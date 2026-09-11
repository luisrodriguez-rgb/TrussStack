import React, { useState } from 'react';
import type { StackRecommendation, TechCategory, Technology } from '../../engine/types';
import { TECH_BY_ID } from '../../engine/catalog';
import { getLocalizedTech } from '../../engine/catalogI18n';
import { TechLogo } from '../common/TechLogo';
import { useI18n } from '../../i18n/I18nContext';
import { FlowSimulatorBar } from './FlowSimulatorBar';
import { ProtocolModal } from './ProtocolModal';
import { WhyThisStackModal } from './WhyThisStackModal';
import { ScoreBreakdownModal } from './ScoreBreakdownModal';
import {
  PROTOCOL_INSPECTIONS,
  type FlowScenario,
  type ProtocolInspection,
} from '../../engine/flows';

interface ArchitectureCanvasProps {
  recommendation: StackRecommendation;
  onReplaceCategory: (category: TechCategory) => void;
  onInspectTech: (tech: Technology) => void;
  onOpenCostSim?: () => void;
  onOpenExport?: () => void;
  onShareBlueprint?: () => void;
  isShareCopied?: boolean;
  onOpenDriftAudit?: () => void;
}

export const ArchitectureCanvas: React.FC<ArchitectureCanvasProps> = ({
  recommendation,
  onReplaceCategory,
  onInspectTech,
  onOpenCostSim,
  onOpenExport,
  onShareBlueprint,
  isShareCopied = false,
  onOpenDriftAudit,
}) => {
  const { t, lang } = useI18n();
  const [activeScenario, setActiveScenario] = useState<FlowScenario | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [activeProtocol, setActiveProtocol] = useState<ProtocolInspection | null>(null);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);

  const {
    slots,
    fitScore,
    overallCostEstimate,
    frictionWarnings,
    dimensionScores,
    scoreBreakdown,
    causalRules,
    whyReasons,
    keyTradeoffs,
  } = recommendation;

  const renderCard = (category: TechCategory, customLayerName?: string, isHero = false) => {
    const techId = slots[category];
    if (!techId) return null;
    const rawTech = TECH_BY_ID[techId];
    if (!rawTech) return null;
    const tech = getLocalizedTech(rawTech, lang);

    const isInFlow = activeScenario ? activeScenario.involvedCategories.includes(category) : false;
    const currentStep = activeScenario?.steps[currentStepIndex];
    const isStepTarget = currentStep?.targetCategory === category;
    const isStepSource = currentStep?.sourceCategory === category;
    const isHighlighted = isStepTarget || isStepSource;
    const isDimmed = activeScenario ? !isInFlow : false;

    return (
      <div
        key={tech.id}
        className={`craft-card ${isHero ? 'hero-node' : ''} ${
          isHighlighted ? 'active-flow-step' : isInFlow ? 'in-flow' : ''
        } ${isDimmed ? 'dimmed-flow' : ''}`}
        onClick={() => onInspectTech(tech)}
      >
        <div>
          {/* Active Flow Badge if participating in current step */}
          {isStepTarget && (
            <span className="flow-step-badge">
              [ {lang === 'es' ? 'PASO' : 'STEP'} {currentStepIndex + 1}: {t.flowStepTarget} ]
            </span>
          )}
          {isStepSource && (
            <span className="flow-step-badge" style={{ background: '#FFE600' }}>
              [ {lang === 'es' ? 'PASO' : 'STEP'} {currentStepIndex + 1}: {t.flowStepSource} ]
            </span>
          )}

          {/* Card Top Bar with Logo, Name and Action Icons */}
          <div className="card-header">
            <div className="card-brand-group">
              <div className="card-logo-box">
                <TechLogo id={tech.id} size={20} />
              </div>
              <span className="card-title-text">{tech.name}</span>
            </div>

            <div className="card-top-actions" onClick={(e) => e.stopPropagation()}>
              <a
                href={tech.website}
                target="_blank"
                rel="noopener noreferrer"
                className="card-icon-btn"
                title="Website"
              >
                ↗
              </a>
              <button
                type="button"
                className="card-icon-btn"
                onClick={() => onReplaceCategory(category)}
                title="Replace"
              >
                +
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="card-description">{tech.description}</p>

          {/* Outlined Yellow Badge like reference image */}
          <div
            className={`badge-sin-tarjeta ${
              tech.costProfile.freeTier.hasFreeTier ? '' : 'orange'
            }`}
          >
            {tech.costProfile.freeTier.hasFreeTier
              ? t.badgeNoCard
              : tech.costProfile.initialCost === 'free'
              ? t.badgeFreeTier
              : t.badgeUsageBased}
          </div>

          {/* Quota / Free tier breakdown */}
          <p className="card-quota-text">
            {tech.costProfile.freeTier.limitsDescription || tech.tagline}
          </p>
        </div>

        {/* Footer Tags & Actions */}
        <div className="card-footer-tags" onClick={(e) => e.stopPropagation()}>
          <div className="tag-pills-list">
            <span className="pill-tag">{customLayerName || category}</span>
            <span className="pill-tag">
              {tech.isOpenSource ? 'open source' : 'managed'}
            </span>
            <span className="pill-tag">dx {tech.metrics.dx}/5</span>
          </div>

          <div className="card-action-btns">
            <button
              type="button"
              className="btn-card-swap"
              onClick={() => onReplaceCategory(category)}
            >
              {t.btnCardSwap}
            </button>
            <button
              type="button"
              className="btn-card-details"
              onClick={() => onInspectTech(tech)}
            >
              {t.btnCardTradeoffs}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="canvas-view">
      {/* 0. Canvas Instrumentation & Actions Ribbon */}
      <div className="canvas-instrumentation-bar">
        <div className="canvas-bar-kpis">
          <div
            className="canvas-kpi-pill interactive"
            onClick={() => setIsScoreModalOpen(true)}
            style={{ cursor: 'pointer' }}
            title={lang === 'es' ? 'Click para inspeccionar desglose de puntuación' : 'Click to inspect score breakdown'}
          >
            <span className="canvas-kpi-label">{t.kpiFitScore}</span>
            <span className={`canvas-kpi-value ${fitScore >= 80 ? 'healthy' : 'warning'}`}>
              {fitScore}% ↗
            </span>
          </div>

          <div
            className="canvas-kpi-pill interactive"
            onClick={onOpenCostSim}
            title={t.canvasBarCostTooltip}
          >
            <span className="canvas-kpi-label">{t.kpiCost}</span>
            <span className="canvas-kpi-value healthy">
              {overallCostEstimate.split(' ')[0]} ↗
            </span>
          </div>

          <div className="canvas-kpi-pill" title={t.canvasBarFrictionTooltip}>
            <span className="canvas-kpi-label">{t.kpiFriction}</span>
            <span className={`canvas-kpi-value ${frictionWarnings.length === 0 ? 'healthy' : 'warning'}`}>
              {frictionWarnings.length === 0 ? '0' : `! ${frictionWarnings.length}`}
            </span>
          </div>
        </div>

        <div className="canvas-bar-actions">
          <button
            type="button"
            className="btn-canvas-action"
            style={{ borderColor: 'var(--yellow-vivid)', color: 'var(--yellow-vivid)' }}
            onClick={() => setIsWhyModalOpen(true)}
            title={lang === 'es' ? 'Ver justificación causal de esta arquitectura' : 'View causal rationale for this architecture'}
          >
            {lang === 'es' ? '¿POR QUÉ ESTE STACK? ↗' : 'WHY THIS STACK? ↗'}
          </button>

          {onOpenCostSim && (
            <button
              type="button"
              className="btn-canvas-action"
              onClick={onOpenCostSim}
              title={lang === 'es' ? 'Abrir Simulador Dinámico de Costes' : 'Open Dynamic Cost Simulator'}
            >
              {t.btnOpenCostSim}
            </button>
          )}

          {onShareBlueprint && (
            <button
              type="button"
              className={`btn-canvas-action ${isShareCopied ? 'copied' : ''}`}
              onClick={onShareBlueprint}
              title={t.btnShareTooltip}
            >
              {isShareCopied ? t.btnShareCopied : t.btnShare}
            </button>
          )}

          {onOpenDriftAudit && (
            <button
              type="button"
              className="btn-canvas-action"
              onClick={onOpenDriftAudit}
              title={lang === 'es' ? 'Auditar drift arquitectónico en package.json' : 'Audit architectural drift in package.json'}
            >
              {t.btnAuditDrift}
            </button>
          )}

          {onOpenExport && (
            <button
              type="button"
              className="btn-canvas-action primary"
              onClick={onOpenExport}
              title="Export Production Bundle"
            >
              {t.btnExport}
            </button>
          )}
        </div>
      </div>

      {/* 1. SPECIFICATION MATRIX HEADER PANEL */}
      <div className="nutrition-panel">
        <div className="nutrition-headline-group">
          <div
            className="nutrition-stamp interactive"
            onClick={() => setIsScoreModalOpen(true)}
            style={{ cursor: 'pointer' }}
            title={lang === 'es' ? 'Click para inspeccionar desglose de puntuación' : 'Click to inspect score breakdown'}
          >
            <span className="nutrition-stamp-num">{fitScore}%</span>
            <span className="nutrition-stamp-lbl">FIT ↗</span>
          </div>

          <div className="nutrition-headline">
            <h2>{t.matrixTitle}</h2>
            <p>{t.matrixDesc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.45rem' }}>
              <button
                type="button"
                className="chip-btn"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', color: 'var(--yellow-vivid)', borderColor: 'var(--yellow-vivid)' }}
                onClick={() => setIsWhyModalOpen(true)}
              >
                {lang === 'es' ? '¿Por qué esta arquitectura? ↗' : 'Why this architecture? ↗'}
              </button>
              <button
                type="button"
                className="chip-btn"
                style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
                onClick={() => setIsScoreModalOpen(true)}
              >
                {lang === 'es' ? 'Desglose del Fit Score ↗' : 'Score breakdown ↗'}
              </button>
            </div>
          </div>
        </div>

        <div className="nutrition-metrics-row">
          <div className="nutrition-metric-box">
            <span className="metric-micro-label">{t.matrixTeam}</span>
            <span className="metric-micro-val">
              {recommendation.spec.teamSize === 'solo'
                ? lang === 'es'
                  ? '1 SOLO DEV'
                  : '1 SOLO DEV'
                : recommendation.spec.teamSize === 'small_team'
                ? '2-5 DEVS'
                : '5+ DEVS'}
            </span>
          </div>

          <div
            className="nutrition-metric-box"
            style={{ cursor: onOpenCostSim ? 'pointer' : 'default' }}
            onClick={onOpenCostSim}
            title={
              lang === 'es'
                ? 'Click para abrir la calculadora de escala y costes dinámicos'
                : 'Click to open dynamic scale and cost calculator'
            }
          >
            <span className="metric-micro-label">{t.matrixCost} ↗</span>
            <span className="metric-micro-val citron">
              {overallCostEstimate.split(' ')[0]}
            </span>
          </div>

          <div className="nutrition-metric-box">
            <span className="metric-micro-label">{t.matrixDx}</span>
            <span className="metric-micro-val">{dimensionScores.speed}%</span>
          </div>

          <div className="nutrition-metric-box">
            <span className="metric-micro-label">{t.matrixLockin}</span>
            <span className="metric-micro-val">{dimensionScores.portability}%</span>
          </div>

          <div className="nutrition-metric-box">
            <span className="metric-micro-label">{t.matrixSimplicity}</span>
            <span className="metric-micro-val">{dimensionScores.simplicity}%</span>
          </div>
        </div>
      </div>

      {/* 2. Banner de Fricción Arquitectónica (si existe) */}
      {frictionWarnings.length > 0 && (
        <div className="friction-notice-box">
          <strong>{t.frictionNotice}</strong>{' '}
          {frictionWarnings.map((f, i) => (
            <span key={i}>
              [{f.sourceName} + {f.targetName}]: {f.message}{' '}
            </span>
          ))}
        </div>
      )}

      {/* 3. Fundamentos de la Arquitectura ("Why?") */}
      {whyReasons.length > 0 && (
        <div className="why-reasons-box">
          <div className="why-reasons-title">{t.whyTitle}</div>
          <ul className="why-reasons-list">
            {whyReasons.map((why, idx) => (
              <li key={idx} className="why-reason-item">
                {why}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Simulador de Flujos de Datos en Tiempo Real (Fase 1 Roadmap) */}
      <FlowSimulatorBar
        activeScenario={activeScenario}
        currentStepIndex={currentStepIndex}
        onSelectScenario={setActiveScenario}
        onStepChange={setCurrentStepIndex}
      />

      {/* 5. Topología en 5 Capas */}
      <div className="layers-container">
        {/* CAPA 1: INGRESS & CLIENT */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">{t.layer01Tag}</span>
            <span className="layer-title">{t.layer01Title}</span>
          </div>
          <div className="layer-nodes-grid">
            {renderCard('frontend', 'frontend', true)}
            {slots.mobile && renderCard('mobile', 'mobile client')}
          </div>
        </div>

        {/* Conector 1 */}
        <div
          className="layer-connector interactive"
          onClick={() => setActiveProtocol(PROTOCOL_INSPECTIONS.ingress_to_app)}
          title={
            lang === 'es'
              ? 'Click para inspeccionar contrato de protocolo y seguridad'
              : 'Click to inspect protocol contract and security'
          }
        >
          <div className="connector-line" />
          <span className="connector-pill interactive">
            PROTOCOL: HTTPS / WEBFETCH / RPC ↗
          </span>
        </div>

        {/* CAPA 2: APPLICATION & API */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">{t.layer02Tag}</span>
            <span className="layer-title">{t.layer02Title}</span>
          </div>
          <div className="layer-nodes-grid">
            {slots.backend ? (
              renderCard('backend', 'backend api')
            ) : (
              <div
                className="craft-card"
                style={{
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  background: 'var(--bg-card)',
                }}
              >
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <span
                    className="badge-sin-tarjeta"
                    style={{ marginBottom: '0.5rem' }}
                  >
                    NATIVE INTEGRATION
                  </span>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--text-pure)',
                    }}
                  >
                    {t.serverlessTitle}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      marginTop: '0.35rem',
                    }}
                  >
                    {t.serverlessDesc}
                  </p>
                </div>
              </div>
            )}
            {slots.queues && renderCard('queues', 'background queues')}
          </div>
        </div>

        {/* Conector 2 */}
        <div
          className="layer-connector interactive"
          onClick={() => setActiveProtocol(PROTOCOL_INSPECTIONS.app_to_data)}
          title={
            lang === 'es'
              ? 'Click para inspeccionar contrato de protocolo y seguridad'
              : 'Click to inspect protocol contract and security'
          }
        >
          <div className="connector-line" />
          <span className="connector-pill interactive">
            PROTOCOL: SQL CONNECTION POOL / S3 PRESIGNED ↗
          </span>
        </div>

        {/* CAPA 3: DATA & STATE */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">{t.layer03Tag}</span>
            <span className="layer-title">{t.layer03Title}</span>
          </div>
          <div className="layer-nodes-grid">
            {renderCard('database', 'database')}
            {slots.storage && renderCard('storage', 'storage')}
            {slots.ai && renderCard('ai', 'vector & ai search')}
          </div>
        </div>

        {/* Conector 3 */}
        <div
          className="layer-connector interactive"
          onClick={() => setActiveProtocol(PROTOCOL_INSPECTIONS.app_to_services)}
          title={
            lang === 'es'
              ? 'Click para inspeccionar contrato de protocolo y seguridad'
              : 'Click to inspect protocol contract and security'
          }
        >
          <div className="connector-line" />
          <span className="connector-pill interactive">
            PROTOCOL: JWT TOKENS / OAUTH / WEBHOOKS ↗
          </span>
        </div>

        {/* CAPA 4: THIRD-PARTY SERVICES */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">{t.layer04Tag}</span>
            <span className="layer-title">{t.layer04Title}</span>
          </div>
          <div className="layer-nodes-grid">
            {slots.auth && renderCard('auth', 'auth')}
            {slots.payments && renderCard('payments', 'payments')}
            {slots.email && renderCard('email', 'email')}
          </div>
        </div>

        {/* Conector 4 */}
        <div
          className="layer-connector interactive"
          onClick={() => setActiveProtocol(PROTOCOL_INSPECTIONS.app_to_ops)}
          title={
            lang === 'es'
              ? 'Click para inspeccionar contrato de protocolo y seguridad'
              : 'Click to inspect protocol contract and security'
          }
        >
          <div className="connector-line" />
          <span className="connector-pill interactive">
            PROTOCOL: EDGE DEPLOY / APM TELEMETRY / CI HOOKS ↗
          </span>
        </div>

        {/* CAPA 5: INFRASTRUCTURE & OPS */}
        <div className="layer-section">
          <div className="layer-header">
            <span className="layer-tag">{t.layer05Tag}</span>
            <span className="layer-title">{t.layer05Title}</span>
          </div>
          <div className="layer-nodes-grid">
            {renderCard('hosting', 'hosting')}
            {slots.monitoring && renderCard('monitoring', 'monitoring')}
            {slots.cicd && renderCard('cicd', 'ci/cd')}
          </div>
        </div>
      </div>

      {/* Modal de Inspección de Protocolo */}
      <ProtocolModal
        protocol={activeProtocol}
        onClose={() => setActiveProtocol(null)}
      />

      {/* Modal de Explicabilidad Causal "Why this Stack?" */}
      {isWhyModalOpen && (
        <WhyThisStackModal
          causalRules={causalRules || []}
          whyReasons={whyReasons}
          keyTradeoffs={keyTradeoffs}
          onClose={() => setIsWhyModalOpen(false)}
        />
      )}

      {/* Modal de Desglose Matemático del Fit Score */}
      {isScoreModalOpen && scoreBreakdown && (
        <ScoreBreakdownModal
          scoreBreakdown={scoreBreakdown}
          fitScore={fitScore}
          onClose={() => setIsScoreModalOpen(false)}
        />
      )}
    </div>
  );
};
