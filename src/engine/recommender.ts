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
import { getSystemProfile } from './systems';
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

  // Ajustes de idoneidad según Perfil Declarativo del Tipo de Proyecto
  const systemProfile = getSystemProfile(spec.projectType);
  if (systemProfile.fitModifiers.boostTechIds.includes(tech.id)) {
    rawScore += 14;
  }
  if (systemProfile.fitModifiers.penalizeTechIds?.includes(tech.id)) {
    rawScore -= 18;
  }

  // Bonificaciones específicas de precisión
  switch (spec.projectType) {
    case 'content_blog':
      if (tech.id === 'astro') rawScore += 8;
      if (tech.id === 'cloudflare-pages') rawScore += 6;
      if (tech.id === 'turso') rawScore += 4;
      break;
    case 'saas':
      if (tech.id === 'nextjs') rawScore += 4;
      if (tech.id === 'supabase-db') rawScore += 4;
      break;
    case 'ai_agent':
      if (tech.id === 'pgvector' || tech.id === 'qdrant' || tech.id === 'fastapi') rawScore += 8;
      break;
    case 'mobile_app':
      if (tech.id === 'react-native-expo' || tech.id === 'flutter') rawScore += 16;
      break;
    case 'data_pipeline':
      if (tech.id === 'clickhouse' || tech.id === 'kafka') rawScore += 18;
      if (tech.id === 'duckdb') rawScore += 10;
      break;
    case 'realtime_app':
      if (tech.id === 'supabase-db' || tech.id === 'redis') rawScore += 6;
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
    ai: null,
    queues: null,
    mobile: null,
  };

  // Función interna para escoger la mejor tecnología de una categoría
  const pickBest = (category: TechCategory): Technology => {
    const candidates = TECHNOLOGIES.filter((t) => t.category === category);
    let best = candidates[0];
    let highestScore = -Infinity;
    const profile = getSystemProfile(spec.projectType);

    for (const cand of candidates) {
      const score = calculateTechFit(cand, spec, slots);
      const isCandBoosted = profile.fitModifiers.boostTechIds.includes(cand.id);
      const isBestBoosted = profile.fitModifiers.boostTechIds.includes(best.id);

      if (score > highestScore || (score === highestScore && isCandBoosted && !isBestBoosted)) {
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

  // 4. Backend (Dedicado para APIs, IA, Streaming, IoT, Juegos o cuando el frontend es SPA pura)
  const needsDedicatedBackend =
    spec.projectType === 'api_backend' ||
    spec.projectType === 'ai_agent' ||
    spec.projectType === 'data_pipeline' ||
    spec.projectType === 'iot_embedded' ||
    spec.projectType === 'game_backend' ||
    bestFrontend.id === 'react-vite';

  if (needsDedicatedBackend) {
    slots.backend = pickBest('backend').id;
  } else {
    // Para Next.js / SvelteKit / Nuxt, la API serverless viene integrada de serie
    slots.backend = null;
  }

  // 5. Auth (si el usuario lo requiere o es SaaS, Dashboard, Marketplace o App Móvil)
  if (
    spec.constraints.needsAuth ||
    spec.projectType === 'saas' ||
    spec.projectType === 'dashboard' ||
    spec.projectType === 'marketplace' ||
    spec.projectType === 'mobile_app'
  ) {
    // Si la DB ya es Supabase, prefiere Supabase Auth para máxima sinergia
    if (slots.database === 'supabase-db') {
      slots.auth = 'supabase-auth';
    } else {
      slots.auth = pickBest('auth').id;
    }
  }

  // 6. Storage (si el usuario sube archivos, marketplace o agentes de IA)
  if (spec.constraints.needsStorage || spec.projectType === 'marketplace' || spec.projectType === 'ai_agent') {
    if (slots.database === 'supabase-db') {
      slots.storage = 'supabase-storage';
    } else {
      slots.storage = pickBest('storage').id;
    }
  }

  // 7. Payments (si requiere cobrar o es SaaS / E-commerce / Marketplace)
  if (
    spec.constraints.needsPayments ||
    spec.projectType === 'ecommerce' ||
    spec.projectType === 'saas' ||
    spec.projectType === 'marketplace'
  ) {
    slots.payments = pickBest('payments').id;
  }

  // 8. Email (SaaS, Marketplace o apps con Auth requieren confirmaciones)
  if (
    spec.constraints.needsAuth ||
    spec.projectType === 'saas' ||
    spec.projectType === 'marketplace'
  ) {
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

  // 11. Queues & Background Workers
  if (
    spec.constraints.needsBackgroundJobs ||
    spec.projectType === 'ai_agent' ||
    spec.projectType === 'data_pipeline'
  ) {
    const queueCandidates = TECHNOLOGIES.filter((t) => t.category === 'queues');
    if (queueCandidates.length > 0) {
      slots.queues = pickBest('queues').id;
    }
  }

  // 12. AI & Vector Engine
  if (spec.projectType === 'ai_agent') {
    const aiCandidates = TECHNOLOGIES.filter((t) => t.category === 'ai');
    if (aiCandidates.length > 0) {
      slots.ai = pickBest('ai').id;
    }
  }

  // 13. Mobile Layer
  if (spec.projectType === 'mobile_app') {
    const mobileCandidates = TECHNOLOGIES.filter((t) => t.category === 'mobile');
    if (mobileCandidates.length > 0) {
      slots.mobile = pickBest('mobile').id;
    }
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

  // Porcentajes de las prioridades del usuario
  const totalUserWeight =
    spec.priorities.costMinimization +
    spec.priorities.developmentSpeed +
    spec.priorities.scalability +
    spec.priorities.lowVendorLockin +
    spec.priorities.operationalSimplicity || 1;

  const prioritiesPercentage = {
    cost: Math.round((spec.priorities.costMinimization / totalUserWeight) * 100),
    speed: Math.round((spec.priorities.developmentSpeed / totalUserWeight) * 100),
    scalability: Math.round((spec.priorities.scalability / totalUserWeight) * 100),
    lockin: Math.round((spec.priorities.lowVendorLockin / totalUserWeight) * 100),
    simplicity: Math.round((spec.priorities.operationalSimplicity / totalUserWeight) * 100),
  };

  const scoreBreakdown = {
    finalFitScore,
    baseScore: avgScore,
    frictionPenalty,
    frictionsCount: frictions.length,
    prioritiesPercentage,
    dimensionScores,
    formulaExplanationEs:
      'El Fit Score se calcula promediando la afinidad técnica de los componentes activos en 5 dimensiones ponderadas por tus prioridades, restando 4 puntos por cada fricción de integración detectada.',
    formulaExplanationEn:
      'The Fit Score is computed by weighting the technical affinity of all active components across 5 dimensions against your priorities, subtracting 4 points per detected architectural friction.',
  };

  // Estimación de coste general
  let overallCostEstimate = lang === 'es' ? '$0/mes (100% Free Tier)' : '$0/mo (100% Free Tier)';
  if (spec.budget === 'low_50') {
    overallCostEstimate = lang === 'es' ? '~$15 - $30/mes tras tráfico inicial' : '~$15 - $30/mo after initial traffic';
  } else if (spec.budget === 'growth_flexible') {
    overallCostEstimate = lang === 'es' ? '~$50 - $150/mes (Escala elástica)' : '~$50 - $150/mo (Elastic scale)';
  }

  // Generación determinista de reglas causales ("Why this Stack?")
  const causalRules = [];
  const systemProfile = getSystemProfile(spec.projectType);

  if (systemProfile) {
    causalRules.push({
      id: 'rule-system-profile',
      trigger: `Arquetipo: ${lang === 'es' ? systemProfile.titleEs : systemProfile.titleEn}`,
      triggerEn: `Archetype: ${systemProfile.titleEn}`,
      decision: `Inyecta restricciones y afinidad de perfil para ${systemProfile.group}`,
      decisionEn: `Injects constraints and profile affinity modifiers for ${systemProfile.group}`,
      favoredTechName: lang === 'es' ? systemProfile.titleEs : systemProfile.titleEn,
    });
  }

  if (spec.teamSize === 'solo') {
    causalRules.push({
      id: 'rule-team-size',
      trigger: 'Equipo unipersonal (1 solo developer)',
      triggerEn: 'Solo developer (1 developer team)',
      decision: 'Favorece infraestructura gestionada / BaaS unificado para eliminar administración de servidores',
      decisionEn: 'Favors unified BaaS and serverless to eliminate manual server ops',
      favoredTechName: slots.database && TECH_BY_ID[slots.database] ? TECH_BY_ID[slots.database].name : 'Supabase',
      category: 'database',
    });
  } else if (spec.teamSize === 'scale_team') {
    causalRules.push({
      id: 'rule-team-size',
      trigger: 'Equipo grande (5+ ingenieros)',
      triggerEn: 'Large team (5+ engineers)',
      decision: 'Permite desacoplamiento en capas independientes y servicios fuertemente estructurados',
      decisionEn: 'Enables modular decoupling into independent layers and structured services',
      favoredTechName: slots.backend && TECH_BY_ID[slots.backend] ? TECH_BY_ID[slots.backend].name : 'Decoupled API',
      category: 'backend',
    });
  }

  if (spec.budget === 'zero_free') {
    causalRules.push({
      id: 'rule-budget-zero',
      trigger: 'Presupuesto inicial de $0/mes (Free Tier)',
      triggerEn: 'Strict $0/mo initial budget (Free Tier)',
      decision: 'Selecciona herramientas con capa gratuita perpetua y sin costes fijos de arranque',
      decisionEn: 'Selects tools with perpetual free tiers and zero upfront compute baseline costs',
      favoredTechName: slots.hosting && TECH_BY_ID[slots.hosting] ? TECH_BY_ID[slots.hosting].name : 'Cloudflare / Vercel',
      category: 'hosting',
    });
  }

  if (spec.constraints.needsSeo) {
    causalRules.push({
      id: 'rule-seo',
      trigger: 'SEO público y renderizado en servidor crítico',
      triggerEn: 'Public SEO & Server-Side Rendering required',
      decision: 'Descarta SPAs cliente puras (CSR) y prioriza SSR / SSG con indexación de motores de búsqueda',
      decisionEn: 'Discards pure client SPAs (CSR) in favor of hybrid SSR / SSG for instant search engine indexing',
      favoredTechName: slots.frontend && TECH_BY_ID[slots.frontend] ? TECH_BY_ID[slots.frontend].name : 'Next.js',
      category: 'frontend',
    });
  }

  if (spec.constraints.needsBackgroundJobs) {
    causalRules.push({
      id: 'rule-background-jobs',
      trigger: 'Procesamiento de tareas pesadas en segundo plano',
      triggerEn: 'Background async job processing required',
      decision: 'Desacopla la lógica pesada del bucle principal del API mediante colas de mensajes',
      decisionEn: 'Decouples heavy workloads from the main API event loop using message queues',
      favoredTechName: slots.queues && TECH_BY_ID[slots.queues] ? TECH_BY_ID[slots.queues].name : 'BullMQ / Redis',
      category: 'queues',
    });
  }

  if (spec.constraints.needsRealtime) {
    causalRules.push({
      id: 'rule-realtime',
      trigger: 'Sincronización colaborativa o eventos WebSockets en tiempo real',
      triggerEn: 'Real-time collaborative sync or WebSockets required',
      decision: 'Inyecta persistencia reactiva mediante canales Pub/Sub en memoria de baja latencia',
      decisionEn: 'Injects reactive persistence via low-latency in-memory Pub/Sub channels',
      favoredTechName: slots.database && slots.database.includes('supabase') ? 'Supabase Realtime' : 'Redis Streams',
      category: 'database',
    });
  }

  if (spec.priorities.developmentSpeed >= 4 && spec.priorities.lowVendorLockin <= 2) {
    causalRules.push({
      id: 'rule-tradeoff-velocity',
      trigger: 'Prioridad máxima a velocidad de entrega sobre portabilidad',
      triggerEn: 'Maximized delivery velocity prioritized over cloud portability',
      decision: 'Acepta acoplamiento con plataformas cloud gestionadas a cambio de reducir el tiempo a mercado a la mitad',
      decisionEn: 'Accepts coupling with managed cloud platforms in exchange for cutting time-to-market in half',
      favoredTechName: slots.hosting && TECH_BY_ID[slots.hosting] ? TECH_BY_ID[slots.hosting].name : 'Vercel / Supabase',
      category: 'hosting',
    });
  } else if (spec.priorities.lowVendorLockin >= 4) {
    causalRules.push({
      id: 'rule-tradeoff-lockin',
      trigger: 'Prioridad alta a código abierto y portabilidad (Zero Lock-in)',
      triggerEn: 'High priority on open-source and zero vendor lock-in',
      decision: 'Prioriza estándares abiertos y tecnologías autocontenibles en Docker sin dependencias privativas',
      decisionEn: 'Prioritizes open standards and Docker-containerizable tech without proprietary cloud lock-in',
      favoredTechName: slots.database && TECH_BY_ID[slots.database]?.isOpenSource ? TECH_BY_ID[slots.database].name : 'PostgreSQL / Docker',
      category: 'database',
    });
  }

  // Generación determinista de razones ("Why?")
  const whyReasons: string[] = [];
  if (systemProfile) {
    whyReasons.push(lang === 'es' ? systemProfile.whyRationaleEs : systemProfile.whyRationaleEn);
  }

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
    scoreBreakdown,
    causalRules,
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
