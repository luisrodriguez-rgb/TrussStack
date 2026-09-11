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
          Diseña técnicamente tu <span>aplicación completa</span>
        </h1>
        <p>
          No es un directorio de herramientas: es un motor determinista que evalúa tus
          restricciones, detecta fricciones y propone la arquitectura técnica ideal con sus trade-offs explícitos.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 1. Tipo de Proyecto */}
        <section className="wizard-card">
          <h2 className="wizard-section-title">
            <span className="section-num">01</span> ¿Qué tipo de sistema vas a construir?
          </h2>
          <p className="wizard-section-desc">
            Define la naturaleza arquitectónica fundamental (SSR, client-heavy, data-heavy, etc.).
          </p>

          <div className="options-grid">
            {[
              { id: 'saas', icon: '🚀', title: 'SaaS B2B/B2C', desc: 'Auth, pagos, multi-tenant' },
              { id: 'ecommerce', icon: '🛍️', title: 'E-commerce', desc: 'Catálogo, carrito, transacciones' },
              { id: 'dashboard', icon: '📊', title: 'Dashboard / Interno', desc: 'Panel administrativo reactivo' },
              { id: 'api_backend', icon: '⚙️', title: 'API / Backend Puro', desc: 'Microservicio o core API' },
              { id: 'content_blog', icon: '📰', title: 'Contenido / Blog', desc: 'SEO crítico, velocidad estática' },
              { id: 'realtime_app', icon: '⚡', title: 'App Tiempo Real', desc: 'Colaboración, chat, sockets' },
            ].map((item) => (
              <div
                key={item.id}
                className={`option-tile ${projectType === item.id ? 'selected' : ''}`}
                onClick={() => setProjectType(item.id as ProjectType)}
                role="button"
                tabIndex={0}
              >
                <div className="option-icon">{item.icon}</div>
                <div className="option-title">{item.title}</div>
                <div className="option-subtitle">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Escala & Equipo */}
        <section className="wizard-card">
          <h2 className="wizard-section-title">
            <span className="section-num">02</span> Escala prevista y contexto del equipo
          </h2>
          <p className="wizard-section-desc">
            Permite ajustar la complejidad operativa para no sobre-diseñar prematuramente.
          </p>

          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Escala de Usuarios Inicial
          </h4>
          <div className="chips-bar">
            {[
              { id: 'mvp_100', label: '1 - 100 usuarios (MVP inicial)' },
              { id: 'early_1k', label: '100 - 1.000 usuarios' },
              { id: 'mid_10k', label: '1.000 - 10.000 usuarios' },
              { id: 'scale_100k', label: '10.000+ usuarios (Gran escala)' },
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.25rem' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Tamaño del Equipo
              </h4>
              <div className="chips-bar">
                {[
                  { id: 'solo', label: '👤 Solo Developer' },
                  { id: 'small_team', label: '👥 2 - 5 Desarrolladores' },
                  { id: 'scale_team', label: '🏢 5+ Desarrolladores' },
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
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Nivel Técnico del Equipo
              </h4>
              <div className="chips-bar">
                {[
                  { id: 'beginner', label: 'Principiante / Bootstrapper' },
                  { id: 'intermediate', label: 'Intermedio' },
                  { id: 'senior', label: 'Senior / Avanzado' },
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
            <span className="section-num">03</span> Presupuesto y requerimientos funcionales
          </h2>
          <p className="wizard-section-desc">
            Filtra herramientas sin plan gratuito y añade módulos arquitectónicos necesarios.
          </p>

          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Presupuesto Inicial de Infraestructura
          </h4>
          <div className="chips-bar">
            {[
              { id: 'zero_free', label: '💸 $0/mes (Hard Free Tier estricto)' },
              { id: 'low_50', label: '🪙 Bajo (< $50/mes)' },
              { id: 'growth_flexible', label: '📈 Flexible / Presupuesto de crecimiento' },
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

          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '1.25rem 0 0.5rem' }}>
            Funcionalidades Clave Requeridas
          </h4>
          <div className="checkboxes-grid">
            {[
              { key: 'needsAuth', title: 'Autenticación y Cuentas', desc: 'Login social, sesiones, perfiles' },
              { key: 'needsPayments', title: 'Pagos / Facturación', desc: 'Cobros con Stripe, Lemon Squeezy o suscripciones' },
              { key: 'needsStorage', title: 'Subida de Archivos / Media', desc: 'Imágenes, PDFs o archivos pesados' },
              { key: 'needsSeo', title: 'SEO Crítico', desc: 'Indexación pública en buscadores (SSR/SSG)' },
              { key: 'needsRealtime', title: 'Tiempo Real / WebSockets', desc: 'Actualizaciones automáticas instantáneas' },
              { key: 'needsBackgroundJobs', title: 'Tareas en Background', desc: 'Colas de procesamiento asíncronas' },
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
                  <input type="checkbox" checked={isChecked} readOnly />
                  <div className="checkbox-label-group">
                    <span className="checkbox-title">{item.title}</span>
                    <span className="checkbox-desc">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Ponderación de Prioridades Declaradas */}
        <section className="wizard-card">
          <h2 className="wizard-section-title">
            <span className="section-num">04</span> Ponderación de tus preferencias declaradas
          </h2>
          <p className="wizard-section-desc">
            Ajusta el peso de cada valor. El <strong>Fit Score</strong> calculará qué arquitectura maximiza tus preferencias exactas.
          </p>

          <div className="sliders-grid">
            {[
              { key: 'developmentSpeed', label: 'Velocidad de Desarrollo (DX & Time-to-Market)' },
              { key: 'costMinimization', label: 'Minimizar Costes Iniciales' },
              { key: 'scalability', label: 'Techo de Escalabilidad Técnica' },
              { key: 'lowVendorLockin', label: 'Bajo Lock-in (Portabilidad & Open Source)' },
              { key: 'operationalSimplicity', label: 'Simplicidad Operativa (Cero Ops manuales)' },
            ].map((slider) => {
              const k = slider.key as keyof typeof priorities;
              const val = priorities[k];
              return (
                <div key={k} className="slider-group">
                  <div className="slider-header">
                    <span className="slider-label">{slider.label}</span>
                    <span className="slider-value">{val} / 5</span>
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
            <span>✨</span> Generar y Visualizar Arquitectura
          </button>
        </section>
      </form>
    </div>
  );
};
