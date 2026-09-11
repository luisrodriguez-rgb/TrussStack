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
import { Header } from './components/layout/Header';
import { SpecWizard } from './components/wizard/SpecWizard';
import { ArchitectureCanvas } from './components/canvas/ArchitectureCanvas';
import { TradeoffDrawer } from './components/canvas/TradeoffDrawer';
import { ReplaceModal } from './components/canvas/ReplaceModal';
import { ExportModal } from './components/export/ExportModal';
import { CostSimulatorModal } from './components/cost/CostSimulatorModal';

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
  const [currentView, setCurrentView] = useState<'wizard' | 'canvas'>('canvas');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [spec, setSpec] = useState<UserProjectSpec>(defaultSpec);
  const [recommendation, setRecommendation] = useState<StackRecommendation>(() =>
    recommendStack(defaultSpec)
  );

  // Sincronizar tema con el atributo del DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

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
    const newRecommendation = recommendStack(newSpec);
    setRecommendation(newRecommendation);
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
    const frictions = detectStackFrictions(activeIds);
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
        {currentView === 'wizard' ? (
          <SpecWizard initialSpec={spec} onSubmit={handleGenerateStack} />
        ) : (
          <ArchitectureCanvas
            recommendation={recommendation}
            onReplaceCategory={(category) => setReplacingCategory(category)}
            onInspectTech={(tech) => setSelectedTechForDrawer(tech)}
            onOpenCostSim={() => setIsCostSimOpen(true)}
          />
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

      {/* Modal de Simulación de Costes & Egress (Fase 2 Roadmap) */}
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
