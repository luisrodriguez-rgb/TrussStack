import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  auditPackageJson,
  generateSamplePackageJson,
  generateGitHubActionWorkflow,
  generateCliAuditScript,
} from '../linter';
import { recommendStack } from '../recommender';
import type { UserProjectSpec } from '../types';

describe('TrussStack GitOps Architecture Linter & Drift Detector', () => {
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

  it('deberia auditar como 100% conforme un package.json con todas las dependencias alineadas', () => {
    const rec = recommendStack(sampleSpec, 'es');
    const alignedJson = generateSamplePackageJson(rec, 'aligned');
    const report = auditPackageJson(alignedJson, rec, 'es');

    assert.equal(report.status, 'aligned');
    assert.ok(report.complianceScore >= 90);
    assert.equal(report.missing.length, 0);
    assert.equal(report.drift.length, 0);
    assert.ok(report.passed.length > 0);
  });

  it('deberia detectar dependencias faltantes y desvios no autorizados en un package.json con drift', () => {
    const rec = recommendStack(sampleSpec, 'es');
    const driftedJson = generateSamplePackageJson(rec, 'drift');
    const report = auditPackageJson(driftedJson, rec, 'es');

    assert.ok(report.complianceScore < 80);
    assert.ok(report.missing.length > 0);
    assert.ok(report.drift.length > 0);
    assert.ok(report.remediationCommand.includes('npm uninstall'));
  });

  it('deberia generar el workflow de GitHub Action y el script CLI', () => {
    const rec = recommendStack(sampleSpec, 'en');
    const workflow = generateGitHubActionWorkflow(rec);
    const cliScript = generateCliAuditScript(rec);

    assert.ok(workflow.includes('TrussStack Architectural Drift Audit'));
    assert.ok(workflow.includes('node scripts/trussstack-lint.js'));
    assert.ok(cliScript.includes('#!/usr/bin/env node'));
    assert.ok(cliScript.includes('approvedSlots'));
  });

  it('deberia manejar sintaxis JSON invalida con un reporte seguro', () => {
    const rec = recommendStack(sampleSpec, 'es');
    const report = auditPackageJson('bad json text {', rec, 'es');
    assert.equal(report.complianceScore, 0);
    assert.equal(report.status, 'critical');
    assert.equal(report.missing[0].ruleId, 'SYNTAX-ERROR');
  });
});
