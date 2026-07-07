import { describe, expect, it } from 'vitest'
import { Session } from '../../domain/entities/Session.js'

describe('Session', () => {
  it('creates a new session for a concept', () => {
    const session = Session.create('Quantum entanglement')
    expect(session.id).toBeTruthy()
    expect(session.concept).toBe('Quantum entanglement')
    expect(session.normalizedConcept).toBe('quantum entanglement')
    expect(session.levelsUnlocked).toBe(1)
    expect(session.currentLevelIndex).toBe(0)
    expect(session.levels).toHaveLength(5)
    expect(session.levels[0].number).toBe(1)
    expect(session.levels[0].status).toBe('pending')
    expect(session.levels[1].status).toBe('locked')
    expect(session.attempts).toEqual([])
    expect(session.evaluation.preScore).toBeNull()
    expect(session.evaluation.postScore).toBeNull()
  })

  it('normalizes "What is X" to just "X"', () => {
    const session = Session.create('What is quantum entanglement?')
    expect(session.normalizedConcept).toBe('quantum entanglement?')
  })

  it('unlocks the next level', () => {
    const session = Session.create('Test')
    const updated = Session.unlockNextLevel(session)
    expect(updated.levelsUnlocked).toBe(2)
    expect(updated.levels[1].status).toBe('pending')
    expect(updated.levels[2].status).toBe('locked')
  })

  it('does not unlock beyond level 5', () => {
    const session = { ...Session.create('Test'), levelsUnlocked: 5 }
    const updated = Session.unlockNextLevel(session)
    expect(updated.levelsUnlocked).toBe(5)
    // Should return the same session reference when already at max
    expect(updated).toBe(session)
  })

  it('records a quiz attempt', () => {
    const session = Session.create('Test')
    const attempt = {
      level: 1,
      score: 4,
      total: 5,
      passed: true,
      answers: [],
      weakAreas: [],
    }
    const updated = Session.recordAttempt(session, attempt)
    expect(updated.attempts).toHaveLength(1)
    expect(updated.attempts[0].passed).toBe(true)
  })

  it('updates level status to ready when content is set', () => {
    const session = Session.create('Test')
    const updated = Session.setLevelContent(session, 0, {
      explanation: 'A clear explanation...',
      questions: [],
    })
    expect(updated.levels[0].status).toBe('ready')
    expect(updated.levels[0].explanation).toBe('A clear explanation...')
  })

  it('sets evaluation post-score', () => {
    const session = Session.create('Test')
    const updated = Session.setEvaluation(session, { postScore: 4, feedback: 'Great!' })
    expect(updated.evaluation.postScore).toBe(4)
    expect(updated.evaluation.feedback).toBe('Great!')
    expect(updated.evaluation.completedAt).toBeTruthy()
  })

  it('setEvaluation with null postScore does not set completedAt', () => {
    const session = Session.create('Test')
    const updated = Session.setEvaluation(session, { postScore: null, feedback: '' })
    expect(updated.evaluation.postScore).toBeNull()
    expect(updated.evaluation.completedAt).toBeNull()
  })

  it('is frozen (immutable)', () => {
    const session = Session.create('Test')
    expect(Object.isFrozen(session)).toBe(true)
  })
})
