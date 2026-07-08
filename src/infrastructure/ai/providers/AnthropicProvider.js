/**
 * AnthropicProvider — Adaptador para Anthropic Claude API.
 *
 * Hexagonal Architecture (Módulo 2): Adaptador concreto que implementa el puerto AiProvider.
 * Strategy Pattern (Módulo 1): Estrategia intercambiable para generación de contenido.
 */

import {
  buildLevelExplanationPrompt,
  buildLevelQuizPrompt,
  buildReExplainPrompt,
  buildSRSPrompt,
} from '../prompts/index.js'

export class AnthropicProvider {
  constructor(config) {
    this.name = 'anthropic'
    this.apiKey = config.apiKey
    this.model = config.model || 'claude-sonnet-4-20250514'
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
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`)
    }

    const data = await response.json()
    const text = (data.content || []).map((b) => b.text || '').join('')
    return JSON.parse(text)
  }
}
