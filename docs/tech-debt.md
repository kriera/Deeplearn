# Deuda Técnica — DeepLearn

> **Actualizado:** 14 Julio 2026 — PR #8
> **Metodología:** `grep -rn "TODO\|FIXME\|HACK\|XXX" src/` + revisión manual de code smells
> **Referencia:** Módulo 6 — Code Smells, Refactor y Deuda (`Deuda-Tecnica-Practica.txt`)

## Inventario

| ID | Tipo | Ubicación | Descripción | Impacto | Plan |
|----|------|-----------|-------------|---------|------|
| DT-001 | Compatibilidad | `src/test/ui/*.test.jsx` | React 19.2.7 + jsdom 29.1.1 no renderiza componentes. 14 tests UI no pueden ejecutarse. | Medio — cobertura UI no verificable en CI | Esperar release de @testing-library/react compatible con React 19.2. Cobertura UI cubierta por E2E (Playwright). |
| DT-002 | Estado huérfano | `src/ui/pages/CompletionPage.jsx:6-7` | `postScore` y `feedback` son estado local sin persistencia. El usuario puede mover sliders pero los datos no se guardan. | Bajo — UX incompleta | PR #10 (UX Polish): persistir en session.evaluation o eliminar si no hay backend. |
| DT-003 | Prop no usado | `src/App.jsx:141` | `onOpenSrs` se pasa como `() => {}` a CompletionPage. El SRS review panel no está implementado. | Bajo — funcionalidad futura | PR #10: implementar panel de revisión SRS o eliminar prop. |

## Métricas

- **Líneas totales:** 3,359
- **Issues abiertos:** 3
- **Ratio de deuda:** 0.09% (3 issues / 3,359 LOC)
- **Severidad:** 0 críticos, 1 medio, 2 bajos
- **Código sin deuda:** 0 ocurrencias de TODO/FIXME/HACK/XXX

## Deuda saldada en PR #8

| ID | Descripción | Solución |
|----|-------------|----------|
| — | SVG back button duplicado en LevelPage + QuizPage | Extraído a `BackButton.jsx` |
| — | Magic number `5` en App.jsx (niveles totales) | Constante `TOTAL_LEVELS` |
| — | Prop `onGoToLevel` no usado en LevelPage | Eliminado |
