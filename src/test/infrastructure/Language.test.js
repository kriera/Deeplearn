import { describe, expect, it } from 'vitest'
import {
  detectLanguage,
  outputLanguageDirective,
} from '../../infrastructure/ai/prompts/language.js'
import { buildLevelExplanationPrompt } from '../../infrastructure/ai/prompts/LevelPrompt.js'
import { buildLevelQuizPrompt } from '../../infrastructure/ai/prompts/QuizPrompt.js'
import { buildReExplainPrompt } from '../../infrastructure/ai/prompts/ReExplainPrompt.js'
import { buildSRSPrompt } from '../../infrastructure/ai/prompts/SrsPrompt.js'

describe('detectLanguage', () => {
  it('detects Spanish by leading article', () => {
    expect(detectLanguage('El sistema solar')).toBe('es')
    expect(detectLanguage('La Revolución Francesa')).toBe('es')
  })

  it('detects Spanish by accented characters', () => {
    expect(detectLanguage('fotosíntesis')).toBe('es')
  })

  it('detects Spanish by common words', () => {
    expect(detectLanguage('teoría de la relatividad')).toBe('es')
  })

  it('defaults to English otherwise', () => {
    expect(detectLanguage('Quantum entanglement')).toBe('en')
    expect(detectLanguage('DNA replication')).toBe('en')
  })
})

describe('outputLanguageDirective', () => {
  it('exige español para conceptos en español en los 4 prompts', () => {
    const concept = 'El sistema solar'
    expect(buildLevelExplanationPrompt(concept, 1)).toContain('íntegramente en español')
    expect(buildLevelQuizPrompt(concept, 1, 'Una explicación.')).toContain(
      'íntegramente en español',
    )
    expect(buildReExplainPrompt(concept, 1, [])).toContain('íntegramente en español')
    expect(buildSRSPrompt(concept, 'Elemental', 1)).toContain('íntegramente en español')
  })

  it('exige inglés para conceptos en inglés', () => {
    expect(buildLevelExplanationPrompt('Gravity', 1)).toContain('entirely in English')
    expect(buildReExplainPrompt('Gravity', 1, [])).toContain('entirely in English')
    expect(outputLanguageDirective('en')).toContain('English')
  })
})
