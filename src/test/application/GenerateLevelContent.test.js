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
