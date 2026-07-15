# DeepLearn

**Learn anything. Explain it like Feynman.**

A Feynman learning engine that generates 5-level explanations and quizzes for any concept, powered by local AI (Ollama). Built with Clean Architecture + Hexagonal (Ports & Adapters) for the BIG School Master's final project.

**Local-first** (ADR-005): the app runs entirely on your machine — your AI (Ollama), your data (localStorage). No accounts, no API keys, no server.

---

## Main Features

- **5-level Feynman path**: enter any concept and get explanations tailored to 5 audiences, from a 6-year-old (Elemental) to a researcher (Experto).
- **Quiz gates**: 5 AI-generated multiple-choice questions per level; score 4/5 to unlock the next level.
- **Adaptive re-explanation**: fail a quiz and the engine re-explains the level with a different analogy, focused on your weak areas.
- **Language aware**: concepts written in Spanish get fully Spanish content; English concepts get English content.
- **Spaced repetition (SRS)**: passing a level generates flash cards scheduled with the SM-2 algorithm; review them from the home screen or after completing a concept.
- **Session persistence**: sessions live in localStorage; resume any recent concept from the home screen.
- **Self-evaluation**: rate your understanding and leave feedback when you complete a concept.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                      UI Layer                        │
│  React 19 · Framer Motion · Tailwind CSS 4           │
│  Pages: Entry → Level → Quiz → Completion            │
│  Hooks: useSession · useQuiz · useSrs                │
└──────────────────────┬──────────────────────────────┘
                       │ depends on
┌──────────────────────▼──────────────────────────────┐
│                 Application Layer                    │
│  Use Cases: StartSession · SubmitQuiz                │
│            GenerateLevelContent                      │
│  Ports: SessionRepository · AiProvider (interfaces)  │
└──────┬───────────────────────────────────────┬───────┘
       │ implements                            │ implements
┌──────▼──────────┐                    ┌───────▼───────┐
│  Domain Layer    │                    │ Infrastructure│
│  Entities:       │                    │ Storage:      │
│  Session · Level │                    │ localStorage  │
│  Question        │                    │ AI: Ollama    │
│  Services:       │                    │ (gpt-oss:     │
│  SrsService      │                    │  120b-cloud)  │
│  Value Objects   │                    │ Sentry · CI/CD│
└─────────────────┘                    └───────────────┘
```

**Design patterns:** Dependency Inversion (DIP), Strategy (AI providers), Repository (persistence), SRP (use cases).

---

## Tech Stack

| Layer      | Technology              | Version            |
| ---------- | ----------------------- | ------------------ |
| UI         | React                   | 19.2.7             |
| Build      | Vite                    | 8.1.1              |
| Styling    | Tailwind CSS            | 4.3.2              |
| Animation  | Framer Motion           | 12.42.2            |
| AI         | Ollama (local)          | gpt-oss:120b-cloud |
| Monitoring | Sentry                  | 10.65.0            |
| Testing    | Vitest                  | 4.1.9              |
| E2E        | Playwright              | 1.61.1             |
| Linting    | Oxlint                  | 1.73.0             |
| Formatting | Prettier                | 3.9.5              |
| CI/CD      | GitHub Actions + Vercel | —                  |

---

## Quick Start

**Requirements**: Node 22+, and [Ollama](https://ollama.com) running on `localhost:11434` (the app's only external dependency — see ADR-005).

```bash
# 1. Clone
git clone <repo-url> && cd deeplearn

# 2. Install (NODE_ENV=development required for devDependencies)
NODE_ENV=development npm install

# 3. Start Ollama and pull the model
ollama pull gpt-oss:120b-cloud

# 4. Dev server
npm run dev
```

**Environment variables** (`.env`, all optional — defaults shown in `.env.example`):

| Variable           | Default                  | Description                                                    |
| ------------------ | ------------------------ | -------------------------------------------------------------- |
| `VITE_AI_PROVIDER` | `ollama`                 | AI provider: `ollama`, `lmstudio`, `ollama-cloud`, `anthropic` |
| `VITE_AI_BASE_URL` | `http://localhost:11434` | Base URL of the AI provider                                    |
| `VITE_AI_MODEL`    | `gpt-oss:120b-cloud`     | Model name                                                     |
| `VITE_SENTRY_DSN`  | —                        | Sentry DSN for error monitoring                                |
| `VITE_APP_VERSION` | `0.0.0`                  | Release version for Sentry (CI injects the commit SHA)         |

---

## Project Structure

```
deeplearn/
├── src/
│   ├── domain/
│   │   ├── entities/        # Session, Level, Question
│   │   └── services/        # SrsService (spaced repetition)
│   ├── application/
│   │   ├── ports/           # SessionRepository, AiProvider (interfaces)
│   │   └── use-cases/       # StartSession, SubmitQuiz, GenerateLevelContent
│   ├── infrastructure/
│   │   ├── ai/
│   │   │   ├── providers/   # BaseAiProvider + 4 adaptadores (Ollama, LM Studio, …)
│   │   │   ├── prompts/     # LevelPrompt, QuizPrompt, ReExplainPrompt, SrsPrompt, language
│   │   │   ├── observability.js  # Latencia/tokens por llamada al modelo (Sentry)
│   │   │   └── AiProviderFactory.js
│   │   ├── storage/
│   │   │   ├── repositories/  # LocalStorageSessionRepository, InMemorySessionRepository
│   │   │   └── serializers/   # SessionSerializer
│   │   └── sentry.js        # Sentry initialization
│   ├── composition/         # Composition root: config + wiring de dependencias
│   ├── ui/
│   │   ├── atoms/           # Button, Badge, ProgressBar, BackButton, SkeletonCard
│   │   ├── hooks/           # useSession, useQuiz, useSrs
│   │   ├── i18n/            # levelLabels, errorMessages (microcopy de errores)
│   │   └── pages/           # ConceptEntryPage, LevelPage, QuizPage, CompletionPage
│   ├── test/                # Unit + integration tests (Vitest)
│   ├── App.jsx              # Root component with screen routing
│   ├── main.jsx             # Entry point + Sentry ErrorBoundary
│   └── index.css            # Tailwind + custom animations
├── e2e/                     # Playwright E2E tests
├── scripts/eval.js          # Evals de contenido con golden dataset (npm run eval)
├── docs/
│   ├── adr/                 # Architecture Decision Records (ver adr/README.md)
│   │   ├── 001-clean-architecture-hexagonal.md
│   │   ├── 002-ollama-local-ai-provider.md
│   │   ├── 003-localstorage-persistence.md
│   │   ├── 004-vitest-playwright-testing.md
│   │   └── 005-distribucion-local-first.md
│   ├── PLAN.md              # Implementation plan
│   └── tech-debt.md         # Known issues
├── .github/workflows/ci.yml # CI/CD pipeline
├── vercel.json              # SPA rewrite rules
└── .env.example             # Environment template
```

---

## Testing

```bash
# Unit + integration tests (Vitest)
NODE_ENV=development npm test

# Watch mode
NODE_ENV=development npm run test:watch

# Coverage
NODE_ENV=development npm run test:coverage

# E2E tests (Playwright — deterministic, AI model mocked via page.route)
npx playwright test

# Content quality evals (LLMOps — requires Ollama running; writes docs/evals.md)
npm run eval
```

**Coverage thresholds** (enforced in `vite.config.js` — the run fails if unmet): 100% on domain and application layers, 80% on UI components.

**Expected output** of `NODE_ENV=development npm test`:

```
 Test Files  24 passed (24)
      Tests  166 passed (166)
```

E2E tests run in CI on every push (4 scenarios: happy path, quiz failure + retry, navigation, model-unavailable error state).

---

## Deployment

**Vercel** (manual):

```bash
NODE_ENV=development npm run build
vercel --prod
```

**GitHub Actions** (automated on push to `main`):

1. Lint → 2. Test → 3. Build → 4. Deploy to Vercel

Requires `VERCEL_TOKEN` secret in GitHub repository settings.

---

## Architecture Decision Records

Full index with statuses: [docs/adr/README.md](docs/adr/README.md)

| ADR                                                 | Decision                                          | Decision date |
| --------------------------------------------------- | ------------------------------------------------- | ------------- |
| [001](docs/adr/001-clean-architecture-hexagonal.md) | Clean Architecture + Hexagonal (Ports & Adapters) | 2026-07-04    |
| [002](docs/adr/002-ollama-local-ai-provider.md)     | Ollama local as primary AI provider               | 2026-07-08    |
| [003](docs/adr/003-localstorage-persistence.md)     | localStorage for session persistence              | 2026-07-09    |
| [004](docs/adr/004-vitest-playwright-testing.md)    | Vitest + Playwright for testing                   | 2026-07-04    |
| [005](docs/adr/005-distribucion-local-first.md)     | Local-first distribution, Ollama as requirement   | 2026-07-14    |

---

## Master Material References

This project applies concepts from the BIG School Master's in AI Development:

| Module             | Concepts Applied                                           |
| ------------------ | ---------------------------------------------------------- |
| Clean Architecture | Dependency Inversion, Hexagonal (Ports & Adapters), SRP    |
| SOLID Principles   | Single Responsibility, Open/Closed, Dependency Inversion   |
| Prompt Engineering | Structured prompts with context, audience, quality rules   |
| TDD                | Tests before implementation, RED-GREEN-REFACTOR            |
| Design Patterns    | Strategy (AI providers), Repository (persistence), Factory |
| DevOps             | GitHub Actions CI/CD, Vercel deployment, Sentry monitoring |
| Cloud Computing    | Vercel serverless deployment, environment variables        |
| Observability      | Sentry error tracking, release monitoring                  |
| Accessibility      | ARIA labels, keyboard navigation, screen reader support    |
| UX/UI              | Skeleton screens, microcopy, Framer Motion animations      |

Full master materials at `~/bigschool_master/extracted_text/`.

---

## License

BIG School Master's final project. Delivery deadline: 20 July 2026.
