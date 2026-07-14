# DeepLearn

**Learn anything. Explain it like Feynman.**

A Feynman learning engine that generates 5-level explanations and quizzes for any concept, powered by local AI (Ollama). Built with Clean Architecture + Hexagonal (Ports & Adapters) for the BIG School Master's final project.

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

| Layer | Technology | Version |
|-------|-----------|---------|
| UI | React | 19.2.7 |
| Build | Vite | 8.1.1 |
| Styling | Tailwind CSS | 4.3.2 |
| Animation | Framer Motion | 12.42.2 |
| AI | Ollama (local) | gpt-oss:120b-cloud |
| Monitoring | Sentry | 10.65.0 |
| Testing | Vitest | 4.1.9 |
| E2E | Playwright | 1.61.1 |
| Linting | Oxlint | 1.73.0 |
| Formatting | Prettier | 3.9.5 |
| CI/CD | GitHub Actions + Vercel | — |

---

## Quick Start

```bash
# 1. Clone
git clone <repo-url> && cd deeplearn

# 2. Install (NODE_ENV=development required for devDependencies)
NODE_ENV=development npm install

# 3. Start Ollama (must be running on localhost:11434)
ollama pull gpt-oss:120b-cloud

# 4. Dev server
npm run dev
```

**Environment variables** (`.env`):

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SENTRY_DSN` | No | Sentry DSN for error monitoring |
| `VITE_APP_VERSION` | No | Release version for Sentry |

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
│   │   │   ├── providers/   # OllamaProvider, AnthropicProvider, LmStudioProvider
│   │   │   ├── prompts/     # LevelPrompt, QuizPrompt, ReExplainPrompt, SrsPrompt
│   │   │   └── AiProviderFactory.js
│   │   ├── storage/
│   │   │   ├── repositories/  # LocalStorageSessionRepository, InMemorySessionRepository
│   │   │   └── serializers/   # SessionSerializer
│   │   └── sentry.js        # Sentry initialization
│   ├── ui/
│   │   ├── atoms/           # Button, Badge, ProgressBar, BackButton, SkeletonCard
│   │   ├── hooks/           # useSession, useQuiz, useSrs
│   │   └── pages/           # ConceptEntryPage, LevelPage, QuizPage, CompletionPage
│   ├── api/
│   │   └── middleware/      # rateLimit, validateInput
│   ├── test/                # Unit + integration tests (Vitest)
│   ├── App.jsx              # Root component with screen routing
│   ├── main.jsx             # Entry point + Sentry ErrorBoundary
│   └── index.css            # Tailwind + custom animations
├── e2e/                     # Playwright E2E tests
├── docs/
│   ├── adr/                 # Architecture Decision Records
│   │   ├── 001-clean-architecture-hexagonal.md
│   │   ├── 002-ollama-local-ai-provider.md
│   │   ├── 003-localstorage-persistence.md
│   │   └── 004-vitest-playwright-testing.md
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

# E2E tests (Playwright — requires dev server running)
npx playwright test
```

**Coverage targets:** ≥80% lines, ≥90% branches on domain + application layers.

**Known issue (DT-001):** React 19.2.7 + jsdom 29.1.1 incompatibility breaks 14 UI rendering tests. Covered by Playwright E2E tests.

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

| ADR | Decision | Date |
|-----|----------|------|
| [001](docs/adr/001-clean-architecture-hexagonal.md) | Clean Architecture + Hexagonal (Ports & Adapters) | 2026-07-04 |
| [002](docs/adr/002-ollama-local-ai-provider.md) | Ollama local as primary AI provider | 2026-07-08 |
| [003](docs/adr/003-localstorage-persistence.md) | localStorage for session persistence | 2026-07-09 |
| [004](docs/adr/004-vitest-playwright-testing.md) | Vitest + Playwright for testing | 2026-07-04 |

---

## Master Material References

This project applies concepts from the BIG School Master's in AI Development:

| Module | Concepts Applied |
|--------|-----------------|
| Clean Architecture | Dependency Inversion, Hexagonal (Ports & Adapters), SRP |
| SOLID Principles | Single Responsibility, Open/Closed, Dependency Inversion |
| Prompt Engineering | Structured prompts with context, audience, quality rules |
| TDD | Tests before implementation, RED-GREEN-REFACTOR |
| Design Patterns | Strategy (AI providers), Repository (persistence), Factory |
| DevOps | GitHub Actions CI/CD, Vercel deployment, Sentry monitoring |
| Cloud Computing | Vercel serverless deployment, environment variables |
| Observability | Sentry error tracking, release monitoring |
| Accessibility | ARIA labels, keyboard navigation, screen reader support |
| UX/UI | Skeleton screens, microcopy, Framer Motion animations |

Full master materials at `~/bigschool_master/extracted_text/`.

---

## License

Private — BIG School Master's final project. Deadline: 18 July 2026.
