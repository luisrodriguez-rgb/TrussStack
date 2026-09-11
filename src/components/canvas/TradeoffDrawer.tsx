import React, { useState } from 'react';
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
  const [activeHostMode, setActiveHostMode] = useState<'managed' | 'selfhosted'>('selfhosted');
  const [isDockerCopied, setIsDockerCopied] = useState<boolean>(false);

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

          {/* Evaluador Self-Hosted vs Cloud Managed (Fase 4) */}
          {tech.selfHostProfile && (
            <div>
              <h3 className="drawer-section-title" style={{ color: 'var(--yellow-vivid)' }}>
                {t.selfHostNotice}
              </h3>
              <div className="selfhost-evaluator-card">
                <div className="selfhost-header-bar">
                  <span className="control-label">[ DEPLOYMENT EVAL ]</span>
                  <div className="selfhost-mode-toggle">
                    <button
                      type="button"
                      className={`selfhost-toggle-btn ${activeHostMode === 'managed' ? 'active' : ''}`}
                      onClick={() => setActiveHostMode('managed')}
                    >
                      {t.selfHostTabManaged}
                    </button>
                    <button
                      type="button"
                      className={`selfhost-toggle-btn ${activeHostMode === 'selfhosted' ? 'active' : ''}`}
                      onClick={() => setActiveHostMode('selfhosted')}
                    >
                      {t.selfHostTabSelfHosted}
                    </button>
                  </div>
                </div>

                <div className="selfhost-body-content">
                  {activeHostMode === 'selfhosted' ? (
                    <>
                      <div className="selfhost-specs-grid">
                        <div className="selfhost-spec-item">
                          <span className="selfhost-spec-key">{t.selfHostMinSpecs}</span>
                          <span className="selfhost-spec-val">
                            {tech.selfHostProfile.minRamMb} MB RAM // {tech.selfHostProfile.minCpuCores} vCPU
                          </span>
                        </div>
                        <div className="selfhost-spec-item">
                          <span className="selfhost-spec-key">{t.selfHostMaintenance}</span>
                          <span className="selfhost-spec-val" style={{ color: '#FFD000' }}>
                            ~{tech.selfHostProfile.maintenanceHoursPerMonth ?? 2} {t.selfHostHoursPerMonth}
                          </span>
                        </div>
                      </div>

                      <div className="selfhost-docker-box">
                        <div className="selfhost-docker-header">
                          <span className="selfhost-docker-label">{t.selfHostDockerImage}</span>
                          <button
                            type="button"
                            className="btn-copy-docker"
                            onClick={() => {
                              const cmd =
                                tech.selfHostProfile?.dockerCommand ||
                                (tech.selfHostProfile?.dockerImage
                                  ? `docker run -d --name ${tech.id} ${tech.selfHostProfile.dockerImage}`
                                  : '');
                              if (cmd) {
                                navigator.clipboard.writeText(cmd);
                                setIsDockerCopied(true);
                                setTimeout(() => setIsDockerCopied(false), 2000);
                              }
                            }}
                          >
                            {isDockerCopied ? t.selfHostCopied : t.selfHostCopyDocker}
                          </button>
                        </div>
                        <code className="selfhost-docker-code">
                          {tech.selfHostProfile.dockerCommand ||
                            `docker run -d --name ${tech.id} ${tech.selfHostProfile.dockerImage}`}
                        </code>
                      </div>

                      <div className="selfhost-comparison-box">
                        <div className="selfhost-comp-row">
                          <span className="selfhost-comp-label">{t.selfHostManagedCost}:</span>
                          <span className="selfhost-comp-val">
                            {tech.selfHostProfile.monthlyManagedCost || '$25 - $50/mo'}
                          </span>
                        </div>
                        <div className="selfhost-comp-row">
                          <span className="selfhost-comp-label">{t.selfHostVpsCost}:</span>
                          <span className="selfhost-comp-val" style={{ color: '#10B981' }}>
                            {tech.selfHostProfile.monthlySelfHostedCost || '$4 - $12/mo'} (Hetzner CPX31)
                          </span>
                        </div>
                        {((lang === 'es' ? tech.selfHostProfile.gotchasEs : tech.selfHostProfile.gotchasEn) || []).length > 0 && (
                          <div className="selfhost-breakeven-note">
                            <strong>GOTCHAS:</strong>{' '}
                            {(lang === 'es' ? tech.selfHostProfile.gotchasEs : tech.selfHostProfile.gotchasEn).join(' ')}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="selfhost-comparison-box" style={{ background: 'transparent', border: 'none', padding: 0 }}>
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {lang === 'es'
                          ? 'El modelo Cloud gestionado externaliza aprovisionamiento, parches CVE, backups automáticos multi-región y SLA 99.99% a cambio de costes basados en consumo o suscripción mensual.'
                          : 'The managed Cloud model offloads hardware provisioning, CVE patches, multi-region backups, and 99.99% SLA availability at the expense of consumption-based billing or monthly tiers.'}
                      </p>
                      <div className="selfhost-comp-row" style={{ marginTop: '0.5rem' }}>
                        <span className="selfhost-comp-label">{t.selfHostManagedCost}:</span>
                        <span className="selfhost-comp-val" style={{ color: '#FFD000' }}>
                          {tech.selfHostProfile.monthlyManagedCost || '$25 - $50/mo'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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
