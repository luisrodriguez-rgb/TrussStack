import React from 'react';
import type { TechCategory } from '../../engine/types';
import { useI18n } from '../../i18n/I18nContext';
import { TrussLogo } from '../common/TrussLogo';
import { TechLogo } from '../common/TechLogo';

interface LandingHeroProps {
  onStartWizard: () => void;
  onExploreStacks: () => void;
  onOpenBenchmarks: () => void;
  onLoadBlueprint: (slots: Record<TechCategory, string | null>) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartWizard,
  onExploreStacks,
  onOpenBenchmarks,
  onLoadBlueprint,
}) => {
  const { t, lang } = useI18n();

  // 3 sample production blueprints for quick 1-click exploration
  const featuredBlueprints = [
    {
      id: 'saas_fullstack',
      code: 'ARCH-01',
      title: lang === 'es' ? 'Modern Fullstack SaaS Boilerplate' : 'Modern Fullstack SaaS Boilerplate',
      tagline:
        lang === 'es'
          ? 'Next.js App Router + Supabase Postgres + Stripe + Resend + Vercel'
          : 'Next.js App Router + Supabase Postgres + Stripe + Resend + Vercel',
      cost: '$0 - $45 / mo',
      techs: ['nextjs', 'supabase-db', 'stripe', 'resend', 'vercel'],
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
      } as Record<TechCategory, string | null>,
    },
    {
      id: 'ai_worker',
      code: 'ARCH-02',
      title: lang === 'es' ? 'AI Agent Worker & Vector Microservice' : 'AI Agent Worker & Vector Microservice',
      tagline:
        lang === 'es'
          ? 'React SPA + FastAPI Async + PostgreSQL pgvector + BullMQ + Hetzner VPS'
          : 'React SPA + FastAPI Async + PostgreSQL pgvector + BullMQ + Hetzner VPS',
      cost: '~$18 / mo flat',
      techs: ['react-vite', 'fastapi', 'postgres', 'bullmq', 'hetzner-vps'],
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
      } as Record<TechCategory, string | null>,
    },
    {
      id: 'local_first',
      code: 'ARCH-03',
      title: lang === 'es' ? 'Local-First Reactive SQLite Replicated' : 'Local-First Reactive SQLite Replicated',
      tagline:
        lang === 'es'
          ? 'React SPA + Hono Edge API + Turso libSQL + Cloudflare Pages & R2'
          : 'React SPA + Hono Edge API + Turso libSQL + Cloudflare Pages & R2',
      cost: '$0 / mo (100% Free Tier)',
      techs: ['react-vite', 'hono', 'turso', 'cloudflare-pages', 'cloudflare-r2'],
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
      } as Record<TechCategory, string | null>,
    },
  ];

  return (
    <div className="landing-hero-container">
      {/* 1. Main Hero Banner */}
      <section className="hero-banner-box">
        <div className="hero-top-badge-row">
          <span className="hero-version-pill">{t.heroBadgeVersion}</span>
          <a
            href="https://github.com/luisrodriguez-rgb/TrussStack"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-github-star-link"
            title="Star TrussStack on GitHub"
          >
            <span className="github-star-icon">★</span>
            <span className="github-star-text">{t.heroBtnGithub}</span>
            <span className="github-star-badge">v4.0</span>
          </a>
        </div>

        <div className="hero-main-content">
          <div className="hero-brand-mark">
            <TrussLogo size={68} />
          </div>

          <h1 className="hero-main-title">
            <span className="title-dimmed">{t.heroMainTitle1}</span>
            <span className="title-highlight">{t.heroMainTitle2}</span>
          </h1>

          <p className="hero-lead-text">{t.heroSubtitle}</p>

          {/* Social Proof & Engineering Badges */}
          <div className="hero-badges-strip">
            <span className="hero-spec-badge">{t.heroBadgeTechCount}</span>
            <span className="hero-spec-badge accent">{t.heroBadgeDeterministic}</span>
            <span className="hero-spec-badge">{t.heroBadgeLatency}</span>
            <span className="hero-spec-badge">{t.heroBadgeMadr}</span>
          </div>

          {/* Direct CTA Buttons */}
          <div className="hero-cta-group">
            <button
              type="button"
              className="hero-btn-primary"
              onClick={onStartWizard}
            >
              {t.heroBtnStart}
            </button>
            <button
              type="button"
              className="hero-btn-secondary"
              onClick={onExploreStacks}
            >
              {t.heroBtnExplore}
            </button>
            <button
              type="button"
              className="hero-btn-secondary"
              onClick={onOpenBenchmarks}
            >
              {t.heroBtnBenchmarks}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Engineering Philosophy: What It Does vs. What It Does NOT Do */}
      <section className="hero-philosophy-section">
        <div className="section-header-block">
          <span className="section-micro-tag">{t.heroPhilosophyTag}</span>
          <h2 className="section-primary-title">{t.heroPhilosophyTitle}</h2>
          <p className="section-sub-text">{t.heroPhilosophySubtitle}</p>
        </div>

        <div className="what-it-does-grid">
          {/* Column A: What TrussStack Does */}
          <div className="what-column does-box">
            <div className="what-column-header">
              <span className="status-marker positive">[ + ]</span>
              <h3 className="what-column-title">{t.heroWhatItDoesTitle}</h3>
            </div>
            <div className="what-items-list">
              <div className="what-item">
                <strong className="item-title">{t.doesItem1Title}</strong>
                <p className="item-desc">{t.doesItem1Desc}</p>
              </div>
              <div className="what-item">
                <strong className="item-title">{t.doesItem2Title}</strong>
                <p className="item-desc">{t.doesItem2Desc}</p>
              </div>
              <div className="what-item">
                <strong className="item-title">{t.doesItem3Title}</strong>
                <p className="item-desc">{t.doesItem3Desc}</p>
              </div>
              <div className="what-item">
                <strong className="item-title">{t.doesItem4Title}</strong>
                <p className="item-desc">{t.doesItem4Desc}</p>
              </div>
              <div className="what-item">
                <strong className="item-title">{t.doesItem5Title}</strong>
                <p className="item-desc">{t.doesItem5Desc}</p>
              </div>
            </div>
          </div>

          {/* Column B: What TrussStack Does NOT Do */}
          <div className="what-column doesnt-box">
            <div className="what-column-header">
              <span className="status-marker negative">[ ! ]</span>
              <h3 className="what-column-title" style={{ color: 'var(--vermouth)' }}>
                {t.heroWhatItDoesntTitle}
              </h3>
            </div>
            <div className="what-items-list">
              <div className="what-item">
                <strong className="item-title" style={{ color: 'var(--vermouth)' }}>
                  {t.doesntItem1Title}
                </strong>
                <p className="item-desc">{t.doesntItem1Desc}</p>
              </div>
              <div className="what-item">
                <strong className="item-title" style={{ color: 'var(--vermouth)' }}>
                  {t.doesntItem2Title}
                </strong>
                <p className="item-desc">{t.doesntItem2Desc}</p>
              </div>
              <div className="what-item">
                <strong className="item-title" style={{ color: 'var(--vermouth)' }}>
                  {t.doesntItem3Title}
                </strong>
                <p className="item-desc">{t.doesntItem3Desc}</p>
              </div>
              <div className="what-item">
                <strong className="item-title" style={{ color: 'var(--vermouth)' }}>
                  {t.doesntItem4Title}
                </strong>
                <p className="item-desc">{t.doesntItem4Desc}</p>
              </div>
              <div className="what-item">
                <strong className="item-title" style={{ color: 'var(--vermouth)' }}>
                  {t.doesntItem5Title}
                </strong>
                <p className="item-desc">{t.doesntItem5Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 Lifecycle Steps */}
      <section className="hero-lifecycle-section">
        <div className="section-header-block">
          <span className="section-micro-tag">{t.heroLifecycleTag}</span>
          <h2 className="section-primary-title">{t.heroLifecycleTitle}</h2>
        </div>

        <div className="lifecycle-grid">
          <div className="lifecycle-step-card" onClick={onStartWizard}>
            <div className="step-num-badge">{t.heroStep1Num}</div>
            <h4 className="step-card-title">{t.heroStep1Title}</h4>
            <p className="step-card-desc">{t.heroStep1Desc}</p>
            <span className="step-card-link">{t.heroStep1Action}</span>
          </div>

          <div className="lifecycle-step-card" onClick={onStartWizard}>
            <div className="step-num-badge">{t.heroStep2Num}</div>
            <h4 className="step-card-title">{t.heroStep2Title}</h4>
            <p className="step-card-desc">{t.heroStep2Desc}</p>
            <span className="step-card-link">{t.heroStep2Action}</span>
          </div>

          <div className="lifecycle-step-card" onClick={onOpenBenchmarks}>
            <div className="step-num-badge">{t.heroStep3Num}</div>
            <h4 className="step-card-title">{t.heroStep3Title}</h4>
            <p className="step-card-desc">{t.heroStep3Desc}</p>
            <span className="step-card-link">{t.heroStep3Action}</span>
          </div>

          <div className="lifecycle-step-card" onClick={onExploreStacks}>
            <div className="step-num-badge">{t.heroStep4Num}</div>
            <h4 className="step-card-title">{t.heroStep4Title}</h4>
            <p className="step-card-desc">{t.heroStep4Desc}</p>
            <span className="step-card-link">{t.heroStep4Action}</span>
          </div>
        </div>
      </section>

      {/* 4. Featured Blueprints Quick Launch */}
      <section className="hero-featured-section">
        <div className="section-header-block">
          <span className="section-micro-tag">[ BLUEPRINTS // READY-TO-USE ]</span>
          <h2 className="section-primary-title">{t.heroFeaturedTitle}</h2>
          <p className="section-sub-text">{t.heroFeaturedSubtitle}</p>
        </div>

        <div className="featured-blueprints-grid">
          {featuredBlueprints.map((bp) => (
            <div key={bp.id} className="featured-blueprint-card">
              <div className="bp-card-top">
                <span className="bp-code-badge">{bp.code}</span>
                <span className="bp-cost-badge">{bp.cost}</span>
              </div>
              <h3 className="bp-card-title">{bp.title}</h3>
              <p className="bp-card-tagline">{bp.tagline}</p>

              <div className="bp-tech-logos-row">
                {bp.techs.map((tid) => (
                  <div key={tid} className="bp-mini-logo" title={tid}>
                    <TechLogo id={tid} size={18} />
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="bp-btn-load"
                onClick={() => onLoadBlueprint(bp.slots)}
              >
                {t.heroBtnLoadBlueprint}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
