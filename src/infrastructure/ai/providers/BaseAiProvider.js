/**
 * BaseAiProvider — Plantilla común de los adaptadores de IA.
 *
 * Hexagonal Architecture (Módulo 2): implementa el puerto AiProvider una sola
 * vez; cada adaptador concreto aporta solo su transporte (endpoint, headers,
 * cuerpo y extracción de la respuesta).
 * DRY (Módulo 1): elimina el `_call` casi idéntico duplicado en 4 providers.
 */

import {
  buildLevelExplanationPrompt,
  buildLevelQuizPrompt,
  buildReExplainPrompt,
  buildSRSPrompt,
} from '../prompts/index.js'
import { trackModelCall } from '../observability.js'
import { shuffleQuestionOptions } from '../shuffleQuestionOptions.js'

/** El modelo a veces envuelve el JSON en fences pese a las instrucciones. */
function extractJson(text) {
  const trimmed = (text || '').trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/)
  return fenced ? fenced[1] : trimmed
}

export class BaseAiProvider {
  constructor({ name, model, budgets, errorLabel }) {
    this.name = name
    this.model = model
    this.budgets = budgets
    this.errorLabel = errorLabel
  }

  async generateExplanation(concept, levelNumber) {
    const prompt = buildLevelExplanationPrompt(concept, levelNumber)
    return this._call(prompt, this.budgets.explanation, 'explanation')
  }

  async generateQuiz(concept, levelNumber, explanation) {
    const prompt = buildLevelQuizPrompt(concept, levelNumber, explanation)
    const result = await this._call(prompt, this.budgets.quiz, 'quiz')
    return this._withShuffledOptions(result)
  }

  async generateReExplanation(concept, levelNumber, weakAreas) {
    const prompt = buildReExplainPrompt(concept, levelNumber, weakAreas)
    const result = await this._call(prompt, this.budgets.quiz, 're-explanation')
    return this._withShuffledOptions(result)
  }

  /** Guardrail: la distribución de la respuesta correcta no depende del modelo. */
  _withShuffledOptions(result) {
    if (!Array.isArray(result?.questions)) return result
    return { ...result, questions: result.questions.map((q) => shuffleQuestionOptions(q)) }
  }

  async generateSRSCards(concept, levelNumber, levelLabel) {
    const prompt = buildSRSPrompt(concept, levelLabel, levelNumber)
    return this._call(prompt, this.budgets.explanation, 'srs-cards')
  }

  async _call(prompt, maxTokens, kind) {
    const startedAt = performance.now()
    const response = await fetch(this._endpoint(), {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(this._body(prompt, maxTokens)),
    })

    if (!response.ok) {
      throw new Error(`${this.errorLabel} error: ${response.status}`)
    }

    const data = await response.json()
    trackModelCall({
      provider: this.name,
      model: this.model,
      kind,
      durationMs: performance.now() - startedAt,
      usage: this._usage(data),
    })

    return JSON.parse(extractJson(this._content(data)) || '{}')
  }

  /* Hooks que cada adaptador concreto debe implementar */
  _endpoint() {
    throw new Error(`${this.name}: _endpoint() not implemented`)
  }
  _headers() {
    return { 'Content-Type': 'application/json' }
  }
  _body(_prompt, _maxTokens) {
    throw new Error(`${this.name}: _body() not implemented`)
  }
  _content(_data) {
    throw new Error(`${this.name}: _content() not implemented`)
  }
  _usage(_data) {
    return {}
  }
}
