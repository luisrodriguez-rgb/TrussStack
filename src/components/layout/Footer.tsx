import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { TrussLogo } from '../common/TrussLogo';
import type { AppView } from './Header';

interface FooterProps {
  onViewChange: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onViewChange }) => {
  const { t, lang } = useI18n();

  return (
    <footer className="app-footer">
      <div className="footer-top">
        {/* Columna 1: Marca y Filosofia */}
        <div className="footer-col footer-col-brand">
          <div
            className="footer-brand-lockup"
            onClick={() => onViewChange('home')}
            style={{ cursor: 'pointer' }}
            title="TrussStack Home"
          >
            <TrussLogo size={28} />
            <span className="footer-brand-name">TRUSSSTACK</span>
          </div>
          <p className="footer-brand-desc">{t.footerTagline}</p>
          <div className="footer-badges-cluster">
            <span className="footer-tech-badge">[ V4.0 GA ]</span>
            <span className="footer-tech-badge highlighted">[ {t.footerArchitectureEngine.toUpperCase()} ]</span>
            <span className="footer-tech-badge">[ {t.footerZeroHallucinations.toUpperCase()} ]</span>
          </div>
        </div>

        {/* Columna 2: Navegacion del Workbench */}
        <div className="footer-col">
          <h4 className="footer-col-title">[ {t.footerQuickLinks.toUpperCase()} ]</h4>
          <ul className="footer-links-list">
            <li>
              <button type="button" onClick={() => onViewChange('home')} className="footer-link-btn">
                {lang === 'es' ? 'Inicio // Workbench' : 'Home // Workbench'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onViewChange('wizard')} className="footer-link-btn">
                {lang === 'es' ? '01. Calibrador de Requisitos' : '01. Requirements Wizard'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onViewChange('canvas')} className="footer-link-btn">
                {lang === 'es' ? '02. Topologia de Arquitectura' : '02. Architecture Topology'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onViewChange('compare')} className="footer-link-btn">
                {lang === 'es' ? '03. Comparador de Arquetipos' : '03. Archetypes Comparator'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onViewChange('explore')} className="footer-link-btn">
                {lang === 'es' ? '04. Catalogo de 179 Tecnologias' : '04. 179 Technologies Catalog'}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => onViewChange('benchmarks')} className="footer-link-btn">
                {lang === 'es' ? '05. Telemetria de Benchmarks' : '05. Benchmarks Telemetry'}
              </button>
            </li>
          </ul>
        </div>

        {/* Columna 3: Estandares y DevOps */}
        <div className="footer-col">
          <h4 className="footer-col-title">[ {t.footerStandards.toUpperCase()} ]</h4>
          <ul className="footer-links-list">
            <li>
              <span className="footer-spec-item">MADR 3.0 Architectural Decision Records</span>
            </li>
            <li>
              <span className="footer-spec-item">Docker-Compose & .env.example Scaffolding</span>
            </li>
            <li>
              <span className="footer-spec-item">GitOps CI/CD Drift Linter GitHub Action</span>
            </li>
            <li>
              <span className="footer-spec-item">Excalidraw & Mermaid Vector Protocols</span>
            </li>
            <li>
              <span className="footer-spec-item">Pareto Efficient Multi-Vector Scoring</span>
            </li>
          </ul>
        </div>

        {/* Columna 4: Autor y Enlaces Oficiales */}
        <div className="footer-col footer-col-author">
          <h4 className="footer-col-title">[ {lang === 'es' ? 'AUTORIA & REPOSITORIO' : 'AUTHOR & REPOSITORY'} ]</h4>
          <div className="footer-author-box">
            <span className="footer-author-label">{t.footerDesignedBy}</span>
            <a
              href="https://github.com/luisrodriguez-rgb"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-author-name"
              title="GitHub: @luisrodriguez-rgb"
            >
              Luis Rodríguez <span className="author-handle">@luisrodriguez-rgb</span>
            </a>
          </div>
          <div className="footer-cta-buttons">
            <a
              href="https://github.com/luisrodriguez-rgb/TrussStack"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-btn-github"
              title="GitHub Repository"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>{t.footerViewSource}</span>
            </a>
            <a
              href="https://github.com/luisrodriguez-rgb/TrussStack/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-license-pill"
            >
              {t.footerLicense}
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-copy">
          &copy; {new Date().getFullYear()} Luis Rodríguez // TrussStack. {t.footerRights}
        </div>
        <div className="footer-bottom-meta">
          <span>LATENCY: 0ms</span>
          <span className="meta-sep">//</span>
          <span>MEMORY: CLIENT-SIDE</span>
          <span className="meta-sep">//</span>
          <span>ECOSYSTEM: 179 TECHNOLOGIES</span>
        </div>
      </div>
    </footer>
  );
};
