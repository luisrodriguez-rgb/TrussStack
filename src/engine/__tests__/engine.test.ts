import assert from 'node:assert';
import { recommendStack, getReplacementAlternatives, detectStackFrictions } from '../recommender';
import type { UserProjectSpec } from '../types';

console.log('[TEST] Ejecutando Suite de Pruebas Deterministas de TONIC...\n');

// Test Case 1: SaaS MVP con presupuesto $0 y solo developer
const saasSpec: UserProjectSpec = {
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

const saasRecommendation = recommendStack(saasSpec);

assert.strictEqual(saasRecommendation.slots.frontend, 'nextjs', 'Frontend recomendado para SaaS debe ser Next.js');
assert.strictEqual(saasRecommendation.slots.database, 'supabase-db', 'Database recomendada para SaaS $0 debe ser Supabase');
assert.strictEqual(saasRecommendation.slots.auth, 'supabase-auth', 'Auth recomendado debe alinearse con Supabase');
assert.ok(saasRecommendation.fitScore >= 85, `Fit Score debe ser >= 85%, obtenido: ${saasRecommendation.fitScore}%`);
assert.ok(saasRecommendation.whyReasons.length > 0, 'Debe generar explicaciones deterministas del porqué');
console.log('[OK] Test 1 Superado: SaaS MVP $0 recomienda Next.js + Supabase con Fit Score', saasRecommendation.fitScore, '%');

// Test Case 2: Sitio de contenido / Blog con SEO crítico
const blogSpec: UserProjectSpec = {
  projectType: 'content_blog',
  scale: 'early_1k',
  teamSize: 'solo',
  seniority: 'beginner',
  budget: 'zero_free',
  constraints: {
    needsAuth: false,
    needsPayments: false,
    needsStorage: false,
    needsSeo: true,
    needsRealtime: false,
    needsBackgroundJobs: false,
  },
  priorities: {
    developmentSpeed: 4,
    costMinimization: 5,
    scalability: 4,
    lowVendorLockin: 3,
    operationalSimplicity: 5,
  },
};

const blogRecommendation = recommendStack(blogSpec);
assert.strictEqual(blogRecommendation.slots.frontend, 'astro', 'Para sitio de contenido SEO debe recomendar Astro');
assert.strictEqual(blogRecommendation.slots.hosting, 'cloudflare-pages', 'Hosting para Astro en free tier debe ser Cloudflare Pages');
console.log('[OK] Test 2 Superado: Blog de contenido con SEO crítico recomienda Astro + Cloudflare Pages');

// Test Case 3: Detección de fricciones arquitectónicas
const frictions = detectStackFrictions(['astro', 'authjs']);
assert.ok(frictions.length > 0, 'Debe detectar fricción arquitectónica entre Astro y Auth.js');
assert.strictEqual(frictions[0].level, 'high');
console.log('[OK] Test 3 Superado: Fricción detectada correctamente entre Astro y Auth.js ->', frictions[0].message);

// Test Case 4: Sustitución en caliente [Replace]
const alternatives = getReplacementAlternatives('database', saasRecommendation.slots, saasSpec);
assert.ok(alternatives.length > 0, 'Debe ofrecer alternativas de sustitución para Database');

const neonAlt = alternatives.find((a) => a.tech.id === 'neon');
assert.ok(neonAlt, 'Neon debe ser una alternativa disponible');
assert.ok(neonAlt!.gains.length > 0, 'Debe calcular qué se gana al cambiar a Neon');
assert.ok(neonAlt!.losses.length > 0, 'Debe calcular qué se pierde al cambiar a Neon');
// Test Case 5: Modo bilingüe en inglés genera razones, costes y alternativas en inglés
const enRecommendation = recommendStack(saasSpec, 'en');
assert.strictEqual(enRecommendation.overallCostEstimate, '$0/mo (100% Free Tier)');
assert.ok(enRecommendation.whyReasons.some((r) => r.includes('developer') || r.includes('Supabase')));
const enAlts = getReplacementAlternatives('database', saasRecommendation.slots, saasSpec, 'en');
assert.ok(enAlts[0].tech.description.length > 0);
assert.ok(enAlts[0].gains.length > 0);
console.log('[OK] Test 5 Superado: Modo bilingüe en inglés genera recomendaciones y alternativas 100% en inglés');

// Test Case 6: AI Agent Pipeline
const aiSpec: UserProjectSpec = {
  projectType: 'ai_agent',
  scale: 'early_1k',
  teamSize: 'small_team',
  seniority: 'senior',
  budget: 'growth_flexible',
  constraints: {
    needsAuth: true,
    needsPayments: false,
    needsStorage: true,
    needsSeo: false,
    needsRealtime: true,
    needsBackgroundJobs: true,
  },
  priorities: {
    developmentSpeed: 4,
    costMinimization: 2,
    scalability: 5,
    lowVendorLockin: 4,
    operationalSimplicity: 3,
  },
};

const aiRecommendation = recommendStack(aiSpec);
assert.ok(aiRecommendation.slots.ai !== null, 'Agente de IA debe incluir slot de motor vectorial / IA');
assert.strictEqual(aiRecommendation.slots.backend, 'fastapi', 'Backend para AI Agent debe ser FastAPI');
assert.ok(aiRecommendation.slots.queues !== null, 'Agente de IA debe incluir colas asíncronas de workers');
console.log('[OK] Test 6 Superado: AI Agent Pipeline recomienda FastAPI + AI/Vector (' + aiRecommendation.slots.ai + ') + Queues (' + aiRecommendation.slots.queues + ')');

// Test Case 7: Mobile App Multiplataforma
const mobileSpec: UserProjectSpec = {
  projectType: 'mobile_app',
  scale: 'mvp_100',
  teamSize: 'solo',
  seniority: 'intermediate',
  budget: 'zero_free',
  constraints: {
    needsAuth: true,
    needsPayments: true,
    needsStorage: true,
    needsSeo: false,
    needsRealtime: false,
    needsBackgroundJobs: false,
  },
  priorities: {
    developmentSpeed: 5,
    costMinimization: 4,
    scalability: 3,
    lowVendorLockin: 3,
    operationalSimplicity: 4,
  },
};

const mobileRecommendation = recommendStack(mobileSpec);
assert.strictEqual(mobileRecommendation.slots.mobile, 'react-native-expo', 'App móvil debe recomendar React Native Expo');
assert.ok(mobileRecommendation.slots.auth !== null, 'App móvil debe incluir capa de autenticación');
console.log('[OK] Test 7 Superado: Mobile App recomienda React Native Expo + ' + mobileRecommendation.slots.auth);

// Test Case 8: Data Pipeline & Streaming OLAP
const dataSpec: UserProjectSpec = {
  projectType: 'data_pipeline',
  scale: 'scale_100k',
  teamSize: 'scale_team',
  seniority: 'senior',
  budget: 'growth_flexible',
  constraints: {
    needsAuth: false,
    needsPayments: false,
    needsStorage: true,
    needsSeo: false,
    needsRealtime: true,
    needsBackgroundJobs: true,
  },
  priorities: {
    developmentSpeed: 2,
    costMinimization: 2,
    scalability: 5,
    lowVendorLockin: 5,
    operationalSimplicity: 2,
  },
};

const dataRecommendation = recommendStack(dataSpec);
assert.strictEqual(dataRecommendation.slots.database, 'clickhouse', 'Pipeline de datos debe recomendar ClickHouse como motor analítico');
assert.strictEqual(dataRecommendation.slots.queues, 'kafka', 'Pipeline de datos de alta escala debe recomendar Kafka');
console.log('[OK] Test 8 Superado: Data Pipeline recomienda ClickHouse + Kafka');

// Test Case 9: Marketplace Bifronte
const marketplaceSpec: UserProjectSpec = {
  projectType: 'marketplace',
  scale: 'early_1k',
  teamSize: 'small_team',
  seniority: 'intermediate',
  budget: 'low_50',
  constraints: {
    needsAuth: true,
    needsPayments: true,
    needsStorage: true,
    needsSeo: true,
    needsRealtime: false,
    needsBackgroundJobs: true,
  },
  priorities: {
    developmentSpeed: 4,
    costMinimization: 3,
    scalability: 4,
    lowVendorLockin: 3,
    operationalSimplicity: 4,
  },
};

const marketplaceRecommendation = recommendStack(marketplaceSpec);
assert.strictEqual(marketplaceRecommendation.slots.frontend, 'nextjs', 'Marketplace debe utilizar Next.js para SEO y SSR');
assert.strictEqual(marketplaceRecommendation.slots.payments, 'stripe', 'Marketplace debe utilizar Stripe Connect');
console.log('[OK] Test 9 Superado: Marketplace recomienda Next.js + Stripe + ' + marketplaceRecommendation.slots.database);

console.log('\n[DONE] Todas las pruebas del motor determinista extendido pasaron exitosamente.');
