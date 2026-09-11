import type { Language } from '../i18n/translations';
import type { Technology } from './types';

interface TechTranslationData {
  tagline: string;
  description: string;
  freeTierLimits: string;
  pros: string[];
  cons: string[];
  sacrifices: string[];
  idealFor?: string[];
  avoidIf?: string[];
}

export const TECH_I18N_EN: Record<string, TechTranslationData> = {
  // FRONTEND
  nextjs: {
    tagline: 'The industry standard for React full-stack with SSR and Server Components.',
    description: 'Full-stack React framework featuring App Router, hybrid SSR/SSG, Server Actions, and automated optimizations.',
    freeTierLimits: 'Generous Hobby tier on Vercel with included bandwidth and serverless invocations.',
    pros: [
      'Vast ecosystem with the highest availability of production-ready UI libraries.',
      'True hybrid: SSR for dynamic SEO and SSG for instant static page loads.',
      'Integrated Route Handlers and Server Actions eliminating separate backend needs for many apps.',
    ],
    cons: [
      'App Router and React Server Components carry an architectural learning curve.',
      'Tight coupling with native cloud optimizations tailored primarily for Vercel.',
      'Bundle size and compilation overhead scale up on large codebases.',
    ],
    sacrifices: [
      'Sacrifices trivial portability to traditional Node.js/Docker hosting environments without adapters.',
      'Sacrifices mental simplicity compared to a pure static SPA.',
    ],
    idealFor: ['B2B/B2C SaaS', 'Interactive E-commerce', 'Web platforms requiring critical SEO and Auth'],
    avoidIf: ['Purely static sites or blogs where Astro is significantly lighter'],
  },
  'react-vite': {
    tagline: 'Ultra-fast, decoupled SPA with zero server-side magic.',
    description: 'Pure client-side Single Page Application built with Vite, TypeScript, and React. Compiles to static assets.',
    freeTierLimits: 'Can be hosted for $0 on any static CDN (Cloudflare Pages, Vercel, Netlify).',
    pros: [
      'Sub-second hot module replacement and instantaneous local builds.',
      'Complete decoupling from backend architecture; runs anywhere as static files.',
      'Zero operational complexity: no server processes, cold starts, or memory leaks.',
    ],
    cons: [
      'Client-side rendering makes public SEO and social previews difficult.',
      'Initial JavaScript bundle must be downloaded before first paint.',
      'Requires a separate backend API for database operations and server secrets.',
    ],
    sacrifices: [
      'Sacrifices out-of-the-box SEO optimization for public search engines.',
      'Sacrifices server-side data fetching directly at the render layer.',
    ],
    idealFor: ['Internal Dashboards', 'Authenticated SaaS portals', 'Realtime collaborative apps'],
    avoidIf: ['Public blogs, marketing sites, or platforms requiring indexable SEO'],
  },
  astro: {
    tagline: 'Zero-JS by default content-driven framework with Island Architecture.',
    description: 'Framework built for content-rich websites, delivering pristine HTML by default and hydrating components on demand.',
    freeTierLimits: '100% free hosting on Cloudflare Pages or Vercel Hobby with zero egress fees.',
    pros: [
      'Unmatched Core Web Vitals scores due to automatic JavaScript elimination.',
      'Islands architecture: use React, Svelte, or Vue components in the same project.',
      'Native Markdown, MDX, and Content Collections with strict schema validation.',
    ],
    cons: [
      'Not designed for deeply reactive, complex state-driven single-page web applications.',
      'Session management and dynamic mutations require custom API routes or external services.',
    ],
    sacrifices: [
      'Sacrifices seamless global reactive state across the entire user session.',
      'Sacrifices unified component lifecycle between server and client.',
    ],
    idealFor: ['Documentation platforms', 'Marketing websites', 'Editorial blogs', 'Headless e-commerce storefronts'],
    avoidIf: ['Complex dashboards with shared reactive client state and WebSocket streams'],
  },
  sveltekit: {
    tagline: 'Lightweight, compiled reactivity with unified full-stack routing.',
    description: 'Full-stack framework leveraging Svelte compile-time reactivity for minimal runtime bundle sizes.',
    freeTierLimits: 'Free tier deployments on Vercel, Netlify, and Cloudflare Pages via official adapters.',
    pros: [
      'Compile-time reactivity eliminates Virtual DOM overhead.',
      'Extremely concise syntax and minimal boilerplate.',
      'Official adapters for Vercel, Node, Cloudflare Workers, and Docker.',
    ],
    cons: [
      'Smaller third-party component library ecosystem compared to React.',
      'Fewer ready-to-use SaaS boilerplates on the market.',
    ],
    sacrifices: [
      'Sacrifices access to the massive React ecosystem (Shadcn UI, TanStack table, etc.).',
    ],
    idealFor: ['High-performance SaaS', 'Interactive web tools', 'Resource-constrained applications'],
    avoidIf: ['Enterprise teams standardized on React libraries'],
  },
  remix: {
    tagline: 'Web standards-focused full-stack framework with resilient data mutations.',
    description: 'Framework built on Web Fetch API standards, nested routes, and native form submissions with automatic revalidation.',
    freeTierLimits: 'Deployable on Vercel Hobby, Cloudflare Workers, or Fly.io free tiers.',
    pros: [
      'First-class handling of mutations, pending UI states, and optimistic updates.',
      'Leverages native browser standards (Request, Response, FormData).',
      'Nested routing eliminates waterfall requests and layout re-renders.',
    ],
    cons: [
      'Transitioning to React Router v7 architecture creates ecosystem fragmentation.',
      'Smaller boilerplate ecosystem than Next.js.',
    ],
    sacrifices: [
      'Sacrifices Server Components simplicity as implemented in Next.js.',
    ],
  },
  nuxt: {
    tagline: 'The premier full-stack framework for Vue 3 and TypeScript.',
    description: 'Full-stack Vue framework featuring Nitro server engine, auto-imports, file-based routing, and universal rendering.',
    freeTierLimits: 'Free tier on Vercel, Netlify, and Cloudflare via Nitro engine presets.',
    pros: [
      'Outstanding developer experience with auto-imports and typed routing.',
      'Nitro engine allows deployment across any JavaScript runtime (Node, Deno, Workers).',
      'Vue 3 Composition API offers clean, structured reactive code.',
    ],
    cons: [
      'Smaller enterprise developer talent pool compared to React.',
    ],
    sacrifices: [
      'Sacrifices the React UI ecosystem.',
    ],
  },

  // BACKEND
  express: {
    tagline: 'Minimalist, battle-tested HTTP server for Node.js.',
    description: 'The classic unopinionated HTTP micro-framework for Node.js applications with decades of production history.',
    freeTierLimits: 'Requires persistent compute ($5/mo on Railway/Render, or free tier on Fly.io).',
    pros: [
      'Massive ecosystem of middleware and universal documentation.',
      'Complete freedom over architecture, routing, and database drivers.',
    ],
    cons: [
      'Zero built-in TypeScript structure or dependency injection.',
      'Outdated callback/middleware architecture without native async error propagation.',
    ],
    sacrifices: [
      'Sacrifices built-in architectural structure and modern type safety.',
    ],
  },
  nestjs: {
    tagline: 'Enterprise-grade, modular Node.js framework with TypeScript & DI.',
    description: 'Opinionated TypeScript framework inspired by Angular architecture, featuring modules, controllers, and dependency injection.',
    freeTierLimits: 'Deployable on VPS, Railway, Render, or Docker containers.',
    pros: [
      'Enforces consistent modular architecture across large engineering teams.',
      'First-class support for microservices, WebSockets, Kafka, and gRPC.',
    ],
    cons: [
      'High boilerplate and steep learning curve for solo developers.',
      'Heavy memory footprint compared to modern micro-frameworks.',
    ],
    sacrifices: [
      'Sacrifices rapid MVP prototyping speed for long-term architectural rigidity.',
    ],
  },
  fastapi: {
    tagline: 'High-performance Python API framework with automatic OpenAPI schemas.',
    description: 'Modern Python 3.10+ async framework based on Starlette and Pydantic, generating automated OpenAPI documentation.',
    freeTierLimits: 'Free tier on Render or Fly.io, or standard $4/mo VPS.',
    pros: [
      'Native async/await support with high concurrency throughput in Python.',
      'Automatic request validation and interactive Swagger/OpenAPI documentation.',
      'Ideal gateway for AI pipelines, machine learning models, and data orchestration.',
    ],
    cons: [
      'Requires managing a Python runtime, virtual environments, and ASGI servers (Uvicorn).',
    ],
    sacrifices: [
      'Sacrifices a unified TypeScript language stack between frontend and backend.',
    ],
    idealFor: ['AI/ML microservices', 'Data-heavy APIs', 'Python teams'],
  },
  'go-gin': {
    tagline: 'Blazing fast, compiled microsecond HTTP routing in Go.',
    description: 'High-concurrency Go web framework compiling to a single static binary with ultra-low memory footprint.',
    freeTierLimits: 'Runs effortlessly on minimal 256MB RAM instances ($3-$4/mo VPS).',
    pros: [
      'Microsecond request routing with near-zero memory footprint.',
      'Compiles to a standalone binary with zero runtime dependencies.',
      'Unmatched throughput and rock-solid CPU efficiency under heavy concurrency.',
    ],
    cons: [
      'More verbose error handling and boilerplate compared to TypeScript/Python.',
    ],
    sacrifices: [
      'Sacrifices rapid schema iteration and unified JS/TS code sharing.',
    ],
  },
  hono: {
    tagline: 'Ultra-lightweight web framework optimized for Edge and Cloudflare Workers.',
    description: 'Modern, blazing fast TypeScript framework designed to run on any runtime (Cloudflare Workers, Fastly, Deno, Bun, Node.js).',
    freeTierLimits: '100% free deployment on Cloudflare Workers with 100,000 requests/day.',
    pros: [
      'Sub-millisecond startup times and near-zero bundle footprint (< 15KB).',
      'End-to-end type safety with RPC client capabilities directly in frontend.',
      'Runs natively on Cloudflare Workers, Fastly, Deno, Bun, and Node.js.',
    ],
    cons: [
      'Edge runtime restrictions: cannot use native Node C++ bindings.',
    ],
    sacrifices: [
      'Sacrifices legacy Node.js library compatibility in pure Edge environments.',
    ],
  },
  django: {
    tagline: 'The batteries-included Python web framework for perfectionists with deadlines.',
    description: 'Full-featured web framework with built-in ORM, admin dashboard, user authentication, and CSRF protection.',
    freeTierLimits: 'Deployable on Fly.io, Railway, or standard Linux VPS.',
    pros: [
      'Automated admin panel saves hundreds of hours of internal tool development.',
      'Battle-tested security, migrations, and authentication built directly into the core.',
    ],
    cons: [
      'Monolithic architecture can be cumbersome when building modern decoupled SPAs.',
    ],
    sacrifices: [
      'Sacrifices lightweight edge execution and modern frontend integration simplicity.',
    ],
  },

  // DATABASE
  'supabase-db': {
    tagline: 'Managed PostgreSQL with Row-Level Security, Realtime, and Extensions.',
    description: 'Full PostgreSQL database enhanced with instant REST/GraphQL APIs, Auth, Storage, and Realtime WebSocket engine.',
    freeTierLimits: 'Free tier includes 500MB database, 50k monthly active users, and 2 active projects.',
    pros: [
      'PostgreSQL core with Row-Level Security (RLS) enforcing tenant isolation at DB layer.',
      'Built-in WebSocket realtime listeners for database changes.',
      'Zero maintenance: automatic backups, extensions (pgvector), and dashboard UI.',
    ],
    cons: [
      'Free tier projects pause after 7 days of complete inactivity.',
      'RLS policy debugging requires careful SQL testing to prevent performance bottlenecks.',
    ],
    sacrifices: [
      'Sacrifices self-hosted infrastructure autonomy in exchange for managed convenience.',
    ],
    idealFor: ['Full-stack SaaS', 'Realtime collaborative applications', 'Rapid MVP prototyping'],
  },
  postgres: {
    tagline: 'The bedrock open-source relational database for mission-critical systems.',
    description: 'The world’s most advanced open-source relational database with ACID guarantees, rich indexing, and massive ecosystem.',
    freeTierLimits: 'Free local container via Docker; cloud tiers require $5-$15/mo managed instances.',
    pros: [
      'Zero vendor lock-in; deployable on any cloud provider, container, or bare metal.',
      'Rock-solid ACID compliance, robust indexing, and pgvector support.',
    ],
    cons: [
      'Requires managing connections, connection poolers, vacuuming, and replication manually.',
    ],
    sacrifices: [
      'Sacrifices instant serverless autoscaling and built-in REST endpoints.',
    ],
  },
  neon: {
    tagline: 'Serverless PostgreSQL with instant branching and scale-to-zero compute.',
    description: 'Cloud-native PostgreSQL that decouples storage and compute, enabling instantaneous database branching for pull requests.',
    freeTierLimits: 'Generous Free tier with 0.5 GiB storage and scale-to-zero compute hours.',
    pros: [
      'Instant database branching allows isolated staging databases for every PR.',
      'Scales compute to zero when idle, eliminating unnecessary costs during quiet periods.',
      'Modern WebSocket driver enables direct connections from Edge functions without pool exhaustion.',
    ],
    cons: [
      'Scale-from-zero cold starts can introduce 500ms-1s latency on first request after idle.',
    ],
    sacrifices: [
      'Sacrifices real-time WebSocket change streams built into tools like Supabase.',
    ],
  },
  planetscale: {
    tagline: 'Distributed MySQL for massive horizontal scale with zero-downtime migrations.',
    description: 'Vitess-powered serverless MySQL database built for extreme horizontal scale and non-blocking schema migrations.',
    freeTierLimits: 'No permanent free tier; entry plans start at $39/month.',
    pros: [
      'Infinite horizontal read scaling with Vitess sharding architecture.',
      'Non-blocking schema migrations eliminate database locks during deployments.',
    ],
    cons: [
      'No free tier available.',
      'Lacks native support for foreign key constraints at database level.',
    ],
    sacrifices: [
      'Sacrifices database-enforced foreign keys and zero-cost entry.',
    ],
  },
  turso: {
    tagline: 'Distributed SQLite replicated globally at the Edge with libSQL.',
    description: 'Distributed database powered by libSQL (open-source SQLite fork) offering sub-10ms query latency globally.',
    freeTierLimits: 'Free tier includes up to 500 databases and 9GB total storage.',
    pros: [
      'Microsecond read latency with local embedded replicas.',
      'Up to 500 databases per account: ideal for multi-tenant database-per-user patterns.',
      'Native support in Cloudflare Workers and Edge runtimes.',
    ],
    cons: [
      'SQLite concurrency model: concurrent high-volume writes must route to primary node.',
    ],
    sacrifices: [
      'Sacrifices advanced PostgreSQL analytical functions and extensions.',
    ],
  },
  mongodb: {
    tagline: 'Document-oriented database for flexible, schema-less JSON storage.',
    description: 'Popular NoSQL document database storing BSON records with expressive querying and horizontal sharding.',
    freeTierLimits: 'MongoDB Atlas M0 shared cluster with 512MB storage forever free.',
    pros: [
      'Flexible polymorphic document schemas that evolve without upfront migrations.',
      'Intuitive querying syntax directly mirroring JSON data models.',
    ],
    cons: [
      'Lack of enforced relational constraints can lead to data inconsistency at scale.',
    ],
    sacrifices: [
      'Sacrifices relational ACID guarantees and SQL standardization.',
    ],
  },
  redis: {
    tagline: 'In-memory data structure store for caching, rate limiting, and pub/sub.',
    description: 'Ultra-low latency in-memory key-value store powering cache layers, session stores, message queues, and rate limiters.',
    freeTierLimits: 'Free tier on Upstash Serverless Redis (10,000 commands/day).',
    pros: [
      'Sub-millisecond read and write execution times directly from RAM.',
      'Versatile data structures: Hashes, Sorted Sets, Bitmaps, and Streams.',
    ],
    cons: [
      'Dataset must fit entirely in RAM, making large storage volume expensive.',
    ],
    sacrifices: [
      'Sacrifices cost-effective persistent long-term storage.',
    ],
  },

  // AUTH
  'supabase-auth': {
    tagline: 'Integrated authentication with native PostgreSQL Row-Level Security.',
    description: 'Full-featured auth system supporting OAuth, magic links, passwords, and phone auth directly integrated with PostgreSQL RLS.',
    freeTierLimits: '50,000 monthly active users (MAU) included free on Supabase tier.',
    pros: [
      'Direct integration with PostgreSQL RLS: queries automatically filter by auth.uid().',
      '50,000 free MAUs, significantly more generous than standalone auth providers.',
      'Supports social providers, magic links, MFA, and SMS verification.',
    ],
    cons: [
      'UI components require customization or third-party wrappers.',
    ],
    sacrifices: [
      'Sacrifices standalone auth portability if database is migrated away from Supabase.',
    ],
  },
  clerk: {
    tagline: 'The modern standard for React authentication and user management UI.',
    description: 'Complete user management and authentication suite with drop-in UI components, organization multi-tenancy, and B2B RBAC.',
    freeTierLimits: 'Free up to 10,000 MAUs; escalates at $0.02/MAU + $25/mo Pro base.',
    pros: [
      'Best-in-class developer experience with beautiful pre-built React components.',
      'Native support for B2B multi-tenancy, team organizations, and role permissions.',
    ],
    cons: [
      'Steep cost scaling cliff once surpassing 10,000 monthly active users.',
      'Heavy vendor lock-in with closed-source proprietary cloud infrastructure.',
    ],
    sacrifices: [
      'Sacrifices low long-term unit economics at scale and open-source data ownership.',
    ],
  },
  auth0: {
    tagline: 'Enterprise identity management with SAML, SSO, and compliance.',
    description: 'Enterprise-grade identity platform supporting Single Sign-On (SSO), active directory federation, and compliance audits.',
    freeTierLimits: 'Free tier up to 7,500 active users with basic social connections.',
    pros: [
      'Gold standard for enterprise B2B sales requiring SAML/SSO and SOC2 compliance.',
    ],
    cons: [
      'Enterprise pricing jumps drastically into thousands of dollars monthly.',
      'Complex administrative dashboard and configuration surface.',
    ],
    sacrifices: [
      'Sacrifices lean developer experience and low costs for indie projects.',
    ],
  },
  'better-auth': {
    tagline: 'The most modern open-source TypeScript authentication library.',
    description: 'Framework-agnostic, self-hosted TypeScript auth solution with native plugins for two-factor, organizations, and sessions.',
    freeTierLimits: '100% free and open-source forever (runs in your own backend compute).',
    pros: [
      '100% open source with zero vendor lock-in or per-user monthly subscription fees.',
      'Comprehensive plugin ecosystem: 2FA, passkeys, organization teams, social login.',
      'Full control over user tables directly inside your application database.',
    ],
    cons: [
      'Your team is directly responsible for session security, cookie management, and auth maintenance.',
    ],
    sacrifices: [
      'Sacrifices a zero-maintenance managed cloud service.',
    ],
  },
  authjs: {
    tagline: 'Universal open-source authentication for Next.js and full-stack web.',
    description: 'Formerly NextAuth.js, provides lightweight session management, OAuth provider integration, and database adapters.',
    freeTierLimits: '100% free and open source; self-hosted in your server/edge handlers.',
    pros: [
      'No external subscription fees or per-user pricing tiers.',
      'Huge catalog of built-in OAuth providers (Google, GitHub, Discord, Apple).',
    ],
    cons: [
      'Documentation fragmentation across version transitions (v4 to v5/Auth.js).',
      'Frictions when integrating with static or non-Node runtimes.',
    ],
    sacrifices: [
      'Sacrifices drop-in polished UI components found in Clerk.',
    ],
  },

  // STORAGE
  'cloudflare-r2': {
    tagline: 'S3-compatible object storage with zero egress bandwidth fees.',
    description: 'Globally distributed object storage fully compatible with AWS S3 API, with absolute zero charges for outbound data egress.',
    freeTierLimits: 'Free 10GB storage, 1M Class A operations, and 10M Class B operations/month.',
    pros: [
      'Zero egress bandwidth costs: eliminates the single largest cloud billing trap.',
      'Full S3 API compatibility: works directly with standard AWS SDKs.',
      'Integrated edge caching through Cloudflare global network.',
    ],
    cons: [
      'Lacks specialized features like AWS S3 Glacier deep archival tiers.',
    ],
    sacrifices: [
      'Sacrifices deep AWS ecosystem IAM integration.',
    ],
  },
  'aws-s3': {
    tagline: 'The global standard for durable cloud object storage and compliance.',
    description: 'Industry-defining cloud object storage offering 99.999999999% durability, extensive lifecycle policies, and compliance locks.',
    freeTierLimits: '5GB standard storage in AWS Free Tier for 12 months (egress billed thereafter).',
    pros: [
      'Infinite durability and virtually limitless capacity.',
      'Sophisticated lifecycle rules (intelligent tiering, Glacier deep archive).',
    ],
    cons: [
      'Heavy egress billing trap: charges $0.09/GB on data downloaded to internet.',
      'Complex IAM permission policies and arcane billing structures.',
    ],
    sacrifices: [
      'Sacrifices predictable zero-cost bandwidth transfers.',
    ],
  },
  'supabase-storage': {
    tagline: 'S3-backed object storage governed by PostgreSQL Row-Level Security.',
    description: 'File and media storage integrated with PostgreSQL, allowing file access permissions to be defined directly via SQL RLS policies.',
    freeTierLimits: '1GB storage and 2GB monthly bandwidth included in Supabase Free tier.',
    pros: [
      'Protect file uploads using standard PostgreSQL RLS rules.',
      'Built-in image transformation and resizing on the fly.',
    ],
    cons: [
      'Bandwidth overages apply once passing the 2GB monthly quota on Free tier.',
    ],
    sacrifices: [
      'Sacrifices independent storage decoupling from Supabase backend.',
    ],
  },
  uploadthing: {
    tagline: 'File uploads for Next.js and full-stack TypeScript with zero boilerplate.',
    description: 'Developer-friendly upload service providing typed file routers, client hooks, and managed file delivery.',
    freeTierLimits: 'Free tier includes 2GB storage with basic upload quotas.',
    pros: [
      'End-to-end type-safe file routes defined directly in application code.',
      'Pre-built React upload buttons and dropzone components.',
    ],
    cons: [
      'Higher unit storage costs at enterprise scale compared to raw R2 or S3.',
    ],
    sacrifices: [
      'Sacrifices direct control over raw cloud storage primitives.',
    ],
  },

  // HOSTING
  vercel: {
    tagline: 'The premier serverless platform for Next.js, Edge compute, and frontend DX.',
    description: 'Optimized deployment platform featuring automatic previews, Edge Middleware, serverless functions, and global CDN.',
    freeTierLimits: 'Generous Hobby plan for personal projects; Pro plan starts at $20/month/seat.',
    pros: [
      'Best-in-class developer experience: automatic Git branch preview deployments.',
      'Native serverless optimization designed specifically for Next.js App Router.',
      'Zero infrastructure management: instant global SSL, DNS, and edge caching.',
    ],
    cons: [
      'Pro plan requires $20/seat/month; commercial use strictly requires paid plan.',
      'Bandwidth overage costs ($40 per 100GB) can result in unexpected spikes.',
    ],
    sacrifices: [
      'Sacrifices low unit infrastructure costs compared to raw self-hosted VPS.',
    ],
  },
  'cloudflare-pages': {
    tagline: 'Hyper-fast global edge hosting with unlimited free bandwidth.',
    description: 'Edge hosting platform that deploys static assets and serverless Workers across Cloudflare’s 300+ city global network.',
    freeTierLimits: 'Unlimited bandwidth, 500 builds/month, and 100k Worker requests/day for $0.',
    pros: [
      'Zero egress fees forever with unlimited static bandwidth on all plans.',
      'Sub-15ms TTFB globally due to deployment directly across Cloudflare Edge nodes.',
    ],
    cons: [
      'Advanced Node.js runtime APIs require compatibility layers or adapters.',
    ],
    sacrifices: [
      'Sacrifices seamless native Next.js full-stack features without OpenNext.',
    ],
  },
  railway: {
    tagline: 'Instant container and database deployment with frictionless DX.',
    description: 'Modern infrastructure platform that provisions web services, databases, and cron workers directly from Git repositories.',
    freeTierLimits: '$5 monthly trial credit; usage-based billing afterwards (~$5-$10/mo typical).',
    pros: [
      'Deploy full Docker containers and persistent databases in one click.',
      'Private internal networking connects services securely without exposing ports.',
    ],
    cons: [
      'No permanent free tier once trial credits expire.',
    ],
    sacrifices: [
      'Sacrifices hard zero-dollar hosting guarantee.',
    ],
  },
  render: {
    tagline: 'Unified cloud platform for web services, background workers, and PostgreSQL.',
    description: 'Modern Heroku alternative offering managed web services, static sites, background workers, and PostgreSQL.',
    freeTierLimits: 'Free tier for web services and static sites (free services spin down after inactivity).',
    pros: [
      'Predictable pricing tiers for traditional server applications.',
      'Managed Redis and PostgreSQL with automated backups.',
    ],
    cons: [
      'Free tier web services spin down after 15 minutes of inactivity (50s cold start).',
    ],
    sacrifices: [
      'Sacrifices instant zero-cold-start performance on free tier.',
    ],
  },
  flyio: {
    tagline: 'Deploy full Docker containers close to your users on bare-metal Edge.',
    description: 'Global container execution platform running microVMs in 30+ regions globally, ideal for long-running connections and WebSockets.',
    freeTierLimits: 'Small free allowances for lightweight microVMs with credit card validation.',
    pros: [
      'Native support for persistent processes, WebSockets, and stateful workloads.',
      'Runs true Docker containers close to users without serverless timeout limits.',
    ],
    cons: [
      'Requires operational comfort with Docker, memory limits, and fly.toml configs.',
    ],
    sacrifices: [
      'Sacrifices hands-off serverless zero-ops simplicity.',
    ],
  },
  'hetzner-vps': {
    tagline: 'Unbeatable price-to-performance raw VPS compute and dedicated hardware.',
    description: 'European cloud hosting provider offering high-spec VPS instances (CPX series) at a fraction of hyperscaler costs.',
    freeTierLimits: 'No free tier; high-performance VPS starts at ~$4.50 to $18/month.',
    pros: [
      'Unmatched cost efficiency: 4 vCPU / 8GB RAM for ~$12/month vs $150+ on AWS/Vercel.',
      'Pair with Coolify or Dokku to create a self-hosted personal PaaS with zero lock-in.',
      'Massive 20TB included bandwidth with virtually zero egress risk.',
    ],
    cons: [
      'Requires complete responsibility for Linux OS updates, firewalls, and backups.',
    ],
    sacrifices: [
      'Sacrifices managed platform convenience, automated multi-region failover, and zero-ops.',
    ],
  },

  // PAYMENTS
  stripe: {
    tagline: 'The global standard payment infrastructure for internet business.',
    description: 'Comprehensive financial infrastructure handling cards, subscriptions, invoicing, and global payment methods.',
    freeTierLimits: 'No monthly fee; standard transaction fee (2.9% + $0.30 per successful charge).',
    pros: [
      'Highest conversion checkout with Apple Pay, Google Pay, and local bank transfers.',
      'Extensive documentation, battle-tested webhooks, and client libraries.',
    ],
    cons: [
      'Does not act as Merchant of Record: you are legally responsible for global sales tax remittance.',
    ],
    sacrifices: [
      'Sacrifices automated international VAT/sales tax filing compared to Merchant of Record providers.',
    ],
  },
  lemonsqueezy: {
    tagline: 'Merchant of Record taking care of global VAT, taxes, and software billing.',
    description: 'All-in-one payment gateway and Merchant of Record that handles global sales tax, customer invoicing, and digital compliance.',
    freeTierLimits: 'No setup fee; charges 5% + $0.50 per transaction as Merchant of Record.',
    pros: [
      'Acts as Merchant of Record: assumes 100% legal responsibility for calculating and remitting global VAT/taxes.',
      'Drop-in checkout overlays and subscription customer portals.',
    ],
    cons: [
      'Higher transaction fees (5% + $0.50) compared to raw Stripe processing.',
    ],
    sacrifices: [
      'Sacrifices ~2% lower processing fees in exchange for tax peace of mind.',
    ],
  },
  paddle: {
    tagline: 'Merchant of Record built for global B2B and enterprise SaaS billing.',
    description: 'Complete billing and tax engine acting as Merchant of Record, tailored specifically for global SaaS companies.',
    freeTierLimits: 'No monthly platform fees; percentage-based transaction pricing.',
    pros: [
      'Handles international sales tax and B2B reverse-charge invoices automatically.',
    ],
    cons: [
      'Approval process can take longer for brand-new startups.',
    ],
    sacrifices: [
      'Sacrifices instant frictionless onboarding.',
    ],
  },
  mercadopago: {
    tagline: 'Leading payment gateway across Latin America with local currency payment rails.',
    description: 'Dominant payment processing infrastructure across Latin America supporting local cards, Pix (Brazil), and cash vouchers.',
    freeTierLimits: 'No monthly fees; standard per-transaction percentage fees by country.',
    pros: [
      'Essential for converting customers in LATAM (Pix, Oxxo, local installment cards).',
    ],
    cons: [
      'API ergonomics and documentation are less polished than Stripe.',
    ],
    sacrifices: [
      'Sacrifices global currency flexibility outside of Latin America.',
    ],
  },

  // EMAIL
  resend: {
    tagline: 'The modern email API built for developers and React Email.',
    description: 'Clean, modern transactional email API designed to construct responsive emails using React components (@react-email).',
    freeTierLimits: 'Free tier allows sending 3,000 emails/month (100 emails/day).',
    pros: [
      'Build beautiful HTML emails using React components and TypeScript.',
      'Outstanding developer experience with instant domain verification and clean APIs.',
    ],
    cons: [
      'Daily limit of 100 emails on Free tier can restrict high-traffic launch days.',
    ],
    sacrifices: [
      'Sacrifices bulk newsletter campaign automation out-of-the-box.',
    ],
  },
  postmark: {
    tagline: 'Industry gold standard for fast, guaranteed transactional inbox deliverability.',
    description: 'Dedicated transactional email service separating transactional and promotional streams to guarantee high inbox rates.',
    freeTierLimits: 'Free developer tier includes 100 emails/month for testing.',
    pros: [
      'Unmatched inbox deliverability and sub-second delivery latency.',
    ],
    cons: [
      'Strict onboarding review and low volume developer tier.',
    ],
    sacrifices: [
      'Sacrifices generous free email volume.',
    ],
  },
  'aws-ses': {
    tagline: 'Lowest cost bulk transactional email delivery in the cloud.',
    description: 'AWS Simple Email Service offering enterprise delivery at rock-bottom prices ($0.10 per 1,000 emails).',
    freeTierLimits: '62,000 emails/month free when sent from an EC2 instance, otherwise pay-as-you-go.',
    pros: [
      'Unbeatable cost efficiency at large scale ($0.10 per 1,000 emails).',
    ],
    cons: [
      'High initial setup friction: accounts start in AWS Sandbox requiring manual approval.',
    ],
    sacrifices: [
      'Sacrifices clean modern developer experience and quick onboarding.',
    ],
  },
  sendgrid: {
    tagline: 'Established cloud email delivery platform for transactional and marketing mail.',
    description: 'Twilio SendGrid provides cloud-based email delivery with marketing automation and transactional APIs.',
    freeTierLimits: 'Free tier includes 100 emails/day forever.',
    pros: [
      'Unified platform for both developer APIs and marketing campaigns.',
    ],
    cons: [
      'Aging dashboard UI and customer support response times.',
    ],
    sacrifices: [
      'Sacrifices modern developer ergonomics.',
    ],
  },

  // MONITORING
  sentry: {
    tagline: 'Real-time application performance monitoring and full-stack error tracking.',
    description: 'The standard error tracking platform providing actionable stack traces, source maps, performance breadcrumbs, and session replays.',
    freeTierLimits: 'Developer plan includes 5,000 errors and 10,000 performance transactions/month for $0.',
    pros: [
      'Pinpoint exact lines of code causing production crashes with source map de-minification.',
      'Session Replay reproduces the exact user actions leading up to an error.',
      'Comprehensive SDKs across every modern frontend and backend language.',
    ],
    cons: [
      'Can generate noisy alerts if sampling rules and ignore patterns are not configured.',
    ],
    sacrifices: [
      'Sacrifices lightweight client telemetry footprint.',
    ],
  },
  posthog: {
    tagline: 'All-in-one product analytics, session replay, and feature flags.',
    description: 'Open-source product platform combining analytics, session recordings, heatmaps, feature flags, and A/B testing.',
    freeTierLimits: 'Extremely generous Free tier: 1M events and 5,000 session recordings/month for $0.',
    pros: [
      'Replaces 4 different SaaS subscriptions (Mixpanel, Hotjar, LaunchDarkly, Google Analytics).',
      'Extremely generous free allowance every month.',
    ],
    cons: [
      'Client SDK script can impact performance if not loaded asynchronously.',
    ],
    sacrifices: [
      'Sacrifices focused single-purpose simplicity.',
    ],
  },
  betterstack: {
    tagline: 'Beautiful uptime monitoring, incident response, and unified log management.',
    description: 'Modern observability suite featuring synthetic uptime pings, incident status pages, and structured log management.',
    freeTierLimits: 'Free tier includes 10 uptime monitors (3-minute checks) and 1GB logs/month.',
    pros: [
      'Clean Modern-Retro UI with instant alerts via phone call, SMS, or Slack.',
      'Automated public status pages reassure users during outages.',
    ],
    cons: [
      'Free tier ping frequency is 3 minutes (1-minute checks require paid plan).',
    ],
    sacrifices: [
      'Sacrifices deep APM code-level execution profiling found in Datadog.',
    ],
  },
  datadog: {
    tagline: 'Enterprise-grade full-stack infrastructure and distributed cloud APM.',
    description: 'Comprehensive enterprise monitoring platform tracking infrastructure metrics, network flow, logs, and distributed traces.',
    freeTierLimits: 'Free trial available; usage-based per-host billing afterwards.',
    pros: [
      'Deepest infrastructure visibility across large Kubernetes and multi-cloud clusters.',
    ],
    cons: [
      'Enterprise pricing scales quickly into high monthly bills.',
    ],
    sacrifices: [
      'Sacrifices low cost and simplicity for solo/small teams.',
    ],
  },

  // CI/CD
  'github-actions': {
    tagline: 'Automated CI/CD workflows integrated directly inside your GitHub repository.',
    description: 'Native workflow automation platform running tests, linting, security scanning, and multi-cloud deployments directly on Git triggers.',
    freeTierLimits: '2,000 free runner minutes/month for private repos (unlimited for public repos).',
    pros: [
      'Zero external accounts required: workflows live directly in `.github/workflows/`.',
      'Vast Marketplace with tens of thousands of community actions.',
    ],
    cons: [
      'Debugging workflow syntax locally can require trial-and-error commits.',
    ],
    sacrifices: [
      'Sacrifices independent CI platform portability away from GitHub.',
    ],
  },
  'gitlab-ci': {
    tagline: 'Built-in enterprise DevOps pipeline with native Kubernetes orchestration.',
    description: 'Complete DevOps lifecycle platform with native container registries, Auto DevOps, and integrated issue management.',
    freeTierLimits: '400 free CI minutes/month on free SaaS accounts.',
    pros: [
      'Unified single-application DevOps experience.',
    ],
    cons: [
      'Fewer community actions compared to GitHub Actions marketplace.',
    ],
    sacrifices: [
      'Sacrifices GitHub native tooling ecosystem.',
    ],
  },
  'vercel-ci': {
    tagline: 'Zero-config continuous deployment with instant preview URLs for web.',
    description: 'Turnkey CI/CD pipeline specialized in web frameworks, offering instant atomic deployments, preview branches, and instant rollbacks.',
    freeTierLimits: 'Included with Vercel Hobby and Pro accounts.',
    pros: [
      'Zero configuration: connects to your Git repo and handles build, optimize, and CDN deploy.',
      'Instant preview URLs for every pull request accelerate team review cycles.',
    ],
    cons: [
      'Specialized primarily for web apps; cannot run complex integration test suites or microservice builds.',
    ],
    sacrifices: [
      'Sacrifices generalized multi-stage workflow pipeline execution.',
    ],
  },
  'docker-hub': {
    tagline: 'The global standard registry for building and distributing container images.',
    description: 'Container registry and automated build service for storing, sharing, and deploying Docker images to cloud servers.',
    freeTierLimits: '1 private repository and unlimited public repositories for free.',
    pros: [
      'Universal container distribution standard supported by every cloud and VPS provider.',
    ],
    cons: [
      'Free tier has rate limits on image pulls (100 pulls per 6 hours for anonymous users).',
    ],
    sacrifices: [
      'Sacrifices turnkey managed frontend deployment speeds.',
    ],
  },

  // AI & VECTOR DATABASES
  pinecone: {
    tagline: 'Fully managed serverless vector database engineered for semantic search and RAG.',
    description: 'Cloud-native vector database offering ultra-low query latency, automated index management, and serverless scaling to billions of vectors.',
    freeTierLimits: 'Starter tier with up to 100,000 vectors and 1 index for free.',
    pros: [
      'Zero infrastructure overhead: instant serverless provisioning and automatic indexing.',
      'Optimized semantic filtering with metadata namespaces for multi-tenant RAG.',
      'High-throughput similarity search with sub-25ms response budgets.',
    ],
    cons: [
      'Proprietary cloud API: high vendor lock-in with closed-source engine.',
      'Query and vector volume costs scale rapidly in large-scale production.',
    ],
    sacrifices: [
      'Sacrifices local offline execution and freedom to self-host.',
    ],
  },
  qdrant: {
    tagline: 'Open-source Rust vector search engine with rich payload filtering and distributed scaling.',
    description: 'High-performance vector similarity search engine written in Rust. Supports approximate nearest neighbor search with complex payload filters.',
    freeTierLimits: '1GB free cluster on Qdrant Cloud or 100% free self-hosted via Docker.',
    pros: [
      'Open-source Apache-2.0 license with zero vendor lock-in.',
      'Blazing-fast execution speed and low memory footprint powered by Rust.',
      'Deep payload filtering directly inside vector search queries.',
    ],
    cons: [
      'Self-hosting requires memory capacity planning for HNSW graph indexes.',
    ],
    sacrifices: [
      'Sacrifices turnkey zero-maintenance convenience if choosing self-hosted deployment.',
    ],
  },
  chroma: {
    tagline: 'Developer-first open-source embedding database designed for rapid AI prototyping.',
    description: 'Embedding database built for developer ergonomics, featuring native Python and JS clients, local persistence, and LangChain integration.',
    freeTierLimits: '100% free and open-source for local and Docker execution.',
    pros: [
      'Minimalist API allowing you to bootstrap vector search in under 5 lines of code.',
      'Runs locally with zero external server dependencies for offline development.',
      'Rich ecosystem integration with LangChain, LlamaIndex, and Ollama.',
    ],
    cons: [
      'Less mature distributed clustering compared to Qdrant or Milvus.',
    ],
    sacrifices: [
      'Sacrifices multi-region horizontal partitioning for billion-scale vectors.',
    ],
  },
  pgvector: {
    tagline: 'Native vector similarity search for PostgreSQL: unify relational data and embeddings in one ACID engine.',
    description: 'Official extension for PostgreSQL enabling vector storage and similarity search (HNSW and IVFFlat) using standard SQL queries.',
    freeTierLimits: 'Included natively in Supabase, Neon, and local PostgreSQL installations.',
    pros: [
      'Architectural consolidation: single database for users, relational tables, and vectors.',
      'ACID transaction guarantees and Row Level Security (RLS) policies applied to vector search.',
      'Zero new infrastructure or API subscriptions required.',
    ],
    cons: [
      'High-volume vector search queries compete for CPU and RAM with OLTP workloads.',
    ],
    sacrifices: [
      'Sacrifices extreme throughput optimizations of dedicated standalone vector engines.',
    ],
  },
  langchain: {
    tagline: 'Modular orchestration framework for composable LLM chains, autonomous agents, and RAG pipelines.',
    description: 'Framework providing standardized abstractions for LLM providers, prompt templates, vector store retrievers, and tool-calling agent loops.',
    freeTierLimits: '100% open-source library (underlying LLM API token consumption is billed by providers).',
    pros: [
      'Consistent abstraction across OpenAI, Anthropic, Gemini, Groq, and local models.',
      'Vast library of pre-built integrations with document loaders and vector stores.',
    ],
    cons: [
      'Heavy abstractions can introduce redundant HTTP calls and complicate debugging.',
    ],
    sacrifices: [
      'Sacrifices lightweight simplicity compared to direct native REST SDK calls.',
    ],
  },

  // QUEUES & BACKGROUND WORKERS
  'upstash-qstash': {
    tagline: '100% serverless HTTP message queue and task scheduler without persistent sockets.',
    description: 'HTTP-based message broker designed specifically for Serverless and Edge runtimes (Vercel, Cloudflare, AWS Lambda).',
    freeTierLimits: '500 messages per day for free; $1 per 100,000 messages thereafter.',
    pros: [
      'Zero persistent TCP connections: delivers jobs via standard HTTP POST webhooks.',
      'Automated exponential retries, deduplication, and scheduled cron execution.',
      'Cryptographic HMAC payload verification ensuring webhook security.',
    ],
    cons: [
      'Not suited for continuous high-frequency streaming workloads (>100k events/sec).',
    ],
    sacrifices: [
      'Sacrifices fine-grained low-level AMQP exchange controls.',
    ],
  },
  bullmq: {
    tagline: 'The fastest, battle-tested distributed message queue for Node.js backed by Redis.',
    description: 'Production-grade queue and background worker toolkit for Node.js and TypeScript with atomic Redis persistence.',
    freeTierLimits: '100% open-source MIT library. Runs on any local or managed Redis instance.',
    pros: [
      'Massive throughput: tens of thousands of jobs per second with sub-millisecond overhead.',
      'Advanced job priority, concurrency limits, rate limiting, and parent-child workflows.',
      'Complete open-source portability across any cloud or VPS provider.',
    ],
    cons: [
      'Requires persistent Node.js worker processes (cannot run on pure ephemeral Edge).',
    ],
    sacrifices: [
      'Sacrifices pure serverless ergonomics: requires a dedicated worker VM or container.',
    ],
  },
  inngest: {
    tagline: 'Event-driven durable execution engine with step functions for TypeScript.',
    description: 'Platform for writing reliable background jobs and multi-step workflows with automated retries, concurrency control, and delays.',
    freeTierLimits: 'Hobby plan with up to 25,000 monthly step executions for free.',
    pros: [
      'Write durable workflows directly as code (`step.run`, `step.sleep`).',
      'Zero queue infrastructure maintenance: seamless compatibility with Next.js App Router.',
      'Real-time visualization and execution telemetry for every workflow step.',
    ],
    cons: [
      'Step-based pricing model scales with execution frequency.',
    ],
    sacrifices: [
      'Sacrifices low-level message broker tuning.',
    ],
  },
  rabbitmq: {
    tagline: 'The world-standard enterprise message broker for decoupled architectures and microservices.',
    description: 'Robust messaging system supporting AMQP 0-9-1, MQTT, STOMP, and flexible exchange routing (direct, topic, fanout).',
    freeTierLimits: '100% open-source on Docker/VPS or managed plans on CloudAMQP.',
    pros: [
      'Sophisticated message routing, consumer acknowledgments, and dead-letter exchanges.',
      'Decade-long battle-tested enterprise track record across banking and high-scale systems.',
    ],
    cons: [
      'Steeper learning curve and cluster operational maintenance overhead.',
    ],
    sacrifices: [
      'Sacrifices initial setup simplicity compared to simple HTTP webhooks.',
    ],
  },

  // MOBILE & DESKTOP
  'react-native-expo': {
    tagline: 'The modern standard for cross-platform native iOS and Android apps with React and TypeScript.',
    description: 'Cross-platform mobile development ecosystem with instant Fast Refresh, cloud build pipelines (EAS), and universal API bridges.',
    freeTierLimits: 'Framework is 100% free; EAS Build provides monthly free cloud build tiers.',
    pros: [
      'Share up to 90% of business logic, state, and TypeScript definitions with your web app.',
      'Expo Router provides intuitive file-based routing identical to Next.js App Router.',
      'Pre-configured native modules without requiring mandatory local Xcode/Android Studio setups.',
    ],
    cons: [
      'Slightly higher memory overhead compared to raw pure C++ or native Swift/Kotlin.',
    ],
    sacrifices: [
      'Sacrifices absolute bare-metal memory performance for 10x developer shipping speed.',
    ],
  },
  flutter: {
    tagline: 'Google multi-platform framework compiling to native ARM machine code from a single Dart codebase.',
    description: 'UI toolkit rendering every pixel directly to the GPU using Impeller/Skia for iOS, Android, Desktop, and Web.',
    freeTierLimits: '100% free and open-source by Google.',
    pros: [
      'Consistent 60/120 FPS render performance guaranteed by direct GPU canvas drawing.',
      'Comprehensive suite of built-in Cupertino and Material Design widgets.',
    ],
    cons: [
      'Requires learning Dart, fragmenting team tooling if your web application uses TypeScript.',
      'Initial application binary size is larger than lightweight React Native bundles.',
    ],
    sacrifices: [
      'Sacrifices code sharing with existing React or Next.js web application codebases.',
    ],
  },
  tauri: {
    tagline: 'Modern, ultra-lightweight, and secure Electron alternative with Rust backend and web frontend.',
    description: 'Framework for building desktop applications (<15MB) leveraging native OS webviews instead of bundling full Chromium instances.',
    freeTierLimits: '100% open-source MIT license.',
    pros: [
      'Insignificant memory footprint (30-60MB RAM vs 500+ MB on Electron).',
      'Tiny distribution bundles (<15MB) utilizing native OS webview runtimes.',
      'Robust security isolation with strict Rust IPC bridge permissions.',
    ],
    cons: [
      'Native webview rendering can exhibit subtle cross-platform CSS differences.',
    ],
    sacrifices: [
      'Sacrifices the convenience of a bundled identical Chromium browser runtime.',
    ],
  },
  electron: {
    tagline: 'The industry standard for cross-platform desktop software powered by Node.js and Chromium.',
    description: 'Desktop application engine powering VS Code, Slack, Discord, and Figma using standard web technologies.',
    freeTierLimits: '100% open-source MIT license.',
    pros: [
      'Absolute guarantee of pixel-identical rendering across macOS, Windows, and Linux.',
      'Decade of battle-tested stability powering world-class enterprise applications.',
      'Unrestricted access to the entire Node.js ecosystem in the desktop main process.',
    ],
    cons: [
      'High memory and CPU resource footprint from embedding dedicated Chromium instances.',
      'Installer bundle size typically exceeds 80 - 120 MB.',
    ],
    sacrifices: [
      'Sacrifices low hardware resource consumption on end-user machines.',
    ],
  },
};

/**
 * Returns a technology localized for the given language.
 * When lang === 'en', replaces tagline, description, tradeoffs, and free tier text with English equivalents.
 */
export function getLocalizedTech(tech: Technology, lang: Language): Technology {
  if (lang === 'es') return tech;

  const translation = TECH_I18N_EN[tech.id];
  if (!translation) return tech;

  return {
    ...tech,
    tagline: translation.tagline || tech.tagline,
    description: translation.description || tech.description,
    costProfile: {
      ...tech.costProfile,
      freeTier: {
        ...tech.costProfile.freeTier,
        limitsDescription: translation.freeTierLimits || tech.costProfile.freeTier.limitsDescription,
      },
    },
    tradeoffs: {
      ...tech.tradeoffs,
      pros: translation.pros && translation.pros.length > 0 ? translation.pros : tech.tradeoffs.pros,
      cons: translation.cons && translation.cons.length > 0 ? translation.cons : tech.tradeoffs.cons,
      sacrifices:
        translation.sacrifices && translation.sacrifices.length > 0
          ? translation.sacrifices
          : tech.tradeoffs.sacrifices,
      idealFor: translation.idealFor || tech.tradeoffs.idealFor,
      avoidIf: translation.avoidIf || tech.tradeoffs.avoidIf,
    },
  };
}

/**
 * Localized friction explanations in English
 */
export const FRICTION_MESSAGES_EN: Record<string, string> = {
  'astro-authjs':
    'Astro is optimized for static content and islands; integrating dynamic session state with Auth.js adds operational friction and edge adapter complexity.',
  'react-vite-vercel':
    'Hosting a pure client SPA on Vercel is functional, but you are not leveraging SSR or Edge Middleware while incurring higher costs than Cloudflare Pages ($0 egress).',
  'fastapi-authjs':
    'Auth.js is designed primarily for JavaScript runtimes (Node, Edge); authenticating with a Python FastAPI backend requires custom manual JWT validation.',
  'nextjs-hetzner-vps':
    'Deploying Next.js on a self-hosted VPS requires maintaining a standalone Node server or Docker container, losing Vercel automatic edge cache invalidation.',
};

export function getLocalizedFrictionMessage(
  sourceId: string,
  targetId: string,
  defaultMsg: string,
  lang: Language
): string {
  if (lang === 'es') return defaultMsg;
  const key1 = `${sourceId}-${targetId}`;
  const key2 = `${targetId}-${sourceId}`;
  return FRICTION_MESSAGES_EN[key1] || FRICTION_MESSAGES_EN[key2] || defaultMsg;
}
