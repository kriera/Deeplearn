/**
 * OllamaProvider — Adaptador para Ollama Local.
 *
 * Hexagonal Architecture (Módulo 2): Adaptador concreto.
 * Strategy Pattern (Módulo 1): Estrategia intercambiable.
 */

import {
  buildLevelExplanationPrompt,
  buildLevelQuizPrompt,
  buildReExplainPrompt,
  buildSRSPrompt,
} from '../prompts/index.js'

export class OllamaProvider {
  constructor(config) {
    this.name = 'ollama'
    this.baseUrl = (config.baseUrl || 'http://localhost:11434').replace(/\/$/, '')
    this.model = config.model || 'llama3.2'
  }

  async generateExplanation(concept, levelNumber) {
    const prompt = buildLevelExplanationPrompt(concept, levelNumber)
    return this._call(prompt, 1200)
  }

  async generateQuiz(concept, levelNumber, explanation) {
    const prompt = buildLevelQuizPrompt(concept, levelNumber, explanation)
    return this._call(prompt, 2400)
  }

  async generateReExplanation(concept, levelNumber, weakAreas) {
    const prompt = buildReExplainPrompt(concept, levelNumber, weakAreas)
    return this._call(prompt, 2400)
  }

  async generateSRSCards(concept, levelNumber, levelLabel) {
    const prompt = buildSRSPrompt(concept, levelLabel, levelNumber)
    return this._call(prompt, 1200)
  }

  async _call(prompt, maxTokens) {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a JSON API. Respond ONLY with valid JSON.' },
          { role: 'user', content: prompt },
        ],
        stream: false,
        options: { num_predict: maxTokens },
      }),
    })

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`)
    }

    const data = await response.json()
    return JSON.parse(data?.message?.content || '{}')
  }
}
