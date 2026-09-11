import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { TECHNOLOGIES, TECH_BY_ID } from '../catalog';
import { getLocalizedTech } from '../catalogI18n';

describe('TrussStack Phase 4: Extended Catalog, Benchmarks & Self-Hosting Profiles', () => {
  it('deberia contener tecnologias en las nuevas categorias ai, queues y mobile', () => {
    const aiTechs = TECHNOLOGIES.filter((t) => t.category === 'ai');
    const queueTechs = TECHNOLOGIES.filter((t) => t.category === 'queues');
    const mobileTechs = TECHNOLOGIES.filter((t) => t.category === 'mobile');

    assert.ok(aiTechs.length >= 5, 'Debe haber al menos 5 tecnologias de AI');
    assert.ok(queueTechs.length >= 4, 'Debe haber al menos 4 tecnologias de Queues');
    assert.ok(mobileTechs.length >= 4, 'Debe haber al menos 4 tecnologias Mobile/Desktop');
  });

  it('deberia tener telemetria de benchmarks numericos en las tecnologias clave', () => {
    const nextjs = TECH_BY_ID['nextjs'];
    const astro = TECH_BY_ID['astro'];
    const turso = TECH_BY_ID['turso'];
    const qdrant = TECH_BY_ID['qdrant'];

    assert.ok(nextjs.benchmarks);
    assert.ok(typeof nextjs.benchmarks.coldStartMs === 'number');
    assert.ok(typeof nextjs.benchmarks.bundleSizeKb === 'number');

    assert.ok(astro.benchmarks);
    assert.ok(astro.benchmarks.bundleSizeKb !== undefined && astro.benchmarks.bundleSizeKb < nextjs.benchmarks.bundleSizeKb);

    assert.ok(turso.benchmarks);
    assert.ok(turso.benchmarks.connectionLatencyMs !== undefined && turso.benchmarks.connectionLatencyMs < 5);

    assert.ok(qdrant.benchmarks);
    assert.equal(qdrant.benchmarks.coldStartMs, 0);
  });

  it('deberia tener perfiles de self-hosting con imagenes Docker y horas de mantenimiento estimadas', () => {
    const qdrant = TECH_BY_ID['qdrant'];
    const redis = TECH_BY_ID['redis'];
    const supabaseDb = TECH_BY_ID['supabase-db'];

    assert.ok(qdrant.selfHostProfile);
    assert.equal(qdrant.selfHostProfile.canSelfHost, true);
    assert.ok(qdrant.selfHostProfile.dockerImage?.includes('qdrant'));
    assert.ok((qdrant.selfHostProfile.maintenanceHoursPerMonth || 0) > 0);

    assert.ok(redis.selfHostProfile);
    assert.ok(redis.selfHostProfile.dockerImage?.includes('redis'));

    assert.ok(supabaseDb.selfHostProfile);
    assert.ok(supabaseDb.selfHostProfile.dockerImage?.includes('postgres'));
  });

  it('deberia traducir correctamente las nuevas tecnologias al ingles', () => {
    const rawQdrant = TECH_BY_ID['qdrant'];
    const localized = getLocalizedTech(rawQdrant, 'en');

    assert.ok(localized.tagline.includes('Open-source Rust vector search'));
    assert.ok(localized.description.includes('Rust'));
    assert.ok(localized.tradeoffs.pros[0].includes('Apache-2.0'));
  });
});
