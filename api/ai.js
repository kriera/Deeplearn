/**
 * ai — Proxy serverless para proveedores de IA.
 * Diseñado para Vercel serverless functions.
 *
 * OWASP Top 10 (Módulo 3): Validación server-side, rate limiting.
 * Clean Architecture (Módulo 2): Adaptador de entrada (infraestructura).
 */

import { validateProxyRequest } from './middleware/validateInput.js'
import { RateLimiter } from './middleware/rateLimit.js'

const limiter = new RateLimiter(20, 60000)

async function callAnthropic(prompt, maxTokens) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { status: 500, body: { error: 'ANTHROPIC_API_KEY is not configured.' } }
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      max_tokens: maxTokens || 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { status: response.status, body: { error: data?.error?.message || response.statusText } }
  }

  return {
    status: 200,
    body: { text: (data.content || []).map((b) => b.text || '').join('') },
  }
}

async function callOllamaCloud(prompt, model) {
  const apiKey = process.env.OLLAMA_CLOUD_API_KEY
  if (!apiKey) {
    return { status: 500, body: { error: 'OLLAMA_CLOUD_API_KEY is not configured.' } }
  }

  const response = await fetch('https://api.ollama.com/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || process.env.OLLAMA_CLOUD_MODEL || 'gemma3:12b',
      messages: [
        { role: 'system', content: 'You are a JSON API. Respond ONLY with valid JSON.' },
        { role: 'user', content: prompt },
      ],
      stream: false,
    }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    return { status: response.status, body: { error: data?.error || response.statusText } }
  }

  return { status: 200, body: { text: data?.message?.content || '' } }
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  const rateCheck = limiter.check(clientIp)
  if (!rateCheck.allowed) {
    res.status(429).json({ error: `Too many requests. Retry after ${rateCheck.retryAfter}s.` })
    return
  }

  // Input validation
  const validation = validateProxyRequest(req.body, req.method)
  if (!validation.valid) {
    res.status(400).json({ error: validation.error })
    return
  }

  try {
    const { provider, prompt, maxTokens, model } = req.body
    const result =
      provider === 'ollama-cloud'
        ? await callOllamaCloud(prompt, model)
        : await callAnthropic(prompt, maxTokens)

    res.status(result.status).json(result.body)
  } catch (error) {
    res.status(500).json({ error: error.message || 'Unexpected AI proxy error.' })
  }
}
