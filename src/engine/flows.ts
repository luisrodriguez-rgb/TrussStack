import type { TechCategory } from './types';

export interface ProtocolInspection {
  id: string;
  title: string;
  sourceLayer: string;
  targetLayer: string;
  protocolName: string;
  transport: string;
  defaultPort: string;
  latencyBudget: string;
  securityHardening: string[];
  headersAndParams: string[];
  architectureNotes: string;
}

export interface FlowStep {
  step: number;
  sourceCategory: TechCategory | 'client_browser' | 'third_party_gateway';
  targetCategory: TechCategory;
  label: string;
  protocol: string;
  latency: string;
  payloadDescription: string;
}

export interface FlowScenario {
  id: string;
  code: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  involvedCategories: TechCategory[];
  steps: FlowStep[];
}

export const PROTOCOL_INSPECTIONS: Record<string, ProtocolInspection> = {
  ingress_to_app: {
    id: 'ingress_to_app',
    title: 'INGRESS & CLIENT <-> APPLICATION ENGINE',
    sourceLayer: '01. Ingress & Client Interface',
    targetLayer: '02. Application Engine & API',
    protocolName: 'HTTPS (HTTP/2 / HTTP/3) / RPC',
    transport: 'TLS 1.3 over TCP / QUIC (UDP 443)',
    defaultPort: '443 / 80',
    latencyBudget: '15ms - 45ms (Edge CDN Ingress)',
    securityHardening: [
      'TLS 1.3 obligatorio con ciphers suites seguras (CHACHA20 / AES-GCM)',
      'Content-Security-Policy (CSP) estricto y HSTS (Strict-Transport-Security: max-age=63072000)',
      'Validación y sanitización estricta de payloads con esquemas tipados (Zod / Valibot)',
      'CORS restrictivo limitando Access-Control-Allow-Origin únicamente al dominio frontend',
    ],
    headersAndParams: [
      'Authorization: Bearer <token_jwt>',
      'Content-Type: application/json; charset=utf-8',
      'X-Request-Id: <uuid_v4>',
      'Cache-Control: public, s-maxage=3600, stale-while-revalidate=600',
    ],
    architectureNotes:
      'Si el Frontend y el Backend corren en una solución integrada (Next.js / Remix), este salto se ejecuta en memoria o sobre bucle local en la misma función serverless, reduciendo la latencia de red a < 1ms.',
  },
  app_to_data: {
    id: 'app_to_data',
    title: 'APPLICATION ENGINE <-> DATA & PERSISTENCE',
    sourceLayer: '02. Application Engine & API',
    targetLayer: '03. Persistence, Database & State',
    protocolName: 'PostgreSQL Wire Protocol / S3 REST API',
    transport: 'TCP con SSL/TLS 1.3 o HTTP/2 REST',
    defaultPort: '5432 (Postgres) / 443 (Object Storage)',
    latencyBudget: '2ms - 15ms (Colocación en misma región / VPC)',
    securityHardening: [
      'Pool de conexiones activo (PgBouncer o Prisma Accelerate) para evitar agotar sockets en Serverless',
      'Row Level Security (RLS) habilitado por defecto para aislar tenants a nivel de base de datos',
      'Credenciales inyectadas exclusivamente vía variables de entorno en runtime, nunca en código fuente',
      'Acceso a almacenamiento de objetos mediante URLs prefirmadas temporales con expiración en minutos',
    ],
    headersAndParams: [
      'DATABASE_URL=postgresql://user:pass@pooler.host:5432/dbname?pgbouncer=true',
      'X-Amz-Expires: 900 (15 minutos para subidas S3/R2)',
      'Content-Disposition: attachment; filename="..."',
    ],
    architectureNotes:
      'En entornos serverless, abrir conexiones directas a PostgreSQL en cada invocación puede saturar la base de datos. Se exige un proxy o pooler con soporte de WebSockets/HTTP (como Supabase Pooler o Neon Serverless Driver).',
  },
  app_to_services: {
    id: 'app_to_services',
    title: 'APPLICATION & CLIENT <-> MANAGED SERVICES',
    sourceLayer: '02. Application Engine / 03. Persistence',
    targetLayer: '04. Third-Party Managed Services (Auth & Billing)',
    protocolName: 'OAuth 2.0 / OpenID Connect / Webhooks HMAC',
    transport: 'HTTPS REST con firmas criptográficas HMAC-SHA256',
    defaultPort: '443',
    latencyBudget: '80ms - 250ms (Llamadas a APIs de terceros)',
    securityHardening: [
      'Validación de firmas criptográficas en webhooks de Stripe/LemonSqueezy antes de procesar eventos',
      'Idempotencia obligatoria en endpoints de cobro mediante Idempotency-Key headers',
      'Tokens de sesión JWT almacenados en cookies HttpOnly, Secure, SameSite=Lax para prevenir XSS',
      'Rotación automática de claves secretas y certificados OAuth',
    ],
    headersAndParams: [
      'Stripe-Signature: t=1614093910,v1=5257a869e7eceefe325420f...',
      'Idempotency-Key: <unique_transaction_hash>',
      'Set-Cookie: __Host-auth-token=...; HttpOnly; Secure; SameSite=Lax; Path=/',
    ],
    architectureNotes:
      'Los webhooks entrantes deben responder 200 OK en < 500ms y delegar el procesamiento pesado a colas de trabajo en segundo plano para evitar reintentos y bloqueos de pasarela.',
  },
  app_to_ops: {
    id: 'app_to_ops',
    title: 'SYSTEM TOPOLOGY <-> CLOUD INFRASTRUCTURE & OPS',
    sourceLayer: 'Arquitectura Completa',
    targetLayer: '05. Cloud Infrastructure & Observability',
    protocolName: 'OTLP (OpenTelemetry) / APM / GitOps CI Hooks',
    transport: 'gRPC / HTTPS con mTLS o Tokens de API',
    defaultPort: '4317 (gRPC OTLP) / 443 (HTTPS Sentry/Logflare)',
    latencyBudget: 'Asíncrono en background (Cero impacto en el usuario final)',
    securityHardening: [
      'Filtrado y ofuscación estricta de PII (Personally Identifiable Information) y passwords en logs',
      'Sampling dinámico de trazas (10% en peticiones sanas, 100% en errores HTTP 5xx)',
      'Alertas de umbral configuradas sobre errores de despliegue y saturación de base de datos',
      'Protección de ramas de producción en GitHub Actions con tests deterministas obligatorios',
    ],
    headersAndParams: [
      'X-Sentry-Auth: Sentry sentry_version=7, sentry_key=...',
      'traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01',
    ],
    architectureNotes:
      'La telemetría no debe bloquear la respuesta HTTP al cliente. Los clientes SDK de observabilidad como Sentry flushan eventos en hilos de fondo o al finalizar el ciclo de la función lambda.',
  },
};

export const FLOW_SCENARIOS: FlowScenario[] = [
  {
    id: 'auth_session_flow',
    code: 'FLOW-01',
    title: 'Autenticación & Mutación Transaccional',
    titleEn: 'Authentication & Transactional Mutation',
    description:
      'El cliente envía credenciales, se valida el token JWT en el middleware y se ejecuta la consulta protegida con políticas RLS en PostgreSQL.',
    descriptionEn:
      'The client submits credentials, validates the JWT token in middleware, and executes a secured query with PostgreSQL RLS policies.',
    involvedCategories: ['frontend', 'backend', 'auth', 'database'],
    steps: [
      {
        step: 1,
        sourceCategory: 'client_browser',
        targetCategory: 'frontend',
        label: 'Envío de credenciales (OAuth / Social o email)',
        protocol: 'HTTPS POST /api/auth/callback',
        latency: '15ms',
        payloadDescription: 'Payload JSON con authorization code o email/password hasheado.',
      },
      {
        step: 2,
        sourceCategory: 'frontend',
        targetCategory: 'auth',
        label: 'Verificación de sesión y emisión de tokens',
        protocol: 'OAuth2 / OpenID Connect',
        latency: '65ms',
        payloadDescription: 'Validación de firma criptográfica y generación de access/refresh JWT tokens.',
      },
      {
        step: 3,
        sourceCategory: 'frontend',
        targetCategory: 'backend',
        label: 'Petición de mutación con cookie de sesión segura',
        protocol: 'Internal Route Handler / RPC',
        latency: '2ms',
        payloadDescription: 'Header Cookie: __Host-auth-token con contexto del usuario autenticado.',
      },
      {
        step: 4,
        sourceCategory: 'backend',
        targetCategory: 'database',
        label: 'Ejecución de consulta con aislamiento RLS',
        protocol: 'TCP Pooler / SQL Wire (5432)',
        latency: '8ms',
        payloadDescription: 'SET LOCAL role = "authenticated"; SELECT * FROM orders WHERE user_id = auth.uid();',
      },
    ],
  },
  {
    id: 'public_seo_flow',
    code: 'FLOW-02',
    title: 'Lectura Pública Ultrarrápida & SEO',
    titleEn: 'Ultra-Fast Public Read & SEO Hydration',
    description:
      'Petición pública resuelta en el nodo Edge más cercano con caché distribuida y mínima latencia.',
    descriptionEn:
      'Public read request resolved at the nearest Edge CDN node with distributed caching and minimal latency.',
    involvedCategories: ['hosting', 'frontend', 'database'],
    steps: [
      {
        step: 1,
        sourceCategory: 'client_browser',
        targetCategory: 'hosting',
        label: 'Petición GET desde el navegador del usuario',
        protocol: 'HTTPS / HTTP/3 over QUIC',
        latency: '12ms',
        payloadDescription: 'GET /blog/architecture-patterns con cabecera Accept-Encoding: br, gzip.',
      },
      {
        step: 2,
        sourceCategory: 'hosting',
        targetCategory: 'frontend',
        label: 'Inspección de caché en Edge CDN',
        protocol: 'Edge Cache Lookup (SWR)',
        latency: '3ms',
        payloadDescription: 'Cache HIT: Retorna HTML pre-renderizado instantáneamente sin tocar servidor.',
      },
      {
        step: 3,
        sourceCategory: 'frontend',
        targetCategory: 'database',
        label: 'Revalidación en segundo plano (Cache MISS)',
        protocol: 'PostgreSQL Read Replica',
        latency: '15ms',
        payloadDescription: 'SELECT id, title, content FROM posts WHERE slug = $1; (Solo si expira s-maxage).',
      },
    ],
  },
  {
    id: 'secure_upload_flow',
    code: 'FLOW-03',
    title: 'Subida Segura de Archivos a Storage',
    titleEn: 'Secure Direct-to-Storage File Upload',
    description:
      'El cliente solicita una URL prefirmada al servidor y sube el archivo directamente al bucket sin sobrecargar el backend.',
    descriptionEn:
      'The client requests a presigned URL and uploads directly to the object storage bucket without burdening backend compute.',
    involvedCategories: ['frontend', 'backend', 'storage', 'database'],
    steps: [
      {
        step: 1,
        sourceCategory: 'client_browser',
        targetCategory: 'frontend',
        label: 'Solicitud de URL prefirmada para subida',
        protocol: 'HTTPS POST /api/upload/presigned',
        latency: '20ms',
        payloadDescription: '{ filename: "invoice.pdf", contentType: "application/pdf", sizeBytes: 204800 }',
      },
      {
        step: 2,
        sourceCategory: 'frontend',
        targetCategory: 'storage',
        label: 'Generación de firma criptográfica temporal S3/R2',
        protocol: 'AWS SDK S3 SigV4',
        latency: '5ms',
        payloadDescription: 'Genera URL con X-Amz-Signature válida por 15 minutos con permisos PUT estrictos.',
      },
      {
        step: 3,
        sourceCategory: 'client_browser',
        targetCategory: 'storage',
        label: 'Subida directa del binario al bucket',
        protocol: 'HTTPS PUT direct to S3/R2 Bucket',
        latency: '120ms',
        payloadDescription: 'Transferencia directa cliente -> bucket, liberando al backend de consumir RAM/cómputo.',
      },
      {
        step: 4,
        sourceCategory: 'storage',
        targetCategory: 'database',
        label: 'Registro de metadata del archivo subido',
        protocol: 'Postgres SQL Insert / Webhook',
        latency: '10ms',
        payloadDescription: 'INSERT INTO files (url, size, user_id, status) VALUES (...);',
      },
    ],
  },
  {
    id: 'webhook_billing_flow',
    code: 'FLOW-04',
    title: 'Procesamiento de Pagos & Webhook Asíncrono',
    titleEn: 'Payment Gateway Webhook & Async Fulfillment',
    description:
      'Recepción de evento de cobro exitoso, verificación de firma HMAC y actualización atómica de estado.',
    descriptionEn:
      'Receipt of successful payment event, HMAC cryptographic signature verification, and atomic state update.',
    involvedCategories: ['payments', 'backend', 'database', 'email'],
    steps: [
      {
        step: 1,
        sourceCategory: 'third_party_gateway',
        targetCategory: 'backend',
        label: 'Envío de webhook por pasarela de pago (Stripe/Lemon)',
        protocol: 'HTTPS POST /api/webhooks/billing',
        latency: '45ms',
        payloadDescription: 'Evento invoice.payment_succeeded firmado con cabecera Stripe-Signature.',
      },
      {
        step: 2,
        sourceCategory: 'backend',
        targetCategory: 'payments',
        label: 'Validación criptográfica de firma HMAC',
        protocol: 'Crypto HMAC-SHA256 verify',
        latency: '1ms',
        payloadDescription: 'Comprueba stripe.webhooks.constructEvent(...) para prevenir falsificación.',
      },
      {
        step: 3,
        sourceCategory: 'backend',
        targetCategory: 'database',
        label: 'Actualización atómica de suscripción',
        protocol: 'PostgreSQL ACID Transaction',
        latency: '12ms',
        payloadDescription: 'UPDATE subscriptions SET status = "active", current_period_end = ... WHERE customer_id = $1;',
      },
      {
        step: 4,
        sourceCategory: 'backend',
        targetCategory: 'email',
        label: 'Despacho de recibo de compra en segundo plano',
        protocol: 'HTTPS REST API (Resend / SES)',
        latency: '75ms',
        payloadDescription: 'POST /emails con plantilla HTML del recibo sin bloquear la respuesta HTTP 200.',
      },
    ],
  },
];
