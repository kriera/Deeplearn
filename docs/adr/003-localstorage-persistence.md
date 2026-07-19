# ADR-003: localStorage para Persistencia de Sesiones

**Fecha de la decisión**: 2026-07-09 (commit `c403da7`)
**Redactado en formato completo**: 2026-07-14 (PR #10)
**Estado**: Aceptado

## Contexto

DeepLearn necesita persistir sesiones de aprendizaje (niveles, quizzes, intentos) entre recargas del navegador. La SPEC prohíbe backend propio y base de datos externa. El alcance es single-user, single-device.

## Opciones Consideradas

1. **localStorage** — API nativa del navegador, 5-10MB, síncrona, sin expiración.
2. **IndexedDB** — API asíncrona, mayor capacidad, más compleja.
3. **sessionStorage** — Solo dura la sesión del navegador, se pierde al cerrar pestaña.
4. **In-memory only** — Sin persistencia, se pierde al recargar.

## Decisión

Elegimos **localStorage** con Repository Pattern (LocalStorageSessionRepository).

## Justificación

- **SPEC compliance**: "Sin backend propio, sin base de datos externa, localStorage".
- **Simplicidad**: API síncrona, sin callbacks ni promesas para operaciones básicas.
- **Repository Pattern**: La interfaz `SessionRepository` permite migrar a IndexedDB o backend en el futuro sin cambiar Application ni Domain.
- **Serialización**: SessionSerializer maneja la conversión a/desde JSON, aislando detalles de formato.

## Consecuencias

### Positivas

- Cero dependencias externas
- Implementación en ~50 líneas
- Migrable a IndexedDB/backend sin tocar lógica de negocio

### Negativas

- Límite de 5-10MB (suficiente para cientos de sesiones)
- Datos perdidos si el usuario limpia el navegador
- No hay sincronización multi-dispositivo

## Referencias

- Máster, módulo «Buenas Prácticas y Principios de Diseño» — patrón Repository
- Máster, módulo «Spec-Driven Development» — introducción a Spec-Driven Development
