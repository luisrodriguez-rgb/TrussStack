import React from 'react';
import type { ProtocolInspection } from '../../engine/flows';
import { useI18n } from '../../i18n/I18nContext';

interface ProtocolModalProps {
  protocol: ProtocolInspection | null;
  onClose: () => void;
}

export const ProtocolModal: React.FC<ProtocolModalProps> = ({ protocol, onClose }) => {
  const { lang, t } = useI18n();
  if (!protocol) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="pill-tag" style={{ color: 'var(--yellow-vivid)' }}>
              [ INTERFACE PROTOCOL CONTRACT ]
            </span>
            <h3>{protocol.protocolName}</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {protocol.sourceLayer} &lt;--&gt; {protocol.targetLayer}
            </p>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close">
            {t.drawerClose}
          </button>
        </div>

        <div className="modal-content">
          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-rule)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.7rem' }}>
                {lang === 'es' ? 'TRANSPORTE DE RED' : 'NETWORK TRANSPORT'}
              </span>
              <strong style={{ color: 'var(--text-pure)' }}>{protocol.transport}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.7rem' }}>
                {lang === 'es' ? 'PUERTO ESTÁNDAR' : 'DEFAULT PORT'}
              </span>
              <strong style={{ color: 'var(--yellow-vivid)' }}>{protocol.defaultPort}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block', fontSize: '0.7rem' }}>
                {lang === 'es' ? 'PRESUPUESTO DE LATENCIA (P95)' : 'P95 LATENCY BUDGET'}
              </span>
              <strong style={{ color: 'var(--text-pure)' }}>{protocol.latencyBudget}</strong>
            </div>
          </div>

          {/* Security Hardening */}
          <div style={{ marginTop: '1.25rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--yellow-vivid)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
              }}
            >
              [ ! ] {lang === 'es' ? 'REQUISITOS DE SEGURIDAD & HARDENING' : 'SECURITY HARDENING & CONTRACTS'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {protocol.securityHardening.map((sec, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-rule)',
                    borderRadius: 'var(--radius-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--text-pure)',
                  }}
                >
                  <span style={{ color: 'var(--yellow-vivid)', fontWeight: 800 }}>•</span>
                  <span>{sec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Headers & Environment params */}
          <div style={{ marginTop: '1.25rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem',
              }}
            >
              [ CONFIG ] {lang === 'es' ? 'CABECERAS & PARÁMETROS CRÍTICOS' : 'CRITICAL HEADERS & PARAMETERS'}
            </h4>
            <div
              style={{
                background: '#040508',
                border: '1px solid var(--border-rule)',
                borderRadius: 'var(--radius-xs)',
                padding: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#94A3B8',
                overflowX: 'auto',
              }}
            >
              {protocol.headersAndParams.map((hdr, idx) => (
                <div key={idx} style={{ padding: '0.2rem 0' }}>
                  <code style={{ color: '#F1F5F9' }}>{hdr}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Notes */}
          <div style={{ marginTop: '1.25rem' }}>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.4rem',
              }}
            >
              [ ARCHITECTURE NOTE ]
            </h4>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                background: 'var(--bg-card)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-rule)',
              }}
            >
              {protocol.architectureNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
