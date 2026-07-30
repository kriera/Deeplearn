# DeepLearn

**Aprende cualquier cosa. Explícalo como Feynman.**

Motor de aprendizaje Feynman que genera explicaciones en 5 niveles y quizzes para cualquier concepto, impulsado por IA local (Ollama). Construido con Clean Architecture + Hexagonal (Ports & Adapters) como proyecto final del Máster en Desarrollo con IA de BIG School.

**🌐 App publicada**: <https://deeplearn-three.vercel.app> — requiere Ollama en tu máquina; ver [Usar la app desplegada](#usar-la-app-desplegada-el-local-first-se-mantiene).

**Local-first** (ADR-005): sin servidor propio ni API keys que gestionar. La SPA corre en tu navegador y llama a **tu** Ollama; tus sesiones viven en `localStorage`, sin login.

> **Matiz de privacidad (importante):** el modelo por defecto `gpt-oss:120b-cloud` usa Ollama como _pasarela_ hacia la nube de Ollama — los prompts **salen a `ollama.com`** y requiere `ollama signin`. Se elige por defecto por su calidad. Para privacidad **100 % en tu máquina** (los prompts no salen), configura un modelo genuinamente local, p. ej. `VITE_AI_MODEL=llama3.2`. La ejecución (navegador + Ollama) y la persistencia (localStorage) son locales en ambos casos; lo que cambia es si los _prompts_ viajan al modelo en la nube. Detalle en [ADR-005](docs/adr/005-distribucion-local-first.md).

> **Sin login**: la aplicación no tiene registro ni inicio de sesión — es una decisión de diseño, no una carencia. Al ser local-first, los datos ya son personales por definición (viven en el navegador de cada usuario), así que no hay credenciales de prueba que entregar. Justificación completa en [ADR-005](docs/adr/005-distribucion-local-first.md).

---

## Funcionalidades principales

- **Ruta Feynman de 5 niveles**: escribe cualquier concepto y obtén explicaciones adaptadas a 5 audiencias, desde un niño de 6 años (Elemental) hasta una audiencia investigadora (Experto).
- **Quiz por nivel**: 5 preguntas tipo test generadas por IA en cada nivel; acierta 4/5 para desbloquear el siguiente.
- **Re-explicación adaptativa**: si suspendes un quiz, el motor re-explica el nivel con una analogía distinta, centrada en tus áreas débiles.
- **Generación progresiva**: la explicación se muestra en cuanto está lista y el quiz se genera en segundo plano mientras lees; el siguiente nivel se prepara mientras ves tu resultado.
- **Siempre en castellano**: todo el contenido generado —explicaciones, preguntas, opciones y tarjetas— sale en español, aunque escribas el concepto en otro idioma («machine learning», «black holes»).
- **Repaso espaciado (SRS)**: superar un nivel genera tarjetas de repaso programadas con un algoritmo inspirado en SM-2 (variante binaria: recordada/olvidada sobre el factor de facilidad e intervalo); repásalas desde la pantalla de inicio o al completar un concepto.
- **Persistencia de sesiones**: las sesiones viven en localStorage; retoma cualquier concepto reciente desde la pantalla de inicio.
- **Autoevaluación**: valora tu comprensión y deja feedback al completar un concepto.

---

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    Capa de UI                        │
│  React 19 · Framer Motion · Tailwind CSS 4           │
│  Páginas: Entry → Level → Quiz → Completion          │
│  Hooks: useSession · useQuiz · useSrs                │
└──────────────────────┬──────────────────────────────┘
                       │ depende de
┌──────────────────────▼──────────────────────────────┐
│               Capa de Aplicación                     │
│  Casos de uso: StartSession · SubmitQuiz             │
│            GenerateLevelContent                      │
│  Puertos: SessionRepository · AiProvider (interfaces)│
└──────┬───────────────────────────────────────┬───────┘
       │ implementa                            │ implementa
┌──────▼──────────┐                    ┌───────▼───────┐
│ Capa de Dominio  │                    │Infraestructura│
│  Entidades:      │                    │ Storage:      │
│  Session · Level │                    │ localStorage  │
│  Question        │                    │ IA: Ollama    │
│  Servicios:      │                    │ (gpt-oss:     │
│  SrsService      │                    │  120b-cloud)  │
│  Value Objects   │                    │ Sentry · CI/CD│
└─────────────────┘                    └───────────────┘
```

**Patrones de diseño:** Inversión de dependencias (DIP), Strategy (providers de IA), Repository (persistencia), SRP (casos de uso).

---

## Stack tecnológico

| Capa           | Tecnología              | Versión            |
| -------------- | ----------------------- | ------------------ |
| UI             | React                   | 19.2.7             |
| Build          | Vite                    | 8.1.1              |
| Estilos        | Tailwind CSS            | 4.3.2              |
| Animación      | Framer Motion           | 12.42.2            |
| IA             | Ollama (local)          | gpt-oss:120b-cloud |
| Monitorización | Sentry                  | 10.65.0            |
| Testing        | Vitest                  | 4.1.9              |
| E2E            | Playwright              | 1.61.1             |
| Linting        | Oxlint                  | 1.73.0             |
| Formato        | Prettier                | 3.9.5              |
| CI/CD          | GitHub Actions + Vercel | —                  |

---

## Instalación y ejecución

**Requisitos**: Node 22+ y [Ollama](https://ollama.com) en ejecución en `localhost:11434` (la única dependencia externa de la app — ver ADR-005).

```bash
# 1. Clonar
git clone https://github.com/kriera/Deeplearn.git && cd Deeplearn

# 2. Instalar (NODE_ENV=development necesario para las devDependencies)
NODE_ENV=development npm install

# 3. Instalar Ollama (macOS: brew install ollama · Linux: curl -fsSL https://ollama.com/install.sh | sh
#    · Windows: instalador en https://ollama.com/download) y descargar el modelo
ollama pull gpt-oss:120b-cloud

# 4. Arrancar Ollama (no hace falta si usas la app de escritorio, que ya lo deja en marcha)
ollama serve

# 5. Servidor de desarrollo
npm run dev
```

**Variables de entorno** (`.env`, todas opcionales — valores por defecto en `.env.example`):

| Variable           | Por defecto              | Descripción                                                       |
| ------------------ | ------------------------ | ----------------------------------------------------------------- |
| `VITE_AI_PROVIDER` | `ollama`                 | Provider de IA: `ollama`, `lmstudio`, `ollama-cloud`, `anthropic` |
| `VITE_AI_BASE_URL` | `http://localhost:11434` | URL base del provider de IA                                       |
| `VITE_AI_MODEL`    | `gpt-oss:120b-cloud`     | Nombre del modelo                                                 |
| `VITE_SENTRY_DSN`  | —                        | DSN de Sentry para monitorización de errores                      |
| `VITE_APP_VERSION` | `0.0.0`                  | Versión de release para Sentry (la CI inyecta el SHA del commit)  |

---

## Estructura del proyecto

```
deeplearn/
├── src/
│   ├── domain/
│   │   ├── entities/        # Session, Level, Question
│   │   └── services/        # SrsService (repaso espaciado)
│   ├── application/
│   │   ├── ports/           # SessionRepository, AiProvider (interfaces)
│   │   └── use-cases/       # StartSession, SubmitQuiz, GenerateLevelContent
│   ├── infrastructure/
│   │   ├── ai/
│   │   │   ├── providers/   # BaseAiProvider + 4 adaptadores (Ollama, LM Studio, …)
│   │   │   ├── prompts/     # LevelPrompt, QuizPrompt, ReExplainPrompt, SrsPrompt, language
│   │   │   ├── observability.js         # Latencia/tokens por llamada al modelo (Sentry)
│   │   │   ├── shuffleQuestionOptions.js # Guardrail: baraja opciones del quiz
│   │   │   └── AiProviderFactory.js
│   │   ├── storage/
│   │   │   ├── repositories/  # LocalStorageSessionRepository, InMemorySessionRepository
│   │   │   └── serializers/   # SessionSerializer
│   │   └── sentry.js        # Inicialización de Sentry
│   ├── composition/         # Composition root: config + cableado de dependencias
│   ├── ui/
│   │   ├── atoms/           # Button, Badge, ProgressBar, BackButton, SkeletonCard
│   │   ├── hooks/           # useSession, useQuiz, useSrs
│   │   ├── i18n/            # levelLabels, errorMessages (microcopy de errores)
│   │   └── pages/           # ConceptEntryPage, LevelPage, QuizPage, CompletionPage, SrsReviewPage
│   ├── test/                # Tests unitarios + integración (Vitest)
│   ├── App.jsx              # Componente raíz con enrutado de pantallas
│   ├── main.jsx             # Punto de entrada + ErrorBoundary de Sentry
│   └── index.css            # Tailwind + animaciones propias
├── e2e/                     # Tests E2E (Playwright)
├── scripts/eval.js          # Evals de contenido con golden dataset (npm run eval)
├── docs/
│   ├── adr/                 # Architecture Decision Records (ver adr/README.md)
│   │   ├── 001-clean-architecture-hexagonal.md
│   │   ├── 002-ollama-local-ai-provider.md
│   │   ├── 003-localstorage-persistence.md
│   │   ├── 004-vitest-playwright-testing.md
│   │   └── 005-distribucion-local-first.md
│   ├── PLAN.md              # Plan de implementación
│   ├── evals.md             # Informe de evals de contenido (generado)
│   └── tech-debt.md         # Deuda técnica registrada
├── .github/workflows/ci.yml # Pipeline de CI/CD
├── vercel.json              # Reglas SPA + cabeceras de seguridad
└── .env.example             # Plantilla de variables de entorno
```

---

## Pruebas

```bash
# Tests unitarios + integración (Vitest)
NODE_ENV=development npm test

# Modo watch
NODE_ENV=development npm run test:watch

# Cobertura
NODE_ENV=development npm run test:coverage

# Tests E2E (Playwright — deterministas, modelo de IA mockeado vía page.route)
npx playwright test

# Evals de calidad de contenido (LLMOps — requiere Ollama activo; escribe docs/evals.md)
# Herramienta MANUAL y NO determinista: corre contra el modelo real, el recuento de
# checks puede variar entre ejecuciones. Por eso no está en el CI; su resultado es orientativo.
npm run eval
```

**Umbrales de cobertura** (forzados en `vite.config.js` — la ejecución falla si no se cumplen): 100% en las capas de dominio y aplicación, 80% en componentes de UI.

**Salida esperada** de `NODE_ENV=development npm test`:

```
 Test Files  30 passed (30)
      Tests  208 passed (208)
```

Los E2E corren en la CI en cada push (4 escenarios: camino feliz, quiz suspendido + reintento, navegación y estado de error sin modelo disponible).

---

## Despliegue

**Vercel** (manual):

```bash
NODE_ENV=development npm run build
vercel --prod
```

**GitHub Actions** (automático en cada push a `main`):

1. Lint → 2. Test → 3. Build → 4. Deploy a Vercel

Requiere el secret `VERCEL_TOKEN` en la configuración del repositorio de GitHub.

### Usar la app desplegada (el local-first se mantiene)

> **¿Solo quieres echar un vistazo sin instalar nada?** En la portada, pulsa
> **«Ver un ejemplo (sin instalar nada)»**: carga una sesión de ejemplo
> pre-generada (concepto _la fotosíntesis_ con sus 5 niveles, quizzes y tarjetas
> de repaso) para recorrer toda la app **sin Ollama**. La generación de conceptos
> nuevos sí requiere Ollama, como se explica abajo.

El sitio desplegado es una SPA estática: **todas las llamadas de IA van al Ollama
de tu propia máquina**, nunca a un servidor (ADR-005). Guía completa desde cero:

1. **Instalar Ollama** (una sola vez):

   ```bash
   # macOS
   brew install ollama
   # (o descarga el instalador desde https://ollama.com/download)

   # Linux
   curl -fsSL https://ollama.com/install.sh | sh

   # Windows: instalador desde https://ollama.com/download
   ```

2. **Descargar el modelo** (una sola vez, requiere sesión de Ollama para los
   modelos `-cloud`):

   ```bash
   ollama pull gpt-oss:120b-cloud
   ```

3. **Arrancar Ollama permitiendo el origen de la app** (CORS — Ollama solo
   acepta orígenes locales por defecto):

   ```bash
   OLLAMA_ORIGINS="https://deeplearn-three.vercel.app" ollama serve
   ```

   O de forma persistente en macOS, si prefieres usar la app de escritorio de
   Ollama en vez del comando anterior:

   ```bash
   launchctl setenv OLLAMA_ORIGINS "https://deeplearn-three.vercel.app"
   # reinicia la app de Ollama después
   ```

4. **Abrir <https://deeplearn-three.vercel.app> en Chrome, Edge o Firefox**
   (tratan `http://localhost` como origen confiable; Safari puede bloquear la
   llamada — en ese caso ejecuta la app en local con `npm run dev`, totalmente
   soportado). Si Chrome muestra el aviso de "acceso a la red local" la primera
   vez, acéptalo para que la app pueda hablar con tu Ollama.

---

## Architecture Decision Records

Índice completo con estados: [docs/adr/README.md](docs/adr/README.md)

| ADR                                                 | Decisión                                          | Fecha de decisión |
| --------------------------------------------------- | ------------------------------------------------- | ----------------- |
| [001](docs/adr/001-clean-architecture-hexagonal.md) | Clean Architecture + Hexagonal (Ports & Adapters) | 2026-07-04        |
| [002](docs/adr/002-ollama-local-ai-provider.md)     | Ollama local como provider de IA principal        | 2026-07-08        |
| [003](docs/adr/003-localstorage-persistence.md)     | localStorage para la persistencia de sesiones     | 2026-07-09        |
| [004](docs/adr/004-vitest-playwright-testing.md)    | Vitest + Playwright para testing                  | 2026-07-04        |
| [005](docs/adr/005-distribucion-local-first.md)     | Distribución local-first, Ollama como requisito   | 2026-07-14        |

---

## Referencias al material del máster

Este proyecto aplica conceptos del Máster en Desarrollo con IA de BIG School:

| Módulo             | Conceptos aplicados                                                 |
| ------------------ | ------------------------------------------------------------------- |
| Clean Architecture | Inversión de dependencias, Hexagonal (Ports & Adapters), SRP        |
| Principios SOLID   | Single Responsibility, Open/Closed, Dependency Inversion            |
| Prompt Engineering | Prompts estructurados con contexto, audiencia y reglas de calidad   |
| TDD                | Tests antes de la implementación, RED-GREEN-REFACTOR                |
| Patrones de diseño | Strategy (providers de IA), Repository (persistencia), Factory      |
| DevOps             | CI/CD con GitHub Actions, despliegue en Vercel, Sentry              |
| Cloud Computing    | Despliegue estático en Vercel, variables de entorno                 |
| Observabilidad     | Sentry, monitorización de releases, latencia/tokens por llamada     |
| LLMOps             | Evals con golden dataset, guardrails en código, prompts versionados |
| Accesibilidad      | Etiquetas ARIA, navegación por teclado, lectores de pantalla        |
| UX/UI              | Skeleton screens, microcopy, animaciones con Framer Motion          |

---

## Licencia

© 2026 Kilian Riera. Todos los derechos reservados.

Proyecto final del Máster en Desarrollo con IA de BIG School (fecha límite de entrega: 20 de julio de 2026). El código se publica con fines de evaluación y muestra; no se concede ninguna licencia de uso, copia, modificación ni distribución sin permiso expreso del autor.
