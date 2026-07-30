/**
 * LmStudioProvider — Adaptador para LM Studio (OpenAI-compatible).
 *
 * Hexagonal Architecture (Módulo 2): Adaptador concreto.
 * Strategy Pattern (Módulo 1): Estrategia intercambiable.
 */

import { BaseAiProvider } from './BaseAiProvider.js'

export class LmStudioProvider extends BaseAiProvider {
  constructor(config) {
    super({
      name: 'lmstudio',
      model: config.model || 'local-model',
      budgets: { explanation: 1200, quiz: 2400 },
      errorLabel: 'LM Studio',
    })
    this.baseUrl = (config.baseUrl || 'http://localhost:1234').replace(/\/$/, '')
  }

  _endpoint() {
    return `${this.baseUrl}/v1/chat/completions`
  }

  _body(prompt, maxTokens) {
    return {
      model: this.model,
      messages: [
        {
          role: 'system',
          content:
            'Eres una API JSON. Responde SOLO con JSON válido. Todo el texto que generes debe estar en español.',
        },
        { role: 'user', content: prompt },
      ],
      stream: false,
      max_tokens: maxTokens,
    }
  }

  _content(data) {
    return data?.choices?.[0]?.message?.content || ''
  }

  _usage(data) {
    return {
      inputTokens: data?.usage?.prompt_tokens,
      outputTokens: data?.usage?.completion_tokens,
    }
  }
}
