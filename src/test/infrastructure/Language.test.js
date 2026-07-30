import { describe, expect, it } from 'vitest'
import {
  OUTPUT_LANGUAGE,
  outputLanguageDirective,
} from '../../infrastructure/ai/prompts/language.js'
import { buildLevelExplanationPrompt } from '../../infrastructure/ai/prompts/LevelPrompt.js'
import { buildLevelQuizPrompt } from '../../infrastructure/ai/prompts/QuizPrompt.js'
import { buildReExplainPrompt } from '../../infrastructure/ai/prompts/ReExplainPrompt.js'
import { buildSRSPrompt } from '../../infrastructure/ai/prompts/SrsPrompt.js'

const builders = [
  ['explicación', (c) => buildLevelExplanationPrompt(c, 1)],
  ['quiz', (c) => buildLevelQuizPrompt(c, 1, 'Una explicación.')],
  ['re-explicación', (c) => buildReExplainPrompt(c, 1, [])],
  ['tarjetas SRS', (c) => buildSRSPrompt(c, 'Elemental', 1)],
]

describe('idioma de salida', () => {
  it('la app es monolingüe en castellano', () => {
    expect(OUTPUT_LANGUAGE).toBe('es')
    expect(outputLanguageDirective()).toContain('íntegramente en español')
  })

  it.each(builders)('%s: exige español para conceptos en español', (_name, build) => {
    expect(build('El sistema solar')).toContain('íntegramente en español')
  })

  // Regresión: detectLanguage() caía en 'en' por defecto, así que conceptos
  // españoles sin tildes ni artículo pedían inglés EXPLÍCITAMENTE al modelo.
  it.each(builders)('%s: exige español sin tildes ni artículo', (_name, build) => {
    for (const concept of ['Relatividad general', 'Oferta y demanda', 'Agujeros negros']) {
      const prompt = build(concept)
      expect(prompt).toContain('íntegramente en español')
      expect(prompt).not.toContain('entirely in English')
    }
  })

  it.each(builders)('%s: exige español también para conceptos en inglés', (_name, build) => {
    const prompt = build('Quantum entanglement')
    expect(prompt).toContain('íntegramente en español')
    expect(prompt).not.toContain('entirely in English')
  })
})
