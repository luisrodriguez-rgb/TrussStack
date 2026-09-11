# Directrices de Contribucion a TrussStack

Gracias por tu interes en contribuir a **TrussStack**. Como motor de arquitectura tecnica determinista, este proyecto mantiene estandares rigurosos de calidad de codigo, reproducibilidad y disciplina en el control de versiones.

---

## Principios Fundamentales del Proyecto

1. **Determinismo Absoluto**: La logica de calculo de afinidad, pesos y compatibilidad se ejecuta 100% en TypeScript en el cliente. No se aceptan dependencias opacas de inferencia probabilistica o LLMs en el nucleo del motor.
2. **Cero Emojis (Regla Obligatoria)**: No se permite el uso de emojis en codigo, interfaces de usuario, documentacion o mensajes de commit. Se utilizan indicadores de texto monoespaciado en su lugar: `[ OK ]`, `[ ! ]`, `[ + ]`, `▲`, `↗`, `->`.
3. **Estetica Modern-Retro**: Contraste alto con amarillo vivo `#FFD000` sobre carbon profundo `#090B10`, tipografia monoespaciada e interfaces densas en informacion tecnica util.
4. **Paridad Bilingue**: Cualquier texto nuevo de interfaz debe contar con traduccion equivalente en espanol e ingles en `src/i18n/translations.ts`.

---

## Estandar de Commits Atomicos y Descriptivos

Este repositorio sigue de forma estricta las siguientes reglas de versionado:

### 1. Un commit = Un cambio logico
Cada commit debe representar una sola modificacion conceptual y coherente. No mezcles refactors con nuevas funcionalidades, cambios de estilo o actualizacion de dependencias en un mismo commit.

### 2. Formato Conventional Commits
Utiliza siempre una categoria clara y concisa:

- `feat(scope):` Nueva funcionalidad.
- `fix(scope):` Correccion de un error o incompatibilidad.
- `refactor(scope):` Cambio estructural interno sin alterar el comportamiento observable.
- `style(scope):` Cambios exclusivamente de formato o estilos visuales.
- `test(scope):` Creacion o modificacion de pruebas unitarias.
- `docs(scope):` Modificaciones exclusivamente de documentacion.
- `chore(scope):` Tareas de mantenimiento, dependencias o tooling.
- `perf(scope):` Optimizaciones de rendimiento o reduccion de bundle size.

### 3. Mensajes claros y descriptivos
El mensaje debe explicar que cambio y con que proposito sin necesidad de abrir el diff.
- Incorrecto: `fix: ajustes varios`
- Correcto: `fix(cost): corregir calculo de salto de plan en Vercel Pro al superar 25M invocaciones`

---

## Flujo de Desarrollo Local

### 1. Clonar el repositorio y crear una rama
```bash
git clone https://github.com/luisrodriguez-rgb/TrussStack.git
cd TrussStack
git checkout -b feat/mi-mejora
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Validar calidad de codigo y pruebas antes de cada commit
Asegurate de que las siguientes tres comprobaciones pasen con cero errores:

```bash
npm run lint    # Ejecuta oxlint
npm test        # Ejecuta la suite de pruebas unitarias deterministas
npm run build   # Valida la compilacion estricta de TypeScript y el bundle
```

---

## Politica de Pull Requests

- Toda Pull Request debe describir el problema resuelto y el enfoque tecnico adoptado.
- Si anades una tecnologia al catalogo, asegurate de proporcionar:
  - Metricas de DX, curva de aprendizaje y ecosistema.
  - Perfil detallado de costes y limites de free tier.
  - Telemetria de benchmarks (cold starts, bundle, memoria).
  - Imagen Docker oficial para la evaluacion de self-hosting.
  - Logo vectorial SVG nativo en `TechLogo.tsx`.
- Las pruebas automatizadas del pipeline de CI deben concluir en estado exitoso para poder realizar el merge.
