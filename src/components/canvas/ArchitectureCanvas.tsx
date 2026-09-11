import React from 'react';
import type { StackRecommendation, TechCategory, Technology } from '../../engine/types';
import { TECH_BY_ID } from '../../engine/catalog';

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

  const renderNode = (category: TechCategory, customLabel?: string, isHero = false) => {
    const techId = slots[category];
    if (!techId) return null;
    const tech = TECH_BY_ID[techId];
    if (!tech) return null;

    return (
      <div
        key={tech.id}
        className={`node-card ${isHero ? 'hero-node' : ''}`}
        onClick={() => onInspectTech(tech)}
        style={{ cursor: 'pointer' }}
      >
        <div>
          <div className="node-top-bar">
            <span className="node-category-pill">{customLabel || category}</span>
            <span className="node-fit-badge">
              {tech.isOpenSource ? 'Open Source' : 'Cloud Managed'}
            </span>
          </div>

          <div className="node-title-group">
            <h4 className="node-name">{tech.name}</h4>
            <p className="node-tagline">{tech.tagline}</p>
          </div>

          <div className="node-meta-tags">
            {tech.costProfile.freeTier.hasFreeTier ? (
              <span className="node-tag-item free">✓ Free Tier Disponible</span>
            ) : (
              <span className="node-tag-item">Pago por uso / suscripción</span>
            )}
            <span className="node-tag-item">DX: {tech.metrics.dx}/5</span>
            <span className="node-tag-item">Escalabilidad: {tech.metrics.scalability}/5</span>
          </div>
        </div>

        <div className="node-actions" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="btn-node-replace"
            onClick={() => onReplaceCategory(category)}
          >
            <span>🔄</span> Replace
          </button>
          <button
            type="button"
            className="btn-node-inspect"
            onClick={() => onInspectTech(tech)}
          >
            Ver Trade-offs ➔
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="canvas-view">
      {/* 1. Status Bar con Fit Score y Dimensiones */}
      <div className="canvas-status-bar">
        <div className="fit-score-hero">
          <div className="score-circle" style={{ '--score-pct': fitScore } as React.CSSProperties}>
            <span className="score-number">{fitScore}%</span>
          </div>
          <div className="score-details">
            <h3>Fit Score de Arquitectura</h3>
            <p>Afinidad calculada según tus restricciones y preferencias declaradas</p>
          </div>
        </div>

        <div className="canvas-meta-chips">
          <div className="kpi-chip">
            <span className="kpi-label">Coste Inicial:</span>
            <span className="kpi-value healthy">{overallCostEstimate}</span>
          </div>

          <div className="kpi-chip">
            <span className="kpi-label">Velocidad DX:</span>
            <span className="kpi-value">{dimensionScores.speed}%</span>
          </div>

          <div className="kpi-chip">
            <span className="kpi-label">Portabilidad:</span>
            <span className="kpi-value">{dimensionScores.portability}%</span>
          </div>

          <div className="kpi-chip">
            <span className="kpi-label">Simplicidad:</span>
            <span className="kpi-value">{dimensionScores.simplicity}%</span>
          </div>
        </div>
      </div>

      {/* 2. Banner de Fricción Arquitectónica (si existe) */}
      {frictionWarnings.length > 0 && (
        <div className="friction-alert-banner has-friction">
          <span>⚠️</span>
          <div>
            <strong>Fricción Arquitectónica Detectada:</strong>{' '}
            {frictionWarnings.map((f, i) => (
              <span key={i}>
                {f.sourceName} + {f.targetName}: {f.message}{' '}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. Justificación Explicable ("Why?") */}
      {whyReasons.length > 0 && (
        <div
          style={{
            background: 'rgba(14, 165, 233, 0.05)',
            border: '1px solid rgba(14, 165, 233, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '0.9rem 1.25rem',
            fontSize: '0.85rem',
          }}
        >
          <div style={{ color: 'var(--cyan-400)', fontWeight: 700, marginBottom: '0.35rem' }}>
            💡 Fundamentos de la Recomendación:
          </div>
          <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {whyReasons.map((why, idx) => (
              <li key={idx}>{why}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Topología en 5 Capas */}
      <div className="layers-container">
        {/* CAPA 1: CLIENT / INGRESS */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">Capa 01</span>
            <span className="layer-title">Ingress & Client Interface</span>
          </div>
          <div className="layer-nodes-grid">{renderNode('frontend', 'Frontend Client', true)}</div>
        </div>

        {/* Conector */}
        <div className="layer-connector">
          <div className="connector-line" />
          <span className="connector-pill">HTTPS / WebFetch / RPC</span>
        </div>

        {/* CAPA 2: APPLICATION & API */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">Capa 02</span>
            <span className="layer-title">Application Engine & Business Logic</span>
          </div>
          <div className="layer-nodes-grid">
            {slots.backend ? (
              renderNode('backend', 'Backend API Server')
            ) : (
              <div
                className="node-card"
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                }}
              >
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '0.5rem' }}>
                  <div style={{ color: 'var(--cyan-400)', fontWeight: 600, fontSize: '0.95rem' }}>
                    ⚡ Serverless Route Handlers & Server Actions
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Integrados de forma nativa en {TECH_BY_ID[slots.frontend!]?.name || 'el Frontend'} (sin necesidad de servidor backend separado)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conector */}
        <div className="layer-connector">
          <div className="connector-line" />
          <span className="connector-pill">SQL Connection Pool / S3 Presigned / REST</span>
        </div>

        {/* CAPA 3: DATA & STATE */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">Capa 03</span>
            <span className="layer-title">Persistence, Database & State</span>
          </div>
          <div className="layer-nodes-grid">
            {renderNode('database', 'Primary Database')}
            {slots.storage && renderNode('storage', 'Object Storage')}
          </div>
        </div>

        {/* Conector */}
        <div className="layer-connector">
          <div className="connector-line" />
          <span className="connector-pill">JWT Tokens / OAuth / Webhooks / SMTP</span>
        </div>

        {/* CAPA 4: THIRD-PARTY SERVICES */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">Capa 04</span>
            <span className="layer-title">Third-Party Managed Services</span>
          </div>
          <div className="layer-nodes-grid">
            {slots.auth && renderNode('auth', 'Authentication Provider')}
            {slots.payments && renderNode('payments', 'Payment Gateway / MoR')}
            {slots.email && renderNode('email', 'Transactional Email')}
          </div>
        </div>

        {/* Conector */}
        <div className="layer-connector">
          <div className="connector-line" />
          <span className="connector-pill">Edge Deploy / APM Tracing / CI Triggers</span>
        </div>

        {/* CAPA 5: INFRASTRUCTURE & OPS */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">Capa 05</span>
            <span className="layer-title">Cloud Infrastructure & Observability</span>
          </div>
          <div className="layer-nodes-grid">
            {renderNode('hosting', 'Cloud Hosting & Edge CDN')}
            {slots.monitoring && renderNode('monitoring', 'Telemetry & Error Tracking')}
            {slots.cicd && renderNode('cicd', 'Automated CI/CD Pipeline')}
          </div>
        </div>
      </div>
    </div>
  );
};
