import assert from 'node:assert';
import { recommendStack, getReplacementAlternatives, detectStackFrictions } from '../recommender';
import { TECH_BY_ID } from '../catalog';
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

console.log('\n[DONE] Todas las pruebas del motor determinista pasaron exitosamente.');
