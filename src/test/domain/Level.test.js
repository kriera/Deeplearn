import { describe, expect, it } from 'vitest'
import { Level, LEVEL_CONTRACTS } from '../../domain/entities/Level.js'

describe('Level', () => {
  it('creates a level with valid number 1-5', () => {
    const level = Level.create(1)
    expect(level.number).toBe(1)
    expect(level.label).toBe('Elemental')
  })

  it('creates all five levels with correct labels', () => {
    const labels = ['Elemental', 'Basic', 'Medium', 'Advanced', 'Expert']
    for (let i = 1; i <= 5; i++) {
      const level = Level.create(i)
      expect(level.label).toBe(labels[i - 1])
    }
  })

  it('throws for invalid level numbers', () => {
    expect(() => Level.create(0)).toThrow('Level must be between 1 and 5')
    expect(() => Level.create(6)).toThrow('Level must be between 1 and 5')
    expect(() => Level.create(-1)).toThrow('Level must be between 1 and 5')
  })

  it('returns the audience description for each level', () => {
    const level1 = Level.create(1)
    expect(level1.audience).toContain('6-year-old')

    const level5 = Level.create(5)
    expect(level5.audience).toContain('researcher')
  })

  it('is frozen (immutable)', () => {
    const level = Level.create(1)
    expect(Object.isFrozen(level)).toBe(true)
  })

  it('compares equality by value', () => {
    const a = Level.create(2)
    const b = Level.create(2)
    expect(Level.equals(a, b)).toBe(true)
  })

  it('inequality when different levels', () => {
    const a = Level.create(1)
    const b = Level.create(3)
    expect(Level.equals(a, b)).toBe(false)
  })
})

describe('LEVEL_CONTRACTS', () => {
  it('has exactly 5 contracts', () => {
    expect(LEVEL_CONTRACTS).toHaveLength(5)
  })

  it('each contract has level, label, audience, rules, quizRules', () => {
    for (const c of LEVEL_CONTRACTS) {
      expect(c).toHaveProperty('level')
      expect(c).toHaveProperty('label')
      expect(c).toHaveProperty('audience')
      expect(c).toHaveProperty('rules')
      expect(c).toHaveProperty('quizRules')
    }
  })
})
