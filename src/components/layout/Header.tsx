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
        {/* Language Toggle */}
        <button
          type="button"
          className="btn-theme-toggle"
          onClick={toggleLang}
          title={lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
        >
          {lang === 'es' ? '[ LANG: ES ]' : '[ LANG: EN ]'}
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          className="btn-theme-toggle"
          onClick={onToggleTheme}
          title={lang === 'es' ? 'Alternar modo oscuro / claro' : 'Toggle dark / light theme'}
        >
          {theme === 'dark' ? t.themeDark : t.themeLight}
        </button>

        {/* GitHub Star Button */}
        <a
          href="https://github.com/luisrodriguez-rgb/TrussStack"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-header-github"
          title="Star on GitHub"
        >
          {t.btnGitHubStar}
        </a>
      </div>
    </header>
  );
};
