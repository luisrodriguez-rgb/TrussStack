import React from 'react';
import type { Technology } from '../../engine/types';
import { TECH_BY_ID } from '../../engine/catalog';

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
    { label: 'Developer Experience (DX)', val: tech.metrics.dx },
    { label: 'Curva de Aprendizaje', val: tech.metrics.learningCurve },
    { label: 'Escalabilidad', val: tech.metrics.scalability },
    { label: 'Ecosistema & Librerías', val: tech.metrics.ecosystem },
    { label: 'Comunidad & Soporte', val: tech.metrics.community },
    { label: 'Madurez en Producción', val: tech.metrics.maturity },
    { label: 'Complejidad Operativa (Ops)', val: tech.metrics.operationalComplexity },
    { label: 'Vendor Lock-in (Riesgo)', val: tech.metrics.vendorLockin },
  ];

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <span className="node-category-pill">{tech.category}</span>
            <h2>{tech.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              {tech.tagline}
            </p>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Cerrar">
            &times;
          </button>
        </div>

        <div className="drawer-body">
          {/* Quick Action */}
          <button
            type="button"
            className="btn-node-replace"
            style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
            onClick={() => {
              onClose();
              onReplaceClick(tech.category);
            }}
          >
            <span>🔄</span> Sustituir por otra tecnología compatible
          </button>

          {/* Sacrifices (El núcleo de trade-offs) */}
          <div className="drawer-section">
            <h3 className="drawer-section-title" style={{ color: 'var(--rose-400)' }}>
              <span>🛑</span> Lo que estás sacrificando al elegir esto
            </h3>
            <ul className="tradeoff-list">
              {tech.tradeoffs.sacrifices.map((sac, idx) => (
                <li key={idx} className="tradeoff-item sacrifice">
                  <span>⚠</span>
                  <div>{sac}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pros */}
          <div className="drawer-section">
            <h3 className="drawer-section-title" style={{ color: 'var(--emerald-400)' }}>
              <span>✓</span> Ventajas técnicas clave
            </h3>
            <ul className="tradeoff-list">
              {tech.tradeoffs.pros.map((pro, idx) => (
                <li key={idx} className="tradeoff-item pro">
                  <span>✓</span>
                  <div>{pro}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="drawer-section">
            <h3 className="drawer-section-title" style={{ color: 'var(--amber-400)' }}>
              <span>⚡</span> Desventajas y limitaciones
            </h3>
            <ul className="tradeoff-list">
              {tech.tradeoffs.cons.map((con, idx) => (
                <li key={idx} className="tradeoff-item con">
                  <span>-</span>
                  <div>{con}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Free tier & Cost profile */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">
              <span>💳</span> Perfil de Costes y Tier Gratuito
            </h3>
            <div style={{ background: 'var(--bg-canvas)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-dim)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Coste Inicial:</span>
                <span style={{ fontWeight: 600, color: 'var(--emerald-400)' }}>{tech.costProfile.initialCost.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Riesgo de Factura al Escalar:</span>
                <span style={{ fontWeight: 600, color: tech.costProfile.scalingRisk === 'high' ? 'var(--rose-400)' : 'var(--emerald-400)' }}>
                  {tech.costProfile.scalingRisk.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-dim)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <strong>Límites Free:</strong> {tech.costProfile.freeTier.limitsDescription}
              </div>
            </div>
          </div>

          {/* Dimensiones Métricas */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">
              <span>📊</span> Radar de Dimensiones (1 a 5)
            </h3>
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
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--cyan-400)' }}>
                      {m.val}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integraciones con el stack actual */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">
              <span>🔗</span> Sinergia con tu Stack Actual
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(currentStack)
                .filter(([cat, id]) => id && id !== tech.id && cat !== tech.category)
                .map(([_cat, otherId]) => {
                  const other = otherId ? TECH_BY_ID[otherId] : null;
                  if (!other) return null;
                  const intAB = tech.integrations[otherId!];
                  const intBA = other.integrations[tech.id];
                  const activeInt = intAB || intBA;

                  const isFriction = activeInt && (activeInt.relation === 'friction' || activeInt.relation === 'incompatible');
                  const isNatural = activeInt && activeInt.relation === 'natural';

                  return (
                    <div
                      key={otherId}
                      style={{
                        padding: '0.65rem 0.85rem',
                        background: 'var(--bg-canvas)',
                        borderRadius: 'var(--radius-sm)',
                        border: `1px solid ${isFriction ? 'var(--amber-500)' : isNatural ? 'var(--cyan-500)' : 'var(--border-dim)'}`,
                        fontSize: '0.82rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{other.name}</span>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: isFriction ? 'var(--amber-400)' : isNatural ? 'var(--cyan-400)' : 'var(--text-muted)',
                        }}>
                          {isFriction ? '⚠ FRICCIÓN' : isNatural ? '✓ INTEGRACIÓN NATURAL' : 'COMPATIBLE'}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                        {activeInt ? activeInt.explanation : `Compatible mediante protocolos estándar HTTP/REST.`}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-dim)', paddingTop: '1.25rem' }}>
            <a
              href={tech.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--cyan-400)', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              Sitio Oficial ↗
            </a>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Licencia: {tech.license}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
