/**
 * observability — Telemetría de llamadas al modelo de IA.
 *
 * Observabilidad/LLMOps (Módulo 7): cada llamada registra latencia y tokens
 * como breadcrumb de Sentry con contexto de negocio. Si Sentry no está
 * inicializado los breadcrumbs son no-op; la telemetría nunca rompe el flujo.
 */

import { Sentry } from '../sentry.js'

export function trackModelCall({ provider, model, kind, durationMs, usage }) {
  try {
    Sentry.addBreadcrumb({
      category: 'ai.model',
      message: `${provider}/${kind}`,
      level: 'info',
      data: {
        model,
        durationMs: Math.round(durationMs),
        ...(usage || {}),
      },
    })
    Sentry.setTag('ai.provider', provider)
  } catch {
    // La telemetría es best-effort
  }
}
