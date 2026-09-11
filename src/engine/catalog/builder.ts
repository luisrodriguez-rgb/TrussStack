import type {
  CostTier,
  LicenseType,
  TechCategory,
  Technology,
  TechMetrics,
  TechIntegration,
} from '../types';

export interface TechDefinition {
  id: string;
  name: string;
  category: TechCategory;
  tagline: string;
  description: string;
  website: string;
  license?: LicenseType;
  isManaged?: boolean;
  isOpenSource?: boolean;
  badgeText?: string;
  integrations?: Record<string, TechIntegration>;
  metrics?: Partial<TechMetrics>;
  cost?: {
    initialCost?: CostTier;
    operationalCost?: CostTier;
    scalingRisk?: 'low' | 'medium' | 'high';
    hasFreeTier?: boolean;
    limitsDescription?: string;
  };
  tradeoffs?: {
    pros?: string[];
    cons?: string[];
    sacrifices?: string[];
    idealFor?: string[];
    avoidIf?: string[];
  };
}

export function defineTech(def: TechDefinition): Technology {
  const defaultMetrics: TechMetrics = {
    dx: 4,
    learningCurve: 3,
    scalability: 4,
    ecosystem: 4,
    community: 4,
    maturity: 4,
    operationalComplexity: 2,
    vendorLockin: 2,
    ...def.metrics,
  };

  const initialCost = def.cost?.initialCost || 'free';
  const operationalCost = def.cost?.operationalCost || 'low';
  const scalingRisk = def.cost?.scalingRisk || 'medium';
  const hasFreeTier = def.cost?.hasFreeTier ?? true;
  const limitsDescription = def.cost?.limitsDescription || 'Generous tier available for development & MVP scale.';

  return {
    id: def.id,
    name: def.name,
    category: def.category,
    tagline: def.tagline,
    description: def.description,
    website: def.website,
    badgeText: def.badgeText,
    license: def.license || 'MIT',
    isManaged: def.isManaged ?? false,
    isOpenSource: def.isOpenSource ?? true,
    metrics: defaultMetrics,
    costProfile: {
      initialCost,
      operationalCost,
      scalingRisk,
      freeTier: {
        hasFreeTier,
        limitsDescription,
      },
    },
    integrations: def.integrations || {},
    tradeoffs: {
      pros: def.tradeoffs?.pros || ['Alta productividad y madurez en el ecosistema.'],
      cons: def.tradeoffs?.cons || ['Requiere consideraciones de configuracion en escala.'],
      sacrifices: def.tradeoffs?.sacrifices || ['Sacrificas flexibilidad extrema de bajo nivel.'],
      idealFor: def.tradeoffs?.idealFor || ['SaaS moderno', 'APIs de alta velocidad'],
      avoidIf: def.tradeoffs?.avoidIf || ['Casos de uso legacy sin soporte de tooling moderno'],
    },
  };
}
