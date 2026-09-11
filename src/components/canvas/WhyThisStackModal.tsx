import React from 'react';
import type { ArchitectureCausalRule } from '../../engine/types';
import { useI18n } from '../../i18n/I18nContext';

interface WhyThisStackModalProps {
  causalRules: ArchitectureCausalRule[];
  whyReasons: string[];
  keyTradeoffs: string[];
  onClose: () => void;
}

export const WhyThisStackModal: React.FC<WhyThisStackModalProps> = ({
  causalRules,
  whyReasons,
  keyTradeoffs,
  onClose,
}) => {
  const { lang } = useI18n();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '840px', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="pill-tag" style={{ color: 'var(--yellow-vivid)' }}>
              {lang === 'es'
                ? 'EXPLICABILIDAD DETERMINISTA // CAUSAL ENGINE'
                : 'DETERMINISTIC EXPLAINABILITY // CAUSAL ENGINE'}
            </span>
            <h3>
              {lang === 'es'
                ? '¿Por qué esta Arquitectura? (Why this Stack?)'
                : 'Why this Architecture? (Why this Stack?)'}
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
                ? 'Registro transparente de causa y efecto: cómo cada respuesta y restricción técnica determinó la selección de componentes.'
                : 'Transparent cause-and-effect log: how your technical constraints and requirements determined each selected component.'}
            </p>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-content" style={{ padding: '1.25rem' }}>
          {/* Causal Chain Rules Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--yellow-vivid)',
                marginBottom: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>[ CAUSAL RULES ENGINE ]</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>
                ({causalRules.length} {lang === 'es' ? 'reglas activadas' : 'rules fired'})
              </span>
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {causalRules.map((rule, idx) => {
                const triggerText = lang === 'es' ? rule.trigger : rule.triggerEn;
                const decisionText = lang === 'es' ? rule.decision : rule.decisionEn;

                return (
                  <div
                    key={rule.id || idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-rule)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                    }}
                  >
                    {/* Top Row: Index + Requirement */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--yellow-vivid)',
                          fontWeight: 700,
                          background: 'rgba(255, 208, 0, 0.1)',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '2px',
                        }}
                      >
                        [ {String(idx + 1).padStart(2, '0')} ]
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          color: 'var(--text-primary)',
                          fontWeight: 600,
                          flex: 1,
                        }}
                      >
                        {triggerText}
                      </span>
                      {rule.favoredTechName && (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            padding: '0.2rem 0.5rem',
                            background: 'var(--bg-panel)',
                            border: '1px solid var(--border-rule)',
                            color: 'var(--text-primary)',
                            borderRadius: 'var(--radius-xs)',
                          }}
                        >
                          → {rule.favoredTechName}
                        </span>
                      )}
                    </div>

                    {/* Bottom Row: Deterministic Rule Decision */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        paddingLeft: '0.5rem',
                        borderLeft: '2px solid var(--yellow-vivid)',
                        marginTop: '0.2rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.78rem',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.35',
                        }}
                      >
                        {decisionText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Trade-offs Section */}
          {keyTradeoffs.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-primary)',
                  marginBottom: '0.65rem',
                }}
              >
                [ {lang === 'es' ? 'COMPROMISOS Y SACRIFICIOS ASUMIDOS' : 'DELIBERATE TRADE-OFFS & SACRIFICES'} ]
              </h4>
              <div
                style={{
                  background: 'rgba(255, 208, 0, 0.04)',
                  border: '1px solid rgba(255, 208, 0, 0.25)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {keyTradeoffs.map((to, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.35',
                    }}
                  >
                    <span style={{ color: 'var(--yellow-vivid)', fontWeight: 700 }}>•</span>
                    <span>{to}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Profile Rationale Summary */}
          {whyReasons.length > 0 && (
            <div>
              <h4
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text-primary)',
                  marginBottom: '0.65rem',
                }}
              >
                [ {lang === 'es' ? 'NOTAS DE INGENIERÍA ARQUITECTÓNICA' : 'ARCHITECTURAL ENGINEERING NOTES'} ]
              </h4>
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-rule)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                {whyReasons.map((reason, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.4',
                      margin: 0,
                    }}
                  >
                    {reason}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--border-rule)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
              }}
            >
              {lang === 'es'
                ? 'Documentado formalmente en exportaciones MADR 3.0 (ARCHITECTURE-ADR.md)'
                : 'Formally documented in MADR 3.0 exports (ARCHITECTURE-ADR.md)'}
            </span>
            <button
              type="button"
              className="chip-btn"
              onClick={onClose}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
            >
              {lang === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
