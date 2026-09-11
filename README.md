# TRUSSSTACK // Technical Architecture & Trade-off Engine

<p align="center">
  <img src="./public/trussstack-banner.jpg" alt="TrussStack - Motor de Arquitectura Determinista" width="700" />
</p>

<p align="center">
  <strong>MOTOR DE ARQUITECTURA DETERMINISTA // DETERMINISTIC ARCHITECTURE ENGINE</strong><br>
  Plataforma técnica para el diseño, simulación de trade-offs, auditoría de drift y exportación de stacks de software modernos.
</p>

<p align="center">
  <a href="https://github.com/luisrodriguez-rgb/TrussStack"><img src="https://img.shields.io/badge/VERSION-4.0%20GA-FFD000?style=for-the-badge&logoColor=090B10&labelColor=090B10" alt="Version 4.0 GA" /></a>
  <a href="https://github.com/luisrodriguez-rgb/TrussStack/blob/main/LICENSE"><img src="https://img.shields.io/badge/LICENCIA-MIT-FFD000?style=for-the-badge&logoColor=090B10&labelColor=090B10" alt="License MIT" /></a>
  <img src="https://img.shields.io/badge/ENGINE-100%25%20DETERMINISTIC%20TS-FFD000?style=for-the-badge&logoColor=090B10&labelColor=090B10" alt="Deterministic Engine" />
  <img src="https://img.shields.io/badge/AI%20DEPENDENCY-ZERO%20HALLUCINATIONS-FFD000?style=for-the-badge&logoColor=090B10&labelColor=090B10" alt="Zero Hallucinations" />
  <img src="https://img.shields.io/badge/TESTS-19%20PASSING-00E699?style=for-the-badge&logoColor=090B10&labelColor=090B10" alt="19 Tests Passing" />
</p>

---

## Que es TrussStack

**TrussStack** es un motor técnico determinista de arquitectura de software disenado para ingenieros que necesitan tomar decisiones de stack fundamentadas, reproducibles y explicables. 

A diferencia de catálogos pasivos o asistentes basados en LLMs propensos a alucinaciones y sesgos comerciales, TrussStack evalúa matrices de compatibilidad matemática, calcula penalizaciones de fricción entre capas, proyecta costes reales de infraestructura (incluyendo trampas de transferencia saliente / egress), audita el drift de dependencias en `package.json` mediante CI/CD y genera documentación formal conforme al estándar **MADR 3.0**.

Construido con una estética **Modern-Retro** de alto contraste (amarillo técnico `#FFD000` y negro carbón `#090B10`), tipografía monoespaciada, soporte completo de **Modo Oscuro / Modo Claro**, **Modo Bilingüe (Español / Inglés)** en tiempo real y **cero emojis**.

---

## Filosofia de Ingenieria: Que Hace y Que NO Hace

| [ + ] LO QUE HACE TRUSSSTACK | [ ! ] LO QUE NO HACE TRUSSSTACK |
| :--- | :--- |
| **Evaluacion Determinista Tipada**: Algoritmos en TypeScript con 0 ms de latencia y resultados reproducibles sin llamadas lentas a APIs externas. | **Cero Alucinaciones de IA**: No genera recomendaciones aleatorias ni se basa en cadenas de texto no estructuradas de LLMs. |
| **Deteccion de Fricciones & Costes Ocultos**: Alerta inmediata de incompatibilidades reales (ej. Astro + Auth.js) y trampas de egress de ancho de banda. | **Cero Sesgo Comercial**: Ninguna tecnologia paga por posicionamiento ni existen enlaces patrocinados u ocultos de afiliados. |
| **Telemetria de Benchmarks Empiricos**: Tiempos medidos de arranque en frio (cold starts), tamano de bundle transferido y memoria en reposo. | **No Infla el Boilerplate**: No te obliga a crear proyectos gigantescos ni genera codigo basura que nadie entiende. |
| **Estandar MADR 3.0 & DevOps Scaffolding**: Exporta registros formales de decision (`ARCHITECTURE-ADR.md`), `docker-compose.yml` y `.env.example`. | **No Ignora la Realidad Operativa**: No oculta el coste a 3 anos de mantenimiento ni la complejidad de mantener clusters. |
| **Auditoria GitOps en CI/CD**: Compara tu arquitectura declarada contra tu `package.json` y rompe el build si existe drift no autorizado. | **No Impone Microservicios**: Reconoce cuándo un monolito modular o una arquitectura serverless edge es la opcion correcta para tu fase. |

---

## El Ciclo de Vida Tecnico en 4 Pasos

TrussStack estructura el diseno de software en cuatro etapas metodologicas rigurosas:

```text
[ 01. ESPECIFICAR ]  ──>  [ 02. EVALUAR & DISENAR ]  ──>  [ 03. COMPARAR & BENCHMARKS ]  ──>  [ 04. AUDITAR & CONSTRUIR ]
   Requisitos, Escala        Topologia 5 Capas,          Radar de Arquetipos,              Linter de Drift GitOps,
   y Presupuesto Real        Sustitucion & Protocolos    Costes & Telemetria Empirica      MADR 3.0 & Docker-Compose
```

### Paso 1: Especificar ([Requisitos])
Define parámetros críticos del proyecto: tipo de aplicación (SaaS MVP, Blog/SEO, E-commerce, API asíncrona, Local-First), escala esperada de usuarios (1k a 100k+ MAU), tamaño y seniority del equipo de desarrollo, presupuesto mensual de infraestructura ($0 strict free tier a crecimiento) y módulos prioritarios.

### Paso 2: Evaluar & Disenar ([Arquitectura Canvas])
Explora la topología del sistema organizada en 5 capas desacopladas con 26+ componentes auditados. Inspecciona el **Fit Score global**, la compatibilidad cruzada, las fricciones detectadas y el coste mensual proyectado. Permite la **sustitución de componentes en caliente** con cálculo instantáneo del balance de compromisos (*trade-offs* en el frente de Pareto).

### Paso 3: Comparar & Benchmarks ([Comparar] & [Benchmarks])
Contrasta arquetipos cara a cara (*Fullstack Serverless Edge* vs *Decoupled API* vs *Local-First SQLite*) mediante un radar multicriterio. Analiza métricas empíricas de benchmarks (arranques en frío en milisegundos, tamaño de bundle en kB, peticiones por segundo y consumo de memoria) y evalúa la viabilidad operativa de auto-hospedar herramientas (*Self-Hosting vs Managed Cloud*).

### Paso 4: Auditar & Construir ([Explorar] & [Exportar])
Descarga el bundle de producción con documentación formal MADR 3.0, configuración ejecutable de contenedores `docker-compose.yml`, archivo de variables `.env.example` y diagramas vectoriales para Mermaid y Excalidraw. Conecta el linter GitOps a tu repositorio para auditar desvíos entre la arquitectura planeada y el `package.json` en cada Pull Request.

---

## Caracteristicas de la Plataforma

### 1. Topologia de Arquitectura en 5 Capas + 3 Categorias de Infraestructura
Organización desacoplada con protocolos explícitos de red:
1. **[ 01 ] Ingress & Client Interface**: Next.js (App Router), Astro, Remix, Vite (React SPA), SvelteKit.
2. **[ 02 ] Application Engine & Business Logic**: FastAPI, Express, NestJS, Go Fiber, Hono (Edge API).
3. **[ 03 ] Persistence, Database & State**: PostgreSQL, Supabase Postgres, Neon Serverless, PlanetScale, Cloudflare D1/R2, Turso (libSQL), AWS S3.
4. **[ 04 ] Third-Party Managed Services**: Auth.js, Clerk Auth, Better Auth, Supabase Auth, Stripe, Lemon Squeezy, Resend, Postmark.
5. **[ 05 ] Cloud Infrastructure & Observability**: Vercel, Cloudflare Pages, Fly.io, Railway, Hetzner Cloud, Sentry, Better Stack, GitHub Actions.

*Categorias de ampliacion de infraestructura*:
- **AI & Vector Search**: pgvector (PostgreSQL), LangChain / LlamaIndex, OpenAI / Anthropic APIs, Ollama (Local LLM).
- **Asynchronous Background Queues**: BullMQ (Redis-backed), RabbitMQ, AWS SQS, Upstash QStash.
- **Cross-Platform Mobile**: React Native / Expo, Flutter, Capacitor, Tauri Mobile.

### 2. Trazador de Flujos de Datos & Protocolos en Tiempo Real
Simulador interactivo montado sobre el canvas de arquitectura:
- **Escenarios de Arquitectura Preconfigurados**:
  - `[ FLOW-01 ] Autenticacion & Mutacion Transaccional`: Browser -> Next.js Route Handler -> Auth.js JWT -> Supabase Postgres RLS.
  - `[ FLOW-02 ] Lectura Publica Ultrarrapida & SEO`: Browser -> Cloudflare CDN -> SSR Cache -> Hydration estatica.
  - `[ FLOW-03 ] Subida Directa de Archivos a Storage`: Browser -> Presigned URL API -> S3/R2 Bucket -> Registro SQL.
  - `[ FLOW-04 ] Procesamiento de Pagos & Webhook`: Stripe/Lemon Squeezy -> Webhook Ingress -> Validacion HMAC-SHA256 -> Transaccion ACID en Postgres -> Envio asincrono con Resend.
- **Inspector de Seguridad & Hardening de Protocolos**:
  - Al pulsar cualquier conector de red se auditan: Transporte (TLS 1.3, QUIC, Postgres Wire Protocol, gRPC), puertos (443, 5432, 4317), presupuesto de latencia p95, cabeceras requeridas (`Idempotency-Key`, `Stripe-Signature`) y checklist de seguridad (Content-Security-Policy, cookies HttpOnly SameSite=Lax).

### 3. Simulador Dinamico de Costes & Trampas de Egress
- **Calculadora en Tiempo Real**: Deslizadores interactivos de usuarios activos mensuales (1k a 500k MAU) y volumen de almacenamiento (1 GB a 2 TB).
- **Deteccion de Trampas de Egress**: Alertas críticas automáticas sobre proveedores que cobran transferencia saliente agresiva (ej. AWS S3 a $0.09/GB vs Cloudflare R2 con egress ilimitado a $0).
- **Proyeccion de Escalado por Herramienta**: Desglose transparente de saltos de plan (Vercel Pro $20/seat, Clerk Auth $0.02/MAU pasados los 10k, Supabase Pro $25/mes, Neon Launch $19/mes).
- **Calculo de Breakeven Serverless vs VPS**: Determina exactamente a partir de qué volumen de tráfico resulta más rentable migrar de funciones serverless a un servidor dedicado o VPS (Hetzner / Fly.io).

### 4. Comparador Cara a Cara de Arquetipos
- Vista dedicada para contrastar simultáneamente 3 filosofías de ingeniería:
  - *Arquetipo A: Fullstack Serverless Edge* (Next.js + Supabase + Cloudflare).
  - *Arquetipo B: Decoupled Containerized API* (React SPA + FastAPI / Go + PostgreSQL + Redis).
  - *Arquetipo C: Local-First Reactive Edge* (Vite + Hono + Turso libSQL + Cloudflare R2).
- Radar de evaluación técnica en 5 ejes: Experiencia de desarrollo (DX), velocidad al mercado (Time to Market), costes en escala, latencia global y riesgo de vendor lock-in.

### 5. Galeria de Blueprints de Produccion de la Industria
Colección de 8 arquitecturas reales inspiradas en proyectos y compañías de referencia:
1. **Cal.com**: Next.js App Router + Prisma + PostgreSQL + Stripe + SendGrid.
2. **Supabase Studio**: Next.js + Go Fiber + PostgreSQL / PostgREST + GoTrue Auth.
3. **Vercel AI Chatbot**: Next.js + AI SDK + pgvector + Serverless Redis.
4. **Ghost Headless CMS**: React SPA + Node.js Ghost Core + MySQL + Cloudflare CDN.
5. **PostHog Analytics Engine**: ClickHouse + Kafka/BullMQ + Django backend + React.
6. **MedusaJS Headless Commerce**: Medusa Core + PostgreSQL + Redis + Stripe.
7. **Linear / Affine Local-First**: IndexedDB local + CRDT sync + Cloudflare Workers + Turso.
8. **Plausible Analytics**: Elixir/Phoenix + ClickHouse + PostgreSQL + Vanilla JS (1 kB script).
*Carga instantánea de cualquier blueprint en el canvas interactivo con 1 clic.*

### 6. Generador de Architecture Decision Records (MADR 3.0)
- Motor formal de documentación arquitectónica según la especificación **MADR 3.0** (Markdown Architectural Decision Records).
- Genera un documento técnico completo para cada decisión de capa (Frontend, Backend, Database, Auth, Storage, Hosting, etc.).
- Cada registro incluye: Contexto del problema, controladores de decisión (coste, latencia, DX), alternativas evaluadas con pros y contras, decisión adoptada y consecuencias positivas/negativas.
- Exporta el archivo consolidado `ARCHITECTURE-ADR.md` listo para versionar en Git.

### 7. Linter GitOps de Arquitectura & Auditor de Drift
- Inspección estática del archivo `package.json` contra el stack declarado en TrussStack.
- Identifica: Dependencias faltantes, tecnologías no autorizadas introducidas en el código y desvíos de versión.
- Emite un **Indice de Conformidad Arquitectónica** (0% a 100%).
- Exporta:
  - Workflow de CI/CD para GitHub Actions (`.github/workflows/architecture-linter.yml`).
  - Script CLI ejecutable en Node.js (`scripts/arch-linter.js`) para validar automáticamente cada Pull Request.

### 8. Matriz de Benchmarks Empiricos & Evaluador Self-Hosted
- **Telemetria Real de Rendimiento**:
  - Tiempos de arranque en frío (Cold Start) medidos en milisegundos (Vercel Edge vs Node.js Serverless vs Cloudflare Workers).
  - Tamaño de bundle inicial transferido en kB.
  - Throughput de peticiones por segundo bajo concurrencia.
  - Consumo de memoria RAM en reposo y bajo carga.
- **Evaluador de Viabilidad Self-Hosted**:
  - Horas estimadas de mantenimiento mensual de DevOps por componente.
  - Comando Docker oficial listo para producción (`docker run`).
  - Comparativa de coste mensual entre servicio cloud gestionado vs VPS dedicado con cálculo del punto de equilibrio económico.

### 9. Exportacion Multiformato para Ingenieria
- **docker-compose.yml**: Archivo ejecutable con servicios de PostgreSQL, Redis, MinIO y API containers pre-configurados.
- **.env.example**: Plantilla de variables de entorno estándar organizadas por capa técnica.
- **Mermaid .md**: Diagramas de arquitectura estructurados por capas con temas limpios monocromáticos.
- **Canonical JSON Schema**: Especificación completa serializada en JSON estándar (`trussstack.json`).
- **Excalidraw Vector Scene**: Escena vectorial completa compatible con visualizadores de arquitectura y el motor Sketion.

### 10. Comparticion Inmediata por Enlace (URL State)
- Serialización compacta en Base64 URL-safe con codificación liviana.
- Permite compartir cualquier stack, configuración y modificaciones en un enlace directo (`#blueprint=...`) sin necesidad de base de datos externa ni registro de usuarios.

---

## Estructura del Repositorio

```text
TrussStack/
├── public/
│   ├── favicon.png                       # Favicon oficial de la aplicacion
│   └── trussstack-banner.jpg             # Banner tecnico en alta resolucion
├── src/
│   ├── engine/                           # Nucleo determinista sin dependencias externas
│   │   ├── types.ts                      # Tipos de dominio, tecnologia, categorias y especificaciones
│   │   ├── catalog.ts                    # Catalogo de 50+ tecnologias con metricas y perfiles
│   │   ├── extendedCatalog.ts            # Extension con categorias de AI, Queues y Mobile
│   │   ├── catalogI18n.ts                # Diccionarios de traduccion de descripciones y fricciones
│   │   ├── recommender.ts                # Motor de scoring ponderado, compatibilidad y trade-offs
│   │   ├── costSimulator.ts              # Calculadora dinamica de costes, egress y breakeven
│   │   ├── flows.ts                      # Modelado de protocolos, flujos y checklist de seguridad
│   │   ├── adrGenerator.ts               # Generador de registros MADR 3.0 en Markdown
│   │   ├── linter.ts                     # Motor de auditoria estatica de package.json y CI exporter
│   │   └── __tests__/                    # Suite de 19 pruebas unitarias automatizadas
│   │       ├── engine.test.ts            # Tests del recomendador y matrices de friccion
│   │       ├── costSimulator.test.ts     # Tests de calculo de infraestructura y trampas de egress
│   │       ├── urlState.test.ts          # Tests de codificacion y decodificacion de blueprints
│   │       ├── adrGenerator.test.ts      # Tests de generacion de documentos MADR 3.0
│   │       ├── linter.test.ts            # Tests del auditor de drift arquitectonico
│   │       └── benchmarks.test.ts        # Tests de telemetria, cold starts y self-hosting
│   ├── components/
│   │   ├── home/
│   │   │   └── LandingHero.tsx           # Pagina de inicio con banner, filosofia y blueprints
│   │   ├── layout/
│   │   │   └── Header.tsx                # Barra de navegacion superior descongestionada con GitHub
│   │   ├── common/
│   │   │   ├── TechLogo.tsx              # 50+ logos vectoriales SVG nativos
│   │   │   └── TrussLogo.tsx             # Isotipo oficial de TrussStack
│   │   ├── wizard/
│   │   │   └── SpecWizard.tsx            # Asistente de calibracion de requisitos tecnicos
│   │   ├── canvas/
│   │   │   ├── ArchitectureCanvas.tsx    # Matriz visual de 5 capas con instrumentacion
│   │   │   ├── FlowSimulatorBar.tsx      # Barra de control de flujos paso a paso y autoplay
│   │   │   ├── ProtocolModal.tsx         # Inspector de protocolos de red y seguridad
│   │   │   ├── TradeoffDrawer.tsx        # Drawer lateral de trade-offs, radar y self-hosting
│   │   │   └── ReplaceModal.tsx          # Modal de reemplazo en caliente de piezas
│   │   ├── compare/
│   │   │   └── StackComparator.tsx       # Comparador cara a cara de 3 arquetipos de arquitectura
│   │   ├── explore/
│   │   │   └── BlueprintGallery.tsx      # Galeria de 8 blueprints reales de la industria
│   │   ├── benchmarks/
│   │   │   └── BenchmarkMatrix.tsx       # Matriz interactiva de cold starts, bundle y memoria
│   │   ├── cost/
│   │   │   └── CostSimulatorModal.tsx    # Modal interactivo de proyeccion de costes y egress
│   │   ├── linter/
│   │   │   └── DriftAuditModal.tsx       # Modal de auditoria de drift con inspector package.json
│   │   └── export/
│   │       └── ExportModal.tsx           # Centro de exportacion multiformato y devops
│   ├── exporters/
│   │   ├── mermaidExporter.ts            # Exportador a diagramas de flujo Mermaid
│   │   ├── jsonExporter.ts               # Exportador a esquema canonico JSON
│   │   ├── excalidrawExporter.ts         # Exportador a escena vectorial Excalidraw
│   │   └── scaffoldExporter.ts           # Exportador de docker-compose.yml y .env.example
│   ├── utils/
│   │   └── urlState.ts                   # Utilidades de serializacion compacta URL-safe
│   ├── i18n/
│   │   ├── translations.ts               # Textos de UI en Espanol e Ingles al 100%
│   │   └── I18nContext.tsx               # Contexto React de idioma con cambio en caliente
│   ├── App.tsx                           # Enrutador de vistas, orquestador de estado y hash sync
│   ├── main.tsx                          # Punto de entrada de la aplicacion React
│   └── index.css                         # Sistema de diseno Modern-Retro Vanilla CSS (57 kB)
├── index.html                            # Documento HTML raiz con favicon oficial
├── package.json                          # Manifiesto de dependencias y scripts
├── tsconfig.json                         # Configuracion TypeScript
└── vite.config.ts                        # Configuracion del bundler Vite
```

---

## Guia de Instalacion y Ejecucion Local

### Prerrequisitos
- **Node.js**: Version 18.0 o superior.
- **npm**: Version 9.0 o superior.

### Pasos de Instalacion

1. **Clonar el repositorio**:
```bash
git clone https://github.com/luisrodriguez-rgb/TrussStack.git
cd TrussStack
```

2. **Instalar dependencias del proyecto**:
```bash
npm install
```

3. **Iniciar el servidor local de desarrollo**:
```bash
npm run dev
```
La aplicación iniciará en `http://localhost:5173/` (o el puerto que asigne Vite).

4. **Ejecutar la suite completa de pruebas unitarias**:
```bash
npm test
```
Ejecuta las 19 pruebas deterministas del motor (scoring, simulador de costes, serialización URL, generación MADR 3.0, linter de drift y benchmarks).

5. **Compilar para produccion**:
```bash
npm run build
```
Valida la integridad de tipos en TypeScript (`tsc -b`) y genera el bundle optimizado en la carpeta `dist/`.

---

## Estandar de Commits Atomicos

Este repositorio sigue estrictamente la convención de **Conventional Commits** profesionales, atómicos y descriptivos. Cada commit representa una única unidad lógica de cambio sin mezclar refactors con funcionalidades ni cambios de estilo:

- `feat(scope):` Nuevas funcionalidades.
- `refactor(scope):` Cambios estructurales sin modificar el comportamiento del usuario.
- `style(scope):` Modificaciones exclusivamente de formato, espaciados o CSS.
- `test(scope):` Creación o actualización de pruebas unitarias.
- `docs(scope):` Cambios exclusivamente en archivos de documentación.
- `chore(scope):` Tareas de mantenimiento, dependencias o tooling.

*Regla obligatoria del proyecto: Cero emojis en mensajes de commit, comentarios de código o interfaces de usuario.*

---

## Licencia

Distribuido bajo la **Licencia MIT**. Consulta el archivo `LICENSE` para conocer los términos completos.

---

<p align="center">
  <strong>TRUSSSTACK // DETERMINISTIC ARCHITECTURE ENGINE</strong><br>
  Diseñado para ingenieros que valoran el rigor técnico, la predictibilidad operativa y las decisiones de arquitectura transparentes.
</p>
