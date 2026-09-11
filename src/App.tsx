import React, { useEffect, useState } from 'react';
import type {
  StackRecommendation,
  TechCategory,
  Technology,
  UserProjectSpec,
} from './engine/types';
import {
  calculateTechFit,
  detectStackFrictions,
  recommendStack,
} from './engine/recommender';
import { TECH_BY_ID } from './engine/catalog';
import { getLocalizedFrictionMessage } from './engine/catalogI18n';
import { Header, type AppView } from './components/layout/Header';
import { SpecWizard } from './components/wizard/SpecWizard';
import { ArchitectureCanvas } from './components/canvas/ArchitectureCanvas';
import { StackComparator } from './components/compare/StackComparator';
import { StacksCatalog } from './components/explore/StacksCatalog';
import { TradeoffDrawer } from './components/canvas/TradeoffDrawer';
import { ReplaceModal } from './components/canvas/ReplaceModal';
import { ExportModal } from './components/export/ExportModal';
import { CostSimulatorModal } from './components/cost/CostSimulatorModal';
import { useI18n } from './i18n/I18nContext';

// Especificación inicial por defecto: SaaS MVP optimizado para 1 dev
const defaultSpec: UserProjectSpec = {
  projectType: 'saas',
  scale: 'mvp_100',
  teamSize: 'solo',
  seniority: 'intermediate',
  budget: 'zero_free',
  constraints: {
    needsAuth: true,
    needsPayments: true,
    needsStorage: true,
    needsSeo: true,
    needsRealtime: false,
    needsBackgroundJobs: false,
  },
  priorities: {
    developmentSpeed: 5,
    costMinimization: 5,
    scalability: 3,
    lowVendorLockin: 2,
    operationalSimplicity: 4,
  },
};

export const App: React.FC = () => {
  const { lang } = useI18n();
  const [currentView, setCurrentView] = useState<AppView>('canvas');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [spec, setSpec] = useState<UserProjectSpec>(defaultSpec);
  const [recommendation, setRecommendation] = useState<StackRecommendation>(() =>
    recommendStack(defaultSpec, 'es')
  );

  // Sincronizar tema con el atributo del DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sincronizar textos deterministas de la recomendación al cambiar de idioma
  useEffect(() => {
    setRecommendation((prev) => {
      const refreshed = recommendStack(spec, lang);
      return {
        ...refreshed,
        slots: prev.slots, // Mantener las selecciones y sustituciones activas del usuario
      };
    });
  }, [lang, spec]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modales y Drawers
  const [selectedTechForDrawer, setSelectedTechForDrawer] = useState<Technology | null>(null);
  const [replacingCategory, setReplacingCategory] = useState<TechCategory | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCostSimOpen, setIsCostSimOpen] = useState<boolean>(false);

  // Generar recomendación desde el Wizard
  const handleGenerateStack = (newSpec: UserProjectSpec) => {
    setSpec(newSpec);
    const newRecommendation = recommendStack(newSpec, lang);
    setRecommendation(newRecommendation);
    setCurrentView('canvas');
  };

  // Cargar Blueprint desde Compare o Explore
  const handleLoadCustomSlots = (newSlots: Record<TechCategory, string | null>) => {
    const activeIds = Object.values(newSlots).filter((id): id is string => Boolean(id));
    const individualScores = activeIds.map((id) => calculateTechFit(TECH_BY_ID[id], spec, newSlots));
    const avgScore = Math.round(
      individualScores.reduce((acc, score) => acc + score, 0) / (individualScores.length || 1)
    );

    const rawFrictions = detectStackFrictions(activeIds);
    const frictions = rawFrictions.map((f) => ({
      ...f,
      message: getLocalizedFrictionMessage(f.sourceId, f.targetId, f.message, lang),
    }));
    const frictionPenalty = frictions.length * 4;
    const finalFitScore = Math.max(20, Math.min(98, avgScore - frictionPenalty));

    setRecommendation((prev) => ({
      ...prev,
      slots: newSlots,
      fitScore: finalFitScore,
      frictionWarnings: frictions,
    }));

    setCurrentView('canvas');
  };

  // Sustitución en caliente [Replace]
  const handleSelectAlternative = (category: TechCategory, newTechId: string) => {
    const updatedSlots = {
      ...recommendation.slots,
      [category]: newTechId,
    };

    // Recalcular Fit Score general
    const activeIds = Object.values(updatedSlots).filter((id): id is string => Boolean(id));
    const individualScores = activeIds.map((id) => calculateTechFit(TECH_BY_ID[id], spec, updatedSlots));
    const avgScore = Math.round(
      individualScores.reduce((acc, score) => acc + score, 0) / (individualScores.length || 1)
    );

    // Recalcular fricciones
    const rawFrictions = detectStackFrictions(activeIds);
    const frictions = rawFrictions.map((f) => ({
      ...f,
      message: getLocalizedFrictionMessage(f.sourceId, f.targetId, f.message, lang),
    }));
    const frictionPenalty = frictions.length * 4;
    const finalFitScore = Math.max(20, Math.min(98, avgScore - frictionPenalty));

    // Actualizar recomendación en caliente
    setRecommendation((prev) => ({
      ...prev,
      slots: updatedSlots,
      fitScore: finalFitScore,
      frictionWarnings: frictions,
    }));

    setReplacingCategory(null);
  };

  return (
    <div className="app-container" data-theme={theme}>
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        recommendation={recommendation}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenCostSim={() => setIsCostSimOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="main-content">
        {currentView === 'wizard' && (
          <SpecWizard initialSpec={spec} onSubmit={handleGenerateStack} />
        )}

        {currentView === 'canvas' && (
          <ArchitectureCanvas
            recommendation={recommendation}
            onReplaceCategory={(category) => setReplacingCategory(category)}
            onInspectTech={(tech) => setSelectedTechForDrawer(tech)}
            onOpenCostSim={() => setIsCostSimOpen(true)}
          />
        )}

        {currentView === 'compare' && (
          <StackComparator onLoadStack={handleLoadCustomSlots} />
        )}

        {currentView === 'explore' && (
          <StacksCatalog onLoadBlueprint={handleLoadCustomSlots} />
        )}
      </main>

      {/* Drawer de Trade-offs */}
      <TradeoffDrawer
        tech={selectedTechForDrawer}
        currentStack={recommendation.slots}
        onClose={() => setSelectedTechForDrawer(null)}
        onReplaceClick={(category) => setReplacingCategory(category as TechCategory)}
      />

      {/* Modal de Sustitución [Replace] */}
      {replacingCategory && (
        <ReplaceModal
          category={replacingCategory}
          currentStack={recommendation.slots}
          spec={spec}
          onClose={() => setReplacingCategory(null)}
          onSelectAlternative={handleSelectAlternative}
        />
      )}

      {/* Modal de Exportación */}
      {isExportOpen && (
        <ExportModal
          recommendation={recommendation}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Modal de Simulación de Costes & Egress */}
      {isCostSimOpen && (
        <CostSimulatorModal
          slots={recommendation.slots}
          onClose={() => setIsCostSimOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
