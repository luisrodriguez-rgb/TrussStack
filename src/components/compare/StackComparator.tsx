import React from 'react';
import type { TechCategory } from '../../engine/types';
import { TECH_BY_ID } from '../../engine/catalog';
import { getLocalizedTech } from '../../engine/catalogI18n';
import { TechLogo } from '../common/TechLogo';
import { useI18n } from '../../i18n/I18nContext';

export interface ArchitectureArchetype {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  slots: Record<TechCategory, string | null>;
  costZero: string;
  costZeroEn: string;
  costTenK: string;
  costTenKEn: string;
  attributes: {
    dx: number; // 0-100
    seo: number;
    speed: number;
    scale: number;
    simplicity: number;
    portability: number;
  };
  sacrifices: string[];
  sacrificesEn: string[];
  verdict: string;
  verdictEn: string;
}

export const ARCHITECTURE_ARCHETYPES: ArchitectureArchetype[] = [
  {
    id: 'saas_fullstack',
    code: 'ARCH-01',
    name: 'Modern Fullstack SaaS Boilerplate',
    nameEn: 'Modern Fullstack SaaS Boilerplate',
    tagline: 'Aceleración máxima para monetización rápida con framework híbrido y BaaS unificado.',
    taglineEn: 'Maximum velocity for revenue generation with hybrid framework and unified BaaS.',
    slots: {
      frontend: 'nextjs',
      backend: null,
      database: 'supabase-db',
      auth: 'supabase-auth',
      storage: 'supabase-storage',
      hosting: 'vercel',
      payments: 'stripe',
      email: 'resend',
      monitoring: 'sentry',
      cicd: 'vercel-ci',
      ai: null,
      queues: null,
      mobile: null,
    },
    costZero: '$0 / mes (100% Free Tier)',
    costZeroEn: '$0 / mo (100% Free Tier)',
    costTenK: '~$25 - $45 / mes (Supabase Pro + Vercel)',
    costTenKEn: '~$25 - $45 / mo (Supabase Pro + Vercel)',
    attributes: {
      dx: 95,
      seo: 90,
      speed: 98,
      scale: 85,
      simplicity: 92,
      portability: 60,
    },
    sacrifices: [
      'Sacrificas portabilidad trivial fuera de la nube de Vercel/Supabase.',
      'Sacrificas simplicidad mental frente a una arquitectura SPA desacoplada.',
      'Límites de tiempo de ejecución de Serverless Functions (10s en Hobby, 60s en Pro).',
    ],
    sacrificesEn: [
      'Sacrifices trivial portability outside the Vercel/Supabase managed cloud.',
      'Sacrifices mental simplicity compared to a pure decoupled client SPA.',
      'Serverless function execution timeouts (10s on Hobby, 60s on Pro).',
    ],
    verdict:
      'La elección definitiva para lanzar un producto comercial en menos de 14 días con 1 desarrollador.',
    verdictEn:
      'The definitive architecture to launch a monetizable commercial SaaS in under 14 days with 1 solo engineer.',
  },
  {
    id: 'decoupled_api',
    code: 'ARCH-02',
    name: 'Decoupled API & Dedicated VPS',
    nameEn: 'Decoupled API & Dedicated VPS',
    tagline: 'Separación estricta de frontend SPA y backend transaccional de alto rendimiento sobre contenedores.',
    taglineEn: 'Strict decoupling of frontend SPA and high-throughput backend running on Linux containers.',
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
      ai: null,
      queues: 'bullmq',
      mobile: null,
    },
    costZero: '~$18 / mes (VPS Hetzner CPX31)',
    costZeroEn: '~$18 / mo (Hetzner CPX31 VPS)',
    costTenK: '~$18 - $28 / mes (Mismo servidor sin sobrecostes)',
    costTenKEn: '~$18 - $28 / mo (Same flat server, zero egress surprises)',
    attributes: {
      dx: 80,
      seo: 40,
      speed: 70,
      scale: 96,
      simplicity: 55,
      portability: 98,
    },
    sacrifices: [
      'Sacrificas SEO público indexable en la interfaz de usuario (requiere prerender o SSR separado).',
      'Sacrificas el "cero mantenimiento": el equipo gestiona Docker, certificados SSL y parches del kernel.',
      'Requiere inversión fija de ~$18/mes desde el primer día.',
    ],
    sacrificesEn: [
      'Sacrifices public indexable SEO for the frontend SPA (requires dedicated SSR if indexing is needed).',
      'Sacrifices zero-ops: your team maintains Docker daemon, SSL certs, and Linux kernel upgrades.',
      'Requires a flat ~$18/mo fixed commitment from day one.',
    ],
    verdict:
      'Ideal para startups con carga computacional intensiva (IA, microservicios, APIs de datos) con costes 100% predecibles.',
    verdictEn:
      'Optimal for compute-heavy workloads (AI pipelines, microservices, high-throughput APIs) with rock-solid predictable costs.',
  },
  {
    id: 'edge_content',
    code: 'ARCH-03',
    name: 'Edge & Content-Driven Static',
    nameEn: 'Edge & Content-Driven Static',
    tagline: 'Arquitectura ultra-optimizada para Core Web Vitals, SEO impecable y distribución global a coste cero.',
    taglineEn: 'Hyper-optimized for pristine Core Web Vitals, unbeatable public SEO, and global CDN delivery.',
    slots: {
      frontend: 'astro',
      backend: 'hono',
      database: 'turso',
      auth: 'authjs',
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
    costZero: '$0 / mes (100% Free Tier)',
    costZeroEn: '$0 / mo (100% Free Tier)',
    costTenK: '$0 - $5 / mes (Cloudflare $0 egress + Turso Free)',
    costTenKEn: '$0 - $5 / mo (Cloudflare $0 egress + Turso Free)',
    attributes: {
      dx: 88,
      seo: 100,
      speed: 92,
      scale: 92,
      simplicity: 88,
      portability: 82,
    },
    sacrifices: [
      'Sacrificas gestión de estado cliente global y aplicaciones profundamente interactivas tipo canvas/Figma.',
      'Sacrificas un único lenguaje de servidor unificado (Node tradicional sustituido por Edge runtimes).',
    ],
    sacrificesEn: [
      'Sacrifices rich global reactive client state for deeply interactive tools (like Figma/Canvas).',
      'Sacrifices traditional Node.js C++ runtime dependencies due to strict Edge runtime limits.',
    ],
    verdict:
      'Imbatible para blogs, e-commerce headless, documentación técnica y sitios públicos con SEO crítico.',
    verdictEn:
      'Unbeatable for blogs, documentation hubs, headless e-commerce, and public-facing SEO platforms.',
  },
  {
    id: 'ai_agent_pipeline',
    code: 'ARCH-04',
    name: 'Autonomous AI Agent & Vector Pipeline',
    nameEn: 'Autonomous AI Agent & Vector Pipeline',
    tagline: 'Workers asíncronos para tareas de LLM, embeddings semánticos y persistencia vectorial.',
    taglineEn: 'Asynchronous task workers for LLM pipelines, semantic embeddings, and vector indexing.',
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
    costZero: '~$18 / mes (VPS Hetzner CPX31)',
    costZeroEn: '~$18 / mo (Hetzner CPX31 VPS)',
    costTenK: '~$40 - $85 / mes (VPS + API Inference tokens)',
    costTenKEn: '~$40 - $85 / mo (VPS + API Inference tokens)',
    attributes: {
      dx: 82,
      seo: 45,
      speed: 72,
      scale: 94,
      simplicity: 65,
      portability: 92,
    },
    sacrifices: [
      'Sacrificas serverless efímero: necesitas servidores persistentes para workers y memoria de procesos.',
      'Sacrificas predictibilidad de costes si dependes de tokens de APIs externas de LLMs sin caching.',
    ],
    sacrificesEn: [
      'Sacrifices pure ephemeral serverless: requires persistent processes for job workers and memory.',
      'Sacrifices cost predictability if consuming external closed LLM tokens without caching.',
    ],
    verdict:
      'La arquitectura de referencia para agentes autónomos con flujos multietapa, RAG y extracción de datos.',
    verdictEn:
      'The golden pattern for multi-step agent loops, semantic retrieval, and asynchronous extraction.',
  },
  {
    id: 'event_driven_microservices',
    code: 'ARCH-05',
    name: 'Event-Driven Async Microservices & Analytics',
    nameEn: 'Event-Driven Async Microservices & Analytics',
    tagline: 'Desacoplamiento total por eventos, tolerancia a particiones y almacenamiento columnar.',
    taglineEn: 'Fully event-driven choreography, partition fault tolerance, and columnar analytics.',
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
    costZero: '~$25 / mes (VPS con Docker Compose)',
    costZeroEn: '~$25 / mo (VPS with Docker Compose)',
    costTenK: '~$35 - $60 / mes (ClickHouse comprimido + Redpanda)',
    costTenKEn: '~$35 - $60 / mo (Compressed ClickHouse + Redpanda)',
    attributes: {
      dx: 70,
      seo: 30,
      speed: 65,
      scale: 100,
      simplicity: 48,
      portability: 95,
    },
    sacrifices: [
      'Sacrificas consistencia inmediata: las lecturas analíticas son eventualmente consistentes.',
      'Sacrificas simplicidad mental y operativa: depurar transacciones distribuidas requiere trazado distribuido.',
    ],
    sacrificesEn: [
      'Sacrifices immediate consistency: analytical stream consumer views are eventually consistent.',
      'Sacrifices mental and operational simplicity: distributed tracing is required for debugging.',
    ],
    verdict:
      'Indispensable para ingesta de millones de eventos diarios, streaming de telemetría y OLAP.',
    verdictEn:
      'Crucial for millions of daily ingestion events, telemetry streaming, and high-volume OLAP.',
  },
  {
    id: 'local_first_replicated',
    code: 'ARCH-06',
    name: 'Local-First Offline-Ready Replicated',
    nameEn: 'Local-First Offline-Ready Replicated',
    tagline: 'Latencia de 0ms en cliente con réplica embebida, resiliencia offline y sincronización en background.',
    taglineEn: 'Zero-latency client interaction with embedded local replicas, offline resilience, and background sync.',
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
      mobile: 'react-native-expo',
    },
    costZero: '$0 / mes (100% Free Tier)',
    costZeroEn: '$0 / mo (100% Free Tier)',
    costTenK: '$0 - $12 / mes (Turso Free Tier + Cloudflare Pages)',
    costTenKEn: '$0 - $12 / mo (Turso Free Tier + Cloudflare Pages)',
    attributes: {
      dx: 86,
      seo: 50,
      speed: 85,
      scale: 92,
      simplicity: 82,
      portability: 90,
    },
    sacrifices: [
      'Sacrificas sincronización de estado trivial: resolver conflictos concurrentes exige CRDTs o timestamps deterministas.',
      'Sacrificas queries centralizadas complejas de reporting directo sobre todas las bases de datos descentralizadas.',
    ],
    sacrificesEn: [
      'Sacrifices naive state sync: concurrent updates require CRDT conflict resolution or vector clocks.',
      'Sacrifices direct centralized SQL queries across multiple decentralized client replicas.',
    ],
    verdict:
      'La mejor experiencia de usuario para aplicaciones interactivas, móviles y herramientas de productividad offline.',
    verdictEn:
      'The definitive UX pattern for deeply responsive tools, mobile apps, and offline productivity suites.',
  },
];

interface StackComparatorProps {
  onLoadStack: (slots: Record<TechCategory, string | null>) => void;
}

export const StackComparator: React.FC<StackComparatorProps> = ({ onLoadStack }) => {
  const { t, lang } = useI18n();

  const attributeLabels = [
    { key: 'dx', label: 'DEVELOPER EXPERIENCE (DX)' },
    { key: 'seo', label: 'PUBLIC SEO & EDGE LATENCY' },
    { key: 'speed', label: lang === 'es' ? 'VELOCIDAD DE ENTREGA' : 'DELIVERY VELOCITY' },
    { key: 'scale', label: lang === 'es' ? 'ESCALABILIDAD & CONCURRENCIA' : 'SCALE & CONCURRENCY' },
    { key: 'simplicity', label: lang === 'es' ? 'SIMPLICIDAD OPERATIVA' : 'OPERATIONAL SIMPLICITY' },
    { key: 'portability', label: lang === 'es' ? 'CERO LOCK-IN (PORTABILIDAD)' : 'ZERO VENDOR LOCK-IN' },
  ] as const;

  return (
    <div className="canvas-view" style={{ paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div className="nutrition-panel" style={{ marginBottom: '2rem' }}>
        <div className="nutrition-headline-group">
          <div className="nutrition-stamp">
            <span className="nutrition-stamp-num">6X</span>
            <span className="nutrition-stamp-lbl">VS</span>
          </div>
          <div className="nutrition-headline">
            <h2>{t.compareTitle}</h2>
            <p>{t.compareSubtitle}</p>
          </div>
        </div>
      </div>

      {/* 3 Columns Comparison Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {ARCHITECTURE_ARCHETYPES.map((arch) => {
          return (
            <div
              key={arch.id}
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
                {/* Top Code Badge & Name */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
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
                    [{arch.code}]
                  </span>
                  <span className="pill-tag" style={{ margin: 0 }}>
                    {arch.slots.backend ? 'DECOUPLED' : 'SERVERLESS HYBRID'}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--text-pure)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {lang === 'es' ? arch.name : arch.nameEn}
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
                  {lang === 'es' ? arch.tagline : arch.taglineEn}
                </p>

                {/* Key Components Pills */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                    padding: '0.6rem',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-xs)',
                    border: '1px solid var(--border-rule)',
                    marginBottom: '1.2rem',
                  }}
                >
                  {Object.entries(arch.slots)
                    .filter(([, id]) => Boolean(id))
                    .map(([cat, id]) => {
                      const raw = TECH_BY_ID[id!];
                      if (!raw) return null;
                      const tech = getLocalizedTech(raw, lang);
                      return (
                        <div
                          key={cat}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-rule)',
                            padding: '0.2rem 0.45rem',
                            borderRadius: 'var(--radius-xs)',
                            fontSize: '0.75rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-pure)',
                          }}
                        >
                          <TechLogo id={tech.id} size={14} />
                          <span>{tech.name}</span>
                        </div>
                      );
                    })}
                </div>

                {/* Cost Matrix */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <h4
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--yellow-vivid)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {t.compareCostTitle}
                  </h4>
                  <div
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-rule)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.65rem 0.85rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>{t.compareCostZero}</span>
                      <strong style={{ color: 'var(--citron)' }}>
                        {lang === 'es' ? arch.costZero : arch.costZeroEn}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-dim)' }}>{t.compareCostTenK}</span>
                      <strong style={{ color: 'var(--text-pure)' }}>
                        {lang === 'es' ? arch.costTenK : arch.costTenKEn}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Technical Radar / Attribute Bars */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <h4
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {t.compareRadarTitle}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {attributeLabels.map(({ key, label }) => {
                      const val = arch.attributes[key];
                      return (
                        <div key={key} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                            <span style={{ color: 'var(--text-dim)' }}>{label}</span>
                            <span style={{ color: 'var(--text-pure)', fontWeight: 700 }}>{val}%</span>
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: '4px',
                              background: 'var(--bg-elevated)',
                              borderRadius: '2px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${val}%`,
                                height: '100%',
                                background:
                                  val >= 90
                                    ? 'var(--citron)'
                                    : val >= 75
                                    ? 'var(--yellow-vivid)'
                                    : 'var(--text-dim)',
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sacrifices */}
                <div style={{ marginBottom: '1.2rem' }}>
                  <h4
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--vermouth)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {t.compareSacrificesTitle}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {(lang === 'es' ? arch.sacrifices : arch.sacrificesEn).map((sac, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.4rem',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.4,
                        }}
                      >
                        <span style={{ color: 'var(--vermouth)', fontWeight: 800 }}>!</span>
                        <span>{sac}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Verdict */}
                <div
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-rule)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--text-pure)',
                    marginBottom: '1.25rem',
                    lineHeight: 1.45,
                  }}
                >
                  <strong style={{ color: 'var(--yellow-vivid)', display: 'block', marginBottom: '0.2rem' }}>
                    {t.compareVerdictTitle}
                  </strong>
                  {lang === 'es' ? arch.verdict : arch.verdictEn}
                </div>
              </div>

              {/* Load Button */}
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
                onClick={() => onLoadStack(arch.slots)}
              >
                {t.btnLoadStack}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
