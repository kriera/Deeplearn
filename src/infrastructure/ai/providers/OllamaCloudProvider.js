/**
 * OllamaCloudProvider — Adaptador para Ollama Cloud.
 *
 * Hexagonal Architecture (Módulo 2): Adaptador concreto.
 * Strategy Pattern (Módulo 1): Estrategia intercambiable.
 */

import { BaseAiProvider } from './BaseAiProvider.js'

export class OllamaCloudProvider extends BaseAiProvider {
  constructor(config) {
    super({
      name: 'ollama-cloud',
      model: config.model || 'gemma3:12b',
      budgets: { explanation: 1200, quiz: 2400 },
      errorLabel: 'Ollama Cloud',
    })
    this.apiKey = config.apiKey
  }

  _endpoint() {
    return 'https://api.ollama.com/api/chat'
  }

  _headers() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    }
  }

  _body(prompt, maxTokens) {
    return {
      model: this.model,
      messages: [
        { role: 'system', content: 'You are a JSON API. Respond ONLY with valid JSON.' },
        { role: 'user', content: prompt },
      ],
      stream: false,
      options: { num_predict: maxTokens },
    }
  }

  _content(data) {
    return data?.message?.content || ''
  }

  _usage(data) {
    return {
      inputTokens: data?.prompt_eval_count,
      outputTokens: data?.eval_count,
    }
  }
}
