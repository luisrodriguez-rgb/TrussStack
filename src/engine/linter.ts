import type { StackRecommendation, TechCategory } from './types';
import { TECH_BY_ID } from './catalog';
import type { Language } from '../i18n/translations';

export interface AuditFinding {
  type: 'passed' | 'missing' | 'drift';
  ruleId: string;
  title: string;
  description: string;
  packageName?: string;
  expectedBy?: string;
}

export interface AuditReport {
  complianceScore: number; // 0 - 100
  status: 'aligned' | 'warning' | 'critical';
  totalRulesEvaluated: number;
  passed: AuditFinding[];
  missing: AuditFinding[];
  drift: AuditFinding[];
  remediationCommand: string;
}

// Mapping of technology ID to expected npm packages (any matching package counts as satisfied)
export const EXPECTED_PACKAGES_BY_TECH: Record<string, string[]> = {
  nextjs: ['next', 'react', 'react-dom'],
  'react-vite': ['react', 'react-dom', 'vite'],
  astro: ['astro'],
  sveltekit: ['@sveltejs/kit'],
  'vue-nuxt': ['nuxt', 'vue'],
  remix: ['@remix-run/react', '@remix-run/node'],
  fastapi: ['fastapi'], // for backend monorepos / pyproject
  'supabase-db': ['@supabase/supabase-js'],
  'supabase-auth': ['@supabase/supabase-js'],
  'supabase-storage': ['@supabase/supabase-js'],
  neon: ['@neondatabase/serverless', 'postgres'],
  turso: ['@libsql/client'],
  postgres: ['pg'],
  redis: ['ioredis', '@upstash/redis'],
  clerk: ['@clerk/nextjs', '@clerk/clerk-react'],
  'better-auth': ['better-auth'],
  authjs: ['next-auth', '@auth/core'],
  stripe: ['stripe', '@stripe/stripe-js'],
  'lemon-squeezy': ['@lemonsqueezy/lemonsqueezy.js'],
  resend: ['resend'],
  sentry: ['@sentry/nextjs', '@sentry/react', '@sentry/node'],
  betterstack: ['@logtail/node', '@logtail/browser', '@logtail/js'],
  posthog: ['posthog-js', 'posthog-node'],
  'aws-s3': ['@aws-sdk/client-s3'],
  'cloudflare-r2': ['@aws-sdk/client-s3'],
  'cloudflare-pages': ['wrangler'],
  vercel: ['vercel'],
};

// Known drift / conflicting packages that indicate unauthorized deviations
export interface DriftRule {
  id: string;
  prohibitedPackages: string[];
  whenSlotIs?: { category: TechCategory; techId: string };
  whenSlotIsNot?: { category: TechCategory; techId: string };
  reasonEs: string;
  reasonEn: string;
}

export const DRIFT_RULES: DriftRule[] = [
  {
    id: 'DRIFT-ORM-BLOAT',
    prohibitedPackages: ['prisma', '@prisma/client'],
    whenSlotIs: { category: 'database', techId: 'turso' },
    reasonEs:
      'Se detectó Prisma en un proyecto configurado con Turso libSQL; Prisma añade sobrecarga binaria no optimizada para SQLite distribuido en Edge.',
    reasonEn:
      'Detected Prisma in a Turso libSQL project; Prisma adds heavy engine binary overhead ill-suited for distributed Edge SQLite.',
  },
  {
    id: 'DRIFT-AUTH-CONFLICT',
    prohibitedPackages: ['@auth0/auth0-react', 'auth0', '@auth0/nextjs-auth0'],
    whenSlotIsNot: { category: 'auth', techId: 'auth0' },
    reasonEs:
      'Se detectó el SDK de Auth0 en un proyecto que aprobó otro proveedor de identidad; genera redundancia y costes innecesarios.',
    reasonEn:
      'Detected Auth0 SDK in a codebase configured for a different IAM provider; causes vendor duplication and excessive licensing costs.',
  },
  {
    id: 'DRIFT-CLERK-DUPLICATION',
    prohibitedPackages: ['@clerk/nextjs', '@clerk/clerk-react'],
    whenSlotIsNot: { category: 'auth', techId: 'clerk' },
    reasonEs:
      'Se detectó Clerk instalado cuando la arquitectura seleccionó otra solución de Auth (ej. Supabase o Better Auth).',
    reasonEn:
      'Detected Clerk packages when architecture decided on an alternative IAM solution (e.g. Supabase or Better Auth).',
  },
  {
    id: 'DRIFT-SUPABASE-AUTHJS-CLASH',
    prohibitedPackages: ['next-auth', '@auth/core'],
    whenSlotIs: { category: 'auth', techId: 'supabase-auth' },
    reasonEs:
      'Se detectó Auth.js (NextAuth) junto con Supabase Auth; manejar sesiones duales introduce vulnerabilidades y token leaks.',
    reasonEn:
      'Detected Auth.js alongside Supabase Auth; managing dual session systems introduces security vulnerabilities and token leakage.',
  },
  {
    id: 'DRIFT-EXPRESS-IN-SERVERLESS',
    prohibitedPackages: ['express'],
    whenSlotIs: { category: 'hosting', techId: 'cloudflare-pages' },
    reasonEs:
      'Express requiere runtime Node.js con sockets TCP persistentes; incompatible con Cloudflare Pages / Workers sin polyfills complejos.',
    reasonEn:
      'Express requires stateful Node.js TCP sockets; incompatible with Cloudflare Pages / Workers without complex emulation polyfills.',
  },
  {
    id: 'DRIFT-CSS-IN-JS-RSC',
    prohibitedPackages: ['styled-components', '@emotion/react'],
    whenSlotIs: { category: 'frontend', techId: 'nextjs' },
    reasonEs:
      'Librerías CSS-in-JS clásicas en tiempo de ejecución causan incompatibilidad y deshabilitan el streaming de React Server Components.',
    reasonEn:
      'Runtime CSS-in-JS libraries break React Server Components streaming and cause client bundle bloat.',
  },
];

/**
 * Deterministically parses a package.json content and audits it against the approved architecture.
 */
export function auditPackageJson(
  packageJsonStr: string,
  recommendation: StackRecommendation,
  lang: Language = 'es'
): AuditReport {
  const isEs = lang === 'es';
  const passed: AuditFinding[] = [];
  const missing: AuditFinding[] = [];
  const drift: AuditFinding[] = [];

  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(packageJsonStr);
  } catch {
    return {
      complianceScore: 0,
      status: 'critical',
      totalRulesEvaluated: 1,
      passed: [],
      missing: [
        {
          type: 'missing',
          ruleId: 'SYNTAX-ERROR',
          title: isEs ? 'Archivo JSON Inválido' : 'Invalid JSON Syntax',
          description: isEs
            ? 'El contenido ingresado no es un JSON válido o está incompleto.'
            : 'Provided content is not valid or well-formed JSON.',
        },
      ],
      drift: [],
      remediationCommand: '',
    };
  }

  const dependencies = (parsed.dependencies || {}) as Record<string, string>;
  const devDependencies = (parsed.devDependencies || {}) as Record<string, string>;
  const allInstalled = { ...dependencies, ...devDependencies };
  const installedNames = new Set(Object.keys(allInstalled));

  // 1. Audit Required Core Packages based on active slots
  const evaluatedTechs = new Set<string>();
  for (const [, techId] of Object.entries(recommendation.slots)) {
    if (!techId) continue;
    evaluatedTechs.add(techId);
    const tech = TECH_BY_ID[techId];
    const techName = tech ? tech.name : techId;
    const requiredPkgs = EXPECTED_PACKAGES_BY_TECH[techId];

    if (requiredPkgs && requiredPkgs.length > 0) {
      const isSatisfied = requiredPkgs.some((pkg) => installedNames.has(pkg));
      if (isSatisfied) {
        passed.push({
          type: 'passed',
          ruleId: `REQ-${techId.toUpperCase()}`,
          title: isEs ? `Paquete principal de ${techName}` : `Core package for ${techName}`,
          description: isEs
            ? `Se detectó dependencia obligatoria instalada (${requiredPkgs.filter((p) => installedNames.has(p)).join(', ')}).`
            : `Required core dependency found (${requiredPkgs.filter((p) => installedNames.has(p)).join(', ')}).`,
          expectedBy: techName,
        });
      } else {
        missing.push({
          type: 'missing',
          ruleId: `MISSING-${techId.toUpperCase()}`,
          title: isEs ? `Dependencia faltante: ${techName}` : `Missing dependency: ${techName}`,
          description: isEs
            ? `La arquitectura aprobó ${techName} pero no se detectó ningún paquete compatible (${requiredPkgs.join(' o ')}).`
            : `Architecture requires ${techName} but none of the expected packages (${requiredPkgs.join(' or ')}) were found.`,
          packageName: requiredPkgs[0],
          expectedBy: techName,
        });
      }
    }
  }

  // 2. Audit Drift & Anti-patterns
  for (const rule of DRIFT_RULES) {
    let applies = true;
    if (rule.whenSlotIs) {
      applies =
        recommendation.slots[rule.whenSlotIs.category] === rule.whenSlotIs.techId;
    } else if (rule.whenSlotIsNot) {
      applies =
        recommendation.slots[rule.whenSlotIsNot.category] !== rule.whenSlotIsNot.techId;
    }

    if (applies) {
      for (const prohibitedPkg of rule.prohibitedPackages) {
        if (installedNames.has(prohibitedPkg)) {
          drift.push({
            type: 'drift',
            ruleId: rule.id,
            title: isEs
              ? `Desvío Arquitectónico: ${prohibitedPkg}`
              : `Architectural Drift: ${prohibitedPkg}`,
            description: isEs ? rule.reasonEs : rule.reasonEn,
            packageName: prohibitedPkg,
          });
        }
      }
    }
  }

  // 3. Compute Compliance Score
  const totalChecks = passed.length + missing.length + drift.length;
  let complianceScore = 100;
  if (totalChecks > 0) {
    const penaltyPerMissing = 15;
    const penaltyPerDrift = 25;
    const rawScore = 100 - missing.length * penaltyPerMissing - drift.length * penaltyPerDrift;
    complianceScore = Math.max(0, Math.min(100, Math.round(rawScore)));
  }

  const status: AuditReport['status'] =
    complianceScore >= 85 ? 'aligned' : complianceScore >= 60 ? 'warning' : 'critical';

  // 4. Formulate Remediation Command
  const packagesToInstall = missing
    .map((m) => m.packageName)
    .filter((p): p is string => Boolean(p));
  const packagesToUninstall = drift
    .map((d) => d.packageName)
    .filter((p): p is string => Boolean(p));

  const installCmd =
    packagesToInstall.length > 0 ? `npm install ${packagesToInstall.join(' ')}` : '';
  const uninstallCmd =
    packagesToUninstall.length > 0 ? `npm uninstall ${packagesToUninstall.join(' ')}` : '';

  let remediationCommand = '';
  if (installCmd && uninstallCmd) {
    remediationCommand = `${uninstallCmd} && ${installCmd}`;
  } else {
    remediationCommand = installCmd || uninstallCmd || (isEs ? '# Arquitectura 100% conforme' : '# Architecture 100% aligned');
  }

  return {
    complianceScore,
    status,
    totalRulesEvaluated: totalChecks,
    passed,
    missing,
    drift,
    remediationCommand,
  };
}

/**
 * Generates an aligned or intentionally drifted package.json sample for live demo testing.
 */
export function generateSamplePackageJson(
  recommendation: StackRecommendation,
  scenario: 'aligned' | 'drift' = 'drift'
): string {
  const deps: Record<string, string> = {};
  const devDeps: Record<string, string> = {
    typescript: '^5.4.0',
  };

  // Add expected packages
  for (const techId of Object.values(recommendation.slots)) {
    if (!techId) continue;
    const pkgs = EXPECTED_PACKAGES_BY_TECH[techId];
    if (pkgs && pkgs.length > 0) {
      deps[pkgs[0]] = '^1.0.0';
    }
  }

  if (scenario === 'drift') {
    // Intentionally inject contraband packages that trigger drift warnings
    delete deps['@supabase/supabase-js']; // simulate missing
    deps['prisma'] = '^5.14.0'; // unapproved ORM
    deps['@auth0/auth0-react'] = '^2.2.4'; // unapproved auth
    deps['styled-components'] = '^6.1.8'; // CSS-in-JS conflict
  }

  const sample = {
    name: 'sample-project',
    version: '1.0.0',
    private: true,
    dependencies: deps,
    devDependencies: devDeps,
  };

  return JSON.stringify(sample, null, 2);
}

/**
 * Generates a ready-to-commit GitHub Action CI workflow file (.github/workflows/trussstack-audit.yml).
 */
export function generateGitHubActionWorkflow(
  _recommendation?: StackRecommendation
): string {
  return `name: "TrussStack Architectural Drift Audit"

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  audit-architecture:
    name: "Audit Dependencies & Topology Drift"
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Execute TrussStack CI Audit
        run: |
          echo "[TRUSSSTACK GITOPS] Auditing package.json dependencies against approved architecture..."
          node scripts/trussstack-lint.js
`;
}

/**
 * Generates a standalone Node.js script (scripts/trussstack-lint.js) that can run in CI or pre-commit.
 */
export function generateCliAuditScript(
  recommendation: StackRecommendation
): string {
  const slotsJson = JSON.stringify(recommendation.slots, null, 2);
  return `#!/usr/bin/env node
/**
 * TrussStack GitOps Architectural Drift Auditor
 * Auto-generated by TrussStack Technical Architecture Engine
 */
const fs = require('fs');
const path = require('path');

const approvedSlots = ${slotsJson};

const expectedByTech = {
  nextjs: ['next', 'react', 'react-dom'],
  'react-vite': ['react', 'react-dom'],
  astro: ['astro'],
  'supabase-db': ['@supabase/supabase-js'],
  'supabase-auth': ['@supabase/supabase-js'],
  neon: ['@neondatabase/serverless'],
  turso: ['@libsql/client'],
  stripe: ['stripe'],
  resend: ['resend'],
  sentry: ['@sentry/nextjs', '@sentry/react', '@sentry/node'],
};

const driftProhibitions = [
  { pkg: 'prisma', whenTurso: true, reason: 'Prisma is forbidden when Turso is chosen' },
  { pkg: '@auth0/auth0-react', reason: 'Auth0 is unauthorized in this architecture' },
];

function main() {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  if (!fs.existsSync(pkgPath)) {
    console.error('[FAIL] package.json not found in working directory.');
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const installed = new Set([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ]);

  let violations = 0;

  // Check required
  for (const [cat, techId] of Object.entries(approvedSlots)) {
    if (!techId) continue;
    const reqs = expectedByTech[techId];
    if (reqs && !reqs.some((r) => installed.has(r))) {
      console.error(\`[DRIFT ERROR] Missing required dependency for \${techId}: expected \${reqs.join(' or ')}\`);
      violations++;
    }
  }

  // Check prohibited
  for (const d of driftProhibitions) {
    if (installed.has(d.pkg)) {
      console.error(\`[DRIFT ERROR] Unauthorized package detected: \${d.pkg} (\${d.reason})\`);
      violations++;
    }
  }

  if (violations > 0) {
    console.error(\`\\n[AUDIT FAILED] Found \${violations} architectural drift violation(s). Aborting build.\`);
    process.exit(1);
  }

  console.log('[OK] All dependencies align with the approved TrussStack architecture.');
  process.exit(0);
}

main();
`;
}
