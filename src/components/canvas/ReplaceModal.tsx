import React from 'react';
import type { ReplacementAlternative, TechCategory, UserProjectSpec } from '../../engine/types';
import { getReplacementAlternatives } from '../../engine/recommender';
import { TECH_BY_ID } from '../../engine/catalog';
import { getLocalizedTech } from '../../engine/catalogI18n';
import { TechLogo } from '../common/TechLogo';
import { useI18n } from '../../i18n/I18nContext';

interface ReplaceModalProps {
  category: TechCategory;
  currentStack: Record<TechCategory, string | null>;
  spec: UserProjectSpec;
  onClose: () => void;
  onSelectAlternative: (category: TechCategory, newTechId: string) => void;
}

export const ReplaceModal: React.FC<ReplaceModalProps> = ({
  category,
  currentStack,
  spec,
  onClose,
  onSelectAlternative,
}) => {
  const { t, lang } = useI18n();
  const currentTechId = currentStack[category];
  const rawTech = currentTechId ? TECH_BY_ID[currentTechId] : null;
  const currentTech = rawTech ? getLocalizedTech(rawTech, lang) : null;

  const alternatives: ReplacementAlternative[] = getReplacementAlternatives(
    category,
    currentStack,
    spec,
    lang
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="pill-tag" style={{ color: 'var(--citron)' }}>
              {t.replaceModalTag}
            </span>
            <h3>
              {t.replaceModalTitle} {category.toUpperCase()}:{' '}
              <span style={{ color: 'var(--text-secondary)' }}>{currentTech?.name || t.replaceEmpty}</span>
            </h3>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close">
            {t.drawerClose}
          </button>
        </div>

        <div className="modal-content">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {t.replaceModalDesc}
          </p>

          {alternatives.map((alt) => {
            const isPositive = alt.fitScoreDelta > 0;
            const isNeutral = alt.fitScoreDelta === 0;

            return (
              <div
                key={alt.tech.id}
                className="alt-card"
                onClick={() => onSelectAlternative(category, alt.tech.id)}
              >
                <div className="alt-header">
                  <div className="alt-name-group">
                    <div className="card-logo-box">
                      <TechLogo id={alt.tech.id} size={18} />
                    </div>
                    <span className="alt-name">{alt.tech.name}</span>
                    <span className="pill-tag">
                      {alt.tech.isManaged ? 'cloud managed' : 'open source'}
                    </span>
                    {alt.tech.costProfile.freeTier.hasFreeTier && (
                      <span className="badge-sin-tarjeta" style={{ marginBottom: 0 }}>
                        {t.badgeNoCard}
                      </span>
                    )}
                  </div>

                  <div
                    className={`alt-delta-badge ${
                      isPositive ? 'positive' : isNeutral ? 'neutral' : 'negative'
                    }`}
                  >
                    {isPositive ? `+${alt.fitScoreDelta}%` : `${alt.fitScoreDelta}%`} FIT (
                    {alt.resultingFitScore}%)
                  </div>
                </div>

                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {alt.tech.description}
                </p>

                {/* Consequences Grid */}
                <div className="consequences-grid">
                  <div className="consequence-col">
                    <div className="consequence-title gain">{t.replaceGains}</div>
                    {alt.gains.map((gain, i) => (
                      <div key={i} className="consequence-item">
                        • {gain}
                      </div>
                    ))}
                  </div>

                  <div className="consequence-col">
                    <div className="consequence-title loss">{t.replaceLosses}</div>
                    {alt.losses.map((loss, i) => (
                      <div key={i} className="consequence-item">
                        • {loss}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Friction Alert */}
                {alt.frictionAlerts.length > 0 && (
                  <div className="friction-notice-box" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
                    <strong>{t.replaceFrictionAlert}</strong> {alt.frictionAlerts[0].message}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
                  <button
                    type="button"
                    className="btn-card-swap"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAlternative(category, alt.tech.id);
                    }}
                  >
                    {`[ ${t.btnSwapTo} ${alt.tech.name.toUpperCase()} -> ]`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
