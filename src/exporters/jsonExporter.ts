import type { StackRecommendation } from '../engine/types';
import { TECH_BY_ID } from '../engine/catalog';

export interface StackForgeExportPayload {
  version: '1.0';
  generatedAt: string;
  projectName: string;
  fitScore: number;
  costEstimate: string;
  spec: StackRecommendation['spec'];
  stack: Record<string, {
    id: string;
    name: string;
    category: string;
    website: string;
    license: string;
    isManaged: boolean;
    isOpenSource: boolean;
  } | null>;
  frictionWarnings: StackRecommendation['frictionWarnings'];
  whyReasons: string[];
  keyTradeoffs: string[];
}

export function generateJsonExport(
  recommendation: StackRecommendation,
  projectName = 'My Stack'
): string {
  const stackData: StackForgeExportPayload['stack'] = {};

  for (const [category, techId] of Object.entries(recommendation.slots)) {
    if (techId && TECH_BY_ID[techId]) {
      const t = TECH_BY_ID[techId];
      stackData[category] = {
        id: t.id,
        name: t.name,
        category: t.category,
        website: t.website,
        license: t.license,
        isManaged: t.isManaged,
        isOpenSource: t.isOpenSource,
      };
    } else {
      stackData[category] = null;
    }
  }

  const payload: StackForgeExportPayload = {
    version: '1.0',
    generatedAt: new Date().toISOString(),
    projectName,
    fitScore: recommendation.fitScore,
    costEstimate: recommendation.overallCostEstimate,
    spec: recommendation.spec,
    stack: stackData,
    frictionWarnings: recommendation.frictionWarnings,
    whyReasons: recommendation.whyReasons,
    keyTradeoffs: recommendation.keyTradeoffs,
  };

  return JSON.stringify(payload, null, 2);
}
