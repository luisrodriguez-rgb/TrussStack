import type { StackRecommendation } from './types';
import { TECH_BY_ID } from './catalog';
import { getLocalizedTech } from './catalogI18n';
import type { Language } from '../i18n/translations';

export interface AdrRecord {
  id: string; // e.g. 'ADR-001'
  title: string;
  categoryName: string;
  status: 'Accepted' | 'Aceptado';
  date: string;
  context: string;
  decisionDrivers: string[];
  consideredOptions: {
    name: string;
    description: string;
    pros: string[];
    cons: string[];
  }[];
  decisionOutcome: string;
  positiveConsequences: string[];
  negativeConsequences: string[];
  rawMarkdown: string;
}

/**
 * Generates structured Markdown Architectural Decision Records (MADR 3.0)
 * derived deterministically from the current recommendation and active slots.
 */
export function generateAdrs(
  recommendation: StackRecommendation,
  lang: Language = 'es'
): AdrRecord[] {
  const { spec, slots } = recommendation;
  const isEs = lang === 'es';
  const currentDate = new Date().toISOString().split('T')[0];

  const adrs: AdrRecord[] = [];

  // Helper to format an ADR record into MADR markdown
  const buildMarkdown = (adr: Omit<AdrRecord, 'rawMarkdown'>): string => {
    return [
      `# ${adr.id}: ${adr.title}`,
      ``,
      `- **${isEs ? 'Estado' : 'Status'}**: ${adr.status}`,
      `- **${isEs ? 'Decisores' : 'Deciders'}**: ${isEs ? 'Equipo de Ingeniería y Arquitectura Técnica' : 'Core Engineering & Architecture Team'}`,
      `- **${isEs ? 'Fecha' : 'Date'}**: ${adr.date}`,
      ``,
      `## ${isEs ? 'Contexto y Definición del Problema' : 'Context and Problem Statement'}`,
      adr.context,
      ``,
      `## ${isEs ? 'Drivers de Decisión' : 'Decision Drivers'}`,
      ...adr.decisionDrivers.map((d) => `- ${d}`),
      ``,
      `## ${isEs ? 'Opciones Consideradas' : 'Considered Options'}`,
      ...adr.consideredOptions.flatMap((opt) => [
        `### ${opt.name}`,
        opt.description,
        ``,
        `**${isEs ? 'Ventajas' : 'Pros'}:**`,
        ...opt.pros.map((p) => `- + ${p}`),
        ``,
        `**${isEs ? 'Desventajas' : 'Cons'}:**`,
        ...opt.cons.map((c) => `- - ${c}`),
        ``,
      ]),
      `## ${isEs ? 'Decisión y Justificación' : 'Decision Outcome'}`,
      adr.decisionOutcome,
      ``,
      `## ${isEs ? 'Consecuencias' : 'Consequences'}`,
      ``,
      `### ${isEs ? 'Positivas (Lo que ganamos)' : 'Positive Consequences (What we gain)'}`,
      ...adr.positiveConsequences.map((pos) => `- + ${pos}`),
      ``,
      `### ${isEs ? 'Negativas (Lo que sacrificamos)' : 'Negative Consequences (What we sacrifice)'}`,
      ...adr.negativeConsequences.map((neg) => `- ! ${neg}`),
      ``,
    ].join('\n');
  };

  // ADR-001: General System Architecture & Topology
  const adr1Context = isEs
    ? `El proyecto requiere una arquitectura para ${spec.projectType.toUpperCase()} orientada a una escala de ${spec.scale} con un equipo de tamaño ${spec.teamSize} y presupuesto de infraestructura clasificado como ${spec.budget}. Se busca optimizar la velocidad de entrega sin incurrir en costes desmedidos de mantenimiento.`
    : `The project requires an architecture for a ${spec.projectType.toUpperCase()} system targeted at ${spec.scale} scale with a ${spec.teamSize} engineering team and ${spec.budget} cloud budget. The goal is to maximize shipping velocity while avoiding runaway operational maintenance.`;

  const adr1Drivers = isEs
    ? [
        `Velocidad de entrega (prioridad ${spec.priorities.developmentSpeed}/5)`,
        `Minimización de costes iniciales (prioridad ${spec.priorities.costMinimization}/5)`,
        `Nivel de concurrencia y escala esperada (${spec.scale})`,
        `Prevenir deuda técnica por sobre-ingeniería`,
      ]
    : [
        `Delivery velocity (priority ${spec.priorities.developmentSpeed}/5)`,
        `Cost minimization (priority ${spec.priorities.costMinimization}/5)`,
        `Target concurrency and workload volume (${spec.scale})`,
        `Prevent operational burden from premature over-engineering`,
      ];

  const adr1Record: Omit<AdrRecord, 'rawMarkdown'> = {
    id: 'ADR-001',
    title: isEs
      ? 'Adopción de Topología Multicapa Desacoplada y Motor de Ejecución'
      : 'Adoption of Decoupled Multi-Layer Topology and Execution Engine',
    categoryName: isEs ? 'Topología General' : 'General Topology',
    status: isEs ? 'Aceptado' : 'Accepted',
    date: currentDate,
    context: adr1Context,
    decisionDrivers: adr1Drivers,
    consideredOptions: [
      {
        name: isEs ? 'Topología Serverless / Jamstack con BaaS Gestionado' : 'Serverless / Jamstack Topology with Managed BaaS',
        description: isEs
          ? 'Arquitectura modular con frontend en CDN Edge y servicios backend/BaaS desacoplados.'
          : 'Modular architecture deploying frontend to Edge CDN with decoupled backend/BaaS services.',
        pros: isEs
          ? ['Coste fijo $0 en reposo', 'Escalado horizontal automático', 'Cero mantenimiento de SO']
          : ['$0 fixed cost at idle', 'Automatic horizontal scaling', 'Zero OS-level maintenance'],
        cons: isEs
          ? ['Cold starts ocasionales', 'Riesgo de trampas de egress al escalar']
          : ['Occasional cold starts', 'Risk of egress spikes at scale'],
      },
      {
        name: isEs ? 'Monolito Clásico Desplegado en VPS Único' : 'Classic Monolith on Single VPS',
        description: isEs
          ? 'Despliegue unificado de frontend y backend en un servidor Linux dedicado.'
          : 'Unified deployment of frontend and backend on a dedicated Linux VPS.',
        pros: isEs
          ? ['Latencia interna ultra-baja (localhost)', 'Coste mensual 100% predecible']
          : ['Ultra-low internal latency (localhost)', '100% predictable monthly bill'],
        cons: isEs
          ? ['Requiere parches de seguridad manuales', 'Single point of failure sin cluster']
          : ['Requires manual OS patching', 'Single point of failure without clustering'],
      },
    ],
    decisionOutcome: isEs
      ? `Se adopta la topología modular desacoplada recomendada por TrussStack con un Fit Score del ${recommendation.fitScore}%. Esta arquitectura permite arrancar con un coste de ${recommendation.overallCostEstimate} y evolucionar componentes de manera independiente.`
      : `We adopt the decoupled modular topology recommended by TrussStack with a Fit Score of ${recommendation.fitScore}%. This baseline provides an initial cost of ${recommendation.overallCostEstimate} and allows independent component evolution.`,
    positiveConsequences: isEs
      ? [
          'Arranque inmediato sin necesidad de provisionar servidores dedicados.',
          'Módulos desacoplados que facilitan auditorías de seguridad y testing automatizado.',
        ]
      : [
          'Immediate project bootstrapping without dedicated VM provisioning.',
          'Decoupled modules simplify security auditing and automated testing.',
        ],
    negativeConsequences: isEs
      ? [
          'Mayor cantidad de contratos de red entre capas independientes.',
          'Monitoreo distribuido requerido para rastrear peticiones extremo a extremo.',
        ]
      : [
          'Higher number of network boundary contracts across independent layers.',
          'Distributed telemetry required to trace end-to-end request cycles.',
        ],
  };
  adrs.push({ ...adr1Record, rawMarkdown: buildMarkdown(adr1Record) });

  // ADR-002: Application Framework & Runtime (Frontend)
  if (slots.frontend) {
    const feTech = getLocalizedTech(TECH_BY_ID[slots.frontend], lang);
    const adr2Record: Omit<AdrRecord, 'rawMarkdown'> = {
      id: 'ADR-002',
      title: isEs
        ? `Selección de ${feTech.name} como Framework de Aplicación`
        : `Selection of ${feTech.name} as Application Framework`,
      categoryName: isEs ? 'Frontend & Runtime' : 'Frontend & Runtime',
      status: isEs ? 'Aceptado' : 'Accepted',
      date: currentDate,
      context: isEs
        ? `Se necesita un framework que brinde una experiencia de usuario fluida, soporte ${spec.constraints.needsSeo ? 'SEO estricto mediante SSR/SSG' : 'reactividad cliente'} y encaje con la experiencia del equipo (${spec.seniority}).`
        : `An application framework is required that delivers smooth UX, supports ${spec.constraints.needsSeo ? 'strict SEO via SSR/SSG' : 'rich client reactivity'}, and matches team capability (${spec.seniority}).`,
      decisionDrivers: isEs
        ? [
            feTech.tagline,
            `DX y velocidad de prototipado (${feTech.metrics.dx}/5)`,
            `Ecosistema de componentes (${feTech.metrics.ecosystem}/5)`,
          ]
        : [
            feTech.tagline,
            `DX and prototyping velocity (${feTech.metrics.dx}/5)`,
            `Ecosystem richness (${feTech.metrics.ecosystem}/5)`,
          ],
      consideredOptions: [
        {
          name: feTech.name,
          description: feTech.description,
          pros: feTech.tradeoffs.pros,
          cons: feTech.tradeoffs.cons,
        },
      ],
      decisionOutcome: isEs
        ? `Adoptamos ${feTech.name} porque maximiza la velocidad del equipo y satisface los requerimientos técnicos prioritarios.`
        : `We adopt ${feTech.name} because it optimizes shipping velocity and aligns with primary project constraints.`,
      positiveConsequences: feTech.tradeoffs.pros.slice(0, 3),
      negativeConsequences:
        feTech.tradeoffs.sacrifices.length > 0
          ? feTech.tradeoffs.sacrifices
          : feTech.tradeoffs.cons.slice(0, 2),
    };
    adrs.push({ ...adr2Record, rawMarkdown: buildMarkdown(adr2Record) });
  }

  // ADR-003: Persistence & Database
  if (slots.database) {
    const dbTech = getLocalizedTech(TECH_BY_ID[slots.database], lang);
    const adr3Record: Omit<AdrRecord, 'rawMarkdown'> = {
      id: 'ADR-003',
      title: isEs
        ? `Adopción de ${dbTech.name} para Persistencia y Estado`
        : `Adoption of ${dbTech.name} for Persistence and State Management`,
      categoryName: isEs ? 'Base de Datos' : 'Database & Storage',
      status: isEs ? 'Aceptado' : 'Accepted',
      date: currentDate,
      context: isEs
        ? `El almacenamiento de datos debe cumplir garantías transaccionales y ofrecer un esquema de facturación compatible con el presupuesto (${spec.budget}).`
        : `The data layer must ensure consistency guarantees while maintaining billing alignment with target budget (${spec.budget}).`,
      decisionDrivers: isEs
        ? [
            dbTech.tagline,
            `Límite gratuito inicial: ${dbTech.costProfile.freeTier.limitsDescription}`,
            `Nivel de portabilidad / Lock-in (${dbTech.metrics.vendorLockin}/5)`,
          ]
        : [
            dbTech.tagline,
            `Initial free quota: ${dbTech.costProfile.freeTier.limitsDescription}`,
            `Portability / Lock-in risk (${dbTech.metrics.vendorLockin}/5)`,
          ],
      consideredOptions: [
        {
          name: dbTech.name,
          description: dbTech.description,
          pros: dbTech.tradeoffs.pros,
          cons: dbTech.tradeoffs.cons,
        },
      ],
      decisionOutcome: isEs
        ? `Seleccionamos ${dbTech.name} como motor principal de base de datos debido a su equilibrio entre escalabilidad y cero coste de arranque.`
        : `We choose ${dbTech.name} as primary persistence engine due to its balance between scalability and zero initial fixed cost.`,
      positiveConsequences: dbTech.tradeoffs.pros.slice(0, 3),
      negativeConsequences:
        dbTech.tradeoffs.sacrifices.length > 0
          ? dbTech.tradeoffs.sacrifices
          : dbTech.tradeoffs.cons.slice(0, 2),
    };
    adrs.push({ ...adr3Record, rawMarkdown: buildMarkdown(adr3Record) });
  }

  // ADR-004: Identity & Authentication
  if (slots.auth) {
    const authTech = getLocalizedTech(TECH_BY_ID[slots.auth], lang);
    const adr4Record: Omit<AdrRecord, 'rawMarkdown'> = {
      id: 'ADR-004',
      title: isEs
        ? `Estrategia de Identidad y Autenticación con ${authTech.name}`
        : `Identity and Access Management Strategy with ${authTech.name}`,
      categoryName: isEs ? 'Autenticación' : 'Authentication & IAM',
      status: isEs ? 'Aceptado' : 'Accepted',
      date: currentDate,
      context: isEs
        ? `Se requiere gestión de sesiones seguras, soporte de proveedores sociales y bajo coste operacional para los primeros usuarios.`
        : `Secure session handling, social auth providers, and minimal ops complexity are required for target users.`,
      decisionDrivers: isEs
        ? [
            authTech.tagline,
            `Cuota free tier: ${authTech.costProfile.freeTier.limitsDescription}`,
            `Simplicidad de integración (${authTech.metrics.dx}/5)`,
          ]
        : [
            authTech.tagline,
            `Free tier quota: ${authTech.costProfile.freeTier.limitsDescription}`,
            `Integration ergonomics (${authTech.metrics.dx}/5)`,
          ],
      consideredOptions: [
        {
          name: authTech.name,
          description: authTech.description,
          pros: authTech.tradeoffs.pros,
          cons: authTech.tradeoffs.cons,
        },
      ],
      decisionOutcome: isEs
        ? `Se implementa ${authTech.name} para resolver el flujo de autenticación de forma segura y estándar.`
        : `We implement ${authTech.name} to deliver secure, standard authentication flows.`,
      positiveConsequences: authTech.tradeoffs.pros.slice(0, 3),
      negativeConsequences:
        authTech.tradeoffs.sacrifices.length > 0
          ? authTech.tradeoffs.sacrifices
          : authTech.tradeoffs.cons.slice(0, 2),
    };
    adrs.push({ ...adr4Record, rawMarkdown: buildMarkdown(adr4Record) });
  }

  // ADR-005: Hosting & Deployment
  if (slots.hosting) {
    const hostTech = getLocalizedTech(TECH_BY_ID[slots.hosting], lang);
    const adr5Record: Omit<AdrRecord, 'rawMarkdown'> = {
      id: 'ADR-005',
      title: isEs
        ? `Infraestructura de Despliegue y CDN Edge con ${hostTech.name}`
        : `Deployment Infrastructure and Edge CDN with ${hostTech.name}`,
      categoryName: isEs ? 'Hosting & Edge' : 'Hosting & Edge',
      status: isEs ? 'Aceptado' : 'Accepted',
      date: currentDate,
      context: isEs
        ? `La plataforma de hosting debe permitir CI/CD continuo, despliegues globales en Edge y evitar mantenimiento de servidores Linux.`
        : `Hosting platform must deliver automated CI/CD previews, global Edge points of presence, and zero VM maintenance.`,
      decisionDrivers: isEs
        ? [
            hostTech.tagline,
            `Simplicidad operativa (${hostTech.metrics.operationalComplexity <= 2 ? 'Alta' : 'Moderada'})`,
            `Límites de ancho de banda: ${hostTech.costProfile.freeTier.limitsDescription}`,
          ]
        : [
            hostTech.tagline,
            `Operational simplicity (${hostTech.metrics.operationalComplexity <= 2 ? 'High' : 'Moderate'})`,
            `Bandwidth allowances: ${hostTech.costProfile.freeTier.limitsDescription}`,
          ],
      consideredOptions: [
        {
          name: hostTech.name,
          description: hostTech.description,
          pros: hostTech.tradeoffs.pros,
          cons: hostTech.tradeoffs.cons,
        },
      ],
      decisionOutcome: isEs
        ? `Elegimos ${hostTech.name} para hospedar el sistema con despliegues atómicos automáticos.`
        : `We select ${hostTech.name} to host the system with automated atomic deployments.`,
      positiveConsequences: hostTech.tradeoffs.pros.slice(0, 3),
      negativeConsequences:
        hostTech.tradeoffs.sacrifices.length > 0
          ? hostTech.tradeoffs.sacrifices
          : hostTech.tradeoffs.cons.slice(0, 2),
    };
    adrs.push({ ...adr5Record, rawMarkdown: buildMarkdown(adr5Record) });
  }

  // ADR-006: Payments (if present)
  if (slots.payments) {
    const payTech = getLocalizedTech(TECH_BY_ID[slots.payments], lang);
    const adr6Record: Omit<AdrRecord, 'rawMarkdown'> = {
      id: 'ADR-006',
      title: isEs
        ? `Monetización y Facturación mediante ${payTech.name}`
        : `Monetization and Billing Gateway with ${payTech.name}`,
      categoryName: isEs ? 'Pagos' : 'Payments & Billing',
      status: isEs ? 'Aceptado' : 'Accepted',
      date: currentDate,
      context: isEs
        ? `La aplicación requiere suscripciones o cobros puntuales con soporte de webhooks seguros y gestión de impuestos.`
        : `The system requires subscription or checkout capabilities with secure webhook pipelines and tax handling.`,
      decisionDrivers: isEs
        ? [payTech.tagline, `Fiabilidad y compliance PCI`, `Ergonomía del SDK de webhooks`]
        : [payTech.tagline, `Reliability and PCI compliance`, `Webhook SDK developer experience`],
      consideredOptions: [
        {
          name: payTech.name,
          description: payTech.description,
          pros: payTech.tradeoffs.pros,
          cons: payTech.tradeoffs.cons,
        },
      ],
      decisionOutcome: isEs
        ? `Adoptamos ${payTech.name} para procesar cobros y suscripciones de manera conforme a PCI-DSS.`
        : `We adopt ${payTech.name} to process payments and subscriptions with full PCI-DSS compliance.`,
      positiveConsequences: payTech.tradeoffs.pros.slice(0, 3),
      negativeConsequences:
        payTech.tradeoffs.sacrifices.length > 0
          ? payTech.tradeoffs.sacrifices
          : payTech.tradeoffs.cons.slice(0, 2),
    };
    adrs.push({ ...adr6Record, rawMarkdown: buildMarkdown(adr6Record) });
  }

  // ADR-007: Monitoring & Observability (if present)
  if (slots.monitoring) {
    const monTech = getLocalizedTech(TECH_BY_ID[slots.monitoring], lang);
    const adr7Record: Omit<AdrRecord, 'rawMarkdown'> = {
      id: 'ADR-007',
      title: isEs
        ? `Observabilidad y Telemetría con ${monTech.name}`
        : `Observability and Telemetry Strategy with ${monTech.name}`,
      categoryName: isEs ? 'Monitoreo' : 'Monitoring & Tracing',
      status: isEs ? 'Aceptado' : 'Accepted',
      date: currentDate,
      context: isEs
        ? `Se necesita detección inmediata de errores en producción y monitoreo de uptime sin sobrecargar el presupuesto inicial.`
        : `Immediate error reporting and uptime tracking are required without burdening early infrastructure spend.`,
      decisionDrivers: isEs
        ? [monTech.tagline, `Cuota de eventos mensual gratuita`, `Alertas en tiempo real`]
        : [monTech.tagline, `Monthly free event allowance`, `Real-time alerting`],
      consideredOptions: [
        {
          name: monTech.name,
          description: monTech.description,
          pros: monTech.tradeoffs.pros,
          cons: monTech.tradeoffs.cons,
        },
      ],
      decisionOutcome: isEs
        ? `Incorporamos ${monTech.name} para trazabilidad técnica y monitoreo proactivo de excepciones.`
        : `We integrate ${monTech.name} for technical traceability and proactive exception monitoring.`,
      positiveConsequences: monTech.tradeoffs.pros.slice(0, 3),
      negativeConsequences:
        monTech.tradeoffs.sacrifices.length > 0
          ? monTech.tradeoffs.sacrifices
          : monTech.tradeoffs.cons.slice(0, 2),
    };
    adrs.push({ ...adr7Record, rawMarkdown: buildMarkdown(adr7Record) });
  }

  return adrs;
}

/**
 * Generates a unified, consolidated Architecture Decision Log document
 * containing the summary table and all ADRs in sequential order.
 */
export function generateConsolidatedAdrDoc(
  adrs: AdrRecord[],
  lang: Language = 'es'
): string {
  const isEs = lang === 'es';
  const header = isEs
    ? `# REGISTRO CONSOLIDADO DE DECISIONES DE ARQUITECTURA (MADR)\n\nDocumento unificado generado por TrussStack que recopila todas las decisiones técnicas tomadas, alternativas evaluadas y sacrificios aceptados para este sistema.\n\n---\n\n## Índice de Decisiones Arquitectónicas\n\n| ID | Decisión Técnica | Dominio | Estado |\n| :--- | :--- | :--- | :--- |\n`
    : `# CONSOLIDATED ARCHITECTURE DECISION LOG (MADR)\n\nUnified document generated by TrussStack gathering all recorded technical decisions, evaluated alternatives, and accepted trade-offs for this system.\n\n---\n\n## Architecture Decisions Index\n\n| ID | Technical Decision | Domain | Status |\n| :--- | :--- | :--- | :--- |\n`;

  const rows = adrs
    .map((a) => `| **${a.id}** | [${a.title}](#${a.id.toLowerCase()}-${a.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}) | ${a.categoryName} | \`${a.status}\` |`)
    .join('\n');

  const body = adrs.map((a) => a.rawMarkdown).join('\n\n---\n\n');

  return `${header}${rows}\n\n---\n\n${body}`;
}
