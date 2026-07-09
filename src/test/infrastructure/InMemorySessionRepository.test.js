import { describe, expect, it, beforeEach } from 'vitest'
import { InMemorySessionRepository } from '../../infrastructure/storage/repositories/InMemorySessionRepository.js'

describe('InMemorySessionRepository', () => {
  let repo

  beforeEach(() => {
    repo = new InMemorySessionRepository()
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
    const session = {
      id: 's1',
      concept: 'Quantum Entanglement',
      normalizedConcept: 'quantum entanglement',
    }
    await repo.save(session)
    const found = await repo.findByConcept('quantum entanglement')
    expect(found).toEqual(session)
  })

  it('returns null for unknown concept', async () => {
    const found = await repo.findByConcept('unknown')
    expect(found).toBeNull()
  })

  it('returns null for unknown concept even when other sessions exist', async () => {
    await repo.save({ id: 's1', concept: 'Gravity', normalizedConcept: 'gravity' })
    await repo.save({ id: 's2', concept: 'Quantum', normalizedConcept: 'quantum' })
    const found = await repo.findByConcept('relativity')
    expect(found).toBeNull()
  })

  it('returns all sessions', async () => {
    await repo.save({ id: 's1', concept: 'A' })
    await repo.save({ id: 's2', concept: 'B' })
    const all = await repo.findAll()
    expect(all).toHaveLength(2)
  })

  it('deletes a session by id', async () => {
    await repo.save({ id: 's1', concept: 'Test' })
    await repo.deleteById('s1')
    const found = await repo.findById('s1')
    expect(found).toBeNull()
  })

  it('updates an existing session on save', async () => {
    await repo.save({ id: 's1', concept: 'Original' })
    await repo.save({ id: 's1', concept: 'Updated' })
    const found = await repo.findById('s1')
    expect(found.concept).toBe('Updated')
  })
})
