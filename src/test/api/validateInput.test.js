import { describe, expect, it } from 'vitest'
import { validateProxyRequest } from '../../api/middleware/validateInput.js'

describe('validateProxyRequest', () => {
  it('accepts a valid Anthropic request', () => {
    const body = { provider: 'anthropic', prompt: 'Explain gravity', maxTokens: 1000 }
    const result = validateProxyRequest(body)
    expect(result.valid).toBe(true)
  })

  it('accepts a valid Ollama Cloud request', () => {
    const body = { provider: 'ollama-cloud', prompt: 'Explain gravity', model: 'gemma3:12b' }
    const result = validateProxyRequest(body)
    expect(result.valid).toBe(true)
  })

  it('rejects missing prompt', () => {
    const body = { provider: 'anthropic' }
    const result = validateProxyRequest(body)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Prompt is required')
  })

  it('rejects empty prompt', () => {
    const body = { provider: 'anthropic', prompt: '' }
    const result = validateProxyRequest(body)
    expect(result.valid).toBe(false)
  })

  it('rejects unknown provider', () => {
    const body = { provider: 'unknown', prompt: 'test' }
    const result = validateProxyRequest(body)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('provider')
  })

  it('rejects prompt that is too long (>10000 chars)', () => {
    const body = { provider: 'anthropic', prompt: 'x'.repeat(10001) }
    const result = validateProxyRequest(body)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('too long')
  })

  it('rejects non-POST method', () => {
    const result = validateProxyRequest({}, 'GET')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('POST')
  })

  it('rejects non-string prompt', () => {
    const body = { provider: 'anthropic', prompt: 123 }
    const result = validateProxyRequest(body)
    expect(result.valid).toBe(false)
  })

  it('rejects non-object body', () => {
    const result = validateProxyRequest('not-an-object')
    expect(result.valid).toBe(false)
    expect(result.error).toContain('Request body is required')
  })
})
