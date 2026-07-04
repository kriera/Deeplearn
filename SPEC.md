# DeepLearn — System Specification

> **Version:** 0.1.0 (draft)
> **Status:** Spec-First (SDD Level 1)
> **Última actualización:** 4 de julio de 2026

---

## 1. Propósito

DeepLearn es una aplicación web de aprendizaje asistido por IA basada en la **Técnica Feynman**. Permite a un estudiante estudiar cualquier concepto a través de 5 niveles progresivos de complejidad, con explicaciones, quizzes de compuerta y tarjetas de repaso espaciado (SRS).

## 2. Funcionalidades Core

### 2.1 Generación de Ruta de Aprendizaje

- El usuario introduce un concepto (texto libre)
- El sistema genera 5 niveles: Elemental, Básico, Medio, Avanzado, Experto
- Cada nivel contiene: explicación + 5 preguntas de opción múltiple
- Los niveles se generan bajo demanda (no todos a la vez)

### 2.2 Progresión por Niveles

- El usuario lee la explicación del nivel actual
- Debe pasar un quiz (4/5 aciertos) para desbloquear el siguiente nivel
- Si falla, recibe una re-explicación simplificada y puede reintentar
- Al completar los 5 niveles, se muestra pantalla de finalización

### 2.3 Tarjetas SRS (Spaced Repetition)

- Al pasar un nivel, se generan tarjetas flash de repaso
- Algoritmo SM-2: intervalo creciente según aciertos/fallos
- Las tarjetas vencidas aparecen en un cajón de repaso flotante

### 2.4 Proveedores de IA

- Anthropic Claude (hosted, via proxy en producción)
- Ollama Local (http://localhost:11434)
- Ollama Cloud (hosted, via proxy)
- LM Studio (OpenAI-compatible local)

### 2.5 Persistencia

- Sesiones de aprendizaje y tarjetas SRS en localStorage
- API keys en localStorage (solo para desarrollo local)
- En producción: proxy serverless para proteger keys

## 3. Arquitectura

### 3.1 Estilo Arquitectónico

**Clean Architecture + Hexagonal (Ports & Adapters)**

```
┌─────────────────────────────────────┐
│           UI Layer (React)          │  ← Adaptador de entrada
├─────────────────────────────────────┤
│       Application Layer (Use Cases)  │  ← Orquestación
├─────────────────────────────────────┤
│         Domain Layer (Entities)     │  ← Reglas de negocio puras
├─────────────────────────────────────┤
│     Infrastructure Layer (Adapters) │  ← AI, Storage, HTTP
└─────────────────────────────────────┘
```

### 3.2 Reglas de Dependencia

- Las dependencias apuntan siempre hacia adentro (hacia el Domain)
- Domain no conoce React, ni localStorage, ni HTTP, ni ningún framework
- Application orquesta casos de uso usando puertos (interfaces)
- Infrastructure implementa los puertos

### 3.3 Capas

| Capa           | Responsabilidad                             | Tecnología |
| -------------- | ------------------------------------------- | ---------- |
| Domain         | Entidades, Value Objects, reglas de negocio | JS puro    |
| Application    | Casos de uso, DTOs, puertos                 | JS puro    |
| Infrastructure | AI providers, storage, HTTP server          | JS + fetch |
| UI             | Componentes React, hooks específicos        | React 19   |

## 4. Stack Tecnológico

| Componente       | Tecnología                 |
| ---------------- | -------------------------- |
| UI               | React 19                   |
| Build            | Vite 8                     |
| Estilos          | Tailwind CSS 4             |
| Animaciones      | Framer Motion              |
| Testing Unitario | Vitest + Testing Library   |
| Testing E2E      | Playwright                 |
| Linting          | oxlint                     |
| Formato          | Prettier                   |
| Quality Gates    | Husky + lint-staged        |
| CI/CD            | GitHub Actions             |
| Proxy IA         | Vercel serverless function |

## 5. Testing Strategy

### 5.1 Pirámide de Testing

- **Unit tests (base, 70%):** Domain entities, services, SRS algorithm
- **Integration tests (medio, 20%):** Use cases + repositorios mock
- **E2E (cúspide, 10%):** Flujos críticos de usuario

### 5.2 Coverage Estratégico (100/80/0)

- **Domain + Application:** 100% lines, functions, branches
- **UI components:** 80% lines, functions
- **Infrastructure:** sin threshold (auto-validable por tipos)

## 6. Flujo de Usuario

```
Entry → Input Concept → Generate Level 1 → Read Explanation
  → Take Quiz → [Pass] → Unlock Level 2 + Generate SRS Cards
             → [Fail] → Re-explain → Retry Quiz
  → ... (repeat for levels 2-5)
  → Completion Screen → Evaluation → Export Data
```

## 7. Restricciones Técnicas

- Sin backend propio (todo cliente + proxy serverless)
- Sin base de datos externa (localStorage, migrable a futuro)
- Sin autenticación de usuarios
- Sin sincronización multi-dispositivo
- API keys de producción solo en variables de entorno del servidor

## 8. Criterios de Aceptación del Proyecto Final

- [ ] Un estudiante puede completar los 5 niveles para un concepto nuevo
- [ ] Los quizzes validan comprensión real (no solo memorización)
- [ ] Las tarjetas SRS aparecen vencidas según algoritmo SM-2
- [ ] El contenido generado es coherente con el nivel solicitado
- [ ] La app funciona sin errores de consola
- [ ] Cobertura de tests: domain 100%, UI 80%
- [ ] CI pasa en cada PR
- [ ] Despliegue en Vercel funcional
