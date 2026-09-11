import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { encodeBlueprint, decodeBlueprint } from '../../utils/urlState';
import type { TechCategory, UserProjectSpec } from '../types';

describe('TrussStack URL State Serialization', () => {
  const sampleSpec: UserProjectSpec = {
    projectType: 'saas',
    scale: 'scale_10k',
    teamSize: 'small_2_5',
    seniority: 'senior',
    budget: 'growth_flexible',
    constraints: {
      needsAuth: true,
      needsPayments: true,
      needsStorage: true,
      needsSeo: true,
      needsRealtime: true,
      needsBackgroundJobs: true,
    },
    priorities: {
      developmentSpeed: 4,
      costMinimization: 3,
      scalability: 5,
      lowVendorLockin: 4,
      operationalSimplicity: 3,
    },
  };

  const sampleSlots: Record<TechCategory, string | null> = {
    frontend: 'astro',
    backend: 'fastapi',
    database: 'turso',
    auth: 'better-auth',
    storage: 'cloudflare-r2',
    hosting: 'cloudflare-pages',
    payments: 'stripe',
    email: 'resend',
    monitoring: 'betterstack',
    cicd: 'github-actions',
    ai: null,
    queues: null,
    mobile: null,
  };

  it('deberia codificar y decodificar una spec y slots exactamente', () => {
    const encoded = encodeBlueprint(sampleSpec, sampleSlots);
    assert.ok(typeof encoded === 'string' && encoded.length > 20);

    const decoded = decodeBlueprint(encoded);
    assert.ok(decoded !== null);
    assert.deepEqual(decoded.spec, sampleSpec);
    assert.equal(decoded.slots.frontend, 'astro');
    assert.equal(decoded.slots.backend, 'fastapi');
    assert.equal(decoded.slots.database, 'turso');
    assert.equal(decoded.slots.storage, 'cloudflare-r2');
  });

  it('deberia decodificar tokens con prefijo #blueprint= o blueprint=', () => {
    const encoded = encodeBlueprint(sampleSpec, sampleSlots);
    const decodedWithHash = decodeBlueprint(`#blueprint=${encoded}`);
    assert.ok(decodedWithHash !== null);
    assert.equal(decodedWithHash.slots.frontend, 'astro');

    const decodedWithParam = decodeBlueprint(`blueprint=${encoded}`);
    assert.ok(decodedWithParam !== null);
    assert.equal(decodedWithParam.slots.frontend, 'astro');
  });

  it('deberia retornar null ante un hash corrupto o vacio', () => {
    assert.equal(decodeBlueprint(''), null);
    assert.equal(decodeBlueprint('#blueprint='), null);
    assert.equal(decodeBlueprint('hash_totalmente_invalido!@#$'), null);
  });

  it('deberia filtrar slots que contengan IDs inexistentes en el catalogo', () => {
    const forgedSpec = { ...sampleSpec };
    const forgedSlots: Record<TechCategory, string | null> = {
      ...sampleSlots,
      frontend: 'invented-framework-xyz',
    };
    const encoded = encodeBlueprint(forgedSpec, forgedSlots);
    const decoded = decodeBlueprint(encoded);
    assert.ok(decoded !== null);
    assert.equal(decoded.slots.frontend, undefined);
    assert.equal(decoded.slots.database, 'turso');
  });
});
