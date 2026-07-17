# DeepLearn — Plan de Implementación

> **Deadline de entrega del TFM:** 20 Julio 2026 (cierre interno: 18 Julio)
> **Última actualización:** 16 Julio 2026

## Estado Actual (16 Julio)

- **12 PRs completados** (4-15 Julio) + mejoras de percepción de latencia tras pruebas de usuario (16 Julio)
- **Suite en verde**: 183 tests (unit + integración + contrato de providers) + 4 E2E deterministas + evals de contenido contra modelo real
- **App funcional** — SRS operativo, 5 pantallas, code-splitting, observabilidad LLM, generación progresiva en segundo plano
- **Pendiente para la entrega:** repo GitHub público, deploy Vercel con URL, slides, vídeo explicativo

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
| #12 | Jul 15 | `412a53e` | SRS funcional, contrato de providers, observabilidad LLM, evals, code-splitting |

### Mejoras tras pruebas de usuario (16 Julio)

Detectadas probando la app con Ollama real; validadas con los evals de contenido:

- **Generación progresiva**: la explicación se muestra en cuanto llega y el quiz
  se genera mientras el usuario lee; el resultado del quiz ya no espera a que se
  genere el siguiente nivel (pasa a segundo plano). Espera percibida ~90s → ~20-30s.
- **`think: 'low'` en Ollama** para modelos gpt-oss (el parámetro anterior no
  existía en la API): latencia del modelo reducida a ~la mitad (evals: suite C
  de ~50s a ~13s por caso).
- **Guardrail de barajado de opciones** (`shuffleQuestionOptions`): la
  distribución de la respuesta correcta ya no depende de que el modelo obedezca
  el prompt (fallo detectado por los evals con razonamiento bajo).
- Concepto truncado en la cabecera: tooltip con el texto completo.
- ADR-005 ampliado + README: uso de la app desplegada con `OLLAMA_ORIGINS`.

## Trabajo restante (16-18 Julio)

### PR #13 — 16-17 Julio: Entrega

- ~~Deploy Vercel con URL en README (requisito oficial 3)~~ ✅ 16 Julio:
  <https://deeplearn-three.vercel.app>, verificado con la suite E2E contra la
  URL pública y un smoke test real (Ollama local + CORS + flujo completo)
- Repo GitHub público + CI verde en Actions (secrets `VERCEL_*` configurados)
- ~~Cobertura UI de páginas: tests de integración de QuizPage/LevelPage con Testing Library + `userEvent`~~ ✅ 17 Julio:
  `LevelPage.test.jsx` (7 casos) + `QuizPage.test.jsx` (6 casos); suite 184 → 195 tests; umbrales de coverage en verde
- ~~Revisión final contra SPEC §8 (criterios de aceptación)~~ ✅ 17 Julio: 7/8 criterios cumplidos y verificados; solo "CI pasa en cada PR" queda pendiente del push a GitHub
- Slides con URL pública + vídeo explicativo con screencast (requisitos oficiales 4-5)
- Revisión final contra SPEC §8 (criterios de aceptación)

## Convenciones de commit

- **Formato:** subject convencional en inglés (`feat:`/`fix:`/`chore:`); cuerpo en español
- **Cuerpo:** Conceptos del máster aplicados → Archivos → Tests → Referencias
- **ADRs:** referenciar en el subject cuando aplique, p. ej. `feat: ... (ADR-005)`
