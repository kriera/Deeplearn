/**
 * LmStudioProvider — Adaptador para LM Studio (OpenAI-compatible).
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

export class LmStudioProvider {
  constructor(config) {
    this.name = 'lmstudio'
    this.baseUrl = (config.baseUrl || 'http://localhost:1234').replace(/\/$/, '')
    this.model = config.model || 'local-model'
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
    const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: 'You are a JSON API. Respond ONLY with valid JSON.' },
          { role: 'user', content: prompt },
        ],
        stream: false,
        max_tokens: maxTokens,
      }),
    })

    if (!response.ok) {
      throw new Error(`LM Studio error: ${response.status}`)
    }

    const data = await response.json()
    return JSON.parse(data?.choices?.[0]?.message?.content || '{}')
  }
}
