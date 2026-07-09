import { describe, expect, it, beforeEach, vi } from 'vitest'
import { LocalStorageSessionRepository } from '../../infrastructure/storage/repositories/LocalStorageSessionRepository.js'

describe('LocalStorageSessionRepository', () => {
  let repo

  beforeEach(() => {
    localStorage.clear()
    repo = new LocalStorageSessionRepository('test-sessions')
  })

  it('saves and finds a session by id', async () => {
    const session = { id: 's1', concept: 'Test', normalizedConcept: 'test' }
    await repo.save(session)
    const found = await repo.findById('s1')
    expect(found).toEqual(session)
  })

  it('returns null for unknown id', async () => {
    const found = await repo.findById('nonexistent')
    expect(found).toBeNull()
  })

  it('finds a session by normalized concept', async () => {
    const session = { id: 's1', concept: 'Quantum', normalizedConcept: 'quantum' }
    await repo.save(session)
    const found = await repo.findByConcept('quantum')
    expect(found).toEqual(session)
  })

  it('returns all sessions', async () => {
    await repo.save({ id: 's1', concept: 'A', normalizedConcept: 'a' })
    await repo.save({ id: 's2', concept: 'B', normalizedConcept: 'b' })
    const all = await repo.findAll()
    expect(all).toHaveLength(2)
  })

  it('deletes a session by id', async () => {
    await repo.save({ id: 's1', concept: 'Test', normalizedConcept: 'test' })
    await repo.deleteById('s1')
    const found = await repo.findById('s1')
    expect(found).toBeNull()
  })

  it('updates existing session on save', async () => {
    await repo.save({ id: 's1', concept: 'Original', normalizedConcept: 'original' })
    await repo.save({ id: 's1', concept: 'Updated', normalizedConcept: 'updated' })
    const found = await repo.findById('s1')
    expect(found.concept).toBe('Updated')
  })

  it('persists data across instances with same key', async () => {
    const repo1 = new LocalStorageSessionRepository('test-sessions')
    await repo1.save({ id: 's1', concept: 'Test', normalizedConcept: 'test' })

    const repo2 = new LocalStorageSessionRepository('test-sessions')
    const found = await repo2.findById('s1')
    expect(found.concept).toBe('Test')
  })

  it('handles corrupted localStorage gracefully', async () => {
    localStorage.setItem('test-sessions', 'not-valid-json')
    const found = await repo.findById('s1')
    expect(found).toBeNull()
  })

  it('handles localStorage getItem throwing an error', async () => {
    const originalGet = Storage.prototype.getItem
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error('storage error')
    })
    try {
      const found = await repo.findById('s1')
      expect(found).toBeNull()
    } finally {
      Storage.prototype.getItem = originalGet
    }
  })

  it('throws when localStorage is full', async () => {
    const originalSet = Storage.prototype.setItem
    Storage.prototype.setItem = vi.fn(() => {
      throw new Error('QuotaExceededError')
    })
    try {
      await expect(
        repo.save({ id: 's1', concept: 'Test', normalizedConcept: 'test' }),
      ).rejects.toThrow('Storage quota exceeded')
    } finally {
      Storage.prototype.setItem = originalSet
    }
  })
})
