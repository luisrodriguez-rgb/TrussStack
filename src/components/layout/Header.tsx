import React from 'react';
import type { StackRecommendation } from '../../engine/types';
import { useI18n } from '../../i18n/I18nContext';
import { TrussLogo } from '../common/TrussLogo';

export type AppView = 'wizard' | 'canvas' | 'compare' | 'explore';

interface HeaderProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  recommendation: StackRecommendation | null;
  onOpenExport: () => void;
  onOpenCostSim?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  recommendation,
  onOpenExport,
  onOpenCostSim,
  theme,
  onToggleTheme,
}) => {
  const { lang, toggleLang, t } = useI18n();
  const frictionCount = recommendation?.frictionWarnings.length || 0;

  return (
    <header className="app-header">
      <div className="brand-section">
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

        {recommendation && (
          <>
            <div
              className="kpi-chip"
              title={lang === 'es' ? 'Afinidad con tus preferencias declaradas' : 'Fit Score based on declared preferences'}
            >
              <span className="kpi-label">{t.kpiFitScore}</span>
              <span className={`kpi-value ${recommendation.fitScore >= 80 ? 'healthy' : 'warning'}`}>
                {recommendation.fitScore}%
              </span>
            </div>

            <div
              className="kpi-chip"
              style={{ cursor: onOpenCostSim ? 'pointer' : 'default' }}
              onClick={onOpenCostSim}
              title={lang === 'es' ? 'Click para abrir la calculadora de costes y auditoría de egress' : 'Click to open cost calculator & egress audit'}
            >
              <span className="kpi-label">{t.kpiCost}</span>
              <span className="kpi-value healthy">
                {recommendation.overallCostEstimate.split(' ')[0]} ↗
              </span>
            </div>

            <div
              className="kpi-chip"
              title={lang === 'es' ? 'Advertencias de fricción arquitectónica' : 'Architectural friction warnings'}
            >
              <span className="kpi-label">{t.kpiFriction}</span>
              <span className={`kpi-value ${frictionCount === 0 ? 'healthy' : 'warning'}`}>
                {frictionCount === 0 ? '0' : `! ${frictionCount}`}
              </span>
            </div>

            {onOpenCostSim && (
              <button
                type="button"
                className="btn-theme-toggle"
                onClick={onOpenCostSim}
                title={lang === 'es' ? 'Abrir Simulador Dinámico de Costes' : 'Open Dynamic Cost Simulator'}
                style={{ color: 'var(--yellow-vivid)', borderColor: 'var(--yellow-border)' }}
              >
                {t.btnOpenCostSim}
              </button>
            )}

            <button type="button" className="btn-export" onClick={onOpenExport}>
              {t.btnExport}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
