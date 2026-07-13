import { describe, expect, it, vi } from 'vitest'
import { StartSession } from '../../application/use-cases/StartSession.js'

describe('StartSession', () => {
  it('creates a new session and saves it', async () => {
    const saved = []
    const repo = {
      save: vi.fn((s) => {
        saved.push(s)
        return s
      }),
      findByConcept: vi.fn(() => null),
    }

    const result = await StartSession.execute('Quantum entanglement', repo)

    expect(result.session.concept).toBe('Quantum entanglement')
    expect(result.session.levelsUnlocked).toBe(1)
    expect(repo.save).toHaveBeenCalled()
    expect(repo.findByConcept).toHaveBeenCalledWith('quantum entanglement')
  })

  it('restores existing session if concept already studied', async () => {
    const existing = { id: 'existing-id', concept: 'Quantum entanglement', levelsUnlocked: 3 }
    const repo = {
      save: vi.fn(),
      findByConcept: vi.fn(() => existing),
    }

    const result = await StartSession.execute('Quantum entanglement', repo)

    expect(result.session).toBe(existing)
    expect(result.restored).toBe(true)
    expect(repo.save).not.toHaveBeenCalled()
  })

  it('normalizes concept for duplicate detection', async () => {
    const existing = {
      id: 'e1',
      concept: 'Quantum entanglement',
      normalizedConcept: 'quantum entanglement',
    }
    const repo = {
      save: vi.fn(),
      findByConcept: vi.fn(() => existing),
    }

    const result = await StartSession.execute('What is Quantum Entanglement?', repo)

    expect(result.restored).toBe(true)
    expect(repo.findByConcept).toHaveBeenCalledWith('quantum entanglement?')
  })

  it('generates level 1 content when aiProvider is passed', async () => {
    const saved = []
    const repo = {
      save: vi.fn((s) => {
        saved.push(s)
        return s
      }),
      findByConcept: vi.fn(() => null),
    }
    const aiProvider = {
      generateExplanation: vi.fn(() => Promise.resolve({ explanation: 'Test explanation' })),
      generateQuiz: vi.fn(() =>
        Promise.resolve({
          questions: [
            { id: 'q1', text: 'Q?', options: ['A', 'B'], correctIndex: 0, explanation: 'A' },
          ],
        }),
      ),
    }

    const result = await StartSession.execute('Test concept', repo, aiProvider)

    expect(result.session.levels[0].status).toBe('ready')
    expect(result.session.levels[0].explanation).toBe('Test explanation')
    expect(result.session.levels[0].questions).toHaveLength(1)
    expect(aiProvider.generateExplanation).toHaveBeenCalledWith('Test concept', 1)
    expect(aiProvider.generateQuiz).toHaveBeenCalledWith('Test concept', 1, '')
  })

  it('handles AI generation failure gracefully', async () => {
    const repo = {
      save: vi.fn((s) => s),
      findByConcept: vi.fn(() => null),
    }
    const aiProvider = {
      generateExplanation: vi.fn(() => Promise.reject(new Error('Ollama not running'))),
      generateQuiz: vi.fn(() => Promise.resolve({ questions: [] })),
    }

    const result = await StartSession.execute('Test', repo, aiProvider)

    expect(result.session.levels[0].status).toBe('error')
    expect(result.session.levels[0].generationError).toBe('Ollama not running')
  })
})
