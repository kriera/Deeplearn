# DeepLearn — Plan de Sesiones (13-18 Julio 2026)

> **Creado:** 13 Julio 2026, 13:45
> **Sesión Hermes:** Actual (TUI, deepseek-v4-pro)
> **Deadline:** 18 Julio 2026

## Estado Actual

- **8 PRs completados** (4-12 Julio)
- **97/111 tests pasan** (14 fallos UI por compatibilidad React 19.2 + Testing Library)
- **App funcional** — build exitoso, 4 pantallas + 3 hooks
- **Criterios SPEC pendientes:** E2E, deploy Vercel, coverage UI 80%, docs, A11Y, CI verde

## PRs Completados

| PR | Fecha | Commit | Capa |
|----|-------|--------|------|
| #0 | Jul 4 | `a4c2d6e` | Scaffold: SPEC.md, CI, Husky, ADR-001 |
| #1 | Jul 5 | `211fc62` | Domain: Level, Question, Session, SrsService (SM-2) |
| #2 | Jul 7 | `2136aaa` | Application: StartSession, SubmitQuiz, puertos |
| #3 | Jul 8 | `7c7e3f6` | AI providers: 4 adapters + prompt builders |
| #4 | Jul 9 | `c403da7` | Storage: Repository Pattern, localStorage + in-memory |
| #5 | Jul 10 | `a289187` | Serverless proxy + OWASP (rate limiting, validación) |
| #6 | Jul 12 | `e7c4c58` | UI atoms: Button, Badge, ProgressBar + Tailwind 4 |
| #7 | Jul 12 | `0bb4d53` | Screens + hooks: app funcional |

## PRs Planificados

### PR #8 — Lunes 14 Julio: E2E + Refactor + Code Smells

**Conceptos del máster:**
- E2E Testing (Módulo 6): Playwright, flujos críticos, CI integration
- Safe Refactoring (Módulo 6): Red-Green-Refactor, red de seguridad de tests
- Code Smells (Módulo 6): Detección en UI, SRP violations, duplicación
- Integration Testing (Módulo 6): Testing Library, roles ARIA, flujos de usuario
- Deuda Técnica (Módulo 6): Cuantificación, ratio, grep TODO/FIXME

**Referencias:**
- `~/bigschool_master/extracted_text/Testing/E2E-Asistido-por-IA.txt`
- `~/bigschool_master/extracted_text/Code Smells Refactor Y Deuda/Refactor-Seguro-con-TDD.txt`
- `~/bigschool_master/extracted_text/Code Smells Refactor Y Deuda/Detectar-Smells-en-UI.txt`
- `~/bigschool_master/extracted_text/Testing/Integracion-Front.txt`
- `~/bigschool_master/extracted_text/Code Smells Refactor Y Deuda/Deuda-Tecnica-Practica.txt`

**Criterio:** CI verde, 100% tests, E2E flujo completo.

### PR #9 — Miércoles 16 Julio: Deploy Vercel + Observabilidad

**Conceptos del máster:**
- Cloud Deployment (Módulo 7): Vercel, CLI deploy, time-to-market
- Observabilidad (Módulo 7): Sentry, monitoreo errores producción
- Seguridad ENV (Módulo 3): Variables de entorno, secretos
- CI/CD (Módulo 7): GitHub Actions deploy automático

**Referencias:**
- `~/bigschool_master/extracted_text/Cloud Computing/Despliegue-aplicaciones-en-el-Cloud-Render-o-Railway.txt`
- `~/bigschool_master/extracted_text/Observabilidad Con Sentry/Implementacion-de-Sentry.txt`
- `~/bigschool_master/extracted_text/Seguridad Env Owasp Top 10/Variables-de-Entorno-y-Secretos.txt`
- `~/bigschool_master/extracted_text/Devops Y Ci Cd/Hola-Mundo-con-Github-Actions.txt`

**Criterio:** App viva en Vercel, Sentry activo, CI/CD deploy automático.

### PR #10 — Viernes 18 Julio: Documentación + UX Polish + Entrega

**Conceptos del máster:**
- ADR (Módulo 8): Documentar decisiones arquitectónicas
- Docs as Code (Módulo 8): Documentación viva, versionada
- Microcopy (Módulo 4): Textos que guían, prompting para copy
- A11Y (Módulo 4): WCAG, roles ARIA, contraste
- Performance Percibida (Módulo 4): Skeleton screens, optimistic UI
- SDD (Módulo 1): Validación final contra spec

**Referencias:**
- `~/bigschool_master/extracted_text/Documentacion Con Ia/ADR-Documentar-el-porque.txt`
- `~/bigschool_master/extracted_text/Documentacion Con Ia/Docs-as-Code-Minimal.txt`
- `~/bigschool_master/extracted_text/Usabilidad/Microcopy-con-IA.txt`
- `~/bigschool_master/extracted_text/Usabilidad/Heuristicas-Rapidas-A11y.txt`
- `~/bigschool_master/extracted_text/Usabilidad/Medir-Sensacion-de-Rapidez.txt`
- `~/bigschool_master/extracted_text/Spec Driven Development/PPT-Introduccion-a-Spec-Driven-Development.txt`

**Criterio:** 10 PRs, SPEC 100%, app desplegada, docs completas.

## Perfil de Commit (validado contra histórico)

- **Autor:** kriera <kilian.riera@gmail.com>
- **Prefijo:** `feat:` (o `chore:` solo para scaffold)
- **Cuerpo:** Conceptos del máster → Archivos creados → Tests → Referencias
- **Idioma:** Español en cuerpo, inglés en subject
- **Espaciado:** 1-2 días entre commits
- **Horario:** Mañana/mediodía (10:00-14:00 CEST)

## Notas

- Las sesiones anteriores de DeepLearn (PR #1-#7) no aparecen en session_search de Hermes
- Posible causa: cambio de perfil, reseteo de DB, o uso de otro cliente
- Este archivo es el respaldo físico del plan por si la sesión se pierde
- Ruta: `~/Projects/deeplearn/docs/PLAN.md`
