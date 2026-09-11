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

interface SpecWizardProps {
  initialSpec: UserProjectSpec;
  onSubmit: (spec: UserProjectSpec) => void;
}

export const SpecWizard: React.FC<SpecWizardProps> = ({ initialSpec, onSubmit }) => {
  const [projectType, setProjectType] = useState<ProjectType>(initialSpec.projectType);
  const [scale, setScale] = useState<ProjectScale>(initialSpec.scale);
  const [teamSize, setTeamSize] = useState<TeamSize>(initialSpec.teamSize);
  const [seniority, setSeniority] = useState<SeniorityLevel>(initialSpec.seniority);
  const [budget, setBudget] = useState<BudgetTier>(initialSpec.budget);
  const [constraints, setConstraints] = useState<ProjectConstraints>(initialSpec.constraints);
  const [priorities, setPriorities] = useState(initialSpec.priorities);

  const toggleConstraint = (key: keyof ProjectConstraints) => {
    setConstraints((prev) => ({ ...prev, [key]: !prev[key] }));
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

  return (
    <div className="wizard-view">
      <div className="wizard-hero">
        <h1>
          DISEÑA LA FÓRMULA DE TU <span>APLICACIÓN COMPLETA</span>
        </h1>
        <p>
          [ BATCH SPECIFICATION ] // Motor determinista que evalúa restricciones reales,
          audita incompatibilidades y propone la arquitectura técnica ideal con trade-offs transparentes.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 1. Tipo de Proyecto */}
        <section className="wizard-card">
          <h2 className="wizard-section-title">
            <span className="section-num">01</span> Tipo de Sistema / Arquitectura
          </h2>
          <p className="wizard-section-desc">
            Define la naturaleza computacional de la carga (SSR, edge rendering, APIs desacopladas).
          </p>

          <div className="options-grid">
            {[
              { id: 'saas', code: 'SAAS-01', title: 'SaaS B2B/B2C', desc: 'Auth, cobros recurrentes y multi-tenancy' },
              { id: 'ecommerce', code: 'ECOM-02', title: 'E-commerce', desc: 'Catálogo de stock, checkout y carritos' },
              { id: 'dashboard', code: 'DASH-03', title: 'Dashboard Interno', desc: 'Panel administrativo reactivo y CRM' },
              { id: 'api_backend', code: 'CORE-04', title: 'API / Backend Puro', desc: 'Microservicio o motor transaccional' },
              { id: 'content_blog', code: 'BLOG-05', title: 'Contenido / Editorial', desc: 'SEO de máxima velocidad y static gen' },
              { id: 'realtime_app', code: 'SYNC-06', title: 'Realtime / Sockets', desc: 'Colaboración en vivo, chat y streaming' },
            ].map((item) => (
              <div
                key={item.id}
                className={`option-tile ${projectType === item.id ? 'selected' : ''}`}
                onClick={() => setProjectType(item.id as ProjectType)}
                role="button"
                tabIndex={0}
              >
                <div className="option-badge-code">[{item.code}]</div>
                <div className="option-title">{item.title}</div>
                <div className="option-subtitle">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Escala & Equipo */}
        <section className="wizard-card">
          <h2 className="wizard-section-title">
            <span className="section-num">02</span> Escala y Recursos del Equipo
          </h2>
          <p className="wizard-section-desc">
            Evita la sobre-ingeniería adaptando la complejidad operativa a las personas reales que mantienen el sistema.
          </p>

          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cream-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Escala de Usuarios Inicial
          </h4>
          <div className="chips-bar">
            {[
              { id: 'mvp_100', label: '[ 1 - 100 USUARIOS ] MVP INICIAL' },
              { id: 'early_1k', label: '[ 100 - 1.000 USUARIOS ]' },
              { id: 'mid_10k', label: '[ 1.000 - 10.000 USUARIOS ]' },
              { id: 'scale_100k', label: '[ 10.000+ USUARIOS ] ESCALA ALTA' },
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
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cream-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Tamaño del Equipo
              </h4>
              <div className="chips-bar">
                {[
                  { id: 'solo', label: '[ 1 SOLO DEV ]' },
                  { id: 'small_team', label: '[ 2 - 5 DEVS ]' },
                  { id: 'scale_team', label: '[ 5+ DEVS ]' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`chip-btn ${teamSize === t.id ? 'selected' : ''}`}
                    onClick={() => setTeamSize(t.id as TeamSize)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cream-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Seniority Técnico
              </h4>
              <div className="chips-bar">
                {[
                  { id: 'beginner', label: '[ PRINCIPIANTE ]' },
                  { id: 'intermediate', label: '[ INTERMEDIO ]' },
                  { id: 'senior', label: '[ SENIOR ]' },
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
            <span className="section-num">03</span> Presupuesto e Ingredientes Funcionales
          </h2>
          <p className="wizard-section-desc">
            Activa módulos arquitectónicos y penaliza proveedores sin planes gratuitos viables.
          </p>

          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cream-dim)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Presupuesto Mensual de Infraestructura
          </h4>
          <div className="chips-bar">
            {[
              { id: 'zero_free', label: '[ $0/MES ] HARD FREE TIER ESTRICTO' },
              { id: 'low_50', label: '[ < $50/MES ] PRESUPUESTO BAJO' },
              { id: 'growth_flexible', label: '[ FLEXIBLE ] CRECIMIENTO PRO' },
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

          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--cream-dim)', margin: '1.5rem 0 0.5rem', textTransform: 'uppercase' }}>
            Requerimientos Funcionales Críticos
          </h4>
          <div className="checkboxes-grid">
            {[
              { key: 'needsAuth', code: 'AUTH', title: 'Autenticación & Sesiones', desc: 'Login social, roles, tokens seguros' },
              { key: 'needsPayments', code: 'PAY', title: 'Pagos & Suscripciones', desc: 'Stripe, Merchant of Record y facturación' },
              { key: 'needsStorage', code: 'STORAGE', title: 'Subida de Archivos / Media', desc: 'Storage compatible con S3 o RLS' },
              { key: 'needsSeo', code: 'SEO', title: 'SEO Crítico en Buscadores', desc: 'Server-Side Rendering y static HTML' },
              { key: 'needsRealtime', code: 'SOCKET', title: 'Tiempo Real / WebSockets', desc: 'Sincronización en vivo sin recarga' },
              { key: 'needsBackgroundJobs', code: 'QUEUES', title: 'Colas & Background Tasks', desc: 'Trabajos asíncronos y cron jobs' },
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
            <span className="section-num">04</span> Ponderación de Preferencias Declaradas
          </h2>
          <p className="wizard-section-desc">
            Pondera los vectores de decisión para calibrar el <strong>Formula Fit Score</strong> exacto.
          </p>

          <div className="sliders-grid">
            {[
              { key: 'developmentSpeed', label: 'Velocidad de Entrega (DX & Tooling)' },
              { key: 'costMinimization', label: 'Minimizar Costes de Entrada' },
              { key: 'scalability', label: 'Techo de Concurrencia & Escala' },
              { key: 'lowVendorLockin', label: 'Cero Lock-in (Open Source & Portabilidad)' },
              { key: 'operationalSimplicity', label: 'Simplicidad Operativa (Cero Mantenimiento)' },
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
            {'[ GENERAR FÓRMULA TÉCNICA // ARCHITECTURE -> ]'}
          </button>
        </section>
      </form>
    </div>
  );
};
