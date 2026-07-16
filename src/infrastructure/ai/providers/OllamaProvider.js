/**
 * OllamaProvider — Adaptador para Ollama Local.
 *
 * Hexagonal Architecture (Módulo 2): Adaptador concreto.
 * Strategy Pattern (Módulo 1): Estrategia intercambiable.
 */

import { BaseAiProvider } from './BaseAiProvider.js'

export class OllamaProvider extends BaseAiProvider {
  constructor(config) {
    super({
      name: 'ollama',
      model: config.model || 'llama3.2',
      // Presupuestos amplios: los modelos gpt-oss consumen tokens de thinking
      budgets: { explanation: 8000, quiz: 12000 },
      errorLabel: 'Ollama',
    })
    this.baseUrl = (config.baseUrl || 'http://localhost:11434').replace(/\/$/, '')
  }

  _endpoint() {
    return `${this.baseUrl}/api/chat`
  }

  _body(prompt, maxTokens) {
    const body = {
      model: this.model,
      messages: [
        { role: 'system', content: 'You are a JSON API. Respond ONLY with valid JSON.' },
        { role: 'user', content: prompt },
      ],
      stream: false,
      options: { num_predict: maxTokens },
    }
    // Los modelos gpt-oss razonan antes de responder; con esfuerzo 'low'
    // la latencia baja mucho sin degradar tareas de generación guiada.
    // Solo se envía si el modelo lo soporta: Ollama rechaza `think` en
    // modelos sin modo razonamiento.
    if (/gpt-oss/i.test(this.model)) {
      body.think = 'low'
    }
    return body
  }

  _content(data) {
    // Models with thinking mode (gpt-oss, qwen3-coder) put output in
    // message.thinking and leave message.content empty.
    return data?.message?.content || data?.message?.thinking || ''
  }

  _usage(data) {
    return {
      inputTokens: data?.prompt_eval_count,
      outputTokens: data?.eval_count,
    }
  }
}
