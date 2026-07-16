import { describe, expect, it } from 'vitest'
import { buildLevelExplanationPrompt } from '../../infrastructure/ai/prompts/LevelPrompt.js'
import { buildLevelQuizPrompt } from '../../infrastructure/ai/prompts/QuizPrompt.js'
import { buildReExplainPrompt } from '../../infrastructure/ai/prompts/ReExplainPrompt.js'
import { buildSRSPrompt } from '../../infrastructure/ai/prompts/SrsPrompt.js'

describe('LevelPrompt', () => {
  it('includes concept and level in the prompt', () => {
    const prompt = buildLevelExplanationPrompt('Quantum entanglement', 1)
    expect(prompt).toContain('Quantum entanglement')
    expect(prompt).toContain('level 1')
    expect(prompt).toContain('Elemental')
  })

  it('includes audience description for each level', () => {
    const l1 = buildLevelExplanationPrompt('Test', 1)
    expect(l1).toContain('6-year-old')

    const l5 = buildLevelExplanationPrompt('Test', 5)
    expect(l5).toContain('researcher')
  })

  it('requests JSON output without markdown', () => {
    const prompt = buildLevelExplanationPrompt('Test', 2)
    expect(prompt).toContain('Return ONLY valid JSON')
    expect(prompt).toContain('No markdown')
  })
})

describe('QuizPrompt', () => {
  it('includes concept, level, and explanation in the prompt', () => {
    const prompt = buildLevelQuizPrompt('Gravity', 3, 'Gravity is a force...')
    expect(prompt).toContain('Gravity')
    expect(prompt).toContain('level 3')
    expect(prompt).toContain('Medium')
    expect(prompt).toContain('Gravity is a force...')
  })

  it('includes quiz quality rules', () => {
    const prompt = buildLevelQuizPrompt('Test', 1, 'Explanation...')
    expect(prompt).toContain('5 distinct multiple-choice questions')
    expect(prompt).toContain('correct_index')
  })
})

describe('ReExplainPrompt', () => {
  it('includes weak areas in the prompt', () => {
    const weakAreas = [
      { question: 'What is gravity?', correctAnswer: 'A force', explanation: 'Because...' },
    ]
    const prompt = buildReExplainPrompt('Gravity', 1, weakAreas)
    expect(prompt).toContain('What is gravity?')
    expect(prompt).toContain('SIMPLER re-explanation')
  })

  it('handles empty weak areas gracefully', () => {
    const prompt = buildReExplainPrompt('Gravity', 1, [])
    expect(prompt).toContain('SIMPLER re-explanation')
    expect(prompt).not.toContain('undefined')
  })
})

describe('SrsPrompt', () => {
  it('includes concept and level in the prompt', () => {
    const prompt = buildSRSPrompt('Gravity', 'Basic', 2)
    expect(prompt).toContain('Gravity')
    expect(prompt).toContain('Basic')
    expect(prompt).toContain('level 2')
  })

  it('requests 5 flash cards', () => {
    const prompt = buildSRSPrompt('Test', 'Elemental', 1)
    expect(prompt).toContain('5 spaced-repetition flash cards')
  })
})

describe('buildReExplainPrompt — reglas de calidad del quiz', () => {
  it('incluye las reglas de calidad (regresión: eval detectó correct_index sin distribuir)', () => {
    const prompt = buildReExplainPrompt('black holes', 1, [
      { question: 'What is the event horizon?' },
    ])
    expect(prompt).toContain('Spread correct_index across 0, 1, 2, and 3.')
    expect(prompt).toContain('Wrong options must be plausible')
  })

  it('aclara que simpler no significa más corto (regresión: eval detectó re-explicaciones de <100 palabras)', () => {
    const prompt = buildReExplainPrompt('black holes', 1, [
      { question: 'What is the event horizon?' },
    ])
    expect(prompt).toContain('NOT a shorter text')
    expect(prompt).toContain('between 150 and 250 words')
  })
})
