import React, { useState } from 'react';
import type {
  BudgetTier,
  ProjectConstraints,
  ProjectScale,
  ProjectType,
  SeniorityLevel,
  TeamSize,
  UserProjectSpec,
} from '../../engine/types';
import { getSystemProfile, getSystemsByGroup, type SystemGroup } from '../../engine/systems';
import { useI18n } from '../../i18n/I18nContext';

interface SpecWizardProps {
  initialSpec: UserProjectSpec;
  onSubmit: (spec: UserProjectSpec) => void;
}

export const SpecWizard: React.FC<SpecWizardProps> = ({ initialSpec, onSubmit }) => {
  const { t, lang } = useI18n();
  const [projectType, setProjectType] = useState<ProjectType>(initialSpec.projectType);
  const [selectedGroup, setSelectedGroup] = useState<SystemGroup>('all');
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);
  const [scale, setScale] = useState<ProjectScale>(initialSpec.scale);
  const [teamSize, setTeamSize] = useState<TeamSize>(initialSpec.teamSize);
  const [seniority, setSeniority] = useState<SeniorityLevel>(initialSpec.seniority);
  const [budget, setBudget] = useState<BudgetTier>(initialSpec.budget);
  const [constraints, setConstraints] = useState<ProjectConstraints>(initialSpec.constraints);
  const [priorities, setPriorities] = useState(initialSpec.priorities);

  const activeProfile = getSystemProfile(projectType);

  const toggleConstraint = (key: keyof ProjectConstraints) => {
    setConstraints((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApplyRecommendedConstraints = () => {
    if (activeProfile && activeProfile.defaultConstraints) {
      setConstraints((prev) => ({
        ...prev,
        ...activeProfile.defaultConstraints,
      }));
      setIsCalibrated(true);
      setTimeout(() => setIsCalibrated(false), 2200);
    }
  };

  const handlePriorityChange = (key: keyof typeof priorities, value: number) => {
    setPriorities((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectType,
      scale,
      teamSize,
      seniority,
      budget,
      constraints,
      priorities,
    });
  };

  const visibleSystems = getSystemsByGroup(selectedGroup);

  return (
    <div className="wizard-view">
      <div className="wizard-hero">
        <h1>
          {t.wizardTitle} <span>{t.wizardTitleHighlight}</span>
        </h1>
        <p>{t.wizardSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 1. Tipo de Proyecto */}
        <section className="wizard-card">
          <h2 className="wizard-section-title">
            <span className="section-num">01</span> {t.section01Title}
          </h2>
          <p className="wizard-section-desc">{t.section01Desc}</p>

          {/* Group Filter Tabs */}
          <div className="chips-bar" style={{ marginBottom: '1.25rem' }}>
            {[
              { id: 'all', label: t.wizardFilterAll },
              { id: 'web_saas', label: t.wizardFilterWebSaas },
              { id: 'backend_data', label: t.wizardFilterBackendData },
              { id: 'ai_automation', label: t.wizardFilterAiAutomation },
              { id: 'mobile_realtime', label: t.wizardFilterMobileRealtime },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`chip-btn ${selectedGroup === tab.id ? 'selected' : ''}`}
                onClick={() => setSelectedGroup(tab.id as SystemGroup)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="options-grid">
            {visibleSystems.map((item) => (
              <div
                key={item.id}
                className={`option-tile ${projectType === item.id ? 'selected' : ''}`}
                onClick={() => {
                  setProjectType(item.id);
                  setIsCalibrated(false);
                }}
                role="button"
                tabIndex={0}
              >
                <div className="option-badge-code">[{item.code}]</div>
                <div className="option-title">{lang === 'es' ? item.titleEs : item.titleEn}</div>
                <div className="option-subtitle">{lang === 'es' ? item.descEs : item.descEn}</div>
              </div>
            ))}
          </div>

          {/* Calibración sugerida del sistema */}
          <div
            className="system-profile-hint-banner"
            style={{
              marginTop: '1.25rem',
              padding: '1rem 1.25rem',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-rule)',
              borderRadius: 'var(--radius-xs)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.85rem',
            }}
          >
            <div style={{ maxWidth: '680px' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--yellow-vivid)',
                  letterSpacing: '0.06em',
                  marginBottom: '0.25rem',
                }}
              >
                [ {t.wizardActiveProfileTag}: {activeProfile.code} //{' '}
                {lang === 'es' ? activeProfile.titleEs.toUpperCase() : activeProfile.titleEn.toUpperCase()} ]
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                {lang === 'es' ? activeProfile.whyRationaleEs : activeProfile.whyRationaleEn}
              </div>
            </div>
            <button
              type="button"
              onClick={handleApplyRecommendedConstraints}
              className="btn-apply-constraints"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '0.55rem 0.95rem',
                background: isCalibrated ? 'var(--yellow-vivid)' : 'transparent',
                color: isCalibrated ? '#000000' : 'var(--yellow-vivid)',
                border: '1px solid var(--yellow-vivid)',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {isCalibrated ? t.wizardRecommendedApplied : t.wizardApplyRecommended}
            </button>
          </div>
        </section>

        {/* 2. Escala & Equipo */}
        <section className="wizard-card">
          <h2 className="wizard-section-title">
            <span className="section-num">02</span> {t.section02Title}
          </h2>
          <p className="wizard-section-desc">{t.section02Desc}</p>

          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            {t.scaleLabel}
          </h4>
          <div className="chips-bar">
            {[
              { id: 'mvp_100', label: t.scaleMvp },
              { id: 'early_1k', label: t.scaleEarly },
              { id: 'mid_10k', label: t.scaleMid },
              { id: 'scale_100k', label: t.scaleScale },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                className={`chip-btn ${scale === s.id ? 'selected' : ''}`}
                onClick={() => setScale(s.id as ProjectScale)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.25rem' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                {t.teamSizeLabel}
              </h4>
              <div className="chips-bar">
                {[
                  { id: 'solo', label: t.teamSolo },
                  { id: 'small_team', label: t.teamSmall },
                  { id: 'scale_team', label: t.teamScale },
                ].map((team) => (
                  <button
                    key={team.id}
                    type="button"
                    className={`chip-btn ${teamSize === team.id ? 'selected' : ''}`}
                    onClick={() => setTeamSize(team.id as TeamSize)}
                  >
                    {team.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                {t.seniorityLabel}
              </h4>
              <div className="chips-bar">
                {[
                  { id: 'beginner', label: t.senBeginner },
                  { id: 'intermediate', label: t.senIntermediate },
                  { id: 'senior', label: t.senSenior },
                ].map((sen) => (
                  <button
                    key={sen.id}
                    type="button"
                    className={`chip-btn ${seniority === sen.id ? 'selected' : ''}`}
                    onClick={() => setSeniority(sen.id as SeniorityLevel)}
                  >
                    {sen.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Presupuesto & Restricciones */}
        <section className="wizard-card">
          <h2 className="wizard-section-title">
            <span className="section-num">03</span> {t.section03Title}
          </h2>
          <p className="wizard-section-desc">{t.section03Desc}</p>

          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            {t.budgetLabel}
          </h4>
          <div className="chips-bar">
            {[
              { id: 'zero_free', label: t.budgetZero },
              { id: 'low_50', label: t.budgetLow },
              { id: 'growth_flexible', label: t.budgetGrowth },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                className={`chip-btn ${budget === b.id ? 'selected' : ''}`}
                onClick={() => setBudget(b.id as BudgetTier)}
              >
                {b.label}
              </button>
            ))}
          </div>

          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-dim)', margin: '1.5rem 0 0.5rem', textTransform: 'uppercase' }}>
            {t.constraintsLabel}
          </h4>
          <div className="checkboxes-grid">
            {[
              { key: 'needsAuth', code: 'AUTH', title: t.constAuthTitle, desc: t.constAuthDesc },
              { key: 'needsPayments', code: 'PAY', title: t.constPayTitle, desc: t.constPayDesc },
              { key: 'needsStorage', code: 'STORAGE', title: t.constStorageTitle, desc: t.constStorageDesc },
              { key: 'needsSeo', code: 'SEO', title: t.constSeoTitle, desc: t.constSeoDesc },
              { key: 'needsRealtime', code: 'SOCKET', title: t.constRealtimeTitle, desc: t.constRealtimeDesc },
              { key: 'needsBackgroundJobs', code: 'QUEUES', title: t.constBgTitle, desc: t.constBgDesc },
            ].map((item) => {
              const k = item.key as keyof ProjectConstraints;
              const isChecked = constraints[k];
              return (
                <div
                  key={k}
                  className={`checkbox-card ${isChecked ? 'checked' : ''}`}
                  onClick={() => toggleConstraint(k)}
                  role="button"
                  tabIndex={0}
                >
                  <span className="checkbox-indicator">{isChecked ? '[X]' : '[ ]'}</span>
                  <div className="checkbox-label-group">
                    <span className="checkbox-title">
                      [{item.code}] {item.title}
                    </span>
                    <span className="checkbox-desc">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Ponderación de Prioridades */}
        <section className="wizard-card">
          <h2 className="wizard-section-title">
            <span className="section-num">04</span> {t.section04Title}
          </h2>
          <p className="wizard-section-desc">{t.section04Desc}</p>

          <div className="sliders-grid">
            {[
              { key: 'developmentSpeed', label: t.prioritySpeed },
              { key: 'costMinimization', label: t.priorityCost },
              { key: 'scalability', label: t.priorityScale },
              { key: 'lowVendorLockin', label: t.priorityLockin },
              { key: 'operationalSimplicity', label: t.prioritySimplicity },
            ].map((slider) => {
              const k = slider.key as keyof typeof priorities;
              const val = priorities[k];
              return (
                <div key={k} className="slider-group">
                  <div className="slider-header">
                    <span className="slider-label">{slider.label}</span>
                    <span className="slider-value">[{val} / 5]</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={val}
                    onChange={(e) => handlePriorityChange(k, Number(e.target.value))}
                  />
                </div>
              );
            })}
          </div>

          <button type="submit" className="btn-generate-stack">
            {t.btnGenerateStack}
          </button>
        </section>
      </form>
    </div>
  );
};
