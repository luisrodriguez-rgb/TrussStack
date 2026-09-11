import type { TechCategory } from './types';
import { TECH_BY_ID } from './catalog';

export interface CostSimulationInput {
  monthlyRequests: number; // e.g. 50,000 to 50,000,000
  monthlyActiveUsers: number; // e.g. 500 to 500,000
  storageGb: number; // e.g. 0.5 to 500 GB
  egressGb: number; // e.g. 5 to 5,000 GB
}

export interface ComponentCostItem {
  category: TechCategory;
  techId: string;
  name: string;
  costUsd: number;
  formulaNote: string;
  isFree: boolean;
  pricingTierApplied: string;
}

export interface BillingGotcha {
  id: string;
  severity: 'warning' | 'critical';
  title: string;
  titleEn: string;
  explanation: string;
  explanationEn: string;
  mitigation: string;
  mitigationEn: string;
}

export interface CostSimulationResult {
  totalMonthlyCost: number;
  componentCosts: ComponentCostItem[];
  vpsEquivalentCost: number;
  serverlessDifferenceUsd: number;
  billingGotchas: BillingGotcha[];
}

export function calculateDynamicStackCosts(
  slots: Record<TechCategory, string | null>,
  input: CostSimulationInput
): CostSimulationResult {
  const componentCosts: ComponentCostItem[] = [];
  const gotchas: BillingGotcha[] = [];

  const { monthlyRequests, monthlyActiveUsers, storageGb, egressGb } = input;

  // 1. FRONTEND / HOSTING COST CALCULATION
  const frontendId = slots.frontend;
  const hostingId = slots.hosting || frontendId;

  if (hostingId) {
    if (hostingId === 'cloudflare_pages') {
      // Cloudflare Pages: Free unlimited bandwidth & static requests. Workers paid: $5/mo for 10M reqs + $0.50/M
      let cost = 0;
      let tier = 'Free Unlimited Egress';
      if (monthlyRequests > 3_000_000) {
        cost = 5 + Math.max(0, (monthlyRequests - 10_000_000) / 1_000_000) * 0.5;
        tier = 'Workers Paid ($5/mo baseline)';
      }
      componentCosts.push({
        category: 'hosting',
        techId: hostingId,
        name: 'Cloudflare Pages / Edge',
        costUsd: Math.round(cost),
        formulaNote: 'Egress $0/GB garantizado a nivel global por Cloudflare Anycast.',
        isFree: cost === 0,
        pricingTierApplied: tier,
      });
    } else if (hostingId === 'vercel') {
      // Vercel: Free tier includes 100GB bandwidth, 1M edge reqs. Pro is $20/seat + $40/100GB egress
      let cost = 0;
      let tier = 'Hobby ($0/mo)';
      if (egressGb > 100 || monthlyRequests > 1_000_000) {
        cost = 20; // Pro base
        if (egressGb > 100) {
          cost += ((egressGb - 100) / 100) * 40; // $40 per 100GB extra
        }
        tier = 'Pro ($20/seat + Overage Egress)';
      }
      componentCosts.push({
        category: 'hosting',
        techId: hostingId,
        name: 'Vercel',
        costUsd: Math.round(cost),
        formulaNote: egressGb > 100 ? `$20 base + $40 por cada 100GB sobre ${egressGb}GB de egress.` : 'Incluido en Hobby tier (<100GB ancho de banda).',
        isFree: cost === 0,
        pricingTierApplied: tier,
      });

      if (egressGb > 150) {
        gotchas.push({
          id: 'vercel_egress_overage',
          severity: 'warning',
          title: 'Sobrecoste de Egress en Vercel',
          titleEn: 'Vercel Outbound Egress Overage',
          explanation: `Estás consumiendo ${egressGb} GB de salida. En Vercel, el ancho de banda adicional cuesta $40 por cada 100 GB adicionales.`,
          explanationEn: `You are projecting ${egressGb} GB of outbound bandwidth. Vercel charges $40 per additional 100 GB.`,
          mitigation: 'Sirve archivos estáticos o media pesada a través de Cloudflare R2 con $0 egress o activa un CDN intermedio.',
          mitigationEn: 'Serve large media and static files via Cloudflare R2 ($0 egress) or place Cloudflare CDN in front.',
        });
      }
    } else if (hostingId === 'flyio') {
      // Fly.io: Free tier up to 3 shared-cpu-1x VMs, 3GB storage, 160GB egress
      let cost = 0;
      let tier = 'Free Allowance';
      if (monthlyRequests > 2_000_000 || egressGb > 160) {
        cost = 12 + Math.max(0, egressGb - 160) * 0.02;
        tier = 'Pay-as-you-go Micro VMs';
      }
      componentCosts.push({
        category: 'hosting',
        techId: hostingId,
        name: 'Fly.io',
        costUsd: Math.round(cost),
        formulaNote: 'Cómputo en micro-VMs ligeras Firecracker en el edge.',
        isFree: cost === 0,
        pricingTierApplied: tier,
      });
    } else {
      const tech = TECH_BY_ID[hostingId];
      componentCosts.push({
        category: 'hosting',
        techId: hostingId,
        name: tech?.name || hostingId,
        costUsd: 0,
        formulaNote: 'Estimado en capa base de proveedor.',
        isFree: true,
        pricingTierApplied: 'Standard Tier',
      });
    }
  }

  // 2. DATABASE COST CALCULATION
  const dbId = slots.database;
  if (dbId) {
    if (dbId === 'supabase') {
      // Free: 500MB DB, 50k MAU, 2GB egress, 1GB storage. Pro: $25/mo includes 8GB DB, 100k MAU, 50GB egress, 100GB storage.
      let cost = 0;
      let tier = 'Free Tier (500MB DB / 50k MAU)';
      if (storageGb > 0.5 || monthlyActiveUsers > 50_000 || egressGb > 2) {
        cost = 25;
        if (storageGb > 8) {
          cost += (storageGb - 8) * 0.125; // $0.125/GB extra
        }
        if (monthlyActiveUsers > 100_000) {
          cost += ((monthlyActiveUsers - 100_000) / 1_000) * 0.00325; // $0.00325 per MAU
        }
        tier = 'Pro Plan ($25/mo + compute compute add-on)';
      }
      componentCosts.push({
        category: 'database',
        techId: dbId,
        name: 'Supabase PostgreSQL',
        costUsd: Math.round(cost),
        formulaNote: cost > 0 ? `$25 Pro plan incluye 8GB DB y 100k usuarios activos.` : 'Dentro del límite gratuito de 500MB y 50k usuarios.',
        isFree: cost === 0,
        pricingTierApplied: tier,
      });

      if (storageGb > 0.5 && cost === 0) {
        gotchas.push({
          id: 'supabase_storage_limit',
          severity: 'warning',
          title: 'Límite de 500MB en Supabase Free',
          titleEn: '500MB DB Limit on Supabase Free',
          explanation: `Has proyectado ${storageGb} GB en base de datos. El plan gratuito congela la base de datos si superas 500MB sin tarjeta.`,
          explanationEn: `You projected ${storageGb} GB. The free tier pauses the database if you exceed 500MB without a payment card.`,
          mitigation: 'Actualiza al plan Pro ($25/mes) o almacena datos no indexados en object storage (S3/R2).',
          mitigationEn: 'Upgrade to Pro ($25/mo) or offload large unindexed blobs to object storage.',
        });
      }
    } else if (dbId === 'neon') {
      // Neon: Free 0.5GB, 100 compute hours. Launch $19/mo includes 10GB storage, 300 compute hrs.
      let cost = 0;
      let tier = 'Free Tier (0.5GB / Auto-suspend)';
      if (storageGb > 0.5 || monthlyRequests > 2_000_000) {
        cost = 19 + Math.max(0, storageGb - 10) * 1.5;
        tier = 'Launch Plan ($19/mo)';
      }
      componentCosts.push({
        category: 'database',
        techId: dbId,
        name: 'Neon Serverless Postgres',
        costUsd: Math.round(cost),
        formulaNote: cost > 0 ? '$19 Launch plan con branching ilimitado y 10GB de storage.' : 'Free tier con auto-suspensión tras inactividad.',
        isFree: cost === 0,
        pricingTierApplied: tier,
      });
    } else if (dbId === 'planetscale') {
      // PlanetScale: Hobby deprecated, Scaler Pro starts at $39/mo
      const cost = 39 + Math.max(0, storageGb - 10) * 2.5;
      componentCosts.push({
        category: 'database',
        techId: dbId,
        name: 'PlanetScale MySQL',
        costUsd: Math.round(cost),
        formulaNote: '$39/mo base plan (PlanetScale eliminó su tier gratuito permanente).',
        isFree: false,
        pricingTierApplied: 'Scaler Pro ($39/mo)',
      });
    } else {
      const tech = TECH_BY_ID[dbId];
      componentCosts.push({
        category: 'database',
        techId: dbId,
        name: tech?.name || dbId,
        costUsd: 0,
        formulaNote: 'Cálculo base de base de datos.',
        isFree: true,
        pricingTierApplied: 'Standard Tier',
      });
    }
  }

  // 3. STORAGE & OBJECTS
  const storageId = slots.storage;
  if (storageId) {
    if (storageId === 'cloudflare_r2') {
      // R2: $0.015/GB storage, 10M Class A, $0 egress
      const cost = Math.max(0, (storageGb - 10) * 0.015);
      componentCosts.push({
        category: 'storage',
        techId: storageId,
        name: 'Cloudflare R2 Object Storage',
        costUsd: Math.round(cost),
        formulaNote: `10GB gratis. Exceso a $0.015/GB. Ancho de banda de salida (egress): $0.00 siempre.`,
        isFree: cost === 0,
        pricingTierApplied: 'Free 10GB / Zero Egress',
      });
    } else if (storageId === 'aws_s3') {
      // S3: $0.023/GB storage + $0.09/GB egress to Internet (BIG TRAP)
      const storageCost = storageGb * 0.023;
      const egressCost = egressGb * 0.09;
      const totalS3 = storageCost + egressCost;

      componentCosts.push({
        category: 'storage',
        techId: storageId,
        name: 'AWS S3',
        costUsd: Math.round(totalS3),
        formulaNote: `$0.023/GB almacenamiento + $0.09/GB de transferencia saliente a Internet.`,
        isFree: false,
        pricingTierApplied: 'Standard S3 Pay-per-use',
      });

      if (egressGb > 50) {
        gotchas.push({
          id: 'aws_s3_egress_trap',
          severity: 'critical',
          title: 'Trampa Clásica de Egress en AWS S3',
          titleEn: 'Classic AWS S3 Outbound Egress Trap',
          explanation: `Estás proyectando ${egressGb} GB de descarga de archivos. En AWS S3 pagas $0.09/GB solo por sacar datos a Internet (~$${Math.round(
            egressCost
          )}/mes en egress).`,
          explanationEn: `You are projecting ${egressGb} GB of file downloads. AWS S3 charges $0.09/GB just for data transfer out to the internet (~$${Math.round(
            egressCost
          )}/mo just in egress).`,
          mitigation: 'Sustituye AWS S3 por Cloudflare R2 con API compatible con S3 y $0 de costes de egress.',
          mitigationEn: 'Swap AWS S3 for Cloudflare R2 for full S3 API compatibility with $0 egress fees.',
        });
      }
    }
  }

  // 4. AUTHENTICATION (Clerk vs Auth.js / Supabase Auth)
  const authId = slots.auth;
  if (authId) {
    if (authId === 'clerk') {
      // Clerk: Free up to 10k MAU. Pro $25/mo + $0.02 per MAU over 10k
      let cost = 0;
      let tier = 'Free Tier (<10k MAU)';
      if (monthlyActiveUsers > 10_000) {
        cost = 25 + (monthlyActiveUsers - 10_000) * 0.02;
        tier = 'Pro Plan ($25 + $0.02/MAU)';
      }
      componentCosts.push({
        category: 'auth',
        techId: authId,
        name: 'Clerk Authentication',
        costUsd: Math.round(cost),
        formulaNote: cost > 0 ? `$25 base + $0.02 por cada usuario activo sobre 10.000.` : 'Gratis hasta 10.000 usuarios activos mensuales.',
        isFree: cost === 0,
        pricingTierApplied: tier,
      });

      if (monthlyActiveUsers > 25_000) {
        gotchas.push({
          id: 'clerk_mau_scaling',
          severity: 'warning',
          title: 'Escalado Exponencial de MAUs en Clerk',
          titleEn: 'Exponential MAU Scaling Cliff in Clerk',
          explanation: `Para ${monthlyActiveUsers.toLocaleString()} usuarios activos, la factura de Clerk alcanzará ~$${Math.round(
            cost
          )}/mes, superando el coste de toda tu base de datos combinada.`,
          explanationEn: `For ${monthlyActiveUsers.toLocaleString()} MAUs, Clerk will bill ~$${Math.round(
            cost
          )}/mo, exceeding your entire database cost combined.`,
          mitigation: 'Considera Auth.js (NextAuth) o Supabase Auth, los cuales son open source y no cobran por usuario activo.',
          mitigationEn: 'Consider Auth.js (NextAuth) or Supabase Auth, which are open source and do not charge per active user.',
        });
      }
    } else if (authId === 'authjs') {
      componentCosts.push({
        category: 'auth',
        techId: authId,
        name: 'Auth.js (NextAuth)',
        costUsd: 0,
        formulaNote: 'Open Source 100%. Se ejecuta en tu runtime sin cobros por usuario.',
        isFree: true,
        pricingTierApplied: 'Self-Hosted / Open Source ($0)',
      });
    }
  }

  // Total Serverless Stack Cost
  const totalMonthlyCost = componentCosts.reduce((acc, curr) => acc + curr.costUsd, 0);

  // Equivalent Dedicated VPS Architecture (e.g. Hetzner CX22/CX32 + Coolify)
  // Standard VPS: $7/mo for 4GB RAM, 2 vCPU, 40GB NVMe, 20TB traffic!
  let vpsCost = 8;
  if (monthlyRequests > 5_000_000 || storageGb > 40) {
    vpsCost = 18; // Dedicated 8GB RAM VPS
  }
  if (monthlyRequests > 20_000_000 || storageGb > 120) {
    vpsCost = 36; // High performance cluster
  }

  return {
    totalMonthlyCost,
    componentCosts,
    vpsEquivalentCost: vpsCost,
    serverlessDifferenceUsd: totalMonthlyCost - vpsCost,
    billingGotchas: gotchas,
  };
}
