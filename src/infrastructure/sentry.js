/**
 * Sentry — Módulo de inicialización de Sentry para monitoreo de errores.
 *
 * Observabilidad (Módulo 7): Error tracking, performance monitoring, session replay.
 * Seguridad ENV (Módulo 3): DSN via VITE_SENTRY_DSN, nunca hardcodeado.
 */

import * as Sentry from '@sentry/react'

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN

  if (!dsn) {
    // Sentry is optional in development; skip silently
    if (import.meta.env.DEV) return
    console.warn('Sentry DSN not configured — error tracking disabled')
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: `deeplearn@${import.meta.env.VITE_APP_VERSION || '0.0.0'}`,
    integrations: [
      Sentry.browserTracingIntegration({
        enableLongTask: true,
        enableInp: true,
      }),
      Sentry.replayIntegration({
        maskAllText: false,
        maskAllInputs: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    debug: import.meta.env.DEV,
  })
}

export { Sentry }
