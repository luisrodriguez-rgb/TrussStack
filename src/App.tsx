import React, { Suspense, useEffect, useRef, useState } from 'react';
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
import { Footer } from './components/layout/Footer';
import { LandingHero } from './components/home/LandingHero';
import { SpecWizard } from './components/wizard/SpecWizard';
import { ArchitectureCanvas } from './components/canvas/ArchitectureCanvas';
import { TradeoffDrawer } from './components/canvas/TradeoffDrawer';
import { ReplaceModal } from './components/canvas/ReplaceModal';
import { useI18n } from './i18n/I18nContext';
import {
  copyShareableUrlToClipboard,
  decodeBlueprint,
  encodeBlueprint,
} from './utils/urlState';

// Vistas secundarias y modales con code-splitting (Dynamic Imports)
const StackComparator = React.lazy(() =>
  import('./components/compare/StackComparator').then((m) => ({ default: m.StackComparator }))
);
const StacksCatalog = React.lazy(() =>
  import('./components/explore/StacksCatalog').then((m) => ({ default: m.StacksCatalog }))
);
const BenchmarkMatrix = React.lazy(() =>
  import('./components/benchmarks/BenchmarkMatrix').then((m) => ({ default: m.BenchmarkMatrix }))
);
const ExportModal = React.lazy(() =>
  import('./components/export/ExportModal').then((m) => ({ default: m.ExportModal }))
);
const CostSimulatorModal = React.lazy(() =>
  import('./components/cost/CostSimulatorModal').then((m) => ({ default: m.CostSimulatorModal }))
);
const DriftAuditModal = React.lazy(() =>
  import('./components/linter/DriftAuditModal').then((m) => ({ default: m.DriftAuditModal }))
);

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

  // Detección inicial de blueprint en URL hash (#blueprint=...)
  const [initialBlueprint] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return decodeBlueprint(window.location.hash);
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<AppView>(() =>
    initialBlueprint ? 'canvas' : 'home'
  );
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [spec, setSpec] = useState<UserProjectSpec>(() => initialBlueprint?.spec || defaultSpec);
  const [recommendation, setRecommendation] = useState<StackRecommendation>(() => {
    const base = recommendStack(initialBlueprint?.spec || defaultSpec, 'es');
    if (initialBlueprint?.slots) {
      return {
        ...base,
        slots: { ...base.slots, ...initialBlueprint.slots },
      };
    }
    return base;
  });
  const [isShareCopied, setIsShareCopied] = useState<boolean>(false);
  const [isDriftModalOpen, setIsDriftModalOpen] = useState<boolean>(false);

  // Sincronización continua en segundo plano con el URL hash cuando estamos en canvas
  useEffect(() => {
    if (typeof window !== 'undefined' && window.history && window.history.replaceState) {
      if (currentView === 'canvas') {
        const token = encodeBlueprint(spec, recommendation.slots);
        window.history.replaceState(null, '', `#blueprint=${token}`);
      } else if (currentView === 'home' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [spec, recommendation.slots, currentView]);

  // Sincronizar tema con el atributo del DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Restaurar posicion de scroll al inicio al cambiar entre vistas
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentView]);

  // Sincronizar textos deterministas de la recomendación al cambiar de idioma
  const prevLangRef = useRef(lang);
  useEffect(() => {
    if (prevLangRef.current !== lang) {
      prevLangRef.current = lang;
      setRecommendation((prev) => {
        const refreshed = recommendStack(spec, lang);
        return {
          ...refreshed,
          slots: prev.slots, // Mantener las selecciones y sustituciones activas del usuario
        };
      });
    }
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

  // Cargar slots personalizados desde la galería de blueprints o arquetipos
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

  // Reemplazo en caliente de un componente en una categoría
  const handleSelectAlternative = (category: TechCategory, newTechId: string | null) => {
    const updatedSlots = {
      ...recommendation.slots,
      [category]: newTechId,
    };

    const activeIds = Object.values(updatedSlots).filter((id): id is string => Boolean(id));
    const individualScores = activeIds.map((id) => calculateTechFit(TECH_BY_ID[id], spec, updatedSlots));
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
      slots: updatedSlots,
      fitScore: finalFitScore,
      frictionWarnings: frictions,
    }));

    setReplacingCategory(null);
  };

  // Copiar URL compartible
  const handleShareBlueprint = async () => {
    const success = await copyShareableUrlToClipboard(spec, recommendation.slots);
    if (success) {
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 2500);
    }
  };

  const lazyFallback = (
    <div className="lazy-fallback-spinner">
      <span>[ CARGANDO MODULO // PLEASE WAIT... ]</span>
    </div>
  );

  return (
    <div className="app-container" data-theme={theme}>
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="main-content">
        {currentView === 'home' && (
          <LandingHero
            onStartWizard={() => setCurrentView('wizard')}
            onExploreStacks={() => setCurrentView('explore')}
            onOpenBenchmarks={() => setCurrentView('benchmarks')}
            onLoadBlueprint={(slots) => {
              handleLoadCustomSlots(slots);
              setCurrentView('canvas');
            }}
          />
        )}

        {currentView === 'wizard' && (
          <SpecWizard initialSpec={spec} onSubmit={handleGenerateStack} />
        )}

        {currentView === 'canvas' && (
          <ArchitectureCanvas
            recommendation={recommendation}
            onReplaceCategory={(category) => setReplacingCategory(category)}
            onInspectTech={(tech) => setSelectedTechForDrawer(tech)}
            onOpenCostSim={() => setIsCostSimOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            onShareBlueprint={handleShareBlueprint}
            isShareCopied={isShareCopied}
            onOpenDriftAudit={() => setIsDriftModalOpen(true)}
          />
        )}

        <Suspense fallback={lazyFallback}>
          {currentView === 'compare' && (
            <StackComparator onLoadStack={handleLoadCustomSlots} />
          )}

          {currentView === 'explore' && (
            <StacksCatalog onLoadBlueprint={handleLoadCustomSlots} />
          )}

          {currentView === 'benchmarks' && (
            <BenchmarkMatrix onInspectTech={(tech) => setSelectedTechForDrawer(tech)} />
          )}
        </Suspense>
      </main>

      {/* Footer del Workbench con Autoria de Luis Rodriguez */}
      <Footer onViewChange={setCurrentView} />

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

      {/* Modales con carga bajo demanda */}
      <Suspense fallback={null}>
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

        {/* Modal de Auditoría de Drift */}
        {isDriftModalOpen && (
          <DriftAuditModal
            recommendation={recommendation}
            onClose={() => setIsDriftModalOpen(false)}
          />
        )}
      </Suspense>
    </div>
  );
};

export default App;
