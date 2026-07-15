# DeepLearn — Plan de Implementación

> **Deadline de entrega del TFM:** 20 Julio 2026 (cierre interno: 18 Julio)
> **Última actualización:** 15 Julio 2026

## Estado Actual (15 Julio)

- **12 PRs completados** (4-15 Julio)
- **Suite en verde**: 166 tests (unit + integración + contrato de providers) + 4 E2E deterministas
- **App funcional** — SRS operativo, 5 pantallas, code-splitting, observabilidad LLM
- **Pendiente para la entrega:** repo GitHub público, deploy Vercel con URL, ejecutar `npm run eval` con Ollama activo, slides, vídeo explicativo

## PRs Completados

| PR  | Fecha  | Commit    | Capa                                                                            |
| --- | ------ | --------- | ------------------------------------------------------------------------------- |
| #0  | Jul 4  | `a4c2d6e` | Scaffold: SPEC.md, CI, Husky, ADR-001                                           |
| #1  | Jul 5  | `211fc62` | Domain: Level, Question, Session, SrsService (SM-2)                             |
| #2  | Jul 7  | `2136aaa` | Application: StartSession, SubmitQuiz, puertos                                  |
| #3  | Jul 8  | `7c7e3f6` | AI providers: 4 adapters + prompt builders                                      |
| #4  | Jul 9  | `c403da7` | Storage: Repository Pattern, localStorage + in-memory                           |
| #5  | Jul 10 | `a289187` | Serverless proxy + OWASP (rate limiting, validación)                            |
| #6  | Jul 12 | `e7c4c58` | UI atoms: Button, Badge, ProgressBar + Tailwind 4                               |
| #7  | Jul 12 | `0bb4d53` | Screens + hooks: app funcional                                                  |
| #8  | Jul 13 | `fca2b25` | E2E, code smells, deuda técnica + integración Ollama (serie de fixes)           |
| #9  | Jul 13 | `5797643` | Deploy Vercel, Sentry, CI/CD auto-deploy                                        |
| #10 | Jul 14 | `0c2f7b5` | Docs, UX, A11Y, skeleton screens, microcopy español                             |
| #11 | Jul 14 | `ab43dac` | Fix wiring quiz, estados de error, contraste AA, local-first (ADR-005)          |
| #12 | Jul 15 | —         | SRS funcional, contrato de providers, observabilidad LLM, evals, code-splitting |

## Trabajo restante (16-18 Julio)

### PR #13 — 16-17 Julio: Entrega

- Repo GitHub público + CI verde en Actions (secrets `VERCEL_*` configurados)
- Deploy Vercel con URL en README (requisito oficial 3)
- Cobertura UI de páginas: tests de integración de QuizPage/LevelPage con Testing Library + `userEvent`
- Slides con URL pública + vídeo explicativo con screencast (requisitos oficiales 4-5)
- Revisión final contra SPEC §8 (criterios de aceptación)

## Convenciones de commit

- **Formato:** subject convencional en inglés (`feat:`/`fix:`/`chore:`); cuerpo en español
- **Cuerpo:** Conceptos del máster aplicados → Archivos → Tests → Referencias
- **ADRs:** referenciar en el subject cuando aplique, p. ej. `feat: ... (ADR-005)`
