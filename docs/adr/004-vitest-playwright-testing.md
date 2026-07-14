# ADR-004: Vitest + Playwright para Estrategia de Testing

**Fecha**: 2026-07-04
**Estado**: Aceptado

## Contexto

DeepLearn necesita una estrategia de testing que cubra: tests unitarios (domain, application), tests de integración (hooks + repositorios), y tests E2E (flujos de usuario). La SPEC exige 100% coverage en domain/application y 80% en UI.

## Opciones Consideradas

1. **Vitest + Playwright** — Vitest para unitarios/integración, Playwright para E2E.
2. **Jest + Cypress** — Stack tradicional, más maduro pero más lento.
3. **Vitest solo** — Usar Vitest para todo, incluyendo E2E con jsdom.

## Decisión

Elegimos **Vitest para tests unitarios e integración, Playwright para E2E**.

## Justificación

- **Velocidad**: Vitest es 10x más rápido que Jest (comparte config con Vite, ESM nativo, HMR).
- **E2E realista**: Playwright ejecuta tests en navegadores reales (Chromium, Firefox, WebKit), no en jsdom.
- **Compatibilidad**: React 19.2 + jsdom 29.1.1 tiene incompatibilidad conocida que rompe tests de UI. Playwright evita este problema completamente.
- **CI integration**: Ambos se integran con GitHub Actions sin configuración adicional.

## Consecuencias

### Positivas
- Tests unitarios rápidos (~2s para 100 tests)
- E2E en navegadores reales (sin limitaciones de jsdom)
- Configuración compartida con Vite

### Negativas
- 14 tests de UI rotos por incompatibilidad React 19.2 + jsdom (documentado como DT-001)
- Playwright requiere instalar navegadores (~200MB)
- Dos herramientas que mantener en CI

## Referencias

- `~/bigschool_master/extracted_text/Testing/`
- `~/bigschool_master/extracted_text/Devops Y Ci Cd/Hola-Mundo-con-Github-Actions.txt`
