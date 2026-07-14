import { describe, expect, it, vi } from 'vitest'
import { SubmitQuiz } from '../../application/use-cases/SubmitQuiz.js'

describe('SubmitQuiz', () => {
  const baseSession = {
    id: 's1',
    concept: 'Test',
    normalizedConcept: 'test',
    levelsUnlocked: 1,
    currentLevelIndex: 0,
    levels: [
      {
        number: 1,
        status: 'ready',
        explanation: 'An explanation about test.',
        questions: [
          {
            id: 'q1',
            text: 'Q1?',
            options: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            explanation: 'A is correct.',
          },
          {
            id: 'q2',
            text: 'Q2?',
            options: ['A', 'B', 'C', 'D'],
            correctIndex: 1,
            explanation: 'B is correct.',
          },
          {
            id: 'q3',
            text: 'Q3?',
            options: ['A', 'B', 'C', 'D'],
            correctIndex: 2,
            explanation: 'C is correct.',
          },
          {
            id: 'q4',
            text: 'Q4?',
            options: ['A', 'B', 'C', 'D'],
            correctIndex: 3,
            explanation: 'D is correct.',
          },
          {
            id: 'q5',
            text: 'Q5?',
            options: ['A', 'B', 'C', 'D'],
            correctIndex: 0,
            explanation: 'A is correct.',
          },
        ],
      },
      { number: 2, status: 'locked' },
      { number: 3, status: 'locked' },
      { number: 4, status: 'locked' },
      { number: 5, status: 'locked' },
    ],
    attempts: [],
    evaluation: {
      preScore: null,
      postScore: null,
      feedback: '',
      startedAt: new Date().toISOString(),
      completedAt: null,
    },
  }

  it('passes with 4/5 correct answers and unlocks next level', async () => {
    const repo = { save: vi.fn((s) => s) }
    const answers = [
      { questionId: 'q1', selectedIndex: 0 },
      { questionId: 'q2', selectedIndex: 1 },
      { questionId: 'q3', selectedIndex: 2 },
      { questionId: 'q4', selectedIndex: 3 },
      { questionId: 'q5', selectedIndex: 0 },
    ]

    const result = await SubmitQuiz.execute(baseSession, answers, undefined, repo)

    expect(result.passed).toBe(true)
    expect(result.score).toBe(5)
    expect(result.total).toBe(5)
    expect(result.unlockedNextLevel).toBe(true)
    expect(repo.save).toHaveBeenCalled()
  })

  it('fails with 2/5 correct answers and does not unlock next level', async () => {
    const repo = { save: vi.fn((s) => s) }
    const answers = [
      { questionId: 'q1', selectedIndex: 1 },
      { questionId: 'q2', selectedIndex: 2 },
      { questionId: 'q3', selectedIndex: 0 },
      { questionId: 'q4', selectedIndex: 3 },
      { questionId: 'q5', selectedIndex: 1 },
    ]

    const result = await SubmitQuiz.execute(baseSession, answers, undefined, repo)

    expect(result.passed).toBe(false)
    expect(result.score).toBe(1)
    expect(result.unlockedNextLevel).toBe(false)
    expect(result.weakAreas).toHaveLength(4)
    expect(result.weakAreas[0].questionId).toBe('q1')
  })

  it('returns answer review with correct/incorrect details', async () => {
    const repo = { save: vi.fn((s) => s) }
    const answers = [
      { questionId: 'q1', selectedIndex: 0 },
      { questionId: 'q2', selectedIndex: 0 },
      { questionId: 'q3', selectedIndex: 2 },
      { questionId: 'q4', selectedIndex: 3 },
      { questionId: 'q5', selectedIndex: 0 },
    ]

    const result = await SubmitQuiz.execute(baseSession, answers, undefined, repo)

    expect(result.answerReview).toHaveLength(5)
    expect(result.answerReview[0].correct).toBe(true)
    expect(result.answerReview[1].correct).toBe(false)
    expect(result.answerReview[1].correctAnswer).toBe('B')
  })

  it('throws if level has no questions loaded', async () => {
    const repo = { save: vi.fn() }
    const noQuestions = {
      ...baseSession,
      levels: baseSession.levels.map((l, i) => (i === 0 ? { ...l, questions: [] } : l)),
    }

    await expect(SubmitQuiz.execute(noQuestions, [], undefined, repo)).rejects.toThrow(
      'No questions loaded',
    )
  })

  it('handles answer with null selectedIndex', async () => {
    const repo = { save: vi.fn((s) => s) }
    const answers = [
      { questionId: 'q1', selectedIndex: null },
      { questionId: 'q2', selectedIndex: 1 },
      { questionId: 'q3', selectedIndex: 2 },
      { questionId: 'q4', selectedIndex: 3 },
      { questionId: 'q5', selectedIndex: 0 },
    ]

    const result = await SubmitQuiz.execute(baseSession, answers, undefined, repo)
    expect(result.answerReview[0].selectedAnswer).toBe('')
    expect(result.answerReview[0].correct).toBe(false)
  })

  it('generates next level content on pass when aiProvider is passed', async () => {
    const repo = { save: vi.fn((s) => s) }
    const aiProvider = {
      generateExplanation: vi.fn(() => Promise.resolve({ explanation: 'Level 2 explanation' })),
      generateQuiz: vi.fn(() =>
        Promise.resolve({
          questions: [
            { id: 'nq1', text: 'NQ?', options: ['X', 'Y'], correctIndex: 0, explanation: 'X' },
          ],
        }),
      ),
    }
    const answers = [
      { questionId: 'q1', selectedIndex: 0 },
      { questionId: 'q2', selectedIndex: 1 },
      { questionId: 'q3', selectedIndex: 2 },
      { questionId: 'q4', selectedIndex: 3 },
      { questionId: 'q5', selectedIndex: 0 },
    ]

    const result = await SubmitQuiz.execute(baseSession, answers, undefined, repo, aiProvider)

    expect(result.passed).toBe(true)
    expect(result.nextLevelContent).toBeTruthy()
    expect(result.nextLevelContent.explanation).toBe('Level 2 explanation')
    expect(aiProvider.generateExplanation).toHaveBeenCalledWith('Test', 2)
  })

  it('generates re-explanation on fail when aiProvider is passed', async () => {
    const repo = { save: vi.fn((s) => s) }
    const aiProvider = {
      generateReExplanation: vi.fn(() =>
        Promise.resolve({ explanation: 'Simpler explanation...' }),
      ),
    }
    const answers = [
      { questionId: 'q1', selectedIndex: 1 },
      { questionId: 'q2', selectedIndex: 2 },
      { questionId: 'q3', selectedIndex: 0 },
      { questionId: 'q4', selectedIndex: 1 },
      { questionId: 'q5', selectedIndex: 2 },
    ]

    const result = await SubmitQuiz.execute(baseSession, answers, undefined, repo, aiProvider)

    expect(result.passed).toBe(false)
    expect(result.reExplanation).toBe('Simpler explanation...')
    expect(aiProvider.generateReExplanation).toHaveBeenCalled()
  })

  it('normalizes snake_case correct_index and tolerates questions without index', async () => {
    const repo = { save: vi.fn((s) => s) }
    const snakeSession = {
      ...baseSession,
      levels: baseSession.levels.map((l, i) =>
        i === 0
          ? {
              ...l,
              questions: [
                { id: 'q1', text: 'Q1?', options: ['A', 'B'], correct_index: 1, explanation: 'B.' },
                { id: 'q2', text: 'Q2?', options: ['A', 'B'], explanation: 'Sin índice.' },
              ],
            }
          : l,
      ),
    }
    const answers = [
      { questionId: 'q1', selectedIndex: 1 },
      { questionId: 'q2', selectedIndex: 0 },
    ]

    const result = await SubmitQuiz.execute(snakeSession, answers, undefined, repo)

    expect(result.answerReview[0].correct).toBe(true)
    expect(result.answerReview[0].correctIndex).toBe(1)
    expect(result.answerReview[1].correct).toBe(false)
    expect(result.answerReview[1].correctIndex).toBe(-1)
  })

  it('marks next level as error and persists when generation fails on pass', async () => {
    const repo = { save: vi.fn((s) => s) }
    const aiProvider = {
      generateExplanation: vi.fn(() => Promise.reject(new Error('model offline'))),
    }
    const answers = [
      { questionId: 'q1', selectedIndex: 0 },
      { questionId: 'q2', selectedIndex: 1 },
      { questionId: 'q3', selectedIndex: 2 },
      { questionId: 'q4', selectedIndex: 3 },
      { questionId: 'q5', selectedIndex: 0 },
    ]

    const result = await SubmitQuiz.execute(baseSession, answers, undefined, repo, aiProvider)

    expect(result.passed).toBe(true)
    expect(result.unlockedNextLevel).toBe(true)
    expect(result.nextLevelContent).toBeNull()
    expect(result.session.levels[1].status).toBe('error')
    expect(result.session.levels[1].generationError).toBe('model offline')
    expect(repo.save).toHaveBeenCalled()
  })

  it('returns null re-explanation when provider fails on fail path', async () => {
    const repo = { save: vi.fn((s) => s) }
    const aiProvider = {
      generateReExplanation: vi.fn(() => Promise.reject(new Error('model offline'))),
    }
    const answers = [
      { questionId: 'q1', selectedIndex: 1 },
      { questionId: 'q2', selectedIndex: 2 },
      { questionId: 'q3', selectedIndex: 0 },
      { questionId: 'q4', selectedIndex: 1 },
      { questionId: 'q5', selectedIndex: 2 },
    ]

    const result = await SubmitQuiz.execute(baseSession, answers, undefined, repo, aiProvider)

    expect(result.passed).toBe(false)
    expect(result.reExplanation).toBeNull()
  })
})
