import { calculateDynamicStackCosts } from '../costSimulator';

console.log('[TEST] Ejecutando Suite de Pruebas del Simulador Dinámico de Costes...');

// Test 1: MVP under limits -> should be $0
const mvpSlots = {
  frontend: 'nextjs',
  backend: null,
  database: 'supabase',
  auth: 'authjs',
  storage: 'cloudflare_r2',
  hosting: 'cloudflare_pages',
  payments: 'stripe',
  email: 'resend',
  monitoring: null,
  cicd: 'github_actions',
};

const mvpResult = calculateDynamicStackCosts(mvpSlots, {
  monthlyRequests: 100_000,
  monthlyActiveUsers: 2_000,
  storageGb: 0.4,
  egressGb: 1.8,
});

if (mvpResult.totalMonthlyCost === 0) {
  console.log('[OK] Test 1 Superado: MVP bajo demanda calcula $0/mes en coste de infraestructura.');
} else {
  throw new Error(`Test 1 Falló: MVP calculó $${mvpResult.totalMonthlyCost} en vez de $0.`);
}

// Test 2: Egress trap detection on AWS S3
const s3Slots = {
  ...mvpSlots,
  storage: 'aws_s3',
};

const s3Result = calculateDynamicStackCosts(s3Slots, {
  monthlyRequests: 500_000,
  monthlyActiveUsers: 5_000,
  storageGb: 50,
  egressGb: 200,
});

const s3Trap = s3Result.billingGotchas.find((g) => g.id === 'aws_s3_egress_trap');
if (s3Trap && s3Trap.severity === 'critical') {
  console.log('[OK] Test 2 Superado: Trampa de Egress en AWS S3 detectada con severidad crítica.');
} else {
  throw new Error('Test 2 Falló: No se detectó la trampa de egress de AWS S3.');
}

// Test 3: Clerk MAU scaling cliff
const clerkSlots = {
  ...mvpSlots,
  auth: 'clerk',
};

const clerkResult = calculateDynamicStackCosts(clerkSlots, {
  monthlyRequests: 2_000_000,
  monthlyActiveUsers: 50_000,
  storageGb: 10,
  egressGb: 50,
});

const clerkTrap = clerkResult.billingGotchas.find((g) => g.id === 'clerk_mau_scaling');
if (clerkTrap && clerkResult.totalMonthlyCost > 800) {
  console.log(`[OK] Test 3 Superado: Escalado de Clerk detectado ($${clerkResult.totalMonthlyCost}/mes para 50k MAU).`);
} else {
  throw new Error(`Test 3 Falló: Cálculo de Clerk incorrecto: $${clerkResult.totalMonthlyCost}`);
}

console.log('[DONE] Todas las pruebas del simulador de costes pasaron exitosamente.');
