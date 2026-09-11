import type { StackRecommendation } from '../engine/types';
import { TECH_BY_ID } from '../engine/catalog';
import { getLocalizedTech } from '../engine/catalogI18n';
import type { Language } from '../i18n/translations';

/**
 * Generates a clean, production-ready docker-compose.yml for local development
 * containing only the emulated services required by the chosen stack.
 */
export function generateDockerCompose(recommendation: StackRecommendation): string {
  const { slots } = recommendation;
  const services: string[] = [];

  // Database service (PostgreSQL)
  const dbTech = slots.database ? TECH_BY_ID[slots.database] : null;
  if (
    dbTech &&
    (dbTech.id === 'postgres' ||
      dbTech.id === 'supabase-db' ||
      dbTech.id === 'neon')
  ) {
    services.push(`  postgres:
    image: postgres:16-alpine
    container_name: trussstack_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: \${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: \${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: \${POSTGRES_DB:-trussstack_dev}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U \${POSTGRES_USER:-postgres}"]
      interval: 5s
      timeout: 5s
      retries: 5`);
  }

  // Redis (if in stack)
  if (slots.database === 'redis') {
    services.push(`  redis:
    image: redis:7-alpine
    container_name: trussstack_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5`);
  }

  // Object Storage emulation (MinIO)
  if (slots.storage === 'aws-s3' || slots.storage === 'cloudflare-r2' || slots.storage === 'supabase-storage') {
    services.push(`  minio:
    image: minio/minio:RELEASE.2024-05-10T01-41-38Z
    container_name: trussstack_minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: \${MINIO_ROOT_USER:-minioadmin}
      MINIO_ROOT_PASSWORD: \${MINIO_ROOT_PASSWORD:-minioadmin}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data`);
  }

  // Local Email Catcher (MailHog)
  if (slots.email) {
    services.push(`  mailhog:
    image: mailhog/mailhog:latest
    container_name: trussstack_mailhog
    restart: unless-stopped
    ports:
      - "1025:1025" # SMTP server
      - "8025:8025" # Web UI`);
  }

  const volumes: string[] = [];
  if (services.some((s) => s.includes('postgres_data'))) volumes.push('  postgres_data:');
  if (services.some((s) => s.includes('redis_data'))) volumes.push('  redis_data:');
  if (services.some((s) => s.includes('minio_data'))) volumes.push('  minio_data:');

  return `# ==============================================================================
# TRUSSSTACK // LOCAL DEVELOPMENT INFRASTRUCTURE
# Generated deterministically for: ${recommendation.spec.projectType.toUpperCase()}
# ==============================================================================

version: '3.8'

services:
${services.join('\n\n')}

volumes:
${volumes.join('\n')}
`;
}

/**
 * Generates an exhaustive .env.example with exact keys for the active stack
 */
export function generateEnvExample(recommendation: StackRecommendation): string {
  const { slots, spec } = recommendation;
  const lines: string[] = [
    '# ============================================================================== #',
    '# TRUSSSTACK // ENVIRONMENT CONFIGURATION TEMPLATE',
    `# Target Architecture: ${spec.projectType.toUpperCase()} (${spec.scale})`,
    '# ============================================================================== #',
    '',
    '# --- APP ENVIRONMENT ---',
    'NODE_ENV=development',
    'PORT=3000',
    'NEXT_PUBLIC_APP_URL=http://localhost:3000',
    'APP_SECRET=replace_with_a_secure_random_hex_key_32_bytes',
    '',
  ];

  // Database
  lines.push('# --- DATABASE & PERSISTENCE ---');
  if (slots.database === 'supabase-db') {
    lines.push('DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trussstack_dev');
    lines.push('NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321');
    lines.push('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...replace_with_anon_key');
    lines.push('SUPABASE_SERVICE_ROLE_KEY=eyJh...replace_with_service_role_key');
  } else if (slots.database === 'neon') {
    lines.push('DATABASE_URL=postgresql://neondb_owner:password@ep-proj-12345.us-east-2.aws.neon.tech/neondb?sslmode=require');
  } else if (slots.database === 'turso') {
    lines.push('TURSO_DATABASE_URL=libsql://your-db-org.turso.io');
    lines.push('TURSO_AUTH_TOKEN=your_turso_auth_token');
  } else {
    lines.push('DATABASE_URL=postgresql://postgres:postgres@localhost:5432/trussstack_dev');
  }
  lines.push('');

  // Auth
  if (slots.auth) {
    lines.push('# --- AUTHENTICATION & SESSIONS ---');
    if (slots.auth === 'clerk') {
      lines.push('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...');
      lines.push('CLERK_SECRET_KEY=sk_test_...');
      lines.push('NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in');
      lines.push('NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up');
    } else if (slots.auth === 'better-auth' || slots.auth === 'authjs') {
      lines.push('AUTH_SECRET=your_super_secret_session_token_generate_with_openssl');
      lines.push('AUTH_URL=http://localhost:3000/api/auth');
      lines.push('AUTH_GITHUB_ID=your_oauth_client_id');
      lines.push('AUTH_GITHUB_SECRET=your_oauth_client_secret');
    } else if (slots.auth === 'auth0') {
      lines.push('AUTH0_SECRET=your_auth0_session_secret');
      lines.push('AUTH0_BASE_URL=http://localhost:3000');
      lines.push('AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com');
      lines.push('AUTH0_CLIENT_ID=your_client_id');
      lines.push('AUTH0_CLIENT_SECRET=your_client_secret');
    }
    lines.push('');
  }

  // Storage
  if (slots.storage) {
    lines.push('# --- OBJECT STORAGE (S3 COMPATIBLE) ---');
    if (slots.storage === 'cloudflare-r2') {
      lines.push('R2_ACCOUNT_ID=your_cloudflare_account_id');
      lines.push('R2_ACCESS_KEY_ID=your_r2_access_key');
      lines.push('R2_SECRET_ACCESS_KEY=your_r2_secret_key');
      lines.push('R2_BUCKET_NAME=trussstack-assets');
      lines.push('R2_PUBLIC_DOMAIN=https://assets.yourdomain.com');
    } else if (slots.storage === 'aws-s3') {
      lines.push('AWS_REGION=us-east-1');
      lines.push('AWS_ACCESS_KEY_ID=your_aws_access_key');
      lines.push('AWS_SECRET_ACCESS_KEY=your_aws_secret_key');
      lines.push('AWS_S3_BUCKET=trussstack-uploads');
    }
    lines.push('');
  }

  // Payments
  if (slots.payments) {
    lines.push('# --- PAYMENTS & BILLING ---');
    if (slots.payments === 'stripe') {
      lines.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...');
      lines.push('STRIPE_SECRET_KEY=sk_test_...');
      lines.push('STRIPE_WEBHOOK_SECRET=whsec_...');
    } else if (slots.payments === 'lemonsqueezy') {
      lines.push('LEMONSQUEEZY_API_KEY=your_lemon_squeezy_api_key');
      lines.push('LEMONSQUEEZY_STORE_ID=your_store_id');
      lines.push('LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret');
    }
    lines.push('');
  }

  // Email
  if (slots.email) {
    lines.push('# --- TRANSACTIONAL EMAIL ---');
    if (slots.email === 'resend') {
      lines.push('RESEND_API_KEY=re_123456789_abcdef');
      lines.push('EMAIL_FROM=notifications@yourdomain.com');
    } else if (slots.email === 'postmark') {
      lines.push('POSTMARK_SERVER_TOKEN=your_postmark_token');
      lines.push('EMAIL_FROM=notifications@yourdomain.com');
    }
    lines.push('');
  }

  // Observability
  if (slots.monitoring) {
    lines.push('# --- OBSERVABILITY & LOGGING ---');
    if (slots.monitoring === 'sentry') {
      lines.push('NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0');
      lines.push('SENTRY_AUTH_TOKEN=sntrys_...');
    } else if (slots.monitoring === 'betterstack') {
      lines.push('BETTERSTACK_LOG_TOKEN=your_log_ingest_token');
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Generates an Architectural Decision Record (ADR) in MADR standard Markdown
 */
export function generateReadmeAdr(recommendation: StackRecommendation, lang: Language): string {
  const { spec, slots, fitScore, dimensionScores, whyReasons, keyTradeoffs } = recommendation;
  const isEs = lang === 'es';

  const rows = Object.entries(slots)
    .filter(([, id]) => Boolean(id))
    .map(([cat, id]) => {
      const raw = TECH_BY_ID[id!];
      const tech = raw ? getLocalizedTech(raw, lang) : null;
      return `| \`${cat.toUpperCase()}\` | **${tech?.name || id}** | ${tech?.license || 'MIT'} | ${tech?.costProfile.initialCost.toUpperCase()} | ${tech?.tagline || ''} |`;
    })
    .join('\n');

  return `# ADR-001: Technical Stack Architecture for ${spec.projectType.toUpperCase()}

* **Status**: Accepted
* **Date**: ${new Date().toISOString().split('T')[0]}
* **Fit Score**: ${fitScore}%
* **Engine**: TrussStack Deterministic Architecture Engine

---

## 1. Context and Problem Statement

${
  isEs
    ? `Se necesita definir la arquitectura técnica fundacional para un sistema de tipo **${spec.projectType.toUpperCase()}**, dimensionado para una escala inicial de **${spec.scale}**, con un equipo de **${spec.teamSize}** y una restricción presupuestaria de **${spec.budget}**.`
    : `A foundational technical architecture is required for a **${spec.projectType.toUpperCase()}** workload, tailored for an initial scale of **${spec.scale}**, driven by a **${spec.teamSize}** engineering team under a **${spec.budget}** budget constraint.`
}

---

## 2. Decision Drivers

* **Developer Experience & Delivery Velocity**: ${dimensionScores.speed}%
* **Cost Optimization**: ${dimensionScores.cost}%
* **Concurrency Ceiling & Scale**: ${dimensionScores.scalability}%
* **Operational Simplicity (Zero-Ops)**: ${dimensionScores.simplicity}%
* **Portability (Zero Vendor Lock-in)**: ${dimensionScores.portability}%

---

## 3. Considered Architectural Decisions & Selected Topology

| Layer / Category | Component Selected | License | Initial Cost | Architectural Role |
| :--- | :--- | :--- | :--- | :--- |
${rows}

---

## 4. Why This Stack Fits (Architectural Rationale)

${whyReasons.map((r) => `* ${r}`).join('\n')}

---

## 5. Explicitly Accepted Sacrifices (Trade-offs)

${
  keyTradeoffs.length > 0
    ? keyTradeoffs.map((t) => `* **Sacrifice**: ${t}`).join('\n')
    : isEs
    ? '* Ningún compromiso arquitectónico crítico detectado para esta escala.'
    : '* No critical architectural sacrifices flagged for this scale.'
}

---

## 6. Local Development Quickstart

\`\`\`bash
# 1. Start local emulated infrastructure
docker compose up -d

# 2. Configure environment variables
cp .env.example .env

# 3. Install dependencies and start development server
npm install
npm run dev
\`\`\`

---
*Generated by [TrussStack](https://github.com/luisrodriguez-rgb/TrussStack) — Deterministic Architecture Engine.*
`;
}
