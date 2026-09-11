import React from 'react';
import type { ReplacementAlternative, TechCategory, UserProjectSpec } from '../../engine/types';
import { getReplacementAlternatives } from '../../engine/recommender';
import { TECH_BY_ID } from '../../engine/catalog';

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
            <span className="node-category-pill" style={{ color: 'var(--cyan-400)' }}>
              Sustitución en Caliente
            </span>
            <h3>
              Reemplazar {category.toUpperCase()}:{' '}
              <span style={{ color: 'var(--text-secondary)' }}>{currentTech?.name || 'Vacío'}</span>
            </h3>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-content">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Elige una alternativa compatible. El sistema recalculará en tiempo real el Fit Score, el coste estimado
            y te mostrará qué ganas y qué sacrificas con el cambio.
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
                    <span className="alt-name">{alt.tech.name}</span>
                    <span className="node-tag-item">
                      {alt.tech.isManaged ? 'Managed Cloud' : 'Open Source / Self-Hosted'}
                    </span>
                    {alt.tech.costProfile.freeTier.hasFreeTier && (
                      <span className="node-tag-item free">Free Tier</span>
                    )}
                  </div>

                  <div
                    className={`alt-delta-badge ${
                      isPositive ? 'positive' : isNeutral ? 'neutral' : 'negative'
                    }`}
                  >
                    {isPositive ? `+${alt.fitScoreDelta}%` : `${alt.fitScoreDelta}%`} Fit (
                    {alt.resultingFitScore}%)
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {alt.tech.tagline}
                </div>

                {/* Grid de Consecuencias (+ Ganas / - Pierdes) */}
                <div className="consequences-grid">
                  <div className="consequence-col">
                    <span className="consequence-title gain">✓ Qué Ganas</span>
                    {alt.gains.map((gain, i) => (
                      <div key={i} className="consequence-item">
                        • {gain}
                      </div>
                    ))}
                  </div>

                  <div className="consequence-col">
                    <span className="consequence-title loss">⚠ Qué Sacrificas / Pierdes</span>
                    {alt.losses.map((loss, i) => (
                      <div key={i} className="consequence-item">
                        • {loss}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alertas de fricción si introduce alguna */}
                {alt.frictionAlerts.length > 0 && (
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.78rem',
                      color: 'var(--amber-400)',
                    }}
                  >
                    ⚠ <strong>Alerta de Fricción:</strong> {alt.frictionAlerts[0].message}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                  <button
                    type="button"
                    className="btn-node-replace"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAlternative(category, alt.tech.id);
                    }}
                  >
                    Sustituir por {alt.tech.name} ➔
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
