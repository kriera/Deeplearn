/**
 * validateInput — Middleware de validación para el proxy serverless.
 *
 * OWASP Top 10 (Módulo 3): Validación de entrada server-side.
 * Nunca confiar ciegamente en datos del cliente.
 */

const ALLOWED_PROVIDERS = ['anthropic', 'ollama-cloud']
const MAX_PROMPT_LENGTH = 10000

export function validateProxyRequest(body, method = 'POST') {
  if (method !== 'POST') {
    return { valid: false, error: 'Only POST requests are allowed' }
  }

  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Request body is required' }
  }

  const { provider, prompt } = body

  if (!provider || !ALLOWED_PROVIDERS.includes(provider)) {
    return { valid: false, error: `Invalid provider. Allowed: ${ALLOWED_PROVIDERS.join(', ')}` }
  }

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    return { valid: false, error: 'Prompt is required and must be a non-empty string' }
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return { valid: false, error: `Prompt is too long (max ${MAX_PROMPT_LENGTH} characters)` }
  }

  return { valid: true }
}
