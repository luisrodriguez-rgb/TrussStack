import React, { useState } from 'react';
import type { TechCategory } from '../../engine/types';
import { TECH_BY_ID } from '../../engine/catalog';
import { getLocalizedTech } from '../../engine/catalogI18n';
import { TechLogo } from '../common/TechLogo';
import { useI18n } from '../../i18n/I18nContext';

export type BlueprintTag = 'all' | 'real' | 'saas' | 'local_first' | 'ai' | 'edge' | 'mobile' | 'data';
export type EvidenceLevel = 'author_real' | 'industry_pattern' | 'reference_arch';
export type EvidenceFilter = 'all' | 'author_real' | 'industry_pattern' | 'reference_arch';

export interface StackBlueprint {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  tag: BlueprintTag;
  tagLabel: string;
  tagLabelEn: string;
  evidenceLevel: EvidenceLevel;
  evidenceBadgeEs: string;
  evidenceBadgeEn: string;
  evidenceSourceEs: string;
  evidenceSourceEn: string;
  description: string;
  descriptionEn: string;
  highlights: string[];
  highlightsEn: string[];
  slots: Record<TechCategory, string | null>;
}

export const STACK_BLUEPRINTS: StackBlueprint[] = [
  // ==========================================
  // 1. PROYECTOS REALES DEL AUTOR (5)
  // ==========================================
  {
    id: 'mi_semestre',
    code: 'REAL-01',
    name: 'Mi Semestre // Academic Hub',
    nameEn: 'Mi Semestre // Academic Hub',
    tag: 'real',
    tagLabel: 'PROYECTO REAL',
    tagLabelEn: 'REAL-WORLD APP',
    evidenceLevel: 'author_real',
    evidenceBadgeEs: 'PROYECTO REAL DEL AUTOR',
    evidenceBadgeEn: 'AUTHOR-OWNED REAL PROJECT',
    evidenceSourceEs: 'Proyecto propio implementado y validado en producción universitaria',
    evidenceSourceEn: 'Author-owned project verified in university production',
    description:
      'Portal académico universitario para seguimiento de asignaturas, cálculo de promedios ponderados, horarios y fechas críticas con backend unificado.',
    descriptionEn:
      'University academic portal for tracking grades, calculating weighted GPAs, schedules, and semester deadlines with a unified BaaS.',
    highlights: [
      'PostgreSQL con políticas RLS para aislamiento estricto por estudiante',
      'Despliegue serverless instantáneo en Vercel con $0 de coste fijo',
      'Autenticación social y magic links con Supabase Auth',
    ],
    highlightsEn: [
      'PostgreSQL with Row-Level Security for strict per-student isolation',
      'Instant serverless deployment on Vercel with $0 baseline cost',
      'Social OAuth and magic link authentication with Supabase Auth',
    ],
    slots: {
      frontend: 'nextjs',
      backend: null,
      database: 'supabase-db',
      auth: 'supabase-auth',
      storage: 'supabase-storage',
      hosting: 'vercel',
      payments: null,
      email: 'resend',
      monitoring: 'sentry',
      cicd: 'vercel-ci',
      ai: null,
      queues: null,
      mobile: 'react-native-expo',
    },
  },
  {
    id: 'git_invaders',
    code: 'REAL-02',
    name: 'Git Invaders // Arcade Game',
    nameEn: 'Git Invaders // Arcade Game',
    tag: 'real',
    tagLabel: 'PROYECTO REAL',
    tagLabelEn: 'REAL-WORLD APP',
    evidenceLevel: 'author_real',
    evidenceBadgeEs: 'PROYECTO REAL DEL AUTOR',
    evidenceBadgeEn: 'AUTHOR-OWNED REAL PROJECT',
    evidenceSourceEs: 'Videojuego arcade 2D interactivo desarrollado por el autor',
    evidenceSourceEn: 'Interactive 2D arcade game built by the author',
    description:
      'Videojuego retro interactivo que convierte tu historial de commits de GitHub en oleadas de invasores espaciales sobre Canvas 2D con zero serverless latency.',
    descriptionEn:
      'Interactive retro arcade game turning your GitHub commit history into waves of space invaders on HTML5 Canvas 2D with zero latency.',
    highlights: [
      'Compilación de SPA pura con Vite y React para máximo framerate (60fps)',
      'Alojamiento global con $0 egress y latencia < 15ms en Cloudflare Pages',
      'Sincronización de marcadores y rankings globales sin servidores dedicados',
    ],
    highlightsEn: [
      'Pure client SPA compiled with Vite and React for 60fps rendering',
      'Global edge hosting with $0 egress and < 15ms TTFB on Cloudflare Pages',
      'Global arcade leaderboard rankings without dedicated backend servers',
    ],
    slots: {
      frontend: 'react-vite',
      backend: null,
      database: 'turso',
      auth: null,
      storage: null,
      hosting: 'cloudflare-pages',
      payments: null,
      email: null,
      monitoring: 'betterstack',
      cicd: 'github-actions',
      ai: null,
      queues: null,
      mobile: null,
    },
  },
  {
    id: 'sketion_engine',
    code: 'REAL-03',
    name: 'Sketion // Vector Architecture Engine',
    nameEn: 'Sketion // Vector Architecture Engine',
    tag: 'real',
    tagLabel: 'PROYECTO REAL',
    tagLabelEn: 'REAL-WORLD APP',
    evidenceLevel: 'author_real',
    evidenceBadgeEs: 'PROYECTO REAL DEL AUTOR',
    evidenceBadgeEn: 'AUTHOR-OWNED REAL PROJECT',
    evidenceSourceEs: 'Motor de composición vectorial desarrollado por el autor',
    evidenceSourceEn: 'Vector composition engine architected and built by the author',
    description:
      'Motor autónomo de composición visual de diagramas de software, escenas vectoriales Excalidraw multicapa y pipelines de exportación SVG.',
    descriptionEn:
      'Autonomous visual composition engine for software architecture diagrams, multi-layer Excalidraw scenes, and SVG export pipelines.',
    highlights: [
      'Arquitectura Next.js App Router combinada con almacenamiento de objetos en Cloudflare R2',
      'Costes de salida de datos (egress) de $0 incluso con exportaciones vectoriales pesadas',
      'Pipeline de CI/CD automatizado en GitHub Actions con validación estricta de esquemas',
    ],
    highlightsEn: [
      'Next.js App Router combined with Cloudflare R2 object storage',
      'Zero egress bandwidth costs even when serving heavy vector diagram exports',
      'Automated GitHub Actions CI/CD with strict JSON schema validation',
    ],
    slots: {
      frontend: 'nextjs',
      backend: null,
      database: 'supabase-db',
      auth: 'supabase-auth',
      storage: 'cloudflare-r2',
      hosting: 'cloudflare-pages',
      payments: null,
      email: 'resend',
      monitoring: 'sentry',
      cicd: 'github-actions',
      ai: null,
      queues: null,
      mobile: null,
    },
  },
  {
    id: 'file_converter_pro',
    code: 'REAL-04',
    name: 'File Converter Pro // Local WASM Processor',
    nameEn: 'File Converter Pro // Local WASM Processor',
    tag: 'real',
    tagLabel: 'PROYECTO REAL',
    tagLabelEn: 'REAL-WORLD APP',
    evidenceLevel: 'author_real',
    evidenceBadgeEs: 'PROYECTO REAL DEL AUTOR',
    evidenceBadgeEn: 'AUTHOR-OWNED REAL PROJECT',
    evidenceSourceEs: 'Procesador WebAssembly local-first desarrollado por el autor',
    evidenceSourceEn: 'Local-first WebAssembly file converter built by the author',
    description:
      'Suite de conversión de archivos multimedia en el navegador con WebAssembly sin transferir datos a servidores, con almacenamiento de metadatos en Turso.',
    descriptionEn:
      'Browser-based multimedia file conversion suite running client-side WebAssembly without sending raw files to servers, storing history in Turso.',
    highlights: [
      'Cero coste de ancho de banda: procesamiento y transcodificación 100% en cliente con WASM',
      'Despliegue ultrarrápido en Cloudflare Pages con almacenamiento opcional en Cloudflare R2',
      'Sincronización de historiales de conversión con libSQL embebido',
    ],
    highlightsEn: [
      'Zero bandwidth bills: 100% client-side conversion and transcoding via WebAssembly',
      'Global low-latency delivery on Cloudflare Pages with optional Cloudflare R2 storage',
      'Lightweight conversion history state sync powered by embedded libSQL',
    ],
    slots: {
      frontend: 'react-vite',
      backend: 'hono',
      database: 'turso',
      auth: null,
      storage: 'cloudflare-r2',
      hosting: 'cloudflare-pages',
      payments: null,
      email: null,
      monitoring: 'betterstack',
      cicd: 'github-actions',
      ai: null,
      queues: null,
      mobile: null,
    },
  },
  {
    id: 'edugenios_saas',
    code: 'REAL-05',
    name: 'EduGenios // Multi-Tenant Learning Platform',
    nameEn: 'EduGenios // Multi-Tenant Learning Platform',
    tag: 'real',
    tagLabel: 'PROYECTO REAL',
    tagLabelEn: 'REAL-WORLD APP',
    evidenceLevel: 'author_real',
    evidenceBadgeEs: 'PROYECTO REAL DEL AUTOR',
    evidenceBadgeEn: 'AUTHOR-OWNED REAL PROJECT',
    evidenceSourceEs: 'Plataforma SaaS multi-tenant institucional desarrollada por el autor',
    evidenceSourceEn: 'Institutional multi-tenant SaaS platform built by the author',
    description:
      'Plataforma educativa para colegios e instituciones con aislamiento estricto por escuela mediante políticas Row-Level Security y cobros automatizados.',
    descriptionEn:
      'Educational platform for schools and academies featuring tenant isolation via Row-Level Security and automated tuition subscriptions.',
    highlights: [
      'PostgreSQL RLS para segregación de datos escolares en una base de datos unificada',
      'Suscripciones y cobros de colegiatura gestionados de forma segura con Stripe',
      'Entrega transaccional de reportes de calificaciones y alertas mediante Postmark',
    ],
    highlightsEn: [
      'PostgreSQL RLS for tenant school data segregation on a single unified instance',
      'Tuition and subscription billing processed securely with Stripe Checkout',
      'High-deliverability academic report card dispatch via Postmark',
    ],
    slots: {
      frontend: 'nextjs',
      backend: null,
      database: 'postgres',
      auth: 'supabase-auth',
      storage: 'supabase-storage',
      hosting: 'vercel',
      payments: 'stripe',
      email: 'postmark',
      monitoring: 'sentry',
      cicd: 'vercel-ci',
      ai: null,
      queues: 'bullmq',
      mobile: null,
    },
  },

  // ==========================================
  // 2. PATRONES DE INDUSTRIA REPRODUCIBLES (9)
  // ==========================================
  {
    id: 'saas_production',
    code: 'PATT-04',
    name: 'Production B2B SaaS Boilerplate',
    nameEn: 'Production B2B SaaS Boilerplate',
    tag: 'saas',
    tagLabel: 'SAAS PRO',
    tagLabelEn: 'SAAS PRO',
    evidenceLevel: 'industry_pattern',
    evidenceBadgeEs: 'PATRÓN DE INDUSTRIA',
    evidenceBadgeEn: 'INDUSTRY PATTERN',
    evidenceSourceEs: 'Arquetipo estándar de producción para suscripciones B2B',
    evidenceSourceEn: 'Standard production archetype for B2B recurring subscriptions',
    description:
      'Stack de grado de producción diseñado para cobrar suscripciones, gestionar equipos/organizaciones con Clerk y procesar pagos vía Stripe.',
    descriptionEn:
      'Production-grade stack architected for recurring subscriptions, B2B multi-tenant organization management with Clerk, and Stripe billing.',
    highlights: [
      'Clerk Auth con gestión nativa de roles, equipos y portales de usuario',
      'Pasarela Stripe con webhooks verificados mediante firmas criptográficas HMAC',
      'Monitorización APM con Sentry para captura de stack traces y session replays',
    ],
    highlightsEn: [
      'Clerk Auth with native B2B organization RBAC and user profile components',
      'Stripe checkout with cryptographically verified HMAC webhook dispatch',
      'Full APM observability with Sentry stack traces and session replays',
    ],
    slots: {
      frontend: 'nextjs',
      backend: null,
      database: 'supabase-db',
      auth: 'clerk',
      storage: 'supabase-storage',
      hosting: 'vercel',
      payments: 'stripe',
      email: 'resend',
      monitoring: 'sentry',
      cicd: 'vercel-ci',
      ai: null,
      queues: 'bullmq',
      mobile: null,
    },
  },
  {
    id: 'ai_agent_worker',
    code: 'PATT-05',
    name: 'AI Agent Worker & Vector Microservice',
    nameEn: 'AI Agent Worker & Vector Microservice',
    tag: 'ai',
    tagLabel: 'AI & DATA',
    tagLabelEn: 'AI & DATA',
    evidenceLevel: 'industry_pattern',
    evidenceBadgeEs: 'PATRÓN DE INDUSTRIA',
    evidenceBadgeEn: 'INDUSTRY PATTERN',
    evidenceSourceEs: 'Arquitectura validada para orquestación de LLMs y búsqueda vectorial',
    evidenceSourceEn: 'Validated architecture for LLM agent workers and vector search',
    description:
      'Arquitectura desacoplada especializada en ejecución asíncrona de agentes LLM, embeddings vectoriales y tareas intensivas de GPU/CPU.',
    descriptionEn:
      'Decoupled microservice architecture specialized in asynchronous LLM agent orchestration, vector embeddings, and compute workloads.',
    highlights: [
      'Backend en FastAPI (Python) con soporte asíncrono y esquemas Pydantic tipados',
      'PostgreSQL con extensión pgvector y Redis para colas de tareas en segundo plano',
      'Servidor VPS dedicado en Hetzner con costes fijos sin sorpresas de facturación',
    ],
    highlightsEn: [
      'FastAPI (Python) backend with native async concurrency and Pydantic schemas',
      'PostgreSQL with pgvector extension and Redis for high-throughput task queues',
      'Dedicated Hetzner VPS instance ensuring 100% predictable compute expenditure',
    ],
    slots: {
      frontend: 'react-vite',
      backend: 'fastapi',
      database: 'postgres',
      auth: 'better-auth',
      storage: 'cloudflare-r2',
      hosting: 'hetzner-vps',
      payments: 'stripe',
      email: 'postmark',
      monitoring: 'betterstack',
      cicd: 'github-actions',
      ai: 'pgvector',
      queues: 'bullmq',
      mobile: null,
    },
  },
  {
    id: 'local_first_turso',
    code: 'PATT-06',
    name: 'Local-First Reactive SQLite Replicated',
    nameEn: 'Local-First Reactive SQLite Replicated',
    tag: 'local_first',
    tagLabel: 'LOCAL-FIRST',
    tagLabelEn: 'LOCAL-FIRST',
    evidenceLevel: 'industry_pattern',
    evidenceBadgeEs: 'PATRÓN DE INDUSTRIA',
    evidenceBadgeEn: 'INDUSTRY PATTERN',
    evidenceSourceEs: 'Diseño reactivo offline-ready con sincronización en edge',
    evidenceSourceEn: 'Reactive offline-ready pattern with edge SQLite synchronization',
    description:
      'Arquitectura local-first con réplicas embebidas en el cliente para latencia de lectura de microsegundos y sincronización en segundo plano con libSQL.',
    descriptionEn:
      'Local-first architecture featuring embedded client replicas for microsecond read latency and background synchronization with libSQL.',
    highlights: [
      'Bases de datos SQLite distribuidas con Turso libSQL a escala global',
      'Micro-framework Hono para APIs ultraligeras (<15KB) desplegadas en el Edge',
      'Cero coste de base de datos hasta 500 bases de datos en tier gratuito',
    ],
    highlightsEn: [
      'Distributed SQLite databases powered by Turso libSQL across edge regions',
      'Ultra-lightweight Hono micro-framework (<15KB) running natively on Workers',
      '$0 database operating cost up to 500 databases on generous free tier',
    ],
    slots: {
      frontend: 'react-vite',
      backend: 'hono',
      database: 'turso',
      auth: 'better-auth',
      storage: 'cloudflare-r2',
      hosting: 'cloudflare-pages',
      payments: 'lemonsqueezy',
      email: 'resend',
      monitoring: 'betterstack',
      cicd: 'github-actions',
      ai: null,
      queues: null,
      mobile: null,
    },
  },
  {
    id: 'mobile_saas_expo',
    code: 'PATT-07',
    name: 'Cross-Platform Mobile SaaS',
    nameEn: 'Cross-Platform Mobile SaaS',
    tag: 'mobile',
    tagLabel: 'MÓVIL',
    tagLabelEn: 'MOBILE',
    evidenceLevel: 'industry_pattern',
    evidenceBadgeEs: 'PATRÓN DE INDUSTRIA',
    evidenceBadgeEn: 'INDUSTRY PATTERN',
    evidenceSourceEs: 'Arquetipo validado de app móvil React Native Expo con BaaS',
    evidenceSourceEn: 'Validated React Native Expo mobile stack with unified BaaS',
    description:
      'Arquitectura de aplicación móvil para iOS y Android con React Native Expo, sincronización offline local y backend BaaS unificado.',
    descriptionEn:
      'Cross-platform iOS and Android mobile app architecture powered by React Native Expo, local offline caching, and unified BaaS.',
    highlights: [
      'Ecosistema Expo con compilación nativa en la nube vía EAS Build y updates OTA',
      'Autenticación persistente con tokens seguros en biometría y Supabase Auth',
      'Notificaciones push automáticas y emails transaccionales con Resend',
    ],
    highlightsEn: [
      'Expo ecosystem with cloud native builds via EAS and instant Over-The-Air updates',
      'Biometric keychain persistence and token exchange with Supabase Auth',
      'Automated cross-platform push notifications and transactional email via Resend',
    ],
    slots: {
      frontend: 'react-vite',
      backend: 'fastapi',
      database: 'supabase-db',
      auth: 'supabase-auth',
      storage: 'supabase-storage',
      hosting: 'hetzner-vps',
      payments: 'stripe',
      email: 'resend',
      monitoring: 'sentry',
      cicd: 'github-actions',
      ai: null,
      queues: null,
      mobile: 'react-native-expo',
    },
  },
  {
    id: 'data_streaming_olap',
    code: 'PATT-08',
    name: 'High-Throughput Streaming & Analytics',
    nameEn: 'High-Throughput Streaming & Analytics',
    tag: 'data',
    tagLabel: 'DATA & OLAP',
    tagLabelEn: 'DATA & OLAP',
    evidenceLevel: 'industry_pattern',
    evidenceBadgeEs: 'PATRÓN DE INDUSTRIA',
    evidenceBadgeEn: 'INDUSTRY PATTERN',
    evidenceSourceEs: 'Pipeline de ingesta distribuida OLAP con almacenamiento columnar',
    evidenceSourceEn: 'High-throughput event streaming pattern with columnar OLAP',
    description:
      'Pipeline de ingesta de eventos distribuidos a escala con ClickHouse columnar, colas Kafka/Redpanda y visualizaciones en tiempo real.',
    descriptionEn:
      'Distributed event ingestion pipeline at scale with columnar ClickHouse, Kafka/Redpanda queues, and real-time observability.',
    highlights: [
      'Almacenamiento columnar en ClickHouse con compresión zstd para billones de filas',
      'Ingesta de alto rendimiento en Go Gin procesando decenas de miles de eventos/seg',
      'Dashboards operativos en Grafana con métricas de latencia de particiones',
    ],
    highlightsEn: [
      'Columnar ClickHouse storage with zstd compression handling billions of events',
      'Ultra-fast Go Gin ingestion microservice sustaining tens of thousands events/sec',
      'Operational Grafana telemetry dashboards with partition consumer lag metrics',
    ],
    slots: {
      frontend: 'react-vite',
      backend: 'go-gin',
      database: 'clickhouse',
      auth: 'better-auth',
      storage: 'cloudflare-r2',
      hosting: 'hetzner-vps',
      payments: null,
      email: null,
      monitoring: 'grafana',
      cicd: 'github-actions',
      ai: null,
      queues: 'kafka',
      mobile: null,
    },
  },
  {
    id: 'edge_headless_ecommerce',
    code: 'PATT-09',
    name: 'Edge Headless E-Commerce Storefront',
    nameEn: 'Edge Headless E-Commerce Storefront',
    tag: 'edge',
    tagLabel: 'EDGE & SEO',
    tagLabelEn: 'EDGE & SEO',
    evidenceLevel: 'industry_pattern',
    evidenceBadgeEs: 'PATRÓN DE INDUSTRIA',
    evidenceBadgeEn: 'INDUSTRY PATTERN',
    evidenceSourceEs: 'Arquitectura de comercio perimetral con Core Web Vitals perfectos',
    evidenceSourceEn: 'Edge headless commerce architecture optimized for Core Web Vitals',
    description:
      'Tienda electrónica global con páginas estáticas generadas en Astro, micro-APIs en Hono y checkout integrado con Stripe.',
    descriptionEn:
      'Global online storefront featuring static pre-rendered Astro pages, edge micro-APIs in Hono, and Stripe payment processing.',
    highlights: [
      'HTML puro pre-renderizado con Astro para 100/100 en Core Web Vitals y SEO',
      'Distribución global en Cloudflare CDN con latencia TTFB inferior a 25ms',
      'Checkout seguro con Stripe y almacenamiento de catálogo en SQLite distribuido',
    ],
    highlightsEn: [
      'Pure pre-rendered HTML with Astro securing 100/100 Core Web Vitals and SEO',
      'Global edge distribution on Cloudflare CDN with sub-25ms TTFB worldwide',
      'Secure Stripe checkout pipeline backed by distributed edge SQLite on Turso',
    ],
    slots: {
      frontend: 'astro',
      backend: 'hono',
      database: 'turso',
      auth: 'authjs',
      storage: 'cloudflare-r2',
      hosting: 'cloudflare-pages',
      payments: 'stripe',
      email: 'resend',
      monitoring: 'betterstack',
      cicd: 'github-actions',
      ai: null,
      queues: null,
      mobile: null,
    },
  },
  {
    id: 'marketplace_split_escrow',
    code: 'PATT-10',
    name: 'Two-Sided Marketplace & Split Escrow',
    nameEn: 'Two-Sided Marketplace & Split Escrow',
    tag: 'saas',
    tagLabel: 'MARKETPLACE',
    tagLabelEn: 'MARKETPLACE',
    evidenceLevel: 'industry_pattern',
    evidenceBadgeEs: 'PATRÓN DE INDUSTRIA',
    evidenceBadgeEn: 'INDUSTRY PATTERN',
    evidenceSourceEs: 'Arquetipo para plataformas bifrontes con liquidación escrow',
    evidenceSourceEn: 'Two-sided platform archetype with escrow payout splits',
    description:
      'Marketplace multitenant con incorporación de vendedores mediante Stripe Connect, retención de comisiones y dashboards dedicados.',
    descriptionEn:
      'Multi-vendor marketplace featuring merchant onboarding via Stripe Connect, platform fee retention, and vendor dashboards.',
    highlights: [
      'Stripe Connect para división automática de fondos entre vendedores y plataforma',
      'Next.js App Router con Server Actions para transacciones ACID en PostgreSQL',
      'Auditoría y session replays con Sentry para resolución de disputas comerciales',
    ],
    highlightsEn: [
      'Stripe Connect handling automatic escrow payout splits and merchant compliance',
      'Next.js App Router with Server Actions executing strict ACID PostgreSQL mutations',
      'Sentry APM and session replays for rapid resolution of commercial checkout disputes',
    ],
    slots: {
      frontend: 'nextjs',
      backend: null,
      database: 'postgres',
      auth: 'clerk',
      storage: 'cloudflare-r2',
      hosting: 'vercel',
      payments: 'stripe',
      email: 'postmark',
      monitoring: 'sentry',
      cicd: 'vercel-ci',
      ai: null,
      queues: 'bullmq',
      mobile: null,
    },
  },
  {
    id: 'multiplayer_websocket_hub',
    code: 'PATT-11',
    name: 'High-Concurrency WebSocket Multiplayer Hub',
    nameEn: 'High-Concurrency WebSocket Multiplayer Hub',
    tag: 'local_first',
    tagLabel: 'REALTIME & GAME',
    tagLabelEn: 'REALTIME & GAME',
    evidenceLevel: 'industry_pattern',
    evidenceBadgeEs: 'PATRÓN DE INDUSTRIA',
    evidenceBadgeEn: 'INDUSTRY PATTERN',
    evidenceSourceEs: 'Servidor concurrente de baja latencia para juegos y salas en vivo',
    evidenceSourceEn: 'Low-latency concurrency pattern for real-time rooms and games',
    description:
      'Servidor de partidas multijugador con WebSockets concurrentes en Go, canales pub/sub en Redis y despliegue global en Fly.io.',
    descriptionEn:
      'Low-latency multiplayer room server with concurrent Go WebSockets, Redis pub/sub streams, and edge placement on Fly.io.',
    highlights: [
      'Goroutines concurrentes gestionando miles de conexiones persistentes con memoria mínima',
      'Redis Streams para pub/sub de estado de partidas y leaderboards ordenados',
      'Despliegue multirregión en Fly.io acercando el cómputo a los jugadores',
    ],
    highlightsEn: [
      'Concurrent Go routines managing thousands of persistent sockets with minimal RAM',
      'Redis Streams for volatile match state broadcasts and sorted set leaderboards',
      'Global multi-region placement on Fly.io bringing game loops closest to players',
    ],
    slots: {
      frontend: 'react-vite',
      backend: 'go-gin',
      database: 'redis',
      auth: 'better-auth',
      storage: null,
      hosting: 'fly-io',
      payments: 'stripe',
      email: null,
      monitoring: 'betterstack',
      cicd: 'github-actions',
      ai: null,
      queues: 'redis-streams',
      mobile: null,
    },
  },
  {
    id: 'selfhosted_privacy_stack',
    code: 'PATT-12',
    name: 'Self-Hosted Privacy-First Enterprise Stack',
    nameEn: 'Self-Hosted Privacy-First Enterprise Stack',
    tag: 'real',
    tagLabel: 'SELF-HOSTED',
    tagLabelEn: 'SELF-HOSTED',
    evidenceLevel: 'industry_pattern',
    evidenceBadgeEs: 'PATRÓN DE INDUSTRIA',
    evidenceBadgeEn: 'INDUSTRY PATTERN',
    evidenceSourceEs: 'Stack para soberanía de datos y auto-hospedaje en VPS dedicado',
    evidenceSourceEn: 'Self-hosted data sovereignty stack for dedicated VPS instances',
    description:
      'Arquitectura de soberanía de datos con Docker Compose, almacenamiento S3 privado en MinIO, analítica propia y LLM local con Ollama.',
    descriptionEn:
      'Data sovereignty architecture featuring Docker Compose, private MinIO object storage, self-hosted analytics, and local Ollama LLMs.',
    highlights: [
      '100% de los datos permanecen en tu propio VPS sin dependencias propietarias externas',
      'Almacenamiento de objetos privado con MinIO compatible con la API de Amazon S3',
      'Inferencia de IA sin enviar prompts a terceros utilizando Ollama en servidor dedicado',
    ],
    highlightsEn: [
      '100% of telemetry and data stays on your own VPS with zero third-party lock-in',
      'Private object storage via self-hosted MinIO fully compatible with Amazon S3 API',
      'Zero external data egress for AI inference using local Ollama on dedicated server',
    ],
    slots: {
      frontend: 'nextjs',
      backend: 'fastapi',
      database: 'postgres',
      auth: 'better-auth',
      storage: 'minio',
      hosting: 'hetzner-vps',
      payments: null,
      email: 'postmark',
      monitoring: 'grafana',
      cicd: 'github-actions',
      ai: 'ollama',
      queues: 'bullmq',
      mobile: null,
    },
  },

  // ==========================================
  // 3. ARQUITECTURAS DE REFERENCIA (5)
  // ==========================================
  {
    id: 'ref_cal_com',
    code: 'REF-01',
    name: 'Cal.com // Scheduling Infrastructure',
    nameEn: 'Cal.com // Scheduling Infrastructure',
    tag: 'saas',
    tagLabel: 'REFERENCIA',
    tagLabelEn: 'REFERENCE',
    evidenceLevel: 'reference_arch',
    evidenceBadgeEs: 'ARQUITECTURA DE REFERENCIA',
    evidenceBadgeEn: 'REFERENCE ARCHITECTURE',
    evidenceSourceEs: 'Reconstrucción analítica basada en el repositorio open-source oficial',
    evidenceSourceEn: 'Analytical teardown based on Cal.com official open-source repository',
    description:
      'Infraestructura de reservas de calendarios y videollamadas con Next.js App Router, PostgreSQL relacional, Stripe y entrega de correos transaccionales.',
    descriptionEn:
      'Enterprise calendar scheduling infrastructure powered by Next.js App Router, relational PostgreSQL, Stripe, and high-deliverability email dispatch.',
    highlights: [
      'Next.js App Router con integración server-side para sincronización con Google Calendar/Outlook',
      'PostgreSQL con transacciones ACID para evitar doble reserva de franjas horarias',
      'Pasarela Stripe para cobro de consultas y citas profesionales',
    ],
    highlightsEn: [
      'Next.js App Router with server-side OAuth sync with Google/Outlook calendars',
      'PostgreSQL with ACID locking preventing double-booking race conditions',
      'Stripe payment integration for professional billable appointments',
    ],
    slots: {
      frontend: 'nextjs',
      backend: null,
      database: 'postgres',
      auth: 'authjs',
      storage: 'aws-s3',
      hosting: 'vercel',
      payments: 'stripe',
      email: 'resend',
      monitoring: 'sentry',
      cicd: 'github-actions',
      ai: null,
      queues: 'bullmq',
      mobile: null,
    },
  },
  {
    id: 'ref_supabase_studio',
    code: 'REF-02',
    name: 'Supabase Studio // Database Platform',
    nameEn: 'Supabase Studio // Database Platform',
    tag: 'saas',
    tagLabel: 'REFERENCIA',
    tagLabelEn: 'REFERENCE',
    evidenceLevel: 'reference_arch',
    evidenceBadgeEs: 'ARQUITECTURA DE REFERENCIA',
    evidenceBadgeEn: 'REFERENCE ARCHITECTURE',
    evidenceSourceEs: 'Modelo analizado a partir de la consola y microservicios de Supabase',
    evidenceSourceEn: 'Teardown model derived from public Supabase console and backend',
    description:
      'Plataforma de gestión de bases de datos relacionales combinando frontend Next.js con microservicios de alto rendimiento en Go y Docker.',
    descriptionEn:
      'Cloud database management platform pairing Next.js frontend with high-performance Go microservices and container orchestration.',
    highlights: [
      'Dashboard Next.js con explorador SQL interactivo y editor de políticas RLS',
      'Microservicios en Go (Fiber) para provisionamiento de clusters y backups',
      'Aislamiento estricto de tenants en entornos Linux con PostgreSQL nativo',
    ],
    highlightsEn: [
      'Next.js console featuring interactive SQL query runner and RLS policy editor',
      'High-throughput Go (Fiber) microservices handling cluster provisioning',
      'Strict multi-tenant isolation running native PostgreSQL on Linux',
    ],
    slots: {
      frontend: 'nextjs',
      backend: 'go-fiber',
      database: 'postgres',
      auth: 'supabase-auth',
      storage: 'minio',
      hosting: 'aws-fargate',
      payments: 'stripe',
      email: 'resend',
      monitoring: 'betterstack',
      cicd: 'github-actions',
      ai: null,
      queues: 'kafka',
      mobile: null,
    },
  },
  {
    id: 'ref_vercel_ai',
    code: 'REF-03',
    name: 'Vercel AI Chatbot // Streaming Assistant',
    nameEn: 'Vercel AI Chatbot // Streaming Assistant',
    tag: 'ai',
    tagLabel: 'REFERENCIA',
    tagLabelEn: 'REFERENCE',
    evidenceLevel: 'reference_arch',
    evidenceBadgeEs: 'ARQUITECTURA DE REFERENCIA',
    evidenceBadgeEn: 'REFERENCE ARCHITECTURE',
    evidenceSourceEs: 'Patrón de referencia basado en el template oficial de Vercel AI SDK',
    evidenceSourceEn: 'Reference pattern derived from official Vercel AI SDK templates',
    description:
      'Asistente conversacional con streaming Server-Sent Events (SSE), base de datos vectorial para RAG y persistencia de sesiones en Redis.',
    descriptionEn:
      'Conversational AI assistant with Server-Sent Events (SSE) token streaming, pgvector RAG store, and Redis session caching.',
    highlights: [
      'Streaming reactivo de tokens con AI SDK y Next.js Edge Runtime',
      'Búsqueda de similitud de coseno en PostgreSQL mediante pgvector',
      'Caché de respuestas y throttling por IP con Redis serverless',
    ],
    highlightsEn: [
      'Reactive token streaming via AI SDK and Next.js Edge Runtime',
      'Cosine similarity vector search in PostgreSQL using pgvector',
      'Prompt response caching and rate-limiting powered by serverless Redis',
    ],
    slots: {
      frontend: 'nextjs',
      backend: null,
      database: 'postgres',
      auth: 'authjs',
      storage: 'cloudflare-r2',
      hosting: 'vercel',
      payments: null,
      email: null,
      monitoring: 'sentry',
      cicd: 'vercel-ci',
      ai: 'pgvector',
      queues: 'redis-streams',
      mobile: null,
    },
  },
  {
    id: 'ref_ghost_cms',
    code: 'REF-04',
    name: 'Ghost CMS // Publishing Platform',
    nameEn: 'Ghost CMS // Publishing Platform',
    tag: 'edge',
    tagLabel: 'REFERENCIA',
    tagLabelEn: 'REFERENCE',
    evidenceLevel: 'reference_arch',
    evidenceBadgeEs: 'ARQUITECTURA DE REFERENCIA',
    evidenceBadgeEn: 'REFERENCE ARCHITECTURE',
    evidenceSourceEs: 'Modelo analizado a partir del motor open-source de Ghost Foundation',
    evidenceSourceEn: 'Architecture model analyzed from Ghost open-source publishing core',
    description:
      'Plataforma editorial y membresías para creadores independientes con backend en Node.js, almacenamiento MySQL y caché global perimetral.',
    descriptionEn:
      'Independent creator publishing and membership platform with Node.js backend, MySQL persistence, and global edge CDN caching.',
    highlights: [
      'Frontend desacoplado con renderizado ultrarrápido y suscripciones vía Stripe',
      'Backend Node.js optimizado para procesamiento de markdown y newsletters masivas',
      'Caché perimetral agresiva en Cloudflare reduciendo carga en la base de datos',
    ],
    highlightsEn: [
      'Decoupled publishing frontend with instant member subscriptions via Stripe',
      'Node.js backend optimized for markdown rendering and bulk newsletter dispatch',
      'Aggressive Cloudflare edge caching offloading 95%+ of dynamic database reads',
    ],
    slots: {
      frontend: 'react-vite',
      backend: 'node-express',
      database: 'mysql',
      auth: 'better-auth',
      storage: 'aws-s3',
      hosting: 'hetzner-vps',
      payments: 'stripe',
      email: 'postmark',
      monitoring: 'betterstack',
      cicd: 'github-actions',
      ai: null,
      queues: 'bullmq',
      mobile: null,
    },
  },
  {
    id: 'ref_posthog_analytics',
    code: 'REF-05',
    name: 'PostHog // Product Analytics Engine',
    nameEn: 'PostHog // Product Analytics Engine',
    tag: 'data',
    tagLabel: 'REFERENCIA',
    tagLabelEn: 'REFERENCE',
    evidenceLevel: 'reference_arch',
    evidenceBadgeEs: 'ARQUITECTURA DE REFERENCIA',
    evidenceBadgeEn: 'REFERENCE ARCHITECTURE',
    evidenceSourceEs: 'Reconstrucción analítica de la suite open-source de PostHog',
    evidenceSourceEn: 'Analytical breakdown of PostHog open-source analytics platform',
    description:
      'Motor analítico de producto con ingesta masiva de eventos, almacenamiento columnar en ClickHouse y backend en Django/Python.',
    descriptionEn:
      'Product analytics engine handling high-volume event ingestion, columnar ClickHouse storage, and Django/Python API backend.',
    highlights: [
      'Base de datos columnar ClickHouse diseñada para consultas analíticas instantáneas sobre billones de puntos',
      'Bus de eventos Kafka desacoplando la ingesta de la persistencia',
      'Session recording y feature flags gestionados desde un dashboard React unificado',
    ],
    highlightsEn: [
      'ClickHouse columnar database purpose-built for sub-second queries over billions of events',
      'Kafka event bus decoupling ingest spikes from analytical persistence',
      'Integrated session replays and feature flags managed in a unified React UI',
    ],
    slots: {
      frontend: 'react-vite',
      backend: 'django',
      database: 'clickhouse',
      auth: 'better-auth',
      storage: 'minio',
      hosting: 'hetzner-vps',
      payments: null,
      email: 'postmark',
      monitoring: 'grafana',
      cicd: 'github-actions',
      ai: null,
      queues: 'kafka',
      mobile: null,
    },
  },
];

interface StacksCatalogProps {
  onLoadBlueprint: (slots: Record<TechCategory, string | null>) => void;
}

export const StacksCatalog: React.FC<StacksCatalogProps> = ({ onLoadBlueprint }) => {
  const { t, lang } = useI18n();
  const [selectedTag, setSelectedTag] = useState<BlueprintTag>('all');
  const [evidenceFilter, setEvidenceFilter] = useState<EvidenceFilter>('all');

  const filterTags: { id: BlueprintTag; label: string }[] = [
    { id: 'all', label: t.exploreFilterAll },
    { id: 'saas', label: t.exploreFilterSaas },
    { id: 'ai', label: t.exploreFilterAi },
    { id: 'local_first', label: t.exploreFilterLocalFirst },
    { id: 'edge', label: t.exploreFilterEdge },
    { id: 'mobile', label: lang === 'es' ? 'MÓVIL' : 'MOBILE' },
    { id: 'data', label: lang === 'es' ? 'DATA & STREAMING' : 'DATA & STREAMING' },
  ];

  const filteredBlueprints = STACK_BLUEPRINTS.filter((bp) => {
    // 1. Filtro por nivel de evidencia
    if (evidenceFilter !== 'all' && bp.evidenceLevel !== evidenceFilter) return false;

    // 2. Filtro por categoría temática
    if (selectedTag === 'all') return true;
    if (selectedTag === 'real') return bp.evidenceLevel === 'author_real';
    if (selectedTag === 'saas') return bp.tag === 'saas';
    if (selectedTag === 'local_first') return bp.tag === 'local_first';
    if (selectedTag === 'ai') return bp.tag === 'ai' || Boolean(bp.slots.ai);
    if (selectedTag === 'edge')
      return bp.tag === 'edge' || bp.slots.hosting === 'cloudflare-pages' || bp.slots.frontend === 'astro';
    if (selectedTag === 'mobile') return bp.tag === 'mobile' || Boolean(bp.slots.mobile);
    if (selectedTag === 'data') return bp.tag === 'data' || bp.slots.database === 'clickhouse';
    return true;
  });

  return (
    <div className="canvas-view" style={{ paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div className="nutrition-panel" style={{ marginBottom: '1.5rem' }}>
        <div className="nutrition-headline-group">
          <div className="nutrition-stamp">
            <span className="nutrition-stamp-num">19</span>
            <span className="nutrition-stamp-lbl">SPEC</span>
          </div>
          <div className="nutrition-headline">
            <h2>{t.exploreTitle}</h2>
            <p>{t.exploreSubtitle}</p>
          </div>
        </div>
      </div>

      {/* 1. Evidence Level Filter Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'block',
            marginBottom: '0.4rem',
          }}
        >
          {lang === 'es'
            ? 'NIVEL DE EVIDENCIA ARQUITECTÓNICA // EVIDENCE LEVEL:'
            : 'ARCHITECTURAL EVIDENCE LEVEL:'}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          <button
            type="button"
            className={`chip-btn ${evidenceFilter === 'all' ? 'selected' : ''}`}
            onClick={() => setEvidenceFilter('all')}
          >
            {lang === 'es' ? 'TODAS LAS FUENTES (19)' : 'ALL SOURCES (19)'}
          </button>
          <button
            type="button"
            className={`chip-btn ${evidenceFilter === 'author_real' ? 'selected' : ''}`}
            style={{
              borderColor: evidenceFilter === 'author_real' ? 'var(--yellow-vivid)' : undefined,
              color: evidenceFilter === 'author_real' ? 'var(--yellow-vivid)' : undefined,
            }}
            onClick={() => setEvidenceFilter('author_real')}
          >
            ★ {lang === 'es' ? 'PROYECTOS DEL AUTOR (5)' : 'AUTHOR-OWNED (5)'}
          </button>
          <button
            type="button"
            className={`chip-btn ${evidenceFilter === 'industry_pattern' ? 'selected' : ''}`}
            style={{
              borderColor: evidenceFilter === 'industry_pattern' ? '#38BDF8' : undefined,
              color: evidenceFilter === 'industry_pattern' ? '#38BDF8' : undefined,
            }}
            onClick={() => setEvidenceFilter('industry_pattern')}
          >
            {lang === 'es' ? 'PATRONES DE INDUSTRIA (9)' : 'INDUSTRY PATTERNS (9)'}
          </button>
          <button
            type="button"
            className={`chip-btn ${evidenceFilter === 'reference_arch' ? 'selected' : ''}`}
            style={{
              borderColor: evidenceFilter === 'reference_arch' ? '#A78BFA' : undefined,
              color: evidenceFilter === 'reference_arch' ? '#A78BFA' : undefined,
            }}
            onClick={() => setEvidenceFilter('reference_arch')}
          >
            {lang === 'es' ? 'ARQUITECTURAS DE REFERENCIA (5)' : 'REFERENCE ARCHITECTURES (5)'}
          </button>
        </div>
      </div>

      {/* 2. Technical Domain Category Filter Tabs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'block',
            marginBottom: '0.4rem',
          }}
        >
          {lang === 'es' ? 'DOMINIO TÉCNICO // DOMAIN:' : 'TECHNICAL DOMAIN:'}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {filterTags.map((ft) => (
            <button
              key={ft.id}
              type="button"
              className={`chip-btn ${selectedTag === ft.id ? 'selected' : ''}`}
              style={{ fontSize: '0.76rem', padding: '0.25rem 0.65rem' }}
              onClick={() => setSelectedTag(ft.id)}
            >
              {ft.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Blueprints */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filteredBlueprints.map((bp) => {
          const evidenceColor =
            bp.evidenceLevel === 'author_real'
              ? 'var(--yellow-vivid)'
              : bp.evidenceLevel === 'industry_pattern'
              ? '#38BDF8'
              : '#A78BFA';

          const evidenceBg =
            bp.evidenceLevel === 'author_real'
              ? 'rgba(255, 208, 0, 0.08)'
              : bp.evidenceLevel === 'industry_pattern'
              ? 'rgba(56, 189, 248, 0.08)'
              : 'rgba(167, 139, 250, 0.08)';

          const evidenceBorder =
            bp.evidenceLevel === 'author_real'
              ? 'var(--yellow-border)'
              : bp.evidenceLevel === 'industry_pattern'
              ? 'rgba(56, 189, 248, 0.3)'
              : 'rgba(167, 139, 250, 0.3)';

          return (
            <div
              key={bp.id}
              className="craft-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.25rem',
                border: '1px solid var(--border-rule)',
                background: 'var(--bg-card)',
              }}
            >
              <div>
                {/* Top Bar with Code and Category Pill */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.6rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--yellow-vivid)',
                      background: 'var(--yellow-dim)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid var(--yellow-border)',
                    }}
                  >
                    [{bp.code}]
                  </span>
                  <span
                    className="pill-tag"
                    style={{
                      margin: 0,
                      color: 'var(--text-pure)',
                      borderColor: 'var(--border-rule)',
                    }}
                  >
                    {lang === 'es' ? bp.tagLabel : bp.tagLabelEn}
                  </span>
                </div>

                {/* Evidence Source Strip */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.15rem',
                    marginBottom: '0.75rem',
                    padding: '0.35rem 0.55rem',
                    background: evidenceBg,
                    border: `1px solid ${evidenceBorder}`,
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                  }}
                >
                  <span style={{ fontWeight: 800, color: evidenceColor }}>
                    [ {lang === 'es' ? bp.evidenceBadgeEs : bp.evidenceBadgeEn} ]
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.66rem' }}>
                    {lang === 'es' ? bp.evidenceSourceEs : bp.evidenceSourceEn}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: 'var(--text-pure)',
                    marginBottom: '0.45rem',
                  }}
                >
                  {lang === 'es' ? bp.name : bp.nameEn}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                    marginBottom: '1rem',
                  }}
                >
                  {lang === 'es' ? bp.description : bp.descriptionEn}
                </p>

                {/* Highlights List */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <h4
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--yellow-vivid)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.45rem',
                    }}
                  >
                    {t.exploreHighlightsLabel}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {(lang === 'es' ? bp.highlights : bp.highlightsEn).map((hl, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.4rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: 'var(--text-pure)',
                          lineHeight: 1.4,
                        }}
                      >
                        <span style={{ color: 'var(--yellow-vivid)', fontWeight: 800 }}>•</span>
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Topology Layers Pills */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.45rem',
                    }}
                  >
                    {t.exploreLayersLabel}
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {Object.entries(bp.slots)
                      .filter(([, id]) => Boolean(id))
                      .map(([cat, id]) => {
                        const raw = TECH_BY_ID[id!];
                        if (!raw) return null;
                        const tech = getLocalizedTech(raw, lang);
                        return (
                          <span
                            key={cat}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-rule)',
                              padding: '0.2rem 0.45rem',
                              borderRadius: 'var(--radius-xs)',
                              fontSize: '0.72rem',
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--text-pure)',
                            }}
                          >
                            <TechLogo id={tech.id} size={13} />
                            <span>{tech.name}</span>
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                className="btn-card-swap"
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textAlign: 'center',
                }}
                onClick={() => onLoadBlueprint(bp.slots)}
              >
                {t.exploreBtnLoad}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
