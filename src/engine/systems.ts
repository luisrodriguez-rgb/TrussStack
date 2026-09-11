import type { ProjectConstraints, ProjectType, TechCategory } from './types';

export type SystemGroup = 'all' | 'web_saas' | 'backend_data' | 'ai_automation' | 'mobile_realtime';

export interface SystemProfile {
  id: ProjectType;
  code: string;
  group: Exclude<SystemGroup, 'all'>;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  defaultConstraints: Partial<ProjectConstraints>;
  recommendedArchetypeId: string;
  mandatoryCategories: TechCategory[];
  fitModifiers: {
    boostTechIds: string[];
    penalizeTechIds?: string[];
  };
  whyRationaleEs: string;
  whyRationaleEn: string;
}

export const SYSTEM_PROFILES: Record<ProjectType, SystemProfile> = {
  saas: {
    id: 'saas',
    code: 'SAAS-01',
    group: 'web_saas',
    titleEs: 'B2B & Micro-SaaS Multitenant',
    titleEn: 'B2B & Multi-Tenant SaaS',
    descEs: 'Plataforma web con suscripciones recurrentes, gestión de organizaciones y panel administrativo.',
    descEn: 'Web software with recurring subscriptions, organization management, and user portal.',
    defaultConstraints: {
      needsAuth: true,
      needsPayments: true,
      needsStorage: true,
      needsSeo: true,
      needsRealtime: false,
      needsBackgroundJobs: true,
    },
    recommendedArchetypeId: 'saas_fullstack',
    mandatoryCategories: ['frontend', 'database', 'auth', 'hosting', 'payments', 'email'],
    fitModifiers: {
      boostTechIds: ['nextjs', 'supabase-db', 'stripe', 'resend', 'sentry', 'clerk', 'bullmq'],
      penalizeTechIds: ['react-vite'],
    },
    whyRationaleEs:
      'Prioriza frameworks híbridos con soporte nativo de SSR/SEO, pasarelas de pago recurrentes con webhooks verificados y autenticación multitenant con roles.',
    whyRationaleEn:
      'Prioritizes hybrid fullstack frameworks with native SSR/SEO, subscription billing gateways with verified webhooks, and multi-tenant RBAC auth.',
  },

  ecommerce: {
    id: 'ecommerce',
    code: 'ECOM-02',
    group: 'web_saas',
    titleEs: 'Headless E-Commerce & Tienda Global',
    titleEn: 'Headless E-Commerce & Global Store',
    descEs: 'Catálogo de productos indexable, checkout de alta conversión, inventario y pasarelas de pago.',
    descEn: 'Public indexed catalog, high-conversion checkout flow, inventory, and global payments.',
    defaultConstraints: {
      needsAuth: true,
      needsPayments: true,
      needsStorage: true,
      needsSeo: true,
      needsRealtime: false,
      needsBackgroundJobs: false,
    },
    recommendedArchetypeId: 'edge_content',
    mandatoryCategories: ['frontend', 'database', 'payments', 'hosting', 'email'],
    fitModifiers: {
      boostTechIds: ['nextjs', 'astro', 'stripe', 'postgres', 'cloudflare-pages', 'resend'],
      penalizeTechIds: ['react-vite'],
    },
    whyRationaleEs:
      'Requiere Core Web Vitals impecables para SEO de productos, integración fluida con pasarelas de pago seguras y almacenamiento de imágenes en CDN.',
    whyRationaleEn:
      'Demands pristine Core Web Vitals for product SEO, rock-solid payment processing, and fast global CDN asset delivery.',
  },

  dashboard: {
    id: 'dashboard',
    code: 'DASH-03',
    group: 'web_saas',
    titleEs: 'Backoffice & Dashboard Analítico',
    titleEn: 'Backoffice & Analytics Dashboard',
    descEs: 'Panel interno para visualización intensiva de datos, métricas en vivo y operaciones de negocio.',
    descEn: 'Internal portal for data-dense tables, live operational telemetry, and administration.',
    defaultConstraints: {
      needsAuth: true,
      needsPayments: false,
      needsStorage: false,
      needsSeo: false,
      needsRealtime: true,
      needsBackgroundJobs: false,
    },
    recommendedArchetypeId: 'decoupled_api',
    mandatoryCategories: ['frontend', 'database', 'auth', 'hosting'],
    fitModifiers: {
      boostTechIds: ['react-vite', 'nextjs', 'postgres', 'supabase-db', 'betterstack'],
    },
    whyRationaleEs:
      'Enfocado en renderizado de alta densidad de datos en el cliente (SPA), control estricto de acceso RBAC y consultas analíticas eficientes.',
    whyRationaleEn:
      'Focused on high-density client-side UI rendering (SPA), strict internal RBAC access control, and efficient analytical queries.',
  },

  api_backend: {
    id: 'api_backend',
    code: 'CORE-04',
    group: 'backend_data',
    titleEs: 'Microservicios Transaccionales & API',
    titleEn: 'Transactional Microservices & API',
    descEs: 'Capa de backend dedicada para servicios REST/gRPC de alto rendimiento, reglas de negocio e integraciones.',
    descEn: 'Dedicated backend layer for high-throughput REST/gRPC services, core domain logic, and integrations.',
    defaultConstraints: {
      needsAuth: true,
      needsPayments: false,
      needsStorage: false,
      needsSeo: false,
      needsRealtime: false,
      needsBackgroundJobs: true,
    },
    recommendedArchetypeId: 'decoupled_api',
    mandatoryCategories: ['backend', 'database', 'hosting', 'monitoring', 'cicd'],
    fitModifiers: {
      boostTechIds: ['fastapi', 'go-gin', 'hono', 'postgres', 'hetzner-vps', 'bullmq', 'github-actions'],
    },
    whyRationaleEs:
      'Aísla el backend transaccional en contenedores Linux o runtimes de alto throughput, con tipado estricto de esquemas y observabilidad de latencia.',
    whyRationaleEn:
      'Isolates transactional backend logic on Linux containers or high-throughput runtimes with strict schema contracts and latency APM.',
  },

  content_blog: {
    id: 'content_blog',
    code: 'BLOG-05',
    group: 'web_saas',
    titleEs: 'Plataforma de Contenido, Docs & SEO',
    titleEn: 'Content Platform, Docs & High SEO',
    descEs: 'Publicación editorial de artículos, documentación técnica y landings estáticas con latencia cero.',
    descEn: 'Editorial publication, technical documentation hubs, and static marketing sites with zero TTFB.',
    defaultConstraints: {
      needsAuth: false,
      needsPayments: false,
      needsStorage: false,
      needsSeo: true,
      needsRealtime: false,
      needsBackgroundJobs: false,
    },
    recommendedArchetypeId: 'edge_content',
    mandatoryCategories: ['frontend', 'hosting'],
    fitModifiers: {
      boostTechIds: ['astro', 'cloudflare-pages', 'turso', 'resend'],
      penalizeTechIds: ['nextjs', 'react-vite'],
    },
    whyRationaleEs:
      'Optimiza el tamaño del bundle JS a casi 0KB, entrega contenido pre-renderizado desde el Edge CDN y garantiza puntuaciones de 100 en Lighthouse.',
    whyRationaleEn:
      'Optimizes JS bundle size down to nearly 0KB, serves pre-rendered HTML from the global edge, and secures 100/100 Lighthouse scores.',
  },

  realtime_app: {
    id: 'realtime_app',
    code: 'SYNC-06',
    group: 'mobile_realtime',
    titleEs: 'Colaboración en Tiempo Real & Chat',
    titleEn: 'Real-Time Collaboration & Chat',
    descEs: 'Sincronización multiusuario simultánea, presencia en vivo, mensajería instantánea y WebSockets.',
    descEn: 'Concurrent multi-user sync, live cursor presence, instant messaging, and state broadcast.',
    defaultConstraints: {
      needsAuth: true,
      needsPayments: false,
      needsStorage: false,
      needsSeo: false,
      needsRealtime: true,
      needsBackgroundJobs: false,
    },
    recommendedArchetypeId: 'local_first_replicated',
    mandatoryCategories: ['frontend', 'database', 'hosting'],
    fitModifiers: {
      boostTechIds: ['supabase-db', 'redis', 'go-gin', 'hono', 'turso', 'fly-io'],
    },
    whyRationaleEs:
      'Requiere canales bidireccionales persistentes (WebSockets/SSE), pub/sub en memoria de baja latencia y bases de datos con suscripciones reactivas.',
    whyRationaleEn:
      'Demands persistent bidirectional sockets (WebSockets/SSE), low-latency in-memory pub/sub, and reactive database subscriptions.',
  },

  ai_agent: {
    id: 'ai_agent',
    code: 'AGENT-07',
    group: 'ai_automation',
    titleEs: 'Agentes Autónomos de IA & RAG',
    titleEn: 'Autonomous AI Agents & Vector RAG',
    descEs: 'Orquestación de LLMs, búsqueda vectorial semántica, memoria persistente y pipelines asíncronos.',
    descEn: 'LLM orchestration, semantic vector retrieval, persistent memory loops, and async worker pipelines.',
    defaultConstraints: {
      needsAuth: true,
      needsPayments: false,
      needsStorage: true,
      needsSeo: false,
      needsRealtime: true,
      needsBackgroundJobs: true,
    },
    recommendedArchetypeId: 'ai_agent_pipeline',
    mandatoryCategories: ['backend', 'database', 'ai', 'queues', 'hosting'],
    fitModifiers: {
      boostTechIds: ['fastapi', 'postgres', 'pgvector', 'qdrant', 'pinecone', 'bullmq', 'redis', 'hetzner-vps', 'langchain'],
    },
    whyRationaleEs:
      'Especializado en workers asíncronos para absorber la latencia de inferencia de LLMs, bases de datos vectoriales con filtrado HNSW y servidores dedicados.',
    whyRationaleEn:
      'Engineered for asynchronous task workers absorbing LLM inference latency, HNSW vector indexing, and dedicated compute instances.',
  },

  mobile_app: {
    id: 'mobile_app',
    code: 'MOB-08',
    group: 'mobile_realtime',
    titleEs: 'App Móvil Nativa / Multiplataforma',
    titleEn: 'Cross-Platform Native Mobile App',
    descEs: 'Aplicación para iOS y Android con sincronización offline local, notificaciones push y biometría.',
    descEn: 'Native iOS & Android mobile application with offline-first caching, push notifications, and biometrics.',
    defaultConstraints: {
      needsAuth: true,
      needsPayments: true,
      needsStorage: true,
      needsSeo: false,
      needsRealtime: false,
      needsBackgroundJobs: false,
    },
    recommendedArchetypeId: 'local_first_replicated',
    mandatoryCategories: ['mobile', 'database', 'auth', 'email'],
    fitModifiers: {
      boostTechIds: ['react-native-expo', 'flutter', 'supabase-db', 'supabase-auth', 'turso', 'clerk', 'stripe'],
    },
    whyRationaleEs:
      'Prioriza tooling unificado con Expo/React Native, autenticación basada en JWT persistente, almacenamiento offline local y servicios BaaS unificados.',
    whyRationaleEn:
      'Prioritizes unified cross-platform tooling (Expo), persistent mobile token auth, offline-ready local SQLite, and zero-maintenance BaaS.',
  },

  data_pipeline: {
    id: 'data_pipeline',
    code: 'DATA-09',
    group: 'backend_data',
    titleEs: 'Data Pipeline, Streaming & OLAP',
    titleEn: 'Data Pipeline, Streaming & Analytics',
    descEs: 'Ingesta masiva de eventos, procesamiento en streaming, almacenamiento columnar y telemetría analítica.',
    descEn: 'High-throughput event streaming, columnar OLAP storage, aggregated metrics, and analytical telemetry.',
    defaultConstraints: {
      needsAuth: false,
      needsPayments: false,
      needsStorage: true,
      needsSeo: false,
      needsRealtime: true,
      needsBackgroundJobs: true,
    },
    recommendedArchetypeId: 'event_driven_microservices',
    mandatoryCategories: ['backend', 'database', 'queues', 'monitoring', 'hosting'],
    fitModifiers: {
      boostTechIds: ['go-gin', 'fastapi', 'clickhouse', 'duckdb', 'kafka', 'redpanda', 'hetzner-vps', 'grafana'],
    },
    whyRationaleEs:
      'Combina almacenamiento columnar ultracomprimido para consultas de agregación a escala de millones de filas con colas de streaming de baja latencia.',
    whyRationaleEn:
      'Combines columnar compressed storage for sub-second analytical aggregations across billions of rows with distributed event streaming.',
  },

  iot_embedded: {
    id: 'iot_embedded',
    code: 'IOT-10',
    group: 'backend_data',
    titleEs: 'Telemetría IoT & Edge Computing',
    titleEn: 'IoT Device Telemetry & Edge Computing',
    descEs: 'Captura de telemetría de sensores remotos, bases de datos de series temporales y bajo consumo de memoria.',
    descEn: 'Remote sensor telemetry ingestion, time-series metrics, low-overhead microservices, and edge computing.',
    defaultConstraints: {
      needsAuth: true,
      needsPayments: false,
      needsStorage: true,
      needsSeo: false,
      needsRealtime: true,
      needsBackgroundJobs: true,
    },
    recommendedArchetypeId: 'event_driven_microservices',
    mandatoryCategories: ['backend', 'database', 'hosting', 'monitoring'],
    fitModifiers: {
      boostTechIds: ['go-gin', 'hono', 'timescaledb', 'influxdb', 'rabbitmq', 'grafana', 'hetzner-vps'],
    },
    whyRationaleEs:
      'Enfocado en brokers de mensajería ligera (MQTT/RabbitMQ), motores de series temporales con políticas de retención y ejecutables nativos ultraligeros.',
    whyRationaleEn:
      'Focused on lightweight messaging brokers (MQTT/RabbitMQ), time-series data retention engines, and ultra-small compiled binaries.',
  },

  marketplace: {
    id: 'marketplace',
    code: 'MKT-11',
    group: 'web_saas',
    titleEs: 'Marketplace Bifronte con Pagos Split',
    titleEn: 'Two-Sided Marketplace & Split Escrow',
    descEs: 'Plataforma para compradores y vendedores, comisiones retenidas, custodia (escrow) y dashboards independientes.',
    descEn: 'Dual-sided buyer/seller platform, merchant onboarding, escrow payments, and commission splits.',
    defaultConstraints: {
      needsAuth: true,
      needsPayments: true,
      needsStorage: true,
      needsSeo: true,
      needsRealtime: false,
      needsBackgroundJobs: true,
    },
    recommendedArchetypeId: 'saas_fullstack',
    mandatoryCategories: ['frontend', 'database', 'auth', 'payments', 'storage', 'email'],
    fitModifiers: {
      boostTechIds: ['nextjs', 'postgres', 'supabase-db', 'stripe', 'cloudflare-r2', 'postmark', 'sentry'],
    },
    whyRationaleEs:
      'Requiere pasarelas de pago con soporte de onboarding para comerciantes (Stripe Connect), esquemas relacionales complejos con ACID y subida segura de archivos.',
    whyRationaleEn:
      'Demands multi-party payout escrow (Stripe Connect), complex ACID relational schemas, and secure merchant asset uploads.',
  },

  game_backend: {
    id: 'game_backend',
    code: 'GAME-12',
    group: 'mobile_realtime',
    titleEs: 'Servidor de Videojuegos & Leaderboards',
    titleEn: 'Multiplayer Game Server & Leaderboards',
    descEs: 'Servidores de partida en tiempo real, matchmaking de baja latencia, estado en memoria y marcadores globales.',
    descEn: 'Low-latency multiplayer game servers, matchmaking, volatile in-memory state, and global leaderboards.',
    defaultConstraints: {
      needsAuth: true,
      needsPayments: true,
      needsStorage: false,
      needsSeo: false,
      needsRealtime: true,
      needsBackgroundJobs: false,
    },
    recommendedArchetypeId: 'decoupled_api',
    mandatoryCategories: ['backend', 'database', 'hosting', 'monitoring'],
    fitModifiers: {
      boostTechIds: ['go-gin', 'redis', 'turso', 'fly-io', 'betterstack'],
    },
    whyRationaleEs:
      'Prioriza arquitecturas con latencia sub-20ms, WebSockets concurrentes en Go/Node, tablas de clasificación en Redis y servidores distribuidos globalmente.',
    whyRationaleEn:
      'Prioritizes sub-20ms latency architectures, concurrent Go/Node WebSockets, Redis sorted sets for leaderboards, and distributed edge servers.',
  },
};

export function getSystemProfile(type: ProjectType): SystemProfile {
  return SYSTEM_PROFILES[type] || SYSTEM_PROFILES.saas;
}

export function getSystemsByGroup(group: SystemGroup): SystemProfile[] {
  const all = Object.values(SYSTEM_PROFILES);
  if (group === 'all') return all;
  return all.filter((s) => s.group === group);
}
