# ADR-002: Ollama Local como AI Provider Principal

**Fecha de la decisión**: 2026-07-08 (commit `7c7e3f6`)
**Redactado en formato completo**: 2026-07-14 (PR #10); actualizado con los budgets vigentes tras el commit `9002775`
**Estado**: Aceptado — complementado por [ADR-005](005-distribucion-local-first.md) (distribución local-first)

## Contexto

DeepLearn necesita generar explicaciones y quizzes mediante IA. El proyecto debe funcionar sin dependencia de APIs externas de pago, permitiendo desarrollo y testing offline. El usuario dispone de Ollama con modelos cloud-hosted accesibles vía localhost.

## Opciones Consideradas

1. **Ollama Local** — Modelos ejecutándose en localhost:11434, incluyendo modelos cloud-hosted como proxy transparente.
2. **Anthropic Claude API** — API hosted de pago, requiere clave y conexión a internet.
3. **LM Studio** — OpenAI-compatible local, requiere instalación separada.
4. **Ollama Cloud API** — API hosted de pago en api.ollama.com.

## Decisión

Elegimos **Ollama Local** como provider principal, con soporte para Anthropic y LM Studio como alternativas.

## Justificación

- **Cero coste**: Ollama es gratuito y los modelos cloud-hosted (gpt-oss:120b-cloud) se acceden sin API key vía localhost.
- **Offline-first**: Funciona sin conexión a internet para modelos locales.
- **Modelos cloud**: Los modelos cloud-hosted en Ollama se acceden como proxy transparente en localhost:11434, no requieren el provider `ollama-cloud`.
- **Strategy Pattern**: AiProviderFactory permite cambiar de provider en runtime sin modificar código.

## Consecuencias

### Positivas

- Desarrollo y testing sin coste de API
- Sin dependencia de servicios externos
- Modelos cloud accesibles sin API key

### Negativas

- Thinking mode en modelos gpt-oss/qwen3-coder requiere configuración especial (`thinking: { enabled: false }`)
- Token budget debe ajustarse por modelo (8000 para explicaciones y re-explicaciones, 12000 para quizzes y tarjetas SRS — valores ampliados en el commit `9002775` al comprobar truncamientos con los iniciales 3000/5000)
- Latencia variable según carga del servidor Ollama

## Referencias

- Máster, módulo «Prompt Engineering para Developers»
- Máster, módulo «Buenas Prácticas y Principios de Diseño» — patrón Strategy
