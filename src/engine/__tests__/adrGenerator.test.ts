import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateAdrs, generateConsolidatedAdrDoc } from '../adrGenerator';
import { recommendStack } from '../recommender';
import type { UserProjectSpec } from '../types';

describe('TrussStack MADR 3.0 Architecture Decision Records Generator', () => {
  const sampleSpec: UserProjectSpec = {
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

  it('deberia generar la coleccion completa de ADRs en espanol', () => {
    const rec = recommendStack(sampleSpec, 'es');
    const adrs = generateAdrs(rec, 'es');

    assert.ok(adrs.length >= 5);
    assert.equal(adrs[0].id, 'ADR-001');
    assert.equal(adrs[0].status, 'Aceptado');
    assert.ok(adrs[0].rawMarkdown.includes('## Contexto y Definición del Problema'));
    assert.ok(adrs[0].rawMarkdown.includes('## Drivers de Decisión'));
    assert.ok(adrs[0].rawMarkdown.includes('## Decisión y Justificación'));
  });

  it('deberia generar ADRs 100% en ingles cuando lang es en', () => {
    const rec = recommendStack(sampleSpec, 'en');
    const adrs = generateAdrs(rec, 'en');

    assert.ok(adrs.length >= 5);
    assert.equal(adrs[0].status, 'Accepted');
    assert.ok(adrs[0].rawMarkdown.includes('## Context and Problem Statement'));
    assert.ok(adrs[0].rawMarkdown.includes('## Decision Drivers'));
    assert.ok(adrs[0].rawMarkdown.includes('## Decision Outcome'));
  });

  it('deberia consolidar todos los ADRs con un indice tabular markdown valido', () => {
    const rec = recommendStack(sampleSpec, 'es');
    const adrs = generateAdrs(rec, 'es');
    const consolidated = generateConsolidatedAdrDoc(adrs, 'es');

    assert.ok(consolidated.includes('# REGISTRO CONSOLIDADO DE DECISIONES DE ARQUITECTURA (MADR)'));
    assert.ok(consolidated.includes('| **ADR-001** |'));
    assert.ok(consolidated.includes('| **ADR-002** |'));
    assert.ok(consolidated.includes('## Contexto y Definición del Problema'));
  });
});
