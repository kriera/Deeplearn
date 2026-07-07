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
    expect(repo.save).toHaveBeenCalledOnce()
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
})
