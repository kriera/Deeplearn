/**
 * AnthropicProvider — Adaptador para Anthropic Claude API.
 *
 * Hexagonal Architecture (Módulo 2): Adaptador concreto que implementa el puerto AiProvider.
 * Strategy Pattern (Módulo 1): Estrategia intercambiable para generación de contenido.
 */

import { BaseAiProvider } from './BaseAiProvider.js'

export class AnthropicProvider extends BaseAiProvider {
  constructor(config) {
    super({
      name: 'anthropic',
      model: config.model || 'claude-sonnet-4-20250514',
      budgets: { explanation: 1200, quiz: 2400 },
      errorLabel: 'Anthropic API',
    })
    this.apiKey = config.apiKey
  }

  _endpoint() {
    return 'https://api.anthropic.com/v1/messages'
  }

  _headers() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01',
    }
  }

  _body(prompt, maxTokens) {
    return {
      model: this.model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }
  }

  _content(data) {
    return (data.content || []).map((b) => b.text || '').join('')
  }

  _usage(data) {
    return {
      inputTokens: data?.usage?.input_tokens,
      outputTokens: data?.usage?.output_tokens,
    }
  }
}
