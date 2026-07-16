import { describe, expect, it, vi } from 'vitest'
import { GenerateLevelContent } from '../../application/use-cases/GenerateLevelContent.js'

describe('GenerateLevelContent', () => {
  const baseSession = {
    id: 's1',
    concept: 'Test',
    normalizedConcept: 'test',
    levelsUnlocked: 2,
    currentLevelIndex: 1,
    levels: [
      { number: 1, status: 'ready', explanation: 'Done.', questions: [] },
      { number: 2, status: 'pending', explanation: '', questions: [] },
      { number: 3, status: 'locked' },
      { number: 4, status: 'locked' },
      { number: 5, status: 'locked' },
    ],
    attempts: [],
  }

  it('generates explanation first, then quiz from that explanation, and persists', async () => {
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

    const updated = await GenerateLevelContent.execute(baseSession, 1, aiProvider, repo)

    expect(aiProvider.generateExplanation).toHaveBeenCalledWith('Test', 2)
    // Prompt chaining: el quiz se genera desde la explicación como fuente de verdad
    expect(aiProvider.generateQuiz).toHaveBeenCalledWith('Test', 2, 'Level 2 explanation')
    expect(updated.levels[1].status).toBe('ready')
    expect(updated.levels[1].explanation).toBe('Level 2 explanation')
    expect(updated.levels[1].questions).toHaveLength(1)
    expect(repo.save).toHaveBeenCalledWith(updated)
  })

  it('notifica la explicación en cuanto llega (generación progresiva) y la persiste', async () => {
    const saves = []
    const repo = { save: vi.fn((s) => saves.push(s)) }
    const aiProvider = {
      generateExplanation: vi.fn(() => Promise.resolve({ explanation: 'Progressive explanation' })),
      generateQuiz: vi.fn(() => Promise.resolve({ questions: [{ id: 'q1' }] })),
    }
    const onExplanation = vi.fn()

    await GenerateLevelContent.execute(baseSession, 1, aiProvider, repo, { onExplanation })

    // El callback recibe la sesión con la explicación pero sin quiz todavía
    expect(onExplanation).toHaveBeenCalledTimes(1)
    const partial = onExplanation.mock.calls[0][0]
    expect(partial.levels[1].explanation).toBe('Progressive explanation')
    expect(partial.levels[1].questions).toHaveLength(0)
    // Y esa versión parcial ya está persistida (primer save) antes del quiz
    expect(saves[0].levels[1].explanation).toBe('Progressive explanation')
    expect(saves[0].levels[1].questions).toHaveLength(0)
    expect(saves[1].levels[1].questions).toHaveLength(1)
  })

  it('reutiliza la explicación existente y solo genera el quiz', async () => {
    const repo = { save: vi.fn((s) => s) }
    const aiProvider = {
      generateExplanation: vi.fn(),
      generateQuiz: vi.fn(() => Promise.resolve({ questions: [{ id: 'q1' }] })),
    }
    const session = {
      ...baseSession,
      levels: baseSession.levels.map((l, i) =>
        i === 1 ? { ...l, explanation: 'Already generated' } : l,
      ),
    }
    const onExplanation = vi.fn()

    const updated = await GenerateLevelContent.execute(session, 1, aiProvider, repo, {
      onExplanation,
    })

    expect(aiProvider.generateExplanation).not.toHaveBeenCalled()
    expect(onExplanation).not.toHaveBeenCalled()
    expect(aiProvider.generateQuiz).toHaveBeenCalledWith('Test', 2, 'Already generated')
    expect(updated.levels[1].questions).toHaveLength(1)
    expect(repo.save).toHaveBeenCalledTimes(1)
  })

  it('throws when the level index does not exist', async () => {
    const repo = { save: vi.fn() }
    const aiProvider = { generateExplanation: vi.fn(), generateQuiz: vi.fn() }

    await expect(GenerateLevelContent.execute(baseSession, 9, aiProvider, repo)).rejects.toThrow(
      'Level 9 not found',
    )
    expect(aiProvider.generateExplanation).not.toHaveBeenCalled()
    expect(repo.save).not.toHaveBeenCalled()
  })

  it('propagates provider failures without persisting', async () => {
    const repo = { save: vi.fn() }
    const aiProvider = {
      generateExplanation: vi.fn(() => Promise.reject(new Error('model offline'))),
      generateQuiz: vi.fn(),
    }

    await expect(GenerateLevelContent.execute(baseSession, 1, aiProvider, repo)).rejects.toThrow(
      'model offline',
    )
    expect(aiProvider.generateQuiz).not.toHaveBeenCalled()
    expect(repo.save).not.toHaveBeenCalled()
  })
})
