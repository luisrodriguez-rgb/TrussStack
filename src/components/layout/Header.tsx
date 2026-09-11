import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { TrussLogo } from '../common/TrussLogo';

export type AppView = 'home' | 'wizard' | 'canvas' | 'compare' | 'explore' | 'benchmarks';

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  theme,
  onToggleTheme,
}) => {
  const { lang, toggleLang, t } = useI18n();

  return (
    <header className="app-header">
      <div
        className="brand-section"
        onClick={() => onViewChange('home')}
        style={{ cursor: 'pointer' }}
        title="TrussStack Home"
      >
        <div className="brand-badge">
          <TrussLogo size={38} />
        </div>
        <div className="brand-title">
          <span className="brand-name">TRUSSSTACK</span>
          <span className="brand-tagline">{t.brandTagline}</span>
        </div>
      </div>

      <nav className="header-nav" aria-label="Modos principales">
        <button
          type="button"
          className={`nav-tab-btn ${currentView === 'home' ? 'active' : ''}`}
          onClick={() => onViewChange('home')}
        >
          {t.navHome}
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${currentView === 'wizard' ? 'active' : ''}`}
          onClick={() => onViewChange('wizard')}
        >
          {t.navRequirements}
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${currentView === 'canvas' ? 'active' : ''}`}
          onClick={() => onViewChange('canvas')}
        >
          {t.navArchitecture}
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${currentView === 'compare' ? 'active' : ''}`}
          onClick={() => onViewChange('compare')}
        >
          {t.navCompare}
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${currentView === 'explore' ? 'active' : ''}`}
          onClick={() => onViewChange('explore')}
        >
          {t.navExplore}
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${currentView === 'benchmarks' ? 'active' : ''}`}
          onClick={() => onViewChange('benchmarks')}
        >
          {t.navBenchmarks}
        </button>
      </nav>

      <div className="header-actions">
        {/* Selector minimalista de idioma */}
        <button
          type="button"
          className="btn-header-pill"
          onClick={toggleLang}
          title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          aria-label="Toggle language"
        >
          <span className={`pill-lang ${lang === 'es' ? 'active' : ''}`}>ES</span>
          <span className="pill-sep">/</span>
          <span className={`pill-lang ${lang === 'en' ? 'active' : ''}`}>EN</span>
        </button>

        {/* Toggle minimalista de tema con icono vectorial */}
        <button
          type="button"
          className="btn-header-icon"
          onClick={onToggleTheme}
          title={
            theme === 'dark'
              ? lang === 'es'
                ? 'Activar modo claro'
                : 'Switch to light mode'
              : lang === 'es'
              ? 'Activar modo oscuro'
              : 'Switch to dark mode'
          }
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>

        {/* Boton minimalista de GitHub con icono Octocat */}
        <a
          href="https://github.com/luisrodriguez-rgb/TrussStack"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-header-github-compact"
          title="GitHub: luisrodriguez-rgb/TrussStack"
          aria-label="GitHub Repository"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="github-star-text">STAR</span>
        </a>
      </div>
    </header>
  );
};
