import React from 'react';
import type { StackRecommendation } from '../../engine/types';
import { useI18n } from '../../i18n/I18nContext';

interface HeaderProps {
  currentView: 'wizard' | 'canvas';
  onViewChange: (view: 'wizard' | 'canvas') => void;
  recommendation: StackRecommendation | null;
  onOpenExport: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  recommendation,
  onOpenExport,
  theme,
  onToggleTheme,
}) => {
  const { lang, toggleLang, t } = useI18n();
  const frictionCount = recommendation?.frictionWarnings.length || 0;

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-badge">▲</div>
        <div className="brand-title">
          <span className="brand-name">STACKFORGE</span>
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
      </nav>

      <div className="header-actions">
        {/* Language Toggle */}
        <button
          type="button"
          className="btn-theme-toggle"
          onClick={toggleLang}
          title="Cambiar idioma / Switch language"
        >
          {lang === 'es' ? '[ LANG: ES ]' : '[ LANG: EN ]'}
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          className="btn-theme-toggle"
          onClick={onToggleTheme}
          title="Alternar entre modo oscuro y claro"
        >
          {theme === 'dark' ? t.themeDark : t.themeLight}
        </button>

        {recommendation && (
          <>
            <div className="kpi-chip" title="Afinidad con tus preferencias declaradas">
              <span className="kpi-label">{t.kpiFitScore}</span>
              <span className={`kpi-value ${recommendation.fitScore >= 80 ? 'healthy' : 'warning'}`}>
                {recommendation.fitScore}%
              </span>
            </div>

            <div className="kpi-chip" title="Estimación de coste mensual">
              <span className="kpi-label">{t.kpiCost}</span>
              <span className="kpi-value healthy">
                {recommendation.overallCostEstimate.split(' ')[0]}
              </span>
            </div>

            <div className="kpi-chip" title="Advertencias de fricción arquitectónica">
              <span className="kpi-label">{t.kpiFriction}</span>
              <span className={`kpi-value ${frictionCount === 0 ? 'healthy' : 'warning'}`}>
                {frictionCount === 0 ? '0' : `! ${frictionCount}`}
              </span>
            </div>

            <button type="button" className="btn-export" onClick={onOpenExport}>
              {t.btnExport}
            </button>
          </>
        )}
      </div>
    </header>
  );
};
