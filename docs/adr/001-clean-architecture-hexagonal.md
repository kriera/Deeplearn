# ADR-001: Clean Architecture + Hexagonal (Ports & Adapters)

**Fecha**: 2026-07-04
**Estado**: Aceptado

## Contexto

DeepLearn es una aplicación de aprendizaje asistido por IA que debe ser mantenible, testeable y extensible a múltiples proveedores de IA. Necesitamos una arquitectura que permita cambiar de proveedor (Ollama, Anthropic, LM Studio) sin modificar la lógica de negocio, y que facilite el testing unitario sin dependencias externas.

## Opciones Consideradas

1. **Clean Architecture + Hexagonal** — Capas concéntricas (Domain → Application → Infrastructure → UI), dependencias hacia adentro, puertos e interfaces.
2. **MVC tradicional** — Modelo-Vista-Controlador con React como vista y lógica en hooks.
3. **Feature-based** — Carpetas por feature con toda la lógica junta.

## Decisión

Elegimos **Clean Architecture + Hexagonal (Ports & Adapters)**.

## Justificación

- **Testeabilidad**: Domain y Application son JS puro, sin React, sin fetch, sin localStorage. Tests unitarios rápidos y deterministas.
- **Intercambiabilidad de proveedores**: Strategy Pattern en Infrastructure permite cambiar de Ollama a Anthropic sin tocar Application ni Domain.
- **Evolución independiente**: Cada capa puede evolucionar a su propio ritmo. UI puede cambiar de Tailwind a otro framework sin afectar la lógica.
- **Alineación con el máster**: Los conceptos de Clean Architecture, DIP, SRP y Hexagonal son evaluables en el TFM.

## Consecuencias

### Positivas
- 100% de cobertura en Domain y Application (JS puro, sin mocks complejos)
- Cambio de proveedor AI en una línea (AiProviderFactory)
- Separación clara de responsabilidades

### Negativas
- Más archivos y directorios que un enfoque monolítico
- Curva de aprendizaje para desarrolladores nuevos
- Overhead de abstracción para operaciones simples

## Referencias

- `~/bigschool_master/extracted_text/Introduccion A La Arquitectura De Software/`
- `~/bigschool_master/extracted_text/Buenas Practicas Y Principios De Diseno/`
