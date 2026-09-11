export type TechCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'auth'
  | 'storage'
  | 'hosting'
  | 'payments'
  | 'email'
  | 'monitoring'
  | 'cicd'
  | 'ai'
  | 'queues'
  | 'mobile';

export interface TechBenchmarks {
  coldStartMs?: number;         // Tiempos de arranque en frío en ms (Edge <5ms, Node ~150ms, Python ~600ms)
  bundleSizeKb?: number;        // Tamaño de bundle JS inicial en KB transferidos (Astro 0-12KB, Vite 42KB, Next 84KB)
  connectionLatencyMs?: number; // Latencia p95 de conexión a BD / API en ms (Local 0.8ms, WS 12ms, HTTP fetch 45ms)
  p95LatencyMs?: number;        // Alias común para latencia p95
  throughputRps?: number;       // Throughput promedio estimado por nodo / worker (req/s)
}

export interface SelfHostProfile {
  canSelfHost: boolean;
  dockerImage?: string;
  dockerCommand?: string;
  minRamMb?: number;
  minCpuCores?: number;
  maintenanceHoursPerMonth?: number;
  monthlyManagedCost?: string;
  monthlySelfHostedCost?: string;
  operationalBurden: 1 | 2 | 3 | 4 | 5; // 1=trivial, 5=alta complejidad operativa
  costComparison?: {
    cloudManagedUsd: number;
    selfHostedVpsUsd: number;
    breakEvenPoint: string;
  };
  gotchasEs: string[];
  gotchasEn: string[];
}

export type LicenseType =
  | 'MIT'
  | 'Apache-2.0'
  | 'BSL'
  | 'Proprietary'
  | 'AGPL-3.0'
  | 'BSD-3-Clause'
  | 'SSPL'
  | 'RSALv2'
  | 'ISC'
  | 'PostgreSQL'
  | 'MPL-2.0';

export type CostTier = 'free' | 'low' | 'medium' | 'high';

export type IntegrationRelation = 'natural' | 'compatible' | 'friction' | 'incompatible';

export type FrictionLevel = 'none' | 'low' | 'medium' | 'high';

export interface TechMetrics {
  dx: number;                   // 1-5: Developer Experience, ergonomía, tipado, tooling
  learningCurve: number;        // 1-5: Curva de aprendizaje (1=muy accesible, 5=muy empinada)
  scalability: number;          // 1-5: Techo de escalabilidad y rendimiento
  ecosystem: number;            // 1-5: Librerías, SDKs, plugins, paquetes de terceros
  community: number;            // 1-5: Actividad de la comunidad, stack overflow, soporte
  maturity: number;             // 1-5: Años en producción / battle-tested (5=estándar probado, 2=novedoso)
  operationalComplexity: number;// 1-5: Esfuerzo de mantenimiento, ops, infra y upgrades
  vendorLockin: number;         // 1-5: Dificultad para migrar o desacoplarse (1=portabilidad total)
}

export interface TechCostProfile {
  initialCost: CostTier;
  operationalCost: CostTier;
  scalingRisk: 'low' | 'medium' | 'high';
  freeTier: {
    hasFreeTier: boolean;
    limitsDescription: string;
  };
}

export interface TechTradeoffs {
  pros: string[];
  cons: string[];
  sacrifices: string[]; // Lo que estás sacrificando explícitamente al elegir esta herramienta
  idealFor: string[];
  avoidIf: string[];
}

export interface TechIntegration {
  targetId: string;
  relation: IntegrationRelation;
  frictionLevel: FrictionLevel;
  explanation: string;
  fitDelta: number; // Modificador numérico de afinidad (+5, -15, etc.)
}

export interface Technology {
  id: string;
  name: string;
  category: TechCategory;
  tagline: string;
  description: string;
  website: string;
  badgeText?: string;
  license: LicenseType;
  isManaged: boolean;
  isOpenSource: boolean;
  metrics: TechMetrics;
  costProfile: TechCostProfile;
  tradeoffs: TechTradeoffs;
  integrations: Record<string, TechIntegration>;
  stars?: number;
  benchmarks?: TechBenchmarks;
  selfHostProfile?: SelfHostProfile;
}

export type ProjectType =
  | 'saas'
  | 'ecommerce'
  | 'dashboard'
  | 'api_backend'
  | 'content_blog'
  | 'realtime_app';

export type ProjectScale =
  | 'mvp_100'         // 1 - 100 usuarios
  | 'early_1k'        // 100 - 1.000 usuarios
  | 'mid_10k'         // 1.000 - 10.000 usuarios
  | 'scale_100k';     // 10.000+ usuarios

export type TeamSize = 'solo' | 'small_team' | 'scale_team';

export type SeniorityLevel = 'beginner' | 'intermediate' | 'senior';

export type BudgetTier = 'zero_free' | 'low_50' | 'growth_flexible';

export interface ProjectConstraints {
  needsAuth: boolean;
  needsPayments: boolean;
  needsStorage: boolean;
  needsSeo: boolean;
  needsRealtime: boolean;
  needsBackgroundJobs: boolean;
}

export interface PriorityWeights {
  developmentSpeed: number;     // 1-5: DX y velocidad para lanzar
  costMinimization: number;     // 1-5: Prioridad en coste cero o mínimo
  scalability: number;          // 1-5: Preparado para alta concurrencia
  lowVendorLockin: number;      // 1-5: Código abierto y fácil portabilidad
  operationalSimplicity: number;// 1-5: Cero gestión de infra/servidores
}

export interface UserProjectSpec {
  projectType: ProjectType;
  scale: ProjectScale;
  teamSize: TeamSize;
  seniority: SeniorityLevel;
  budget: BudgetTier;
  constraints: ProjectConstraints;
  priorities: PriorityWeights;
}

export interface ArchitecturalFriction {
  sourceId: string;
  targetId: string;
  sourceName: string;
  targetName: string;
  level: FrictionLevel;
  message: string;
}

export interface StackSlot {
  category: TechCategory;
  label: string;
  selectedTechId: string | null;
  isRequired: boolean;
}

export interface StackRecommendation {
  spec: UserProjectSpec;
  slots: Record<TechCategory, string | null>;
  fitScore: number;               // 0 - 100 %
  overallCostEstimate: string;    // Ej. "$0/mes (Free Tier)"
  frictionWarnings: ArchitecturalFriction[];
  dimensionScores: {
    speed: number;
    cost: number;
    scalability: number;
    portability: number;
    simplicity: number;
  };
  whyReasons: string[];
  keyTradeoffs: string[];
}

export interface ReplacementAlternative {
  tech: Technology;
  fitScoreDelta: number;
  resultingFitScore: number;
  gains: string[];
  losses: string[];
  frictionAlerts: ArchitecturalFriction[];
}
