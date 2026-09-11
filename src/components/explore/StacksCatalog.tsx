import React, { useState } from 'react';
import type { TechCategory } from '../../engine/types';
import { TECH_BY_ID } from '../../engine/catalog';
import { getLocalizedTech } from '../../engine/catalogI18n';
import { TechLogo } from '../common/TechLogo';
import { useI18n } from '../../i18n/I18nContext';

export type BlueprintTag = 'all' | 'real' | 'saas' | 'local_first' | 'ai' | 'edge';

export interface StackBlueprint {
  id: string;
  code: string;
  name: string;
  nameEn: string;
  tag: BlueprintTag;
  tagLabel: string;
  tagLabelEn: string;
  description: string;
  descriptionEn: string;
  highlights: string[];
  highlightsEn: string[];
  slots: Record<TechCategory, string | null>;
}

export const STACK_BLUEPRINTS: StackBlueprint[] = [
  {
    id: 'mi_semestre',
    code: 'REAL-01',
    name: 'Mi Semestre // Academic Hub',
    nameEn: 'Mi Semestre // Academic Hub',
    tag: 'real',
    tagLabel: 'PROYECTO REAL',
    tagLabelEn: 'REAL-WORLD APP',
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
    },
  },
  {
    id: 'saas_production',
    code: 'PATT-04',
    name: 'Production B2B SaaS Boilerplate',
    nameEn: 'Production B2B SaaS Boilerplate',
    tag: 'saas',
    tagLabel: 'SAAS PRO',
    tagLabelEn: 'SAAS PRO',
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
    },
  },
];

interface StacksCatalogProps {
  onLoadBlueprint: (slots: Record<TechCategory, string | null>) => void;
}

export const StacksCatalog: React.FC<StacksCatalogProps> = ({ onLoadBlueprint }) => {
  const { t, lang } = useI18n();
  const [selectedTag, setSelectedTag] = useState<BlueprintTag>('all');

  const filterTags: { id: BlueprintTag; label: string }[] = [
    { id: 'all', label: t.exploreFilterAll },
    { id: 'real', label: t.exploreFilterReal },
    { id: 'saas', label: t.exploreFilterSaas },
    { id: 'local_first', label: t.exploreFilterLocalFirst },
    { id: 'ai', label: t.exploreFilterAi },
    { id: 'edge', label: t.exploreFilterEdge },
  ];

  const filteredBlueprints =
    selectedTag === 'all'
      ? STACK_BLUEPRINTS
      : STACK_BLUEPRINTS.filter((bp) => {
          if (selectedTag === 'real') return bp.tag === 'real';
          if (selectedTag === 'saas') return bp.tag === 'saas';
          if (selectedTag === 'local_first') return bp.tag === 'local_first';
          if (selectedTag === 'ai') return bp.tag === 'ai';
          if (selectedTag === 'edge') return bp.slots.hosting === 'cloudflare-pages' || bp.slots.frontend === 'astro';
          return true;
        });

  return (
    <div className="canvas-view" style={{ paddingBottom: '3rem' }}>
      {/* Header Banner */}
      <div className="nutrition-panel" style={{ marginBottom: '1.5rem' }}>
        <div className="nutrition-headline-group">
          <div className="nutrition-stamp">
            <span className="nutrition-stamp-num">6+</span>
            <span className="nutrition-stamp-lbl">SPEC</span>
          </div>
          <div className="nutrition-headline">
            <h2>{t.exploreTitle}</h2>
            <p>{t.exploreSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {filterTags.map((ft) => (
          <button
            key={ft.id}
            type="button"
            className={`chip-btn ${selectedTag === ft.id ? 'selected' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            onClick={() => setSelectedTag(ft.id)}
          >
            {ft.label}
          </button>
        ))}
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
                {/* Top Bar */}
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
                    [{bp.code}]
                  </span>
                  <span
                    className="pill-tag"
                    style={{
                      margin: 0,
                      color: bp.tag === 'real' ? 'var(--citron)' : 'var(--text-pure)',
                      borderColor: bp.tag === 'real' ? 'var(--yellow-border)' : 'var(--border-rule)',
                    }}
                  >
                    {lang === 'es' ? bp.tagLabel : bp.tagLabelEn}
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
