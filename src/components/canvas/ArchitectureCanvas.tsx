import React from 'react';
import type { StackRecommendation, TechCategory, Technology } from '../../engine/types';
import { TECH_BY_ID } from '../../engine/catalog';
import { TechLogo } from '../common/TechLogo';

interface ArchitectureCanvasProps {
  recommendation: StackRecommendation;
  onReplaceCategory: (category: TechCategory) => void;
  onInspectTech: (tech: Technology) => void;
}

export const ArchitectureCanvas: React.FC<ArchitectureCanvasProps> = ({
  recommendation,
  onReplaceCategory,
  onInspectTech,
}) => {
  const { slots, fitScore, overallCostEstimate, frictionWarnings, dimensionScores, whyReasons } =
    recommendation;

  const renderCard = (category: TechCategory, customLayerName?: string, isHero = false) => {
    const techId = slots[category];
    if (!techId) return null;
    const tech = TECH_BY_ID[techId];
    if (!tech) return null;

    return (
      <div
        key={tech.id}
        className={`craft-card ${isHero ? 'hero-node' : ''}`}
        onClick={() => onInspectTech(tech)}
      >
        <div>
          {/* Card Top Bar with Logo, Name and Action Icons */}
          <div className="card-header">
            <div className="card-brand-group">
              <div className="card-logo-box">
                <TechLogo id={tech.id} size={20} />
              </div>
              <span className="card-title-text">{tech.name}</span>
            </div>

            <div className="card-top-actions" onClick={(e) => e.stopPropagation()}>
              <a
                href={tech.website}
                target="_blank"
                rel="noopener noreferrer"
                className="card-icon-btn"
                title="Visitar sitio oficial"
              >
                ↗
              </a>
              <button
                type="button"
                className="card-icon-btn"
                onClick={() => onReplaceCategory(category)}
                title="Sustituir ingrediente"
              >
                +
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="card-description">{tech.description}</p>

          {/* Outlined Badge like reference image */}
          <div
            className={`badge-sin-tarjeta ${
              tech.costProfile.freeTier.hasFreeTier ? '' : 'orange'
            }`}
          >
            {tech.costProfile.freeTier.hasFreeTier
              ? 'SIN TARJETA'
              : tech.costProfile.initialCost === 'free'
              ? 'TIER GRATIS'
              : 'PAGO POR USO'}
          </div>

          {/* Quota / Free tier breakdown */}
          <p className="card-quota-text">
            {tech.costProfile.freeTier.limitsDescription || tech.tagline}
          </p>
        </div>

        {/* Footer Tags & Actions */}
        <div className="card-footer-tags" onClick={(e) => e.stopPropagation()}>
          <div className="tag-pills-list">
            <span className="pill-tag">{customLayerName || category}</span>
            <span className="pill-tag">
              {tech.isOpenSource ? 'open source' : 'managed'}
            </span>
            <span className="pill-tag">dx {tech.metrics.dx}/5</span>
          </div>

          <div className="card-action-btns">
            <button
              type="button"
              className="btn-card-swap"
              onClick={() => onReplaceCategory(category)}
            >
              [ REEMPLAZAR ]
            </button>
            <button
              type="button"
              className="btn-card-details"
              onClick={() => onInspectTech(tech)}
            >
              TRADE-OFFS ↗
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="canvas-view">
      {/* 1. STACK NUTRITION FACTS / FORMULA SPEC PANEL */}
      <div className="nutrition-panel">
        <div className="nutrition-headline-group">
          <div className="nutrition-stamp">
            <span className="nutrition-stamp-num">{fitScore}%</span>
            <span className="nutrition-stamp-lbl">PURITY</span>
          </div>

          <div className="nutrition-headline">
            <h2>FORMULA NUTRITION FACTS // BATCH #2026.09</h2>
            <p>Arquitectura calculada determinísticamente sin ingredientes artificiales ni sesgo</p>
          </div>
        </div>

        <div className="nutrition-metrics-row">
          <div className="nutrition-metric-box">
            <span className="metric-micro-label">SERVING SIZE</span>
            <span className="metric-micro-val">1 DEV TEAM</span>
          </div>

          <div className="nutrition-metric-box">
            <span className="metric-micro-label">EST. RUNTIME COST</span>
            <span className="metric-micro-val citron">
              {overallCostEstimate.split(' ')[0]}
            </span>
          </div>

          <div className="nutrition-metric-box">
            <span className="metric-micro-label">DEVELOPER DX</span>
            <span className="metric-micro-val">{dimensionScores.speed}%</span>
          </div>

          <div className="nutrition-metric-box">
            <span className="metric-micro-label">NO LOCK-IN</span>
            <span className="metric-micro-val">{dimensionScores.portability}%</span>
          </div>

          <div className="nutrition-metric-box">
            <span className="metric-micro-label">SIMPLICITY</span>
            <span className="metric-micro-val">{dimensionScores.simplicity}%</span>
          </div>
        </div>
      </div>

      {/* 2. Banner de Fricción Arquitectónica (si existe) */}
      {frictionWarnings.length > 0 && (
        <div className="friction-notice-box">
          <strong>[ ! ] ATENCIÓN ARQUITECTÓNICA:</strong>{' '}
          {frictionWarnings.map((f, i) => (
            <span key={i}>
              [{f.sourceName} + {f.targetName}]: {f.message}{' '}
            </span>
          ))}
        </div>
      )}

      {/* 3. Justificación de Receta ("Why?") */}
      {whyReasons.length > 0 && (
        <div className="why-reasons-box">
          <div className="why-reasons-title">[ RECETA TÉCNICA // POR QUÉ ENCAJA ]</div>
          <ul className="why-reasons-list">
            {whyReasons.map((why, idx) => (
              <li key={idx} className="why-reason-item">
                {why}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Topología en 5 Capas */}
      <div className="layers-container">
        {/* CAPA 1: INGRESS & CLIENT */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">[ 01 ]</span>
            <span className="layer-title">Ingress & Client Interface</span>
          </div>
          <div className="layer-nodes-grid">{renderCard('frontend', 'frontend', true)}</div>
        </div>

        {/* Conector */}
        <div className="layer-connector">
          <div className="connector-line" />
          <span className="connector-pill">PROTOCOL: HTTPS / WEBFETCH / RPC</span>
        </div>

        {/* CAPA 2: APPLICATION & API */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">[ 02 ]</span>
            <span className="layer-title">Application Engine & Business Logic</span>
          </div>
          <div className="layer-nodes-grid">
            {slots.backend ? (
              renderCard('backend', 'backend api')
            ) : (
              <div
                className="craft-card"
                style={{
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  background: 'rgba(14, 19, 30, 0.4)',
                }}
              >
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <span
                    className="badge-sin-tarjeta"
                    style={{ marginBottom: '0.5rem' }}
                  >
                    NATIVE INTEGRATION
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--cream-pure)',
                    }}
                  >
                    SERVERLESS ROUTE HANDLERS
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--cream-dim)',
                      marginTop: '0.35rem',
                    }}
                  >
                    Integrados directamente en {TECH_BY_ID[slots.frontend!]?.name || 'Frontend'} sin requerir servidor backend independiente.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conector */}
        <div className="layer-connector">
          <div className="connector-line" />
          <span className="connector-pill">PROTOCOL: SQL CONNECTION POOL / S3 PRESIGNED</span>
        </div>

        {/* CAPA 3: DATA & STATE */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">[ 03 ]</span>
            <span className="layer-title">Persistence, Database & State</span>
          </div>
          <div className="layer-nodes-grid">
            {renderCard('database', 'database')}
            {slots.storage && renderCard('storage', 'storage')}
          </div>
        </div>

        {/* Conector */}
        <div className="layer-connector">
          <div className="connector-line" />
          <span className="connector-pill">PROTOCOL: JWT TOKENS / OAUTH / WEBHOOKS</span>
        </div>

        {/* CAPA 4: THIRD-PARTY SERVICES */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">[ 04 ]</span>
            <span className="layer-title">Third-Party Managed Services</span>
          </div>
          <div className="layer-nodes-grid">
            {slots.auth && renderCard('auth', 'auth')}
            {slots.payments && renderCard('payments', 'payments')}
            {slots.email && renderCard('email', 'email')}
          </div>
        </div>

        {/* Conector */}
        <div className="layer-connector">
          <div className="connector-line" />
          <span className="connector-pill">PROTOCOL: EDGE DEPLOY / APM TELEMETRY / CI HOOKS</span>
        </div>

        {/* CAPA 5: INFRASTRUCTURE & OPS */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">[ 05 ]</span>
            <span className="layer-title">Cloud Infrastructure & Observability</span>
          </div>
          <div className="layer-nodes-grid">
            {renderCard('hosting', 'hosting')}
            {slots.monitoring && renderCard('monitoring', 'monitoring')}
            {slots.cicd && renderCard('cicd', 'ci/cd')}
          </div>
        </div>
      </div>
    </div>
  );
};
