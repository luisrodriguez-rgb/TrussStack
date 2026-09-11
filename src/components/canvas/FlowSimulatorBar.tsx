import React, { useState } from 'react';
import { FLOW_SCENARIOS, type FlowScenario } from '../../engine/flows';
import { useI18n } from '../../i18n/I18nContext';

interface FlowSimulatorBarProps {
  activeScenario: FlowScenario | null;
  currentStepIndex: number;
  onSelectScenario: (scenario: FlowScenario | null) => void;
  onStepChange: (index: number) => void;
}

export const FlowSimulatorBar: React.FC<FlowSimulatorBarProps> = ({
  activeScenario,
  currentStepIndex,
  onSelectScenario,
  onStepChange,
}) => {
  const { lang } = useI18n();
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play interval
  React.useEffect(() => {
    if (!isPlaying || !activeScenario) return;
    const timer = setInterval(() => {
      onStepChange(
        currentStepIndex >= activeScenario.steps.length - 1 ? 0 : currentStepIndex + 1
      );
    }, 2400);
    return () => clearInterval(timer);
  }, [isPlaying, activeScenario, currentStepIndex, onStepChange]);

  const currentStep = activeScenario?.steps[currentStepIndex];

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-rule)',
        borderRadius: 'var(--radius-sm)',
        padding: '1rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border-rule)',
          paddingBottom: '0.75rem',
          marginBottom: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 800,
              background: 'var(--yellow-dim)',
              color: 'var(--yellow-vivid)',
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--yellow-border)',
            }}
          >
            [ SIMULADOR ]
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 800,
              color: 'var(--text-pure)',
              textTransform: 'uppercase',
            }}
          >
            {lang === 'es' ? 'TRAZADO DE FLUJOS DE DATOS EN TIEMPO REAL' : 'REAL-TIME DATA FLOW TRACER'}
          </span>
        </div>

        {/* Scenarios Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {FLOW_SCENARIOS.map((sc) => {
            const isSelected = activeScenario?.id === sc.id;
            return (
              <button
                key={sc.id}
                type="button"
                className={`chip-btn ${isSelected ? 'selected' : ''}`}
                style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                onClick={() => {
                  if (isSelected) {
                    onSelectScenario(null);
                    setIsPlaying(false);
                  } else {
                    onSelectScenario(sc);
                    onStepChange(0);
                  }
                }}
              >
                [{sc.code}] {lang === 'es' ? sc.title.split(' ')[0] : sc.titleEn.split(' ')[0]}
              </button>
            );
          })}

          {activeScenario && (
            <button
              type="button"
              className="chip-btn"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', color: 'var(--red-alert)' }}
              onClick={() => {
                onSelectScenario(null);
                setIsPlaying(false);
              }}
            >
              [ RESET X ]
            </button>
          )}
        </div>
      </div>

      {/* When Scenario is Active: Stepper & Telemetry details */}
      {activeScenario && currentStep && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--yellow-vivid)', fontWeight: 800 }}>
                [{activeScenario.code}] {lang === 'es' ? activeScenario.title : activeScenario.titleEn}
              </span>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {lang === 'es' ? activeScenario.description : activeScenario.descriptionEn}
              </p>
            </div>

            {/* Stepper Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn-card-swap"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? '[ PAUSAR || ]' : '[ AUTO PLAY > ]'}
              </button>

              <button
                type="button"
                className="drawer-close-btn"
                disabled={currentStepIndex === 0}
                style={{ opacity: currentStepIndex === 0 ? 0.4 : 1 }}
                onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
              >
                &lt;
              </button>

              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--yellow-vivid)', fontWeight: 800 }}>
                {currentStepIndex + 1} / {activeScenario.steps.length}
              </span>

              <button
                type="button"
                className="drawer-close-btn"
                disabled={currentStepIndex === activeScenario.steps.length - 1}
                style={{ opacity: currentStepIndex === activeScenario.steps.length - 1 ? 0.4 : 1 }}
                onClick={() => onStepChange(Math.min(activeScenario.steps.length - 1, currentStepIndex + 1))}
              >
                &gt;
              </button>
            </div>
          </div>

          {/* Active Step Card */}
          <div
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--yellow-border)',
              borderRadius: 'var(--radius-xs)',
              padding: '0.75rem 1rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem', display: 'block' }}>
                {lang === 'es' ? 'ACCIÓN DEL PASO' : 'STEP ACTION'}
              </span>
              <strong style={{ color: 'var(--text-pure)' }}>
                {currentStep.step}. {currentStep.label}
              </strong>
            </div>

            <div>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem', display: 'block' }}>
                {lang === 'es' ? 'PROTOCOLO // CONEXIÓN' : 'PROTOCOL // WIRE'}
              </span>
              <span style={{ color: 'var(--yellow-vivid)' }}>{currentStep.protocol}</span>
            </div>

            <div>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem', display: 'block' }}>
                {lang === 'es' ? 'LATENCIA ESTIMADA' : 'EST. LATENCY'}
              </span>
              <span style={{ color: 'var(--text-pure)', fontWeight: 700 }}>~{currentStep.latency}</span>
            </div>

            <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-rule)', paddingTop: '0.4rem' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>
                {lang === 'es' ? 'PAYLOAD & CONTEXTO:' : 'PAYLOAD & CONTEXT:'}{' '}
              </span>
              <code style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                {currentStep.payloadDescription}
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
