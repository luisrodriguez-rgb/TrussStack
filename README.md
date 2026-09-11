# TRUSSSTACK // Technical Architecture & Trade-off Engine

<p align="center">
  <img src="./public/trussstack-banner.jpg" alt="TrussStack - Motor de Arquitectura Determinista" width="700" />
</p>

**TrussStack** es un motor determinista de diseño y evaluación de arquitecturas de software. Modela el stack técnico completo de un proyecto, audita incompatibilidades y fricciones en tiempo real, calcula el balance exacto de compromisos (*trade-offs* en el frente de Pareto) y permite sustituir componentes en caliente con exportación a diagramas de producción.

Disenado con una estética **Modern-Retro** de alto contraste (amarillo vivo `#FFD000` y negro carbón `#090B10`), tipografía técnica monoespaciada, soporte nativo de **Modo Oscuro / Modo Claro**, **Modo Bilingüe (Español / Inglés)** y **cero emojis**.

---

## Características Principales

### 1. Topología del Sistema en 5 Capas
Organización arquitectónica estructurada en capas desacopladas con definición explícita de protocolos de comunicación:
1. **[ 01 ] Ingress & Client Interface**: Frameworks web, renderizado SSR, Edge rendering y static builds (Next.js, Astro, Remix, Vite, SvelteKit).
2. **[ 02 ] Application Engine & Business Logic**: Servidores backend desacoplados o Route Handlers serverless (FastAPI, Express, NestJS, Go Fiber, Hono).
3. **[ 03 ] Persistence, Database & State**: Bases de datos relacionales, serverless o vectoriales con almacenamiento de objetos (PostgreSQL, Supabase, Neon, PlanetScale, Cloudflare D1/R2, AWS S3).
4. **[ 04 ] Third-Party Managed Services**: Autenticación, facturación recurrente y pasarelas de pago (Auth.js, Clerk, Supabase Auth, Stripe, Lemon Squeezy, Resend).
5. **[ 05 ] Cloud Infrastructure & Observability**: Hosting, CDN global, monitorización y CI/CD (Vercel, Cloudflare Pages, Fly.io, Railway, Sentry, GitHub Actions).

### 2. Motor Determinista sin IA (Zero Hallucinations)
A diferencia de herramientas basadas en prompts opacos:
- **Calibración de Restricciones Reales**: Evalúa escala de usuarios (1 a 100k+), presupuesto mensual ($0 strict free tier a crecimiento pro), tamaño del equipo (1 dev a 5+) y seniority.
- **Detección de Fricción Arquitectónica**: Audita incompatibilidades reales entre herramientas (p. ej. *Astro + Auth.js* genera advertencia de fricción por acoplamiento dinámico en sitios estáticos).
- **Fit Score & Justificaciones Transparentes**: Proporciona el porcentaje de afinidad y las razones explícitas por las cuales cada tecnología encaja en el diseño.

### 3. Sustitución en Caliente & Análisis de Trade-offs
- **In-Place Replacement**: Reemplaza cualquier pieza del stack con un clic.
- **Delta en Tiempo Real**: Visualiza inmediatamente el impacto en el Fit Score (`+4% FIT`, `-2% FIT`).
- **Consecuencias Explícitas**: Desglose de qué ganas (`[ + QUÉ GANAS ]`) y qué sacrificas (`[ ! QUÉ SACRIFICAS ]`).
- **Radar de 8 Dimensiones**: Evaluación de Developer Experience (DX), curva de aprendizaje, escalabilidad, ecosistema, comunidad, madurez en producción, complejidad operativa y riesgo de vendor lock-in.

### 4. Exportación Multiformato
- **Mermaid .md**: Diagramas de flujo TD con agrupación por capas y estilo monocromático de producción.
- **Canonical JSON Schema**: Especificación completa serializada en JSON estándar (`trussstack.json`).
- **Excalidraw Vector Scene**: Escena vectorial completa compatible con visualizadores de arquitectura y el motor Sketion.

### 5. Estética Modern-Retro & Cero Emojis
- Paleta retro-industrial con amarillo vivo `#FFD000` sobre carbón profundo `#090B10`.
- Indicadores retro-monospace: `[ 01 ]`, `[ SPEC ]`, `[ SIN TARJETA ]`, `[ OK ]`, `[ ! ]`, `▲`, `↗`, `+`.
- Tarjetas con logos SVG vectoriales de 32x32 px integrados, límites detallados del free tier y tags de capa.
- Alternador de idioma instantáneo: **Español** / **English**.
- Alternador de tema instantáneo: **Oscuro** / **Claro**.

---

## Estructura del Proyecto

```text
TrussStack/
├── src/
│   ├── engine/                     # Núcleo determinista
│   │   ├── types.ts                # Modelos y esquemas TypeScript
│   │   ├── catalog.ts              # Catálogo de 50+ tecnologías auditadas
│   │   ├── recommender.ts          # Motor de scoring y cálculo de trade-offs
│   │   └── __tests__/              # Pruebas unitarias automatizadas
│   ├── components/
│   │   ├── common/TechLogo.tsx     # 45+ logos vectoriales SVG nativos
│   │   ├── layout/Header.tsx       # Cabecera con KPIs, tema e idioma
│   │   ├── wizard/SpecWizard.tsx   # Formulario de especificación técnica
│   │   ├── canvas/                 # Matriz de arquitectura y drawer
│   │   │   ├── ArchitectureCanvas.tsx
│   │   │   ├── TradeoffDrawer.tsx
│   │   │   └── ReplaceModal.tsx
│   │   └── export/ExportModal.tsx  # Centro de exportación
│   ├── exporters/                  # Generadores Mermaid, JSON y Excalidraw
│   ├── i18n/                       # Infraestructura y traducciones ES/EN
│   ├── App.tsx                     # Orquestador principal y sincronización de tema
│   └── index.css                   # Sistema de diseño Vanilla CSS Modern-Retro
├── index.html
├── package.json
└── tsconfig.json
```

---

## Instalación y Ejecución Local

### Prerrequisitos
- Node.js 18+
- npm 9+

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/luisrodriguez-rgb/TrussStack.git
cd TrussStack
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173/` (o el puerto que asigne Vite).

4. Ejecutar pruebas unitarias del motor determinista:
```bash
npm test
```

5. Compilar para producción:
```bash
npm run build
```

---

## Licencia

Distribuido bajo la Licencia MIT. Consulta `LICENSE` para más información.
