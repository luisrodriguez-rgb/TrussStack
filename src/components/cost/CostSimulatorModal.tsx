import React, { useState } from 'react';
import type { TechCategory } from '../../engine/types';
import {
  calculateDynamicStackCosts,
  type CostSimulationInput,
} from '../../engine/costSimulator';
import { useI18n } from '../../i18n/I18nContext';

interface CostSimulatorModalProps {
  slots: Record<TechCategory, string | null>;
  onClose: () => void;
}

export const CostSimulatorModal: React.FC<CostSimulatorModalProps> = ({ slots, onClose }) => {
  const { lang, t } = useI18n();

  const [input, setInput] = useState<CostSimulationInput>({
    monthlyRequests: 1_000_000,
    monthlyActiveUsers: 15_000,
    storageGb: 5,
    egressGb: 50,
  });

  const result = calculateDynamicStackCosts(slots, input);

  const applyPreset = (preset: 'mvp' | 'early' | 'growth' | 'scale') => {
    switch (preset) {
      case 'mvp':
        setInput({
          monthlyRequests: 100_000,
          monthlyActiveUsers: 2_000,
          storageGb: 0.4,
          egressGb: 2,
        });
        break;
      case 'early':
        setInput({
          monthlyRequests: 1_000_000,
          monthlyActiveUsers: 15_000,
          storageGb: 5,
          egressGb: 50,
        });
        break;
      case 'growth':
        setInput({
          monthlyRequests: 5_000_000,
          monthlyActiveUsers: 50_000,
          storageGb: 25,
          egressGb: 250,
        });
        break;
      case 'scale':
        setInput({
          monthlyRequests: 20_000_000,
          monthlyActiveUsers: 200_000,
          storageGb: 100,
          egressGb: 1_000,
        });
        break;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-dialog"
        style={{ maxWidth: '880px', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <span className="pill-tag" style={{ color: 'var(--yellow-vivid)' }}>
              {t.costSimTag}
            </span>
            <h3>{t.costSimTitle}</h3>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginTop: '0.25rem',
              }}
            >
              {t.costSimDesc}
            </p>
          </div>
          <button type="button" className="drawer-close-btn" onClick={onClose} aria-label="Close">
            {t.drawerClose}
          </button>
        </div>

        <div className="modal-content">
          {/* Quick Presets Bar */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '0.4rem',
              }}
            >
              {t.costPresetLabel}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              <button
                type="button"
                className="chip-btn"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                onClick={() => applyPreset('mvp')}
              >
                {t.costPresetMvp}
              </button>
              <button
                type="button"
                className="chip-btn"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                onClick={() => applyPreset('early')}
              >
                {t.costPresetEarly}
              </button>
              <button
                type="button"
                className="chip-btn"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                onClick={() => applyPreset('growth')}
              >
                {t.costPresetGrowth}
              </button>
              <button
                type="button"
                className="chip-btn"
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                onClick={() => applyPreset('scale')}
              >
                {t.costPresetScale}
              </button>
            </div>
          </div>

          {/* Metric Sliders Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-rule)',
              borderRadius: 'var(--radius-xs)',
              padding: '1.15rem',
              marginBottom: '1.25rem',
            }}
          >
            {/* Slider 1: Requests */}
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">{t.costReqsLabel}</span>
                <span className="slider-value">[{formatNumber(input.monthlyRequests)}]</span>
              </div>
              <input
                type="range"
                min={50_000}
                max={25_000_000}
                step={50_000}
                value={input.monthlyRequests}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, monthlyRequests: Number(e.target.value) }))
                }
              />
            </div>

            {/* Slider 2: MAUs */}
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">{t.costMauLabel}</span>
                <span className="slider-value">[{formatNumber(input.monthlyActiveUsers)}]</span>
              </div>
              <input
                type="range"
                min={500}
                max={250_000}
                step={500}
                value={input.monthlyActiveUsers}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, monthlyActiveUsers: Number(e.target.value) }))
                }
              />
            </div>

            {/* Slider 3: Storage */}
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">{t.costStorageLabel}</span>
                <span className="slider-value">[{input.storageGb} GB]</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={300}
                step={0.5}
                value={input.storageGb}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, storageGb: Number(e.target.value) }))
                }
              />
            </div>

            {/* Slider 4: Egress */}
            <div className="slider-group">
              <div className="slider-header">
                <span className="slider-label">{t.costEgressLabel}</span>
                <span className="slider-value">[{input.egressGb} GB]</span>
              </div>
              <input
                type="range"
                min={2}
                max={1_500}
                step={2}
                value={input.egressGb}
                onChange={(e) =>
                  setInput((prev) => ({ ...prev, egressGb: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          {/* Comparison Cards: Serverless vs VPS Cluster */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            {/* Serverless Card */}
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--yellow-border)',
                borderRadius: 'var(--radius-xs)',
                padding: '1.15rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--yellow-vivid)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  display: 'block',
                }}
              >
                {t.costTotalServerless}
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.4rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.4rem',
                    fontWeight: 900,
                    color: 'var(--yellow-vivid)',
                  }}
                >
                  ${result.totalMonthlyCost}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                  {t.costPerMonth}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                {result.totalMonthlyCost === 0
                  ? (lang === 'es' ? '100% cubierto dentro de los planes gratuitos de los proveedores.' : '100% covered within providers free tiers.')
                  : (lang === 'es' ? 'Pago por uso elástico según demanda de cómputo y egress.' : 'Elastic pay-as-you-go based on compute and egress demand.')}
              </p>
            </div>

            {/* Dedicated VPS Equivalent */}
            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-rule)',
                borderRadius: 'var(--radius-xs)',
                padding: '1.15rem',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-dim)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  display: 'block',
                }}
              >
                {t.costTotalVps}
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.4rem' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.4rem',
                    fontWeight: 900,
                    color: 'var(--text-pure)',
                  }}
                >
                  ${result.vpsEquivalentCost}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                  {t.costPerMonth}
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                {lang === 'es'
                  ? 'Coste plano predecible en VPS tipo Hetzner/DigitalOcean con 20TB de egress incluidos.'
                  : 'Predictable flat cost on Hetzner/DigitalOcean VPS with 20TB included egress.'}
              </p>
            </div>
          </div>

          {/* Billing Gotchas & Egress Traps Alerts */}
          {result.billingGotchas.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <h4
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--red-alert)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.5rem',
                }}
              >
                {t.costGotchasTitle}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {result.billingGotchas.map((gotcha) => (
                  <div
                    key={gotcha.id}
                    className="friction-notice-box"
                    style={{
                      borderLeft: '4px solid var(--red-alert)',
                      padding: '0.85rem 1rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <strong style={{ color: 'var(--red-alert)', fontSize: '0.85rem' }}>
                        [ ! ] {lang === 'es' ? gotcha.title : gotcha.titleEn}
                      </strong>
                      <span
                        className="badge-sin-tarjeta orange"
                        style={{ margin: 0, padding: '0.1rem 0.4rem', fontSize: '0.65rem' }}
                      >
                        {gotcha.severity.toUpperCase()}
                      </span>
                    </div>
                    <p style={{ margin: '0.2rem 0 0.4rem', color: '#FCA5A5', fontSize: '0.78rem' }}>
                      {lang === 'es' ? gotcha.explanation : gotcha.explanationEn}
                    </p>
                    <div
                      style={{
                        borderTop: '1px solid var(--red-border)',
                        paddingTop: '0.35rem',
                        color: 'var(--text-pure)',
                        fontSize: '0.75rem',
                      }}
                    >
                      <strong>{lang === 'es' ? 'MITIGACIÓN ARQUITECTÓNICA: ' : 'MITIGATION: '}</strong>
                      {lang === 'es' ? gotcha.mitigation : gotcha.mitigationEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Component Breakdown List */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.5rem',
              }}
            >
              {t.costBreakdownTitle}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {result.componentCosts.map((item) => (
                <div
                  key={item.category}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-rule)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.65rem 0.85rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="pill-tag">{item.category}</span>
                    <strong style={{ color: 'var(--text-pure)' }}>{item.name}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      [{item.pricingTierApplied}]
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {item.formulaNote}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        color: item.costUsd === 0 ? 'var(--yellow-vivid)' : 'var(--text-pure)',
                        minWidth: '55px',
                        textAlign: 'right',
                      }}
                    >
                      ${item.costUsd}/mo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
