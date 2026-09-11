import React from 'react';
import type { Technology } from '../../engine/types';
import { TECH_BY_ID } from '../../engine/catalog';
import { getLocalizedTech, getLocalizedFrictionMessage } from '../../engine/catalogI18n';
import { TechLogo } from '../common/TechLogo';
import { useI18n } from '../../i18n/I18nContext';

interface TradeoffDrawerProps {
  tech: Technology | null;
  currentStack: Record<string, string | null>;
  onClose: () => void;
  onReplaceClick: (category: string) => void;
}

export const TradeoffDrawer: React.FC<TradeoffDrawerProps> = ({
  tech: rawTech,
  currentStack,
  onClose,
  onReplaceClick,
}) => {
  const { t, lang } = useI18n();

  if (!rawTech) return null;
  const tech = getLocalizedTech(rawTech, lang);

  const metricItems = [
    { label: t.metricDx, val: tech.metrics.dx },
    { label: t.metricLearning, val: tech.metrics.learningCurve },
    { label: t.metricScalability, val: tech.metrics.scalability },
    { label: t.metricEcosystem, val: tech.metrics.ecosystem },
    { label: t.metricCommunity, val: tech.metrics.community },
    { label: t.metricMaturity, val: tech.metrics.maturity },
    { label: t.metricOps, val: tech.metrics.operationalComplexity },
    { label: t.metricLockinRisk, val: tech.metrics.vendorLockin },
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
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close">
            {t.drawerClose}
          </button>
        </div>

        <div className="drawer-body">
          {/* Tagline */}
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
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
            {t.drawerSwapBtn}
          </button>

          {/* Sacrifices */}
          <div>
            <h3 className="drawer-section-title" style={{ color: 'var(--vermouth)' }}>
              {t.drawerSacrificesTitle}
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
              {t.drawerProsTitle}
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
              {t.drawerConsTitle}
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
            <h3 className="drawer-section-title">{t.drawerCostsTitle}</h3>
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
                <span style={{ color: 'var(--text-dim)' }}>{t.drawerInitCost}</span>
                <span style={{ fontWeight: 800, color: 'var(--citron)' }}>
                  {tech.costProfile.initialCost.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>{t.drawerScaleRisk}</span>
                <span
                  style={{
                    fontWeight: 800,
                    color: tech.costProfile.scalingRisk === 'high' ? 'var(--vermouth)' : 'var(--citron)',
                  }}
                >
                  {tech.costProfile.scalingRisk.toUpperCase()}
                </span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-rule)', paddingTop: '0.5rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                {tech.costProfile.freeTier.limitsDescription}
              </div>
            </div>
          </div>

          {/* Radar Metrics */}
          <div>
            <h3 className="drawer-section-title">{t.drawerRadarTitle}</h3>
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
            <h3 className="drawer-section-title">{t.drawerSynergyTitle}</h3>
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
                        <span style={{ fontWeight: 700, color: 'var(--text-pure)' }}>{other.name}</span>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: isFriction ? 'var(--vermouth)' : isNatural ? 'var(--citron)' : 'var(--text-dim)',
                          }}
                        >
                          {isFriction ? t.synergyFriction : isNatural ? t.synergyNative : t.synergyCompatible}
                        </span>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        {activeInt
                          ? getLocalizedFrictionMessage(tech.id, other.id, activeInt.explanation, lang)
                          : t.synergyDefault}
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
              {t.drawerOfficialWeb}
            </a>
            <span style={{ color: 'var(--text-dim)' }}>{t.drawerLicense} {tech.license}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
