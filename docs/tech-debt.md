# Deuda Técnica — DeepLearn

> **Actualizado:** 15 Julio 2026 — PR #12
> **Metodología:** `grep -rn "TODO\|FIXME\|HACK\|XXX" src/` + revisión manual de code smells + hallazgos de la evaluación interna contra la rúbrica del máster
> **Referencia:** Módulo 6 — Code Smells, Refactor y Deuda (`Deuda-Tecnica-Practica.txt`)

## Inventario

| ID     | Tipo      | Ubicación        | Descripción                                                                                                                                                   | Impacto                                          | Plan                                                                                                |
| ------ | --------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| DT-009 | Cobertura | `src/ui/pages/*` | Las páginas (LevelPage, QuizPage, ConceptEntryPage, CompletionPage) no tienen tests de componente propios; su comportamiento se cubre indirectamente vía E2E. | Bajo — regresiones de UI detectables solo en E2E | PR #13: tests de integración con Testing Library + `userEvent` (happy path, error, estados vacíos). |

## Métricas

- **Issues abiertos:** 1 (DT-009)
- **Severidad:** 0 críticos, 0 medios, 1 bajo
- **Código sin marcadores:** 0 ocurrencias de TODO/FIXME/HACK/XXX en `src/`

## Deuda saldada

### PR #12 (15 Julio)

| ID     | Descripción                                                                                                  | Solución                                                                                                                                                                                                                                                                                                                                      |
| ------ | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DT-003 | Sistema SRS dormido: dominio SM-2 testeado pero sin panel de revisión ni generación de tarjetas en el flujo. | Caso de uso `GenerateSrsCards` (tarjetas al aprobar nivel, en segundo plano), `SrsReviewPage` con Recordé/Olvidé y accesos desde Entry y Completion. 12 tests nuevos (caso de uso + hook + componente con `userEvent`).                                                                                                                       |
| DT-005 | Providers al ~17% de cobertura con `_call` casi idéntico duplicado 4 veces.                                  | `BaseAiProvider` (template method: endpoint/headers/body/content/usage por adaptador) + suite de contrato compartida contra el puerto (21 tests, fetch mockeado), incluida extracción de JSON con code fences y thinking mode.                                                                                                                |
| DT-007 | Bundle único de 587 kB sin code-splitting.                                                                   | `React.lazy` en todas las páginas salvo la de entrada + chunks de vendors (react-vendor 367 kB, motion 133 kB, sentry 37 kB); ningún chunk supera los 500 kB.                                                                                                                                                                                 |
| DT-008 | Sin observabilidad LLM ni evaluations del contenido generado.                                                | Breadcrumbs de Sentry por llamada (provider, tipo, latencia, tokens vía `observability.js`) y golden dataset de 8 conceptos con `npm run eval` (valida contrato, distribución de `correct_index`, longitud e idioma; escribe `docs/evals.md`). Primera ejecución real pendiente de tener Ollama activo — incluida en el checklist de entrega. |

### PR #11 (14 Julio)

| ID     | Descripción                                                                                                                                                                                                                    | Solución                                                                                                                                                                                           |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DT-001 | Se creía que React 19.2 + jsdom impedía ejecutar los 14 tests UI ("no pueden ejecutarse"). Diagnóstico revisado: los tests sí corren; fallaba 1 aserción que comprobaba una clase CSS del spinner (detalle de implementación). | Aserción migrada a estado accesible (`aria-busy`); suite UI completa en verde.                                                                                                                     |
| DT-002 | `postScore`/`feedback` en CompletionPage eran estado local sin persistencia.                                                                                                                                                   | `saveEvaluation` en `useSession` usando `Session.setEvaluation` + botón "Guardar evaluación".                                                                                                      |
| —      | Bug de wiring: `useQuiz` llamaba a `SubmitQuiz.execute` con la firma antigua (4 args); enviar un quiz rompía el flujo desde la UI.                                                                                             | Firma corregida + 5 tests de integración hook → caso de uso → repositorio (`src/test/ui/useQuiz.test.jsx`).                                                                                        |
| —      | Configuración y construcción de adaptadores duplicadas y hardcodeadas en 3 hooks de UI.                                                                                                                                        | Composition root único (`src/composition/container.js`) con config por entorno.                                                                                                                    |
| —      | `detectLanguage` duplicada en 2 prompts y ausente en otros 2; salida sin directiva de idioma.                                                                                                                                  | Módulo único `prompts/language.js` + directiva explícita en los 4 prompts.                                                                                                                         |
| —      | Estado `error` de generación invisible (shimmer infinito); `SkeletonCard` sin integrar; errores técnicos crudos en pantalla.                                                                                                   | Estado de error con reintento en LevelPage, SkeletonCard integrado, mapeo de errores a español accionable (`ui/i18n/errorMessages.js`).                                                            |
| —      | `src/App.css` scaffold muerto; `onOpenSrs={() => {}}`; sesiones recientes no clicables.                                                                                                                                        | App.css eliminado; prop retirado; sesiones retomables con `restoreSession`.                                                                                                                        |
| DT-006 | E2E rotos y no deterministas: referenciaban una UI en inglés que ya no existía, exigían Ollama vivo y usaban selectores CSS de implementación.                                                                                 | Reescritos contra la UI real con `getByRole`/`getByLabel`, modelo mockeado con `page.route` (deterministas, ejecutables en CI), `forbidOnly` en CI, 4º escenario de estado de error con reintento. |
| DT-004 | Proxy serverless (`api/ai.js` + middlewares de validación y rate limiting) sin consumidor tras la decisión local-first; rate limit in-memory inviable en serverless.                                                           | Eliminado citando ADR-005 (junto con sus 14 tests); los providers cloud siguen disponibles como estrategias del factory vía `.env`.                                                                |

### PR #8 (13 Julio)

| ID  | Descripción                                       | Solución                    |
| --- | ------------------------------------------------- | --------------------------- |
| —   | SVG back button duplicado en LevelPage + QuizPage | Extraído a `BackButton.jsx` |
| —   | Magic number `5` en App.jsx (niveles totales)     | Constante `TOTAL_LEVELS`    |
| —   | Prop `onGoToLevel` no usado en LevelPage          | Eliminado                   |
