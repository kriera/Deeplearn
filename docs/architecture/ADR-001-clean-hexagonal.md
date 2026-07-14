# ADR-001: Clean Architecture + Hexagonal (Ports & Adapters)

**Fecha:** 2026-07-04
**Estado:** Reemplazado — versión embrionaria escrita con el scaffold; ver la versión completa en [`docs/adr/001-clean-architecture-hexagonal.md`](../adr/001-clean-architecture-hexagonal.md)
**Contexto:** DeepLearn necesita una arquitectura que permita cambiar de proveedor AI, de mecanismo de almacenamiento, y de framework UI sin reescribir la lógica de negocio.

**Decisión:** Usar Clean Architecture con capas concéntricas (Domain → Application → Infrastructure → UI) combinada con Hexagonal Architecture (Ports & Adapters) para los puntos de integración.

**Consecuencias:**

- Positivas: Dominio testeable al 100%, proveedores AI intercambiables, storage reemplazable
- Negativas: Mayor número de archivos, requiere disciplina en las dependencias
- Riesgo: Overengineering si no se mantiene la disciplina — mitigado con thresholds de coverage

**Referencias:**

- Clean Architecture (Robert C. Martin)
- Hexagonal Architecture (Alistair Cockburn)
- Módulo 2 del máster: Introducción a la Arquitectura de Software
