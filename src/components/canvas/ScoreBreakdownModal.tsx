import React, { useState } from 'react';
import type { ScoreBreakdown } from '../../engine/types';
import { useI18n } from '../../i18n/I18nContext';

interface ScoreBreakdownModalProps {
  scoreBreakdown: ScoreBreakdown;
  fitScore: number;
  onClose: () => void;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  scoreBreakdown,
  fitScore,
  onClose,
}) => {
  const { lang } = useI18n();
  const [showFormula, setShowFormula] = useState<boolean>(false);

  const { prioritiesPercentage, dimensionScores, baseScore, frictionPenalty, frictionsCount } =
    scoreBreakdown;

  const priorityItems = [
    {
      labelEs: 'Minimización de Costes',
      labelEn: 'Cost Minimization',
      pct: prioritiesPercentage.cost,
      color: 'var(--yellow-vivid)',
    },
    {
      labelEs: 'Velocidad de Entrega (DX)',
      labelEn: 'Development Speed (DX)',
      pct: prioritiesPercentage.speed,
      color: '#38BDF8',
    },
    {
      labelEs: 'Escalabilidad & Concurrencia',
      labelEn: 'Scalability & Concurrency',
      pct: prioritiesPercentage.scalability,
      color: '#A78BFA',
    },
    {
      labelEs: 'Bajo Vendor Lock-in (OSS)',
      labelEn: 'Low Vendor Lock-in (OSS)',
      pct: prioritiesPercentage.lockin,
      color: '#34D399',
    },
    {
      labelEs: 'Simplicidad Operativa',
      labelEn: 'Operational Simplicity',
      pct: prioritiesPercentage.simplicity,
      color: '#F472B6',
    },
  ];

  const dimensionItems = [
    {
      labelEs: 'Costes & Infraestructura',
      labelEn: 'Costs & Infrastructure',
      score: dimensionScores.cost,
    },
    {
      labelEs: 'Experiencia de Desarrollo (DX)',
      labelEn: 'Developer Experience (DX)',
      score: dimensionScores.speed,
    },
    {
      labelEs: 'Escalabilidad del Sistema',
      labelEn: 'System Scalability',
      score: dimensionScores.scalability,
    },
    {
      labelEs: 'Portabilidad & Estándares Abiertos',
      labelEn: 'Portability & Open Standards',
      score: dimensionScores.portability,
    },
    {
      labelEs: 'Simplicidad de Mantenimiento',
      labelEn: 'Maintenance Simplicity',
      score: dimensionScores.simplicity,
    },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '680px', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="pill-tag" style={{ color: 'var(--yellow-vivid)' }}>
              {lang === 'es'
                ? 'TRANSPARENCIA DETERMINISTA // ALGORITMO TIPADO'
                : 'DETERMINISTIC TRANSPARENCY // TYPED ALGORITHM'}
            </span>
            <h3>
              {lang === 'es'
                ? 'Desglose de Puntuación (Score Breakdown)'
                : 'Score Breakdown & Calculation'}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginTop: '0.25rem',
              }}
            >
              {lang === 'es'
                ? 'Cómo tus prioridades calibran matemáticamente la puntuación de afinidad de la arquitectura.'
                : 'How your prioritized weights mathematically calibrate the architecture affinity fit.'}
            </p>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-content" style={{ padding: '1.25rem' }}>
          {/* Main Score Hero Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-rule)',
              borderRadius: 'var(--radius-xs)',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: 'block',
                }}
              >
                {lang === 'es' ? 'FIT SCORE GLOBAL' : 'GLOBAL FIT SCORE'}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: fitScore >= 80 ? 'var(--yellow-vivid)' : '#F59E0B',
                  lineHeight: '1.1',
                }}
              >
                {fitScore}
                <span style={{ fontSize: '1.2rem', color: 'var(--text-dim)', fontWeight: 400 }}>
                  {' '}
                  / 100
                </span>
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.25rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
              }}
            >
              <div style={{ color: 'var(--text-secondary)' }}>
                {lang === 'es' ? 'Afinidad base:' : 'Base affinity:'}{' '}
                <strong style={{ color: 'var(--text-primary)' }}>{baseScore} pts</strong>
              </div>
              {frictionsCount > 0 ? (
                <div style={{ color: '#EF4444' }}>
                  {lang === 'es' ? 'Penalización fricción:' : 'Friction penalty:'}{' '}
                  <strong>-{frictionPenalty} pts</strong> ({frictionsCount}{' '}
                  {lang === 'es' ? 'fricciones' : 'frictions'})
                </div>
              ) : (
                <div style={{ color: '#10B981' }}>
                  {lang === 'es' ? 'Cero fricciones detectadas (0 pts)' : 'Zero frictions detected (0 pts)'}
                </div>
              )}
            </div>
          </div>

          {/* Section 1: User Priorities Weight % */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-primary)',
                marginBottom: '0.65rem',
              }}
            >
              [ {lang === 'es' ? 'TUS PRIORIDADES CALIBRADAS' : 'YOUR CALIBRATED PRIORITIES'} ]
            </h4>

            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-rule)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
              }}
            >
              {priorityItems.map((item, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'es' ? item.labelEs : item.labelEn}
                    </span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                      {item.pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '4px',
                      background: 'var(--border-rule)',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${item.pct}%`,
                        background: item.color,
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Result per Dimension */}
          <div style={{ marginBottom: '1.25rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-primary)',
                marginBottom: '0.65rem',
              }}
            >
              [ {lang === 'es' ? 'RESULTADO OBTENIDO POR DIMENSIÓN' : 'RESULT PER TECHNICAL DIMENSION'} ]
            </h4>

            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-rule)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.85rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
              }}
            >
              {dimensionItems.map((dim, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'es' ? dim.labelEs : dim.labelEn}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '120px',
                        height: '6px',
                        background: 'var(--border-rule)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${dim.score}%`,
                          background:
                            dim.score >= 85
                              ? 'var(--yellow-vivid)'
                              : dim.score >= 70
                              ? '#38BDF8'
                              : '#F59E0B',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: 'var(--text-primary)',
                        fontWeight: 700,
                        minWidth: '28px',
                        textAlign: 'right',
                      }}
                    >
                      {dim.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Formula Accordion */}
          <div
            style={{
              background: 'rgba(255, 208, 0, 0.04)',
              border: '1px solid rgba(255, 208, 0, 0.25)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.85rem 1rem',
            }}
          >
            <button
              type="button"
              onClick={() => setShowFormula(!showFormula)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: 0,
                color: 'var(--yellow-vivid)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 600,
                textAlign: 'left',
              }}
            >
              <span>
                {lang === 'es' ? '¿CÓMO SE CALCULA? (VER FÓRMULA)' : 'HOW IS IT COMPUTED? (VIEW FORMULA)'}
              </span>
              <span>{showFormula ? '▲' : '▼'}</span>
            </button>

            {showFormula && (
              <div
                style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid rgba(255, 208, 0, 0.2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.76rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.45',
                }}
              >
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  {lang === 'es'
                    ? scoreBreakdown.formulaExplanationEs
                    : scoreBreakdown.formulaExplanationEn}
                </p>
                <div
                  style={{
                    background: 'var(--bg-panel)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                  }}
                >
                  <code>
                    FitScore = clamp(20, 98, Σ(DimScore_i × Weight_i) / Σ(Weight_i) - (Frictions × 4))
                  </code>
                </div>
              </div>
            )}
          </div>

          {/* Close button */}
          <div
            style={{
              marginTop: '1.25rem',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              className="chip-btn"
              onClick={onClose}
              style={{ padding: '0.4rem 1rem', fontSize: '0.78rem' }}
            >
              {lang === 'es' ? 'Entendido' : 'Got it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
