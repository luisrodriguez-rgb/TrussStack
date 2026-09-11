import React from 'react';
import type { Technology } from '../../engine/types';
import { TECH_BY_ID } from '../../engine/catalog';
import { TechLogo } from '../common/TechLogo';

interface TradeoffDrawerProps {
  tech: Technology | null;
  currentStack: Record<string, string | null>;
  onClose: () => void;
  onReplaceClick: (category: string) => void;
}

export const TradeoffDrawer: React.FC<TradeoffDrawerProps> = ({
  tech,
  currentStack,
  onClose,
  onReplaceClick,
}) => {
  if (!tech) return null;

  const metricItems = [
    { label: 'DEVELOPER EXPERIENCE (DX)', val: tech.metrics.dx },
    { label: 'CURVA DE APRENDIZAJE', val: tech.metrics.learningCurve },
    { label: 'ESCALABILIDAD TÉCNICA', val: tech.metrics.scalability },
    { label: 'ECOSISTEMA & LIBRERÍAS', val: tech.metrics.ecosystem },
    { label: 'COMUNIDAD & SOPORTE', val: tech.metrics.community },
    { label: 'MADUREZ EN PRODUCCIÓN', val: tech.metrics.maturity },
    { label: 'COMPLEJIDAD OPERATIVA (OPS)', val: tech.metrics.operationalComplexity },
    { label: 'VENDOR LOCK-IN (RIESGO)', val: tech.metrics.vendorLockin },
  ];

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div className="card-logo-box">
              <TechLogo id={tech.id} size={22} />
            </div>
            <div>
              <span className="pill-tag">{tech.category}</span>
              <h2>{tech.name}</h2>
            </div>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Cerrar">
            [ X ]
          </button>
        </div>

        <div className="drawer-body">
          {/* Tagline */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--cream-muted)' }}>
            {tech.tagline}
          </p>

          {/* Quick Action */}
          <button
            type="button"
            className="btn-card-swap"
            style={{ width: '100%', padding: '0.65rem', textAlign: 'center' }}
            onClick={() => {
              onClose();
              onReplaceClick(tech.category);
            }}
          >
            [ SUSTITUIR POR OTRO INGREDIENTE ]
          </button>

          {/* Sacrifices */}
          <div>
            <h3 className="drawer-section-title" style={{ color: 'var(--vermouth)' }}>
              [ ! ] LO QUE ESTÁS SACRIFICANDO AL ELEGIR ESTO
            </h3>
            <ul className="tradeoff-list">
              {tech.tradeoffs.sacrifices.map((sac, idx) => (
                <li key={idx} className="tradeoff-item sacrifice">
                  <span style={{ fontWeight: 800 }}>!</span>
                  <div>{sac}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pros */}
          <div>
            <h3 className="drawer-section-title" style={{ color: 'var(--citron)' }}>
              [ + ] VENTAJAS TÉCNICAS CLAVE
            </h3>
            <ul className="tradeoff-list">
              {tech.tradeoffs.pros.map((pro, idx) => (
                <li key={idx} className="tradeoff-item pro">
                  <span style={{ fontWeight: 800 }}>+</span>
                  <div>{pro}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div>
            <h3 className="drawer-section-title">
              [ - ] CONSIDERACIONES Y LÍMITES
            </h3>
            <ul className="tradeoff-list">
              {tech.tradeoffs.cons.map((con, idx) => (
                <li key={idx} className="tradeoff-item con">
                  <span style={{ fontWeight: 800 }}>-</span>
                  <div>{con}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Free Tier Profile */}
          <div>
            <h3 className="drawer-section-title">[ COSTES // FREE TIER ]</h3>
            <div
              style={{
                background: 'var(--bg-card)',
                padding: '1rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-rule)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--cream-dim)' }}>COSTE INICIAL:</span>
                <span style={{ fontWeight: 800, color: 'var(--citron)' }}>
                  {tech.costProfile.initialCost.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--cream-dim)' }}>RIESGO AL ESCALAR:</span>
                <span
                  style={{
                    fontWeight: 800,
                    color: tech.costProfile.scalingRisk === 'high' ? 'var(--vermouth)' : 'var(--citron)',
                  }}
                >
                  {tech.costProfile.scalingRisk.toUpperCase()}
                </span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-rule)', paddingTop: '0.5rem', marginTop: '0.5rem', color: 'var(--cream-muted)' }}>
                {tech.costProfile.freeTier.limitsDescription}
              </div>
            </div>
          </div>

          {/* Radar Metrics */}
          <div>
            <h3 className="drawer-section-title">[ RADAR DE INGREDIENTE // 1 A 5 ]</h3>
            <div className="metric-bars-list">
              {metricItems.map((m) => (
                <div key={m.label} className="metric-bar-item">
                  <span className="metric-bar-label">{m.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="metric-bar-track">
                      <div
                        className="metric-bar-fill"
                        style={{ width: `${(m.val / 5) * 100}%` }}
                      />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--citron)', minWidth: '24px' }}>
                      {m.val}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sinergias con el stack actual */}
          <div>
            <h3 className="drawer-section-title">[ SINERGIA CON EL STACK ACTUAL ]</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(currentStack)
                .filter(([cat, id]) => id && id !== tech.id && cat !== tech.category)
                .map(([_cat, otherId]) => {
                  const other = otherId ? TECH_BY_ID[otherId] : null;
                  if (!other) return null;
                  const intAB = tech.integrations[otherId!];
                  const intBA = other.integrations[tech.id];
                  const activeInt = intAB || intBA;

                  const isFriction =
                    activeInt && (activeInt.relation === 'friction' || activeInt.relation === 'incompatible');
                  const isNatural = activeInt && activeInt.relation === 'natural';

                  return (
                    <div
                      key={otherId}
                      style={{
                        padding: '0.65rem 0.85rem',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-xs)',
                        border: `1px solid ${
                          isFriction ? 'var(--vermouth)' : isNatural ? 'var(--citron)' : 'var(--border-rule)'
                        }`,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--cream-pure)' }}>{other.name}</span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: isFriction ? 'var(--vermouth)' : isNatural ? 'var(--citron)' : 'var(--cream-dim)',
                          }}
                        >
                          {isFriction ? '[ ! FRICCIÓN ]' : isNatural ? '[ OK NATIVO ]' : '[ COMPATIBLE ]'}
                        </span>
                      </div>
                      <div style={{ color: 'var(--cream-muted)', fontSize: '0.75rem' }}>
                        {activeInt ? activeInt.explanation : 'Conexión estándar sobre protocolos HTTP/REST.'}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Footer Meta */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-rule)',
              paddingTop: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
            }}
          >
            <a
              href={tech.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--citron)', textDecoration: 'none' }}
            >
              WEBSITE OFICIAL ↗
            </a>
            <span style={{ color: 'var(--cream-dim)' }}>LICENCIA: {tech.license}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
