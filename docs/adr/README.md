# Architecture Decision Records

Decisiones arquitectónicas del proyecto, en formato de 1 página: contexto, opciones consideradas, decisión, justificación y consecuencias (positivas y negativas). Los ADRs nunca se borran: si una decisión cambia, se marca como Reemplazado y se enlaza el nuevo.

## Activos

| ADR                                        | Decisión                                           | Fecha decisión | Estado   |
| ------------------------------------------ | -------------------------------------------------- | -------------- | -------- |
| [001](001-clean-architecture-hexagonal.md) | Clean Architecture + Hexagonal (Ports & Adapters)  | 2026-07-04     | Aceptado |
| [002](002-ollama-local-ai-provider.md)     | Ollama local como AI provider principal            | 2026-07-08     | Aceptado |
| [003](003-localstorage-persistence.md)     | localStorage para persistencia de sesiones         | 2026-07-09     | Aceptado |
| [004](004-vitest-playwright-testing.md)    | Vitest + Playwright como estrategia de testing     | 2026-07-04     | Aceptado |
| [005](005-distribucion-local-first.md)     | Distribución local-first con Ollama como requisito | 2026-07-14     | Aceptado |

## Reemplazados

| ADR                                                                                          | Motivo                                                                                                                                               |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`docs/architecture/ADR-001-clean-hexagonal.md`](../architecture/ADR-001-clean-hexagonal.md) | Versión embrionaria del ADR-001 escrita con el scaffold (2026-07-04); reemplazada por [001](001-clean-architecture-hexagonal.md) en formato completo |

## Nota sobre fechas

Los ADR 001-004 documentan decisiones tomadas durante el desarrollo (corroborables en los commits que se citan en cada uno) y se redactaron en formato completo el 2026-07-14 (PR #10). Cada ADR distingue ambas fechas.
