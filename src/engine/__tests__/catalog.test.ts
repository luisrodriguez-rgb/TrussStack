import assert from 'node:assert';
import { TECH_CATALOG, TECH_BY_ID } from '../catalog';
import type { TechCategory } from '../types';

console.log('[TEST] Ejecutando Suite de Pruebas del Catalogo Extendido (>150 Tecnologias)...\n');

// 1. Verificacion de tamano minimo del catalogo
assert.ok(
  TECH_CATALOG.length >= 150,
  `El catalogo debe contener al menos 150 tecnologias. Encontradas: ${TECH_CATALOG.length}`
);
console.log(`[OK] Verificacion de volumen superada: ${TECH_CATALOG.length} tecnologias registradas (requerido >= 150).`);

// 2. Verificacion de unicidad de identificadores (IDs)
const idSet = new Set<string>();
const duplicateIds: string[] = [];

for (const tech of TECH_CATALOG) {
  if (idSet.has(tech.id)) {
    duplicateIds.push(tech.id);
  }
  idSet.add(tech.id);
}

assert.strictEqual(
  duplicateIds.length,
  0,
  `Se encontraron IDs duplicados en el catalogo: ${duplicateIds.join(', ')}`
);
console.log('[OK] Verificacion de unicidad superada: 0 identificadores duplicados.');

// 3. Verificacion de cobertura de las 13 categorias tecnicas
const EXPECTED_CATEGORIES: TechCategory[] = [
  'frontend',
  'backend',
  'database',
  'auth',
  'storage',
  'hosting',
  'payments',
  'email',
  'monitoring',
  'cicd',
  'ai',
  'queues',
  'mobile',
];

const categoryCounts: Record<string, number> = {};
for (const cat of EXPECTED_CATEGORIES) {
  categoryCounts[cat] = 0;
}

for (const tech of TECH_CATALOG) {
  assert.ok(
    EXPECTED_CATEGORIES.includes(tech.category),
    `La tecnologia ${tech.id} tiene una categoria invalida: ${tech.category}`
  );
  categoryCounts[tech.category] = (categoryCounts[tech.category] || 0) + 1;
}

for (const cat of EXPECTED_CATEGORIES) {
  const count = categoryCounts[cat];
  assert.ok(
    count >= 5,
    `La categoria ${cat} tiene menos de 5 tecnologias (${count})`
  );
}
console.log('[OK] Verificacion de categorias superada:');
for (const [cat, count] of Object.entries(categoryCounts)) {
  console.log(`     - ${cat.padEnd(12)}: ${count} tecnologias`);
}

// 4. Verificacion de integridad estructural de campos obligatorios
for (const tech of TECH_CATALOG) {
  assert.ok(tech.id.length > 0, `ID vacio en tecnologia`);
  assert.ok(tech.name.length > 0, `Nombre vacio en ${tech.id}`);
  assert.ok(tech.tagline.length > 0, `Tagline vacio en ${tech.id}`);
  assert.ok(tech.description.length > 0, `Descripcion vacia en ${tech.id}`);
  assert.ok(tech.website.startsWith('http'), `URL de website invalida en ${tech.id}: ${tech.website}`);

  // Metricas (1 a 5)
  const m = tech.metrics;
  const metricKeys = ['dx', 'learningCurve', 'scalability', 'ecosystem', 'community', 'maturity', 'operationalComplexity', 'vendorLockin'] as const;
  for (const k of metricKeys) {
    assert.ok(m[k] >= 1 && m[k] <= 5, `Metrica ${k} fuera de rango (1-5) en ${tech.id}: ${m[k]}`);
  }

  // Cost Profile
  assert.ok(tech.costProfile, `Falta costProfile en ${tech.id}`);
  assert.ok(tech.costProfile.freeTier, `Falta freeTier en ${tech.id}`);

  // Tradeoffs
  assert.ok(tech.tradeoffs, `Faltan tradeoffs en ${tech.id}`);
  assert.ok(Array.isArray(tech.tradeoffs.pros) && tech.tradeoffs.pros.length > 0, `Faltan pros en ${tech.id}`);
  assert.ok(Array.isArray(tech.tradeoffs.cons) && tech.tradeoffs.cons.length > 0, `Faltan cons en ${tech.id}`);
  assert.ok(Array.isArray(tech.tradeoffs.sacrifices) && tech.tradeoffs.sacrifices.length > 0, `Faltan sacrifices en ${tech.id}`);
  assert.ok(Array.isArray(tech.tradeoffs.idealFor) && tech.tradeoffs.idealFor.length > 0, `Faltan idealFor en ${tech.id}`);
  assert.ok(Array.isArray(tech.tradeoffs.avoidIf) && tech.tradeoffs.avoidIf.length > 0, `Faltan avoidIf en ${tech.id}`);

  // Mapeo en TECH_BY_ID
  assert.strictEqual(TECH_BY_ID[tech.id], tech, `TECH_BY_ID desincronizado para ${tech.id}`);
}
console.log('[OK] Integridad estructural de atributos, metricas y tradeoffs validada al 100%.\n');
console.log('--- TODAS LAS PRUEBAS DEL CATALOGO EXTENDIDO SUPERADAS CON EXITO ---');
