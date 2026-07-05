import { describe, expect, it } from 'vitest'
import { Question } from '../../domain/entities/Question.js'

describe('Question', () => {
  it('creates a valid question with 4 options', () => {
    const q = Question.create({
      id: 'l1q1',
      text: 'What is the main idea?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      explanation: 'A is correct because...',
    })
    expect(q.id).toBe('l1q1')
    expect(q.text).toBe('What is the main idea?')
    expect(q.options).toHaveLength(4)
    expect(q.options[q.correctIndex]).toBe('A')
  })

  it('throws if text is empty', () => {
    expect(() =>
      Question.create({
        id: 'q1',
        text: '',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        explanation: 'Because...',
      }),
    ).toThrow('Question text is required')
  })

  it('throws if not exactly 4 options', () => {
    expect(() =>
      Question.create({
        id: 'q1',
        text: 'Question?',
        options: ['A', 'B'],
        correctIndex: 0,
        explanation: 'Because...',
      }),
    ).toThrow('Question must have exactly 4 options')
  })

  it('throws if correctIndex is out of range', () => {
    expect(() =>
      Question.create({
        id: 'q1',
        text: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 4,
        explanation: 'Because...',
      }),
    ).toThrow('correctIndex must be between 0 and 3')
  })

  it('throws if options contain duplicates', () => {
    expect(() =>
      Question.create({
        id: 'q1',
        text: 'Question?',
        options: ['Same', 'Same', 'C', 'D'],
        correctIndex: 0,
        explanation: 'Because...',
      }),
    ).toThrow('Options must be unique')
  })

  it('throws if any option is empty', () => {
    expect(() =>
      Question.create({
        id: 'q1',
        text: 'Question?',
        options: ['A', '', 'C', 'D'],
        correctIndex: 0,
        explanation: 'Because this is a valid explanation text.',
      }),
    ).toThrow('All options must be non-empty strings')
  })

  it('throws if explanation is too short', () => {
    expect(() =>
      Question.create({
        id: 'q1',
        text: 'Question?',
        options: ['A', 'B', 'C', 'D'],
        correctIndex: 0,
        explanation: 'Short',
      }),
    ).toThrow('Explanation must be at least 20 characters')
  })

  it('shuffles options while preserving correct answer', () => {
    const q = Question.create({
      id: 'l1q1',
      text: 'Question?',
      options: ['Correct', 'Wrong1', 'Wrong2', 'Wrong3'],
      correctIndex: 0,
      explanation: 'Correct is right because it matches the core idea.',
    })
    expect(q.options).toContain('Correct')
    expect(q.options[q.correctIndex]).toBe('Correct')
    // Shuffled should differ from original order (probabilistic, but very likely)
    const originalOrder = ['Correct', 'Wrong1', 'Wrong2', 'Wrong3']
    const isShuffled = q.options.some((opt, i) => opt !== originalOrder[i])
    expect(isShuffled).toBe(true)
  })

  it('generates an id if none provided', () => {
    const q = Question.create({
      text: 'Question?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      explanation: 'A is correct because it matches the core idea taught in the explanation.',
    })
    expect(q.id).toBeTruthy()
  })

  it('is frozen (immutable)', () => {
    const q = Question.create({
      id: 'q1',
      text: 'Question?',
      options: ['A', 'B', 'C', 'D'],
      correctIndex: 0,
      explanation: 'A is correct because it matches the core idea taught in the explanation.',
    })
    expect(Object.isFrozen(q)).toBe(true)
  })
})
