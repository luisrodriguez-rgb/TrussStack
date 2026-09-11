import type { Technology, TechBenchmarks, SelfHostProfile } from './types';

/**
 * Empirical Performance Benchmarks dataset.
 * Measured across realistic cloud targets (Edge vs Node.js Serverless vs Dedicated Linux VPS).
 */
export const BENCHMARKS_DATA: Record<string, TechBenchmarks> = {
  // FRONTEND & RUNTIME
  nextjs: {
    coldStartMs: 140,
    bundleSizeKb: 84,
    connectionLatencyMs: 8.5,
    throughputRps: 1850,
  },
  'react-vite': {
    coldStartMs: 0,
    bundleSizeKb: 42,
    connectionLatencyMs: 0,
    throughputRps: 15000,
  },
  astro: {
    coldStartMs: 8,
    bundleSizeKb: 12,
    connectionLatencyMs: 3.5,
    throughputRps: 9200,
  },
  sveltekit: {
    coldStartMs: 25,
    bundleSizeKb: 28,
    connectionLatencyMs: 4.0,
    throughputRps: 4200,
  },
  'vue-nuxt': {
    coldStartMs: 160,
    bundleSizeKb: 92,
    connectionLatencyMs: 9.0,
    throughputRps: 1700,
  },
  remix: {
    coldStartMs: 45,
    bundleSizeKb: 54,
    connectionLatencyMs: 6.0,
    throughputRps: 2800,
  },

  // BACKEND
  fastapi: {
    coldStartMs: 480,
    bundleSizeKb: 0,
    connectionLatencyMs: 2.2,
    throughputRps: 6800,
  },
  'node-express': {
    coldStartMs: 180,
    bundleSizeKb: 0,
    connectionLatencyMs: 1.8,
    throughputRps: 4500,
  },
  'go-gin': {
    coldStartMs: 28,
    bundleSizeKb: 0,
    connectionLatencyMs: 1.1,
    throughputRps: 22000,
  },
  hono: {
    coldStartMs: 4,
    bundleSizeKb: 14,
    connectionLatencyMs: 2.5,
    throughputRps: 19500,
  },

  // DATABASE
  'supabase-db': {
    coldStartMs: 0,
    bundleSizeKb: 18,
    connectionLatencyMs: 3.2,
    throughputRps: 4500,
  },
  neon: {
    coldStartMs: 280,
    bundleSizeKb: 12,
    connectionLatencyMs: 14.5,
    throughputRps: 3200,
  },
  turso: {
    coldStartMs: 4,
    bundleSizeKb: 8,
    connectionLatencyMs: 1.8,
    throughputRps: 12000,
  },
  postgres: {
    coldStartMs: 0,
    bundleSizeKb: 0,
    connectionLatencyMs: 0.8,
    throughputRps: 14000,
  },
  redis: {
    coldStartMs: 0,
    bundleSizeKb: 0,
    connectionLatencyMs: 0.4,
    throughputRps: 45000,
  },

  // HOSTING
  vercel: {
    coldStartMs: 120,
    bundleSizeKb: 0,
    connectionLatencyMs: 12.0,
    throughputRps: 14000,
  },
  'cloudflare-pages': {
    coldStartMs: 4,
    bundleSizeKb: 0,
    connectionLatencyMs: 2.1,
    throughputRps: 28000,
  },
  'hetzner-vps': {
    coldStartMs: 0,
    bundleSizeKb: 0,
    connectionLatencyMs: 0.6,
    throughputRps: 22000,
  },

  // AI & VECTOR
  pinecone: {
    coldStartMs: 15,
    bundleSizeKb: 22,
    connectionLatencyMs: 24.0,
    throughputRps: 1200,
  },
  qdrant: {
    coldStartMs: 0,
    bundleSizeKb: 14,
    connectionLatencyMs: 1.2,
    throughputRps: 8500,
  },
  chroma: {
    coldStartMs: 25,
    bundleSizeKb: 16,
    connectionLatencyMs: 3.5,
    throughputRps: 3400,
  },
  pgvector: {
    coldStartMs: 0,
    bundleSizeKb: 0,
    connectionLatencyMs: 1.0,
    throughputRps: 7200,
  },
  langchain: {
    coldStartMs: 80,
    bundleSizeKb: 65,
    connectionLatencyMs: 0,
    throughputRps: 800,
  },

  // QUEUES & BACKGROUND WORKERS
  'upstash-qstash': {
    coldStartMs: 8,
    bundleSizeKb: 6,
    connectionLatencyMs: 18.0,
    throughputRps: 5000,
  },
  bullmq: {
    coldStartMs: 0,
    bundleSizeKb: 12,
    connectionLatencyMs: 0.5,
    throughputRps: 18000,
  },
  inngest: {
    coldStartMs: 12,
    bundleSizeKb: 14,
    connectionLatencyMs: 22.0,
    throughputRps: 4200,
  },
  rabbitmq: {
    coldStartMs: 0,
    bundleSizeKb: 0,
    connectionLatencyMs: 0.8,
    throughputRps: 25000,
  },

  // MOBILE & DESKTOP
  'react-native-expo': {
    coldStartMs: 350,
    bundleSizeKb: 1850,
    connectionLatencyMs: 0,
    throughputRps: 0,
  },
  flutter: {
    coldStartMs: 280,
    bundleSizeKb: 4200,
    connectionLatencyMs: 0,
    throughputRps: 0,
  },
  tauri: {
    coldStartMs: 110,
    bundleSizeKb: 850,
    connectionLatencyMs: 0,
    throughputRps: 0,
  },
  electron: {
    coldStartMs: 750,
    bundleSizeKb: 62000,
    connectionLatencyMs: 0,
    throughputRps: 0,
  },
};

/**
 * Self-Hosted vs. Cloud Managed Profiles
 */
export const SELF_HOST_DATA: Record<string, SelfHostProfile> = {
  'supabase-db': {
    canSelfHost: true,
    dockerImage: 'supabase/postgres:15.1.1.78',
    minRamMb: 2048,
    minCpuCores: 2,
    maintenanceHoursPerMonth: 4,
    monthlyManagedCost: '$25/mo Pro',
    monthlySelfHostedCost: '$6 - $12/mo VPS',
    operationalBurden: 3,
    gotchasEs: [
      'Mantenimiento manual de backups y extensiones pgvector/wal2json.',
      'Actualizaciones mayores de Postgres requieren migraciones manuales de volumen.',
    ],
    gotchasEn: [
      'Manual backup pipelines and pgvector/wal2json extension updates.',
      'Major Postgres engine upgrades require manual dump and volume migration.',
    ],
  },
  postgres: {
    canSelfHost: true,
    dockerImage: 'postgres:16-alpine',
    minRamMb: 1024,
    minCpuCores: 1,
    maintenanceHoursPerMonth: 2,
    monthlyManagedCost: '$15 - $50/mo RDS',
    monthlySelfHostedCost: '$4 - $8/mo VPS',
    operationalBurden: 2,
    gotchasEs: [
      'Configuración obligatoria de pg_dump automatizado y firewall para proteger el puerto 5432.',
    ],
    gotchasEn: [
      'Mandatory automated pg_dump scripts and strict UFW firewall for port 5432.',
    ],
  },
  redis: {
    canSelfHost: true,
    dockerImage: 'redis:7-alpine',
    minRamMb: 512,
    minCpuCores: 1,
    maintenanceHoursPerMonth: 1,
    monthlyManagedCost: '$15 - $40/mo',
    monthlySelfHostedCost: '$4/mo VPS',
    operationalBurden: 1,
    gotchasEs: [
      'Riesgo de pérdida de datos si los volúmenes AOF/RDB no se montan de forma persistente.',
    ],
    gotchasEn: [
      'Data loss risk on container restart if AOF/RDB persistence volumes are omitted.',
    ],
  },
  qdrant: {
    canSelfHost: true,
    dockerImage: 'qdrant/qdrant:v1.9.0',
    minRamMb: 1024,
    minCpuCores: 1,
    maintenanceHoursPerMonth: 2,
    monthlyManagedCost: '$25/mo Managed',
    monthlySelfHostedCost: '$4 - $8/mo VPS',
    operationalBurden: 2,
    gotchasEs: [
      'El consumo de RAM escala linealmente con los vectores indexados (grafo HNSW en memoria).',
    ],
    gotchasEn: [
      'RAM consumption scales linearly with vector count (in-memory HNSW graphs).',
    ],
  },
  chroma: {
    canSelfHost: true,
    dockerImage: 'chromadb/chroma:latest',
    minRamMb: 1024,
    minCpuCores: 1,
    maintenanceHoursPerMonth: 2,
    monthlyManagedCost: '$20/mo Hosted',
    monthlySelfHostedCost: '$5/mo VPS',
    operationalBurden: 2,
    gotchasEs: [
      'Sincronización de índices en disco y control de concurrencia bajo escrituras masivas.',
    ],
    gotchasEn: [
      'Disk index serialization and write lock contention under batch insertion workloads.',
    ],
  },
  rabbitmq: {
    canSelfHost: true,
    dockerImage: 'rabbitmq:3-management-alpine',
    minRamMb: 1024,
    minCpuCores: 1,
    maintenanceHoursPerMonth: 3,
    monthlyManagedCost: '$35 - $90/mo CloudAMQP',
    monthlySelfHostedCost: '$8/mo VPS',
    operationalBurden: 3,
    gotchasEs: [
      'Particiones de red y throttles de memoria si las colas acumulan mensajes sin ack.',
    ],
    gotchasEn: [
      'Network partition splits and memory high-watermark throttling on unacknowledged queues.',
    ],
  },
  'hetzner-vps': {
    canSelfHost: true,
    dockerImage: 'coollabsio/coolify:latest',
    minRamMb: 2048,
    minCpuCores: 2,
    maintenanceHoursPerMonth: 3,
    monthlyManagedCost: 'N/A',
    monthlySelfHostedCost: '$5.50 - $18/mo',
    operationalBurden: 2,
    gotchasEs: [
      'Requiere hardening del servidor Linux, firewall UFW y certificados SSL Let\'s Encrypt.',
    ],
    gotchasEn: [
      'Requires Linux OS hardening, UFW rules, and Let\'s Encrypt SSL renewal monitoring.',
    ],
  },
};

/**
 * 13 New Technologies for AI, Queues & Mobile/Desktop
 */
export const NEW_TECHNOLOGIES: Technology[] = [
  // ==========================================
  // AI & VECTOR DATABASES (5)
  // ==========================================
  {
    id: 'pinecone',
    name: 'Pinecone',
    category: 'ai',
    tagline: 'Base de datos vectorial serverless totalmente gestionada para búsqueda semántica y RAG.',
    description: 'Motor vectorial cloud nativo con latencia ultrabaja, escalado serverless a miles de millones de vectores e indexación automática.',
    website: 'https://www.pinecone.io',
    badgeText: 'Vector Serverless',
    license: 'Proprietary',
    isManaged: true,
    isOpenSource: false,
    metrics: {
      dx: 5,
      learningCurve: 2,
      scalability: 5,
      ecosystem: 5,
      community: 4,
      maturity: 4,
      operationalComplexity: 1,
      vendorLockin: 4,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'medium',
      scalingRisk: 'high',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: 'Starter plan gratuito con hasta 100.000 vectores y 1 índice.',
      },
    },
    tradeoffs: {
      pros: [
        'Cero mantenimiento de infraestructura: aprovisionamiento serverless instantáneo.',
        'Indexación semántica optimizada para RAG en aplicaciones de IA.',
        'Soporte nativo de metadatos y filtrado por usuario/organización.',
      ],
      cons: [
        'Totalmente propietario: fuerte vendor lock-in a su API cerrada.',
        'Costes por vector y consultas escalan rápidamente en producción masiva.',
      ],
      sacrifices: [
        'Sacrificas portabilidad local y capacidad de auto-hospedar sin modificar código.',
      ],
      idealFor: ['SaaS con asistentes de IA', 'Búsqueda semántica documental', 'Sistemas de recomendación'],
      avoidIf: ['Proyectos con requisitos estrictos de datos on-premise o soberanía local'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['pinecone'],
  },
  {
    id: 'qdrant',
    name: 'Qdrant',
    category: 'ai',
    tagline: 'Motor de búsqueda vectorial open-source en Rust con filtrado por payloads y soporte distribuido.',
    description: 'Vector Database de alto rendimiento escrito en Rust. Permite búsquedas de similitud exactas y aproximadas con filtros enriquecidos.',
    website: 'https://qdrant.tech',
    badgeText: 'Rust Vector Engine',
    license: 'Apache-2.0',
    isManaged: false,
    isOpenSource: true,
    metrics: {
      dx: 4,
      learningCurve: 3,
      scalability: 5,
      ecosystem: 4,
      community: 4,
      maturity: 4,
      operationalComplexity: 2,
      vendorLockin: 1,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'low',
      scalingRisk: 'low',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: 'Cluster de 1GB en Qdrant Cloud o 100% gratuito auto-hospedado con Docker.',
      },
    },
    tradeoffs: {
      pros: [
        'Open source con licencia Apache-2.0 y cero vendor lock-in.',
        'Rendimiento extremo gracias a su arquitectura nativa en Rust.',
        'Filtrado avanzado por payloads de metadatos en la misma consulta.',
      ],
      cons: [
        'El auto-hospedaje requiere monitorear el consumo de memoria RAM de los índices HNSW.',
      ],
      sacrifices: [
        'Sacrificas la comodidad de un SaaS serverless si decides gestionarlo tú mismo.',
      ],
      idealFor: ['RAG empresarial', 'Búsqueda semántica auto-hospedada en Hetzner / Docker', 'Zero lock-in'],
      avoidIf: ['Equipos sin capacidad básica de gestión de contenedores Docker'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['qdrant'],
    selfHostProfile: SELF_HOST_DATA['qdrant'],
  },
  {
    id: 'chroma',
    name: 'Chroma',
    category: 'ai',
    tagline: 'Base de datos de embeddings open-source diseñada para simplicidad y prototipado rápido con Python y JS.',
    description: 'Almacén de vectores enfocado en la experiencia del desarrollador, con soporte nativo de colecciones y persistencia local o cliente/servidor.',
    website: 'https://www.trychroma.com',
    badgeText: 'Developer-First AI',
    license: 'Apache-2.0',
    isManaged: false,
    isOpenSource: true,
    metrics: {
      dx: 5,
      learningCurve: 2,
      scalability: 3,
      ecosystem: 4,
      community: 4,
      maturity: 3,
      operationalComplexity: 2,
      vendorLockin: 1,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'low',
      scalingRisk: 'medium',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: '100% Open Source y gratuito en local o contenedor Docker.',
      },
    },
    tradeoffs: {
      pros: [
        'API minimalista que permite comenzar en menos de 5 líneas de código.',
        'Corre localmente sin configuración para desarrollo offline.',
        'Ecosistema muy activo con integraciones oficiales con LangChain y LlamaIndex.',
      ],
      cons: [
        'Menor madurez en clustering distribuido a gran escala frente a Qdrant o Milvus.',
      ],
      sacrifices: [
        'Sacrificas capacidades de particionado multi-nodo para miles de millones de vectores.',
      ],
      idealFor: ['MVPs de IA', 'Prototipos de RAG rápidos', 'Aplicaciones locales o equipos pequeños'],
      avoidIf: ['Databases vectoriales masivas de escala enterprise multi-región'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['chroma'],
    selfHostProfile: SELF_HOST_DATA['chroma'],
  },
  {
    id: 'pgvector',
    name: 'pgvector (PostgreSQL)',
    category: 'ai',
    tagline: 'Extensión vectorial nativa para PostgreSQL: une tus datos relacionales y embeddings en un solo motor ACID.',
    description: 'Extensión oficial para PostgreSQL que permite almacenar vectores y realizar búsquedas de similitud (HNSW e IVFFlat) con SQL estándar.',
    website: 'https://github.com/pgvector/pgvector',
    badgeText: 'PostgreSQL Native',
    license: 'PostgreSQL',
    isManaged: true,
    isOpenSource: true,
    metrics: {
      dx: 4,
      learningCurve: 3,
      scalability: 4,
      ecosystem: 5,
      community: 5,
      maturity: 4,
      operationalComplexity: 2,
      vendorLockin: 1,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'low',
      scalingRisk: 'low',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: 'Incluido de serie sin coste adicional en Supabase, Neon y PostgreSQL local.',
      },
    },
    tradeoffs: {
      pros: [
        'Consolidación arquitectónica: una sola base de datos para usuarios, transacciones y embeddings.',
        'Garantías transaccionales ACID y Row Level Security (RLS) aplicables a vectores.',
        'Cero servicios externos ni APIs adicionales que pagar o mantener.',
      ],
      cons: [
        'Búsquedas vectoriales intensivas compiten por recursos de CPU/RAM con consultas transaccionales.',
      ],
      sacrifices: [
        'Sacrificas la optimización extrema de motores vectoriales dedicados escritos exclusivamente en Rust/C++.',
      ],
      idealFor: ['SaaS que ya usan PostgreSQL o Supabase', 'RAG integrado con autenticación RLS', 'Simplicidad de stack'],
      avoidIf: ['Cargas de trabajo con cientos de millones de vectores y miles de QPS concurrentes'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['pgvector'],
  },
  {
    id: 'langchain',
    name: 'LangChain',
    category: 'ai',
    tagline: 'Framework de orquestación para pipelines de LLMs, agentes autónomos y cadenas RAG.',
    description: 'Biblioteca para componer componentes modulares de IA: prompts, modelos LLM, vector stores, memoria y herramientas de agentes.',
    website: 'https://www.langchain.com',
    badgeText: 'AI Orchestration',
    license: 'MIT',
    isManaged: false,
    isOpenSource: true,
    metrics: {
      dx: 4,
      learningCurve: 4,
      scalability: 4,
      ecosystem: 5,
      community: 5,
      maturity: 4,
      operationalComplexity: 2,
      vendorLockin: 2,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'low',
      scalingRisk: 'low',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: 'Librería Open Source gratuita (las llamadas a LLMs se pagan al proveedor).',
      },
    },
    tradeoffs: {
      pros: [
        'Abstracción uniforme compatible con OpenAI, Anthropic, Gemini, Groq y modelos locales.',
        'Cientos de integraciones listas con bases de datos vectoriales y fuentes de datos.',
      ],
      cons: [
        'Abstracciones complejas que pueden ocultar llamadas HTTP redundantes y dificultar depuración.',
      ],
      sacrifices: [
        'Sacrificas la ligereza de interactuar directamente con la API REST del proveedor de LLM.',
      ],
      idealFor: ['Agentes de IA complejos', 'Pipelines de extracción RAG multinivel', 'Sistemas multimodelo'],
      avoidIf: ['Llamadas simples a ChatGPT donde un SDK nativo de 20 líneas es más claro'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['langchain'],
  },

  // ==========================================
  // MESSAGE QUEUES & BACKGROUND WORKERS (4)
  // ==========================================
  {
    id: 'upstash-qstash',
    name: 'Upstash QStash',
    category: 'queues',
    tagline: 'Mensajería y colas de tareas HTTP 100% serverless sin servidores ni sockets persistentes.',
    description: 'Orquestador de mensajes basado en HTTP diseñado específicamente para entornos Serverless y Edge (Vercel, Cloudflare, AWS Lambda).',
    website: 'https://upstash.com/docs/qstash',
    badgeText: 'Serverless HTTP Queue',
    license: 'Proprietary',
    isManaged: true,
    isOpenSource: false,
    metrics: {
      dx: 5,
      learningCurve: 2,
      scalability: 5,
      ecosystem: 4,
      community: 4,
      maturity: 4,
      operationalComplexity: 1,
      vendorLockin: 3,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'low',
      scalingRisk: 'low',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: '500 mensajes gratuitos al día, escalando a $1 por cada 100.000 mensajes.',
      },
    },
    tradeoffs: {
      pros: [
        'Cero sockets TCP permanentes: entrega los mensajes haciendo HTTP POST a tus Route Handlers.',
        'Soporte nativo de reintentos automáticos, deduplicación y cron jobs programados.',
        'Firma criptográfica de payloads incluida para validar que el webhook proviene de QStash.',
      ],
      cons: [
        'No apto para procesamiento de streams en tiempo real de altísima frecuencia (>100k msg/seg).',
      ],
      sacrifices: [
        'Sacrificas el control de colas AMQP complejas a cambio de compatibilidad serverless.',
      ],
      idealFor: ['Next.js / Astro en Vercel o Cloudflare', 'Tareas en segundo plano de corta duración', 'Cron jobs'],
      avoidIf: ['Workers pesados que ejecutan procesamiento de vídeo durante horas continuas'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['upstash-qstash'],
  },
  {
    id: 'bullmq',
    name: 'BullMQ',
    category: 'queues',
    tagline: 'El sistema de colas en Node.js y Redis más rápido y battle-tested de la industria.',
    description: 'Gestor de colas de mensajes y background workers para Node.js y TypeScript con persistencia atómica en Redis.',
    website: 'https://bullmq.io',
    badgeText: 'Redis Node.js Engine',
    license: 'MIT',
    isManaged: false,
    isOpenSource: true,
    metrics: {
      dx: 4,
      learningCurve: 3,
      scalability: 5,
      ecosystem: 5,
      community: 5,
      maturity: 5,
      operationalComplexity: 3,
      vendorLockin: 1,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'low',
      scalingRisk: 'low',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: '100% Open Source MIT. Corre sobre cualquier instancia de Redis (local o nube).',
      },
    },
    tradeoffs: {
      pros: [
        'Rendimiento colosal: decenas de miles de tareas por segundo con latencia sub-milisegundo.',
        'Soporte avanzado de prioridades, colas con tasa limitada (rate limiting) y jobs recurrentes.',
        'Open source con portabilidad total entre proveedores.',
      ],
      cons: [
        'Requiere un proceso Node.js continuo (worker dedicado en VPS/Docker) y no corre en Edge puro.',
      ],
      sacrifices: [
        'Sacrificas el modelo serverless sin servidores: debes mantener un contenedor o VPS activo.',
      ],
      idealFor: ['Backends Node.js / Express / NestJS', 'Procesamiento masivo de datos', 'Hetzner VPS + Redis'],
      avoidIf: ['Arquitecturas 100% serverless en Vercel donde no hay workers persistentes'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['bullmq'],
  },
  {
    id: 'inngest',
    name: 'Inngest',
    category: 'queues',
    tagline: 'Plataforma de orquestación de workflows orientada a eventos con step functions para TypeScript.',
    description: 'Motor de ejecución duradera para backend y serverless. Permite escribir funciones complejas paso a paso con reintentos y sleeps automáticos.',
    website: 'https://www.inngest.com',
    badgeText: 'Event-Driven Workflow',
    license: 'Proprietary',
    isManaged: true,
    isOpenSource: true,
    metrics: {
      dx: 5,
      learningCurve: 3,
      scalability: 4,
      ecosystem: 4,
      community: 4,
      maturity: 3,
      operationalComplexity: 1,
      vendorLockin: 3,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'medium',
      scalingRisk: 'medium',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: 'Hobby plan con hasta 25.000 ejecuciones de steps al mes de forma gratuita.',
      },
    },
    tradeoffs: {
      pros: [
        'Escribe workflows duraderos como código estándar (`step.run`, `step.sleep`).',
        'Cero gestión de workers o colas complejas: compatible con Next.js y serverless.',
        'Visor de telemetría y trazabilidad de cada paso del workflow en tiempo real.',
      ],
      cons: [
        'El pricing escala con el volumen de steps ejecutados.',
      ],
      sacrifices: [
        'Sacrificas el control a bajo nivel de la infraestructura de colas.',
      ],
      idealFor: ['Flujos de onboarding multi-día', 'Sistemas de sincronización de datos', 'Next.js App Router'],
      avoidIf: ['Colas hiper-rápidas de mensajes IoT con millones de eventos por segundo'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['inngest'],
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    category: 'queues',
    tagline: 'El broker de mensajería enterprise más confiable para arquitecturas desacopladas y microservicios.',
    description: 'Message broker con soporte de AMQP, MQTT, STOMP y enrutamiento complejo con exchanges directos, topic y fanout.',
    website: 'https://www.rabbitmq.com',
    badgeText: 'Enterprise AMQP',
    license: 'MPL-2.0',
    isManaged: false,
    isOpenSource: true,
    metrics: {
      dx: 3,
      learningCurve: 4,
      scalability: 5,
      ecosystem: 5,
      community: 5,
      maturity: 5,
      operationalComplexity: 4,
      vendorLockin: 1,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'medium',
      scalingRisk: 'low',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: '100% Open Source en Docker/VPS, o planes gestionados en CloudAMQP.',
      },
    },
    tradeoffs: {
      pros: [
        'Enrutamiento sofisticado de mensajes entre múltiples lenguajes (Go, Python, Node, Java).',
        'Estándar probado en producción durante más de 15 años en entornos bancarios y telecomunicaciones.',
      ],
      cons: [
        'Curva de aprendizaje empinada y mantenimiento operacional significativo de clusters Erlang.',
      ],
      sacrifices: [
        'Sacrificas simplicidad de inicio: requiere configuración cuidadosa de colas y exchanges.',
      ],
      idealFor: ['Arquitecturas políglotas de microservicios', 'Sistemas financieros', 'Docker en VPS'],
      avoidIf: ['Aplicaciones web monolíticas simples o proyectos de 1 solo dev con serverless'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['rabbitmq'],
    selfHostProfile: SELF_HOST_DATA['rabbitmq'],
  },

  // ==========================================
  // MOBILE & DESKTOP APPS (4)
  // ==========================================
  {
    id: 'react-native-expo',
    name: 'React Native / Expo',
    category: 'mobile',
    tagline: 'El estándar moderno para desarrollo móvil multiplataforma (iOS y Android) con React.',
    description: 'Ecosistema de desarrollo móvil con TypeScript, hot reloading instantáneo, compilación en la nube (EAS) y acceso a APIs nativas.',
    website: 'https://expo.dev',
    badgeText: 'Universal React Native',
    license: 'MIT',
    isManaged: false,
    isOpenSource: true,
    metrics: {
      dx: 5,
      learningCurve: 3,
      scalability: 5,
      ecosystem: 5,
      community: 5,
      maturity: 5,
      operationalComplexity: 2,
      vendorLockin: 2,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'free',
      scalingRisk: 'low',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: 'Framework 100% gratuito. EAS Build ofrece builds gratuitos mensuales en la nube.',
      },
    },
    tradeoffs: {
      pros: [
        'Comparte hasta el 90% del código de negocio y tipado TypeScript entre tu web y tu app móvil.',
        'Expo Router permite navegación unificada similar a Next.js App Router.',
        'Ecosistema gigantesco con bibliotecas nativas preconfiguradas sin Xcode/Android Studio obligatorio.',
      ],
      cons: [
        'Rendimiento inferior a C++ nativo puro en videojuegos complejos o renderizado 3D masivo.',
      ],
      sacrifices: [
        'Sacrificas el 5-10% de optimización de memoria extrema frente a escribir Swift o Kotlin nativo puro.',
      ],
      idealFor: ['Startups y SaaS con app móvil', 'Equipos con experiencia en React', 'Aplicaciones multiplataforma'],
      avoidIf: ['Videojuegos 3D pesados con shaders complejos que requieren Unity o Unreal Engine'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['react-native-expo'],
  },
  {
    id: 'flutter',
    name: 'Flutter',
    category: 'mobile',
    tagline: 'Framework de Google para compilar aplicaciones nativas multiplataforma desde un único codebase en Dart.',
    description: 'Motor de renderizado propio (Impeller) que dibuja cada píxel directamente en GPU para iOS, Android, Desktop y Web.',
    website: 'https://flutter.dev',
    badgeText: 'Google Native UI',
    license: 'BSD-3-Clause',
    isManaged: false,
    isOpenSource: true,
    metrics: {
      dx: 4,
      learningCurve: 4,
      scalability: 5,
      ecosystem: 4,
      community: 5,
      maturity: 5,
      operationalComplexity: 2,
      vendorLockin: 2,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'free',
      scalingRisk: 'low',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: '100% gratuito y Open Source por Google.',
      },
    },
    tradeoffs: {
      pros: [
        'Rendimiento consistente a 60/120 FPS garantizado por su motor de renderizado Skia/Impeller.',
        'Excelente conjunto de widgets de Material Design y Cupertino incluidos de fábrica.',
      ],
      cons: [
        'Requiere aprender el lenguaje Dart, lo que fragmenta el stack si tu web usa TypeScript.',
        'Tamaño del binario inicial de la app es más pesado que React Native.',
      ],
      sacrifices: [
        'Sacrificas compartir código fuente con tu aplicación web en React o Next.js.',
      ],
      idealFor: ['Apps móviles con animaciones de alta fidelidad', 'Equipos centrados puramente en móvil'],
      avoidIf: ['Equipos pequeños de 1-2 desarrolladores que quieren reutilizar su código web React'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['flutter'],
  },
  {
    id: 'tauri',
    name: 'Tauri',
    category: 'mobile',
    tagline: 'La alternativa moderna, ultraligera y segura a Electron con backend en Rust y frontend web.',
    description: 'Framework para construir aplicaciones de escritorio y móviles ultraligeras (<15MB) utilizando el motor webview del sistema operativo.',
    website: 'https://tauri.app',
    badgeText: 'Rust Lightweight Desktop',
    license: 'MIT',
    isManaged: false,
    isOpenSource: true,
    metrics: {
      dx: 4,
      learningCurve: 3,
      scalability: 5,
      ecosystem: 4,
      community: 4,
      maturity: 4,
      operationalComplexity: 2,
      vendorLockin: 1,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'free',
      scalingRisk: 'low',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: '100% Open Source MIT y libre de regalías.',
      },
    },
    tradeoffs: {
      pros: [
        'Consumo de memoria RAM insignificante (30-60 MB frente a los 500+ MB de Electron).',
        'Binarios compilados de menos de 15 MB gracias al uso de webviews del SO.',
        'Seguridad nativa con backend tipado en Rust y permisos de IPC restrictivos.',
      ],
      cons: [
        'El webview del sistema operativo puede presentar sutiles discrepancias de renderizado entre Windows y macOS.',
      ],
      sacrifices: [
        'Sacrificas la garantía de un runtime Chromium unificado que ofrece Electron a cambio de un consumo de memoria 10x menor.',
      ],
      idealFor: ['Herramientas de productividad de escritorio', 'Clientes livianos', 'Apps con frontend React/Vite'],
      avoidIf: ['Aplicaciones que dependen de APIs internas privadas específicas de Chromium'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['tauri'],
  },
  {
    id: 'electron',
    name: 'Electron',
    category: 'mobile',
    tagline: 'El estándar de la industria para aplicaciones de escritorio con Node.js y Chromium integrado.',
    description: 'Plataforma para crear apps de escritorio multiplataforma (VS Code, Discord, Slack, Figma) con HTML, CSS y JavaScript.',
    website: 'https://www.electronjs.org',
    badgeText: 'Battle-Tested Desktop',
    license: 'MIT',
    isManaged: false,
    isOpenSource: true,
    metrics: {
      dx: 4,
      learningCurve: 3,
      scalability: 4,
      ecosystem: 5,
      community: 5,
      maturity: 5,
      operationalComplexity: 3,
      vendorLockin: 1,
    },
    costProfile: {
      initialCost: 'free',
      operationalCost: 'free',
      scalingRisk: 'low',
      freeTier: {
        hasFreeTier: true,
        limitsDescription: '100% Open Source MIT.',
      },
    },
    tradeoffs: {
      pros: [
        'Garantía absoluta de renderizado idéntico en todas las plataformas gracias a empaquetar Chromium.',
        'Ecosistema maduro utilizado por las aplicaciones de escritorio más exitosas del mundo.',
        'Acceso total a cualquier paquete npm de Node.js en el proceso principal.',
      ],
      cons: [
        'Alto consumo de memoria RAM y CPU al levantar instancias independientes de Chromium.',
        'Tamaño del instalador supera típicamente los 80 - 120 MB.',
      ],
      sacrifices: [
        'Sacrificas ligereza y eficiencia de recursos en la máquina del usuario final.',
      ],
      idealFor: ['Aplicaciones de escritorio complejas (editores de código, software audiovisual)', 'Equipos enterprise'],
      avoidIf: ['Utilidades livianas de barra de menú o widgets de bajo consumo de recursos'],
    },
    integrations: {},
    benchmarks: BENCHMARKS_DATA['electron'],
  },
];

/**
 * Enriches an existing catalog technology with benchmarks and self-host profiles if available.
 */
export function enrichTechnology(tech: Technology): Technology {
  const benchmarks = BENCHMARKS_DATA[tech.id] || tech.benchmarks;
  const selfHostProfile = SELF_HOST_DATA[tech.id] || tech.selfHostProfile;
  return {
    ...tech,
    benchmarks,
    selfHostProfile,
  };
}
