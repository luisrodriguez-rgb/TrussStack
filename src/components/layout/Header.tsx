import React from 'react';
import type { StackRecommendation } from '../../engine/types';

interface HeaderProps {
  currentView: 'wizard' | 'canvas';
  onViewChange: (view: 'wizard' | 'canvas') => void;
  recommendation: StackRecommendation | null;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  recommendation,
  onOpenExport,
}) => {
  const frictionCount = recommendation?.frictionWarnings.length || 0;

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-logo">▲</div>
        <div className="brand-title">
          <span className="brand-name">StackForge</span>
          <span className="brand-tagline">Tech Stack Architect</span>
        </div>
      </div>

      <nav className="header-nav" aria-label="Modos principales">
        <button
          type="button"
          className={`nav-tab-btn ${currentView === 'wizard' ? 'active' : ''}`}
          onClick={() => onViewChange('wizard')}
        >
          <span>📋</span> Requisitos
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${currentView === 'canvas' ? 'active' : ''}`}
          onClick={() => onViewChange('canvas')}
        >
          <span>📐</span> Arquitectura
        </button>
      </nav>

      <div className="header-actions">
        {recommendation && (
          <>
            <div className="kpi-chip" title="Afinidad con tus preferencias declaradas">
              <span className="kpi-label">Fit Score</span>
              <span className={`kpi-value ${recommendation.fitScore >= 80 ? 'healthy' : 'warning'}`}>
                {recommendation.fitScore}%
              </span>
            </div>

            <div className="kpi-chip" title="Estimación de coste mensual">
              <span className="kpi-label">Coste</span>
              <span className="kpi-value healthy">
                {recommendation.overallCostEstimate.split(' ')[0]}
              </span>
            </div>

            <div className="kpi-chip" title="Advertencias de fricción arquitectónica">
              <span className="kpi-label">Fricción</span>
              <span className={`kpi-value ${frictionCount === 0 ? 'healthy' : 'warning'}`}>
                {frictionCount === 0 ? '0' : `⚠ ${frictionCount}`}
              </span>
            </div>

            <button type="button" className="btn-export" onClick={onOpenExport}>
              <span>📤</span> Exportar
            </button>
          </>
        )}
      </div>
    </header>
  );
};
