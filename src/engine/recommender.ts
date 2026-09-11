import type {
  ArchitecturalFriction,
  ReplacementAlternative,
  StackRecommendation,
  TechCategory,
  Technology,
  UserProjectSpec,
} from './types';
import { TECH_BY_ID, TECHNOLOGIES } from './catalog';
import { getLocalizedTech, getLocalizedFrictionMessage } from './catalogI18n';
import type { Language } from '../i18n/translations';

// Calcula la afinidad individual (0-100) de una tecnología contra las preferencias del usuario
export function calculateTechFit(
  tech: Technology,
  spec: UserProjectSpec,
  currentStack: Partial<Record<TechCategory, string | null>> = {}
): number {
  const { priorities, budget, scale, constraints } = spec;

  // Normalización de pesos del usuario (1 a 5)
  const totalWeight =
    priorities.developmentSpeed +
    priorities.costMinimization +
    priorities.scalability +
    priorities.lowVendorLockin +
    priorities.operationalSimplicity;

  // Puntuaciones base por dimensión (0 a 100)
  // 1. Velocidad de desarrollo / DX
  const speedScore = ((tech.metrics.dx * 2 + (6 - tech.metrics.learningCurve)) / 15) * 100;

  // 2. Minimización de costes
  let costScore = 60;
  if (tech.costProfile.freeTier.hasFreeTier) costScore += 25;
  if (tech.costProfile.initialCost === 'free') costScore += 15;
  if (tech.costProfile.operationalCost === 'free') costScore += 10;
  if (tech.costProfile.scalingRisk === 'high') costScore -= 20;
  costScore = Math.max(10, Math.min(100, costScore));

  // 3. Escalabilidad
  const scaleScore = (tech.metrics.scalability / 5) * 100;

  // 4. Bajo Vendor Lock-in (Portabilidad / Open Source)
  let lockinScore = ((6 - tech.metrics.vendorLockin) / 5) * 70;
  if (tech.isOpenSource) lockinScore += 30;
  lockinScore = Math.max(10, Math.min(100, lockinScore));

  // 5. Simplicidad Operativa (Poco mantenimiento de infra)
  const simplicityScore =
    (((6 - tech.metrics.operationalComplexity) * 1.5 + (tech.isManaged ? 2.5 : 0)) / 10) * 100;

  // Promedio ponderado según los sliders del usuario
  let rawScore =
    (speedScore * priorities.developmentSpeed +
      costScore * priorities.costMinimization +
      scaleScore * priorities.scalability +
      lockinScore * priorities.lowVendorLockin +
      simplicityScore * priorities.operationalSimplicity) /
    totalWeight;

  // Ajustes de idoneidad según Tipo de Proyecto
  switch (spec.projectType) {
    case 'content_blog':
      if (tech.id === 'astro') rawScore += 18;
      if (tech.id === 'cloudflare-pages') rawScore += 14;
      if (tech.id === 'turso') rawScore += 8;
      if (tech.id === 'nextjs') rawScore -= 5;
      break;
    case 'saas':
      if (tech.id === 'nextjs') rawScore += 14;
      if (tech.id === 'supabase-db') rawScore += 12;
      if (tech.id === 'stripe' || tech.id === 'lemonsqueezy') rawScore += 10;
      if (tech.id === 'resend') rawScore += 10;
      if (tech.id === 'sentry') rawScore += 8;
      break;
    case 'ecommerce':
      if (tech.id === 'nextjs') rawScore += 12;
      if (tech.id === 'postgres' || tech.id === 'supabase-db') rawScore += 10;
      if (tech.id === 'stripe') rawScore += 14;
      break;
    case 'realtime_app':
      if (tech.id === 'supabase-db') rawScore += 14; // Realtime channels nativos
      if (tech.id === 'redis') rawScore += 14;
      if (tech.id === 'go-gin' || tech.id === 'hono') rawScore += 10;
      break;
    case 'api_backend':
      if (tech.id === 'fastapi' || tech.id === 'go-gin' || tech.id === 'hono') rawScore += 15;
      if (tech.id === 'postgres') rawScore += 10;
      break;
    case 'dashboard':
      if (tech.id === 'react-vite') rawScore += 12;
      if (tech.id === 'nextjs') rawScore += 10;
      break;
  }

  // Ajuste por escala masiva
  if (scale === 'scale_100k' && tech.metrics.scalability >= 4) {
    rawScore += 5;
  }

  // Penalización estricta si el usuario pide $0 y la herramienta no tiene free tier
  if (budget === 'zero_free' && !tech.costProfile.freeTier.hasFreeTier) {
    rawScore -= 45;
  }

  // Restricción SEO
  if (constraints.needsSeo && tech.category === 'frontend') {
    if (tech.id === 'react-vite') rawScore -= 28; // SPA pura sufre en SEO
    if (tech.id === 'astro' || tech.id === 'nextjs') rawScore += 12;
  }

  // Sinergias e integraciones con otras tecnologías ya presentes en el stack
  for (const selectedId of Object.values(currentStack)) {
    if (!selectedId || selectedId === tech.id) continue;
    const integration = tech.integrations[selectedId];
    if (integration) {
      rawScore += integration.fitDelta;
    }
    // Chequeo inverso
    const otherTech = TECH_BY_ID[selectedId];
    if (otherTech?.integrations[tech.id]) {
      rawScore += otherTech.integrations[tech.id].fitDelta;
    }
  }

  return Math.round(Math.max(15, Math.min(99, rawScore)));
}

// Detecta todas las fricciones arquitectónicas en un conjunto de tecnologías seleccionadas
export function detectStackFrictions(
  selectedIds: (string | null | undefined)[]
): ArchitecturalFriction[] {
  const frictions: ArchitecturalFriction[] = [];
  const validIds = selectedIds.filter((id): id is string => Boolean(id));

  for (let i = 0; i < validIds.length; i++) {
    for (let j = i + 1; j < validIds.length; j++) {
      const idA = validIds[i];
      const idB = validIds[j];
      const techA = TECH_BY_ID[idA];
      const techB = TECH_BY_ID[idB];
      if (!techA || !techB) continue;

      const intAB = techA.integrations[idB];
      const intBA = techB.integrations[idA];

      const checkIntegration = (int: typeof intAB, source: Technology, target: Technology) => {
        if (int && (int.relation === 'friction' || int.relation === 'incompatible')) {
          frictions.push({
            sourceId: source.id,
            targetId: target.id,
            sourceName: source.name,
            targetName: target.name,
            level: int.frictionLevel,
            message: int.explanation,
          });
        }
      };

      if (intAB) checkIntegration(intAB, techA, techB);
      if (intBA) checkIntegration(intBA, techB, techA);
    }
  }

  return frictions;
}

// Genera la recomendación completa del stack técnico
export function recommendStack(spec: UserProjectSpec, lang: Language = 'es'): StackRecommendation {
  const slots: Record<TechCategory, string | null> = {
    frontend: null,
    backend: null,
    database: null,
    auth: null,
    storage: null,
    hosting: null,
    payments: null,
    email: null,
    monitoring: null,
    cicd: null,
  };

  // Función interna para escoger la mejor tecnología de una categoría
  const pickBest = (category: TechCategory): Technology => {
    const candidates = TECHNOLOGIES.filter((t) => t.category === category);
    let best = candidates[0];
    let highestScore = -Infinity;

    for (const cand of candidates) {
      const score = calculateTechFit(cand, spec, slots);
      if (score > highestScore) {
        highestScore = score;
        best = cand;
      }
    }
    return best;
  };

  // 1. Frontend (Siempre requerido)
  const bestFrontend = pickBest('frontend');
  slots.frontend = bestFrontend.id;

  // 2. Hosting (Recomendado según Frontend)
  const bestHosting = pickBest('hosting');
  slots.hosting = bestHosting.id;

  // 3. Database
  const bestDb = pickBest('database');
  slots.database = bestDb.id;

  // 4. Backend (Si es Next.js o SvelteKit, el backend puede ser serverless integrado; si es Vite o API pura, backend dedicado)
  if (spec.projectType === 'api_backend' || bestFrontend.id === 'react-vite') {
    slots.backend = pickBest('backend').id;
  } else {
    // Para Next.js / SvelteKit / Nuxt, la API serverless viene integrada de serie
    slots.backend = null;
  }

  // 5. Auth (si el usuario lo requiere o es SaaS/Dashboard)
  if (spec.constraints.needsAuth || spec.projectType === 'saas' || spec.projectType === 'dashboard') {
    // Si la DB ya es Supabase, prefiere Supabase Auth para máxima sinergia
    if (slots.database === 'supabase-db') {
      slots.auth = 'supabase-auth';
    } else {
      slots.auth = pickBest('auth').id;
    }
  }

  // 6. Storage (si el usuario sube archivos)
  if (spec.constraints.needsStorage) {
    if (slots.database === 'supabase-db') {
      slots.storage = 'supabase-storage';
    } else {
      slots.storage = pickBest('storage').id;
    }
  }

  // 7. Payments (si requiere cobrar o es SaaS / E-commerce)
  if (spec.constraints.needsPayments || spec.projectType === 'ecommerce') {
    slots.payments = pickBest('payments').id;
  }

  // 8. Email (SaaS o apps con Auth requieren confirmaciones)
  if (spec.constraints.needsAuth || spec.projectType === 'saas') {
    slots.email = pickBest('email').id;
  }

  // 9. Monitoring
  slots.monitoring = pickBest('monitoring').id;

  // 10. CI/CD
  if (slots.hosting === 'vercel') {
    slots.cicd = 'vercel-ci';
  } else {
    slots.cicd = 'github-actions';
  }

  // Cálculo del Fit Score general de la arquitectura completa
  const activeIds = Object.values(slots).filter((id): id is string => Boolean(id));
  const individualScores = activeIds.map((id) => calculateTechFit(TECH_BY_ID[id], spec, slots));
  const avgScore = Math.round(
    individualScores.reduce((acc, score) => acc + score, 0) / (individualScores.length || 1)
  );

  const rawFrictions = detectStackFrictions(activeIds);
  const frictions = rawFrictions.map((f) => ({
    ...f,
    message: getLocalizedFrictionMessage(f.sourceId, f.targetId, f.message, lang),
  }));

  // Penalizar fit general por cada fricción arquitectónica detectada
  const frictionPenalty = frictions.length * 4;
  const finalFitScore = Math.max(20, Math.min(98, avgScore - frictionPenalty));

  // Desglose de puntuaciones dimensionales
  const dimensionScores = {
    speed: Math.min(99, Math.round(avgScore * 0.95 + (spec.priorities.developmentSpeed > 3 ? 5 : 0))),
    cost: Math.min(99, Math.round(spec.budget === 'zero_free' ? 95 : 88)),
    scalability: Math.min(99, Math.round(82 + (spec.scale === 'scale_100k' ? 12 : 0))),
    portability: Math.min(99, Math.round(spec.priorities.lowVendorLockin > 3 ? 88 : 75)),
    simplicity: Math.min(99, Math.round(spec.priorities.operationalSimplicity > 3 ? 94 : 80)),
  };

  // Estimación de coste general
  let overallCostEstimate = lang === 'es' ? '$0/mes (100% Free Tier)' : '$0/mo (100% Free Tier)';
  if (spec.budget === 'low_50') {
    overallCostEstimate = lang === 'es' ? '~$15 - $30/mes tras tráfico inicial' : '~$15 - $30/mo after initial traffic';
  } else if (spec.budget === 'growth_flexible') {
    overallCostEstimate = lang === 'es' ? '~$50 - $150/mes (Escala elástica)' : '~$50 - $150/mo (Elastic scale)';
  }

  // Generación determinista de razones ("Why?")
  const whyReasons: string[] = [];
  if (spec.teamSize === 'solo') {
    whyReasons.push(
      lang === 'es'
        ? 'Optimizado para 1 desarrollador: reduce la fricción de mantenimiento y elimina servidores dedicados manuales.'
        : 'Optimized for 1 developer: minimizes operational maintenance overhead and eliminates manual dedicated servers.'
    );
  }
  if (spec.priorities.developmentSpeed >= 4) {
    const feName = TECH_BY_ID[slots.frontend || '']?.name || 'Frontend';
    whyReasons.push(
      lang === 'es'
        ? `Selección de ${feName} prioritizada por su alta velocidad de entrega y amplio ecosistema de componentes.`
        : `${feName} chosen for high delivery speed, extensive UI ecosystem, and fast developer velocity.`
    );
  }
  if (slots.database === 'supabase-db') {
    whyReasons.push(
      lang === 'es'
        ? 'Supabase unifica base de datos relacional PostgreSQL con Auth y Storage en un solo panel, minimizando integraciones externas.'
        : 'Supabase unifies relational PostgreSQL with Auth and Storage in one dashboard, minimizing external glue code.'
    );
  } else if (slots.database === 'neon') {
    whyReasons.push(
      lang === 'es'
        ? 'Neon permite branching instantáneo de la base de datos para pruebas en Pull Requests y escala a cero cuando no hay tráfico.'
        : 'Neon enables instant DB branching for PR preview testing and scales compute to zero during idle periods.'
    );
  }
  if (spec.budget === 'zero_free') {
    whyReasons.push(
      lang === 'es'
        ? 'Todas las herramientas seleccionadas cuentan con tiers gratuitos generosos sin costes fijos mensuales de entrada.'
        : 'All selected tools provide viable free tiers with zero upfront monthly baseline costs.'
    );
  }

  // Trade-offs clave consolidados
  const keyTradeoffs: string[] = [];
  if (slots.hosting === 'vercel' || slots.database === 'supabase-db') {
    keyTradeoffs.push(
      lang === 'es'
        ? 'Ganas velocidad y experiencia de desarrollo a cambio de cierto acoplamiento a servicios gestionados en la nube.'
        : 'You gain development speed and turnkey DX in exchange for coupling with cloud-managed vendors.'
    );
  }
  if (slots.frontend === 'nextjs') {
    keyTradeoffs.push(
      lang === 'es'
        ? 'Next.js ofrece SSR y Server Actions completos, pero exige mayor disciplina mental que una SPA estática pura.'
        : 'Next.js provides hybrid SSR and Server Actions, but requires more architectural discipline than a pure static SPA.'
    );
  }
  if (slots.payments === 'lemonsqueezy') {
    keyTradeoffs.push(
      lang === 'es'
        ? 'Lemon Squeezy asume el pago de impuestos internacionales como Merchant of Record a cambio de una comisión ligeramente superior a Stripe puro.'
        : 'Lemon Squeezy handles international sales tax as Merchant of Record in exchange for slightly higher transaction fees.'
    );
  }

  return {
    spec,
    slots,
    fitScore: finalFitScore,
    overallCostEstimate,
    frictionWarnings: frictions,
    dimensionScores,
    whyReasons,
    keyTradeoffs,
  };
}

// Calcula las alternativas para sustitución en caliente [Replace]
export function getReplacementAlternatives(
  category: TechCategory,
  currentStack: Record<TechCategory, string | null>,
  spec: UserProjectSpec,
  lang: Language = 'es'
): ReplacementAlternative[] {
  const currentTechId = currentStack[category];
  const currentTech = currentTechId ? TECH_BY_ID[currentTechId] : null;
  const currentFit = currentTech ? calculateTechFit(currentTech, spec, currentStack) : 75;

  const candidates = TECHNOLOGIES.filter(
    (t) => t.category === category && t.id !== currentTechId
  );

  return candidates.map((tech) => {
    // Stack simulado con la sustitución
    const simulatedStack = { ...currentStack, [category]: tech.id };
    const resultingScore = calculateTechFit(tech, spec, simulatedStack);
    const fitScoreDelta = resultingScore - currentFit;

    // Consecuencias (Ganas / Pierdes)
    const gains: string[] = [];
    const losses: string[] = [];

    if (currentTech) {
      // Comparativa de DX
      if (tech.metrics.dx > currentTech.metrics.dx) {
        gains.push(
          lang === 'es'
            ? `Mayor ergonomía y Developer Experience (+${tech.metrics.dx - currentTech.metrics.dx} pts).`
            : `Higher Developer Experience and ergonomics (+${tech.metrics.dx - currentTech.metrics.dx} pts).`
        );
      } else if (tech.metrics.dx < currentTech.metrics.dx) {
        losses.push(
          lang === 'es'
            ? `Menor ergonomía o tooling más manual.`
            : `Reduced ergonomics or more manual tooling required.`
        );
      }

      // Comparativa de Vendor Lock-in
      if (tech.metrics.vendorLockin < currentTech.metrics.vendorLockin) {
        gains.push(
          lang === 'es'
            ? `Mayor portabilidad y menor acoplamiento propietario.`
            : `Higher portability and reduced vendor lock-in.`
        );
      } else if (tech.metrics.vendorLockin > currentTech.metrics.vendorLockin) {
        losses.push(
          lang === 'es'
            ? `Mayor dependencia del ecosistema de ${tech.name}.`
            : `Higher reliance on the ${tech.name} ecosystem.`
        );
      }

      // Comparativa de Complejidad Operativa
      if (tech.metrics.operationalComplexity < currentTech.metrics.operationalComplexity) {
        gains.push(
          lang === 'es'
            ? `Menor esfuerzo de mantenimiento y configuración de servidores.`
            : `Reduced maintenance effort and zero server provisioning.`
        );
      } else if (tech.metrics.operationalComplexity > currentTech.metrics.operationalComplexity) {
        losses.push(
          lang === 'es'
            ? `Mayor responsabilidad de operaciones, Docker o gestión de infra.`
            : `Increased operational responsibility for Docker, OS patches, or infra.`
        );
      }

      // Comparativa Open Source
      if (tech.isOpenSource && !currentTech.isOpenSource) {
        gains.push(
          lang === 'es'
            ? `Código 100% abierto y auditable.`
            : `100% open-source and auditable codebase.`
        );
      } else if (!tech.isOpenSource && currentTech.isOpenSource) {
        losses.push(
          lang === 'es'
            ? `Pasa de código abierto a servicio cloud gestionado propietario.`
            : `Moves from open-source to proprietary managed cloud service.`
        );
      }
    }

    // Agregar pros nativos de la nueva herramienta localizados
    const locTech = getLocalizedTech(tech, lang);
    gains.push(...locTech.tradeoffs.pros.slice(0, 2));
    losses.push(...locTech.tradeoffs.sacrifices.slice(0, 1));

    // Fricciones que se generarían con este cambio
    const simulatedIds = Object.values(simulatedStack).filter((id): id is string => Boolean(id));
    const rawFrictionAlerts = detectStackFrictions(simulatedIds).filter(
      (f) => f.sourceId === tech.id || f.targetId === tech.id
    );
    const frictionAlerts = rawFrictionAlerts.map((f) => ({
      ...f,
      message: getLocalizedFrictionMessage(f.sourceId, f.targetId, f.message, lang),
    }));

    return {
      tech: locTech,
      fitScoreDelta,
      resultingFitScore: resultingScore,
      gains: Array.from(new Set(gains)).slice(0, 3),
      losses: Array.from(new Set(losses)).slice(0, 3),
      frictionAlerts,
    };
  });
}
