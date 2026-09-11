import test from 'node:test';
import assert from 'node:assert';
import { recommendStack } from '../recommender';
import { generateDockerCompose, generateEnvExample } from '../../exporters/scaffoldExporter';
import { generateJsonExport } from '../../exporters/jsonExporter';
import { generateMermaidDiagram } from '../../exporters/mermaidExporter';
import { generateExcalidrawScene } from '../../exporters/excalidrawExporter';
import type { UserProjectSpec } from '../types';

const sampleSpec: UserProjectSpec = {
  projectType: 'saas',
  scale: 'mid_10k',
  teamSize: 'small_team',
  seniority: 'senior',
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
    lowVendorLockin: 4,
    operationalSimplicity: 3,
  },
};

const recommendation = recommendStack(sampleSpec, 'es');

test('TrussStack Exporters Suite', async (t) => {
  await t.test('deberia generar docker-compose.yml valido con servicios y volumenes', () => {
    const yaml = generateDockerCompose(recommendation);
    assert.ok(typeof yaml === 'string');
    assert.ok(yaml.includes('services:'));
    assert.ok(yaml.includes('postgres:') || yaml.includes('trussstack_postgres'));
    assert.ok(yaml.includes('volumes:'));
  });

  await t.test('deberia generar plantilla de variables .env.example con bloques de configuracion', () => {
    const env = generateEnvExample(recommendation);
    assert.ok(typeof env === 'string');
    assert.ok(env.includes('DATABASE_URL') || env.includes('SUPABASE_URL'));
    assert.ok(env.includes('# ---') || env.includes('PORT='));
  });

  await t.test('deberia generar esquema canonico JSON parseable con metadatos completos', () => {
    const jsonStr = generateJsonExport(recommendation, 'Proyecto Test');
    const parsed = JSON.parse(jsonStr);
    assert.strictEqual(parsed.version, '1.0');
    assert.strictEqual(parsed.projectName, 'Proyecto Test');
    assert.ok(typeof parsed.fitScore === 'number');
    assert.ok(parsed.stack);
    assert.ok(parsed.spec);
    assert.ok(Array.isArray(parsed.frictionWarnings));
  });

  await t.test('deberia generar diagrama Mermaid TD estructurado en subgrafos de capas', () => {
    const mermaid = generateMermaidDiagram(recommendation);
    assert.ok(typeof mermaid === 'string');
    assert.ok(mermaid.startsWith('flowchart TD'));
    assert.ok(mermaid.includes('subgraph Clients'));
    assert.ok(mermaid.includes('subgraph Application'));
    assert.ok(mermaid.includes('subgraph DataState'));
  });

  await t.test('deberia generar escena vectorial Excalidraw compatible con elementos y appState', () => {
    const excalidrawStr = generateExcalidrawScene(recommendation);
    const parsed = JSON.parse(excalidrawStr);
    assert.strictEqual(parsed.type, 'excalidraw');
    assert.ok(Array.isArray(parsed.elements));
    assert.ok(parsed.elements.length > 0);
    assert.ok(parsed.appState);
    assert.strictEqual(parsed.appState.viewBackgroundColor, '#0A0F1D');
  });
});
