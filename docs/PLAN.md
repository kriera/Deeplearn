# DeepLearn — Plan de Implementación

> **Deadline de entrega del TFM:** 20 Julio 2026 (cierre interno: 18 Julio)
> **Última actualización:** 14 Julio 2026

## Estado Actual (14 Julio)

- **10 PRs completados** (4-14 Julio)
- **Suite en verde**: tests unitarios, integración e infraestructura + 3 E2E (Playwright)
- **App funcional** — build correcto, 4 pantallas + 3 hooks, composition root
- **Pendiente para la entrega:** repo GitHub público, deploy Vercel con URL, slides, vídeo explicativo

## PRs Completados

| PR  | Fecha  | Commit    | Capa                                                                  |
| --- | ------ | --------- | --------------------------------------------------------------------- |
| #0  | Jul 4  | `a4c2d6e` | Scaffold: SPEC.md, CI, Husky, ADR-001                                 |
| #1  | Jul 5  | `211fc62` | Domain: Level, Question, Session, SrsService (SM-2)                   |
| #2  | Jul 7  | `2136aaa` | Application: StartSession, SubmitQuiz, puertos                        |
| #3  | Jul 8  | `7c7e3f6` | AI providers: 4 adapters + prompt builders                            |
| #4  | Jul 9  | `c403da7` | Storage: Repository Pattern, localStorage + in-memory                 |
| #5  | Jul 10 | `a289187` | Serverless proxy + OWASP (rate limiting, validación)                  |
| #6  | Jul 12 | `e7c4c58` | UI atoms: Button, Badge, ProgressBar + Tailwind 4                     |
| #7  | Jul 12 | `0bb4d53` | Screens + hooks: app funcional                                        |
| #8  | Jul 13 | `fca2b25` | E2E, code smells, deuda técnica + integración Ollama (serie de fixes) |
| #9  | Jul 13 | `5797643` | Deploy Vercel, Sentry, CI/CD auto-deploy                              |
| #10 | Jul 14 | `0c2f7b5` | Docs, UX, A11Y, skeleton screens, microcopy español                   |

## Trabajo restante (14-18 Julio)

### PR #11 — Correcciones de la evaluación interna

**Conceptos del máster:**

- Integración (Módulo 6): tests del cableado hook → caso de uso (bug de firma en `useQuiz` detectado y corregido)
- Composition Root (Módulo 2): dependencias construidas en el borde, config por entorno
- A11Y (Módulo 4): contraste AA, `lang="es"`, estados de error visibles con reintento
- Microcopy (Módulo 4): errores accionables en español, copy unificado
- Prompt Engineering (Módulo 5): rol + directiva de idioma en los 4 prompts, `detectLanguage` unificado
- ADR (Módulo 8): ADR-005 distribución local-first; fechas de decisión vs redacción explícitas

### PR #12 — 15 Julio: SRS funcional + calidad del contenido IA

**Conceptos del máster:**

- YAGNI invertido / deuda saldada (Módulo 6): convertir el código SRS dormido (DT-003) en funcionalidad
- LLMOps (Módulo 7): evaluations con golden dataset, observabilidad de llamadas al modelo
- Testing (Módulo 6): tests de contrato de los providers contra el puerto AiProvider (DT-005)
- Performance (Módulo 4): code-splitting del bundle (DT-007)

**Tareas:**

1. **SRS mínimo viable (cierra DT-003)**: generar tarjetas al aprobar cada nivel (`generateSRSCards` en el flujo de `SubmitQuiz`), panel de repaso accesible desde CompletionPage con `dueCards` + botones Recordé/Olvidé (`useSrs` ya existe), persistencia en `LocalStorageCardRepository`.
2. **Golden dataset + evals (cierra parte de DT-008)**: script `npm run eval` con 5-10 conceptos fijos que llama al modelo real y valida el contrato programáticamente (5 preguntas, `correct_index` 0-3 distribuido, 90-150 palabras, idioma correcto). Documentar resultados en `docs/evals.md`.
3. **Observabilidad LLM (resto de DT-008)**: registrar latencia y tokens por llamada (breadcrumb/`setTag` de Sentry usando `eval_count` de Ollama).
4. **Tests de contrato de providers (cierra DT-005)**: suite compartida contra el puerto con fetch mockeado; extraer el `_call` duplicado a un helper común.
5. **Code-splitting (cierra DT-007)**: `dynamic import()` por página o configuración de chunks.

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
