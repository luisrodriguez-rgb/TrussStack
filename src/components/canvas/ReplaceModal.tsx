import React from 'react';
import type { ReplacementAlternative, TechCategory, UserProjectSpec } from '../../engine/types';
import { getReplacementAlternatives } from '../../engine/recommender';
import { TECH_BY_ID } from '../../engine/catalog';
import { TechLogo } from '../common/TechLogo';

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
  const currentTechId = currentStack[category];
  const currentTech = currentTechId ? TECH_BY_ID[currentTechId] : null;

  const alternatives: ReplacementAlternative[] = getReplacementAlternatives(
    category,
    currentStack,
    spec
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="pill-tag" style={{ color: 'var(--citron)' }}>
              SUSTITUCIÓN EN CALIENTE
            </span>
            <h3>
              REEMPLAZAR {category.toUpperCase()}:{' '}
              <span style={{ color: 'var(--cream-muted)' }}>{currentTech?.name || 'VACÍO'}</span>
            </h3>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            [ X ]
          </button>
        </div>

        <div className="modal-content">
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cream-muted)' }}>
            Elige un ingrediente alternativo. El sistema recalculará en tiempo real el Fit Score, la pureza de la
            fórmula y te mostrará el impacto exacto en trade-offs.
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
                        SIN TARJETA
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

                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cream-muted)' }}>
                  {alt.tech.description}
                </p>

                {/* Consequences Grid */}
                <div className="consequences-grid">
                  <div className="consequence-col">
                    <div className="consequence-title gain">[ + QUÉ GANAS ]</div>
                    {alt.gains.map((gain, i) => (
                      <div key={i} className="consequence-item">
                        • {gain}
                      </div>
                    ))}
                  </div>

                  <div className="consequence-col">
                    <div className="consequence-title loss">[ ! QUÉ SACRIFICAS ]</div>
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
                    <strong>[ ! ] FRICCIÓN DETECTADA:</strong> {alt.frictionAlerts[0].message}
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
                    {`[ SUSTITUIR POR ${alt.tech.name.toUpperCase()} -> ]`}
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
