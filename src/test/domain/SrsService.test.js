import { describe, expect, it } from 'vitest'
import { SrsService } from '../../domain/services/SrsService.js'

describe('SrsService', () => {
  it('creates a new card due immediately', () => {
    const card = SrsService.createCard({
      id: 'c1',
      concept: 'Quantum entanglement',
      levelLabel: 'Elemental',
      front: 'What is entanglement?',
      back: 'A link between particles.',
    })
    expect(card.id).toBe('c1')
    expect(card.concept).toBe('Quantum entanglement')
    expect(card.interval).toBe(1)
    expect(card.ease).toBe(2.5)
    expect(card.reviews).toBe(0)
    expect(card.remembered).toBe(0)
    expect(card.forgotten).toBe(0)
    expect(new Date(card.nextReview) <= new Date()).toBe(true)
  })

  it('schedules remembered card with increased interval and ease', () => {
    const card = SrsService.createCard({
      id: 'c1',
      concept: 'Test',
      levelLabel: 'Basic',
      front: 'Q?',
      back: 'A.',
    })
    const updated = SrsService.remember(card)
    expect(updated.interval).toBeGreaterThan(1)
    expect(updated.ease).toBeGreaterThan(2.5)
    expect(updated.reviews).toBe(1)
    expect(updated.remembered).toBe(1)
    expect(updated.forgotten).toBe(0)
    expect(new Date(updated.nextReview) > new Date()).toBe(true)
  })

  it('schedules forgotten card with interval reset to 1 and decreased ease', () => {
    const card = SrsService.createCard({
      id: 'c1',
      concept: 'Test',
      levelLabel: 'Basic',
      front: 'Q?',
      back: 'A.',
    })
    // First remember to build up interval
    const remembered = SrsService.remember(card)
    const forgotten = SrsService.forget(remembered)
    expect(forgotten.interval).toBe(1)
    expect(forgotten.ease).toBeLessThan(2.5)
    expect(forgotten.reviews).toBe(2)
    expect(forgotten.forgotten).toBe(1)
  })

  it('ease never goes below MIN_EASE', () => {
    const card = SrsService.createCard({
      id: 'c1',
      concept: 'Test',
      levelLabel: 'Basic',
      front: 'Q?',
      back: 'A.',
    })
    let current = { ...card, ease: 1.3 }
    for (let i = 0; i < 10; i++) {
      current = SrsService.forget(current)
    }
    expect(current.ease).toBeGreaterThanOrEqual(1.3)
  })

  it('ease never goes above MAX_EASE', () => {
    const card = SrsService.createCard({
      id: 'c1',
      concept: 'Test',
      levelLabel: 'Basic',
      front: 'Q?',
      back: 'A.',
    })
    let current = { ...card, ease: 2.9 }
    for (let i = 0; i < 10; i++) {
      current = SrsService.remember(current)
    }
    expect(current.ease).toBeLessThanOrEqual(3.0)
  })

  it('getDueCards returns only cards past their review date', () => {
    const now = new Date()
    const future = new Date(now.getTime() + 86400000 * 7).toISOString()
    const past = new Date(now.getTime() - 86400000).toISOString()

    const cards = [
      { id: 'c1', nextReview: past },
      { id: 'c2', nextReview: future },
      { id: 'c3', nextReview: now.toISOString() },
    ]

    const due = SrsService.getDueCards(cards)
    expect(due).toHaveLength(2)
    expect(due.map((c) => c.id)).toEqual(['c1', 'c3'])
  })

  it('handles cards with missing ease/interval defaults', () => {
    // Una tarjeta sin los campos ease/interval: el servicio debe aplicar defaults
    const partial = { id: 'c2', concept: 'T', levelLabel: 'Basic', front: 'Q', back: 'A' }
    const remembered = SrsService.remember(partial)
    expect(remembered.ease).toBe(2.6)
    expect(remembered.interval).toBe(2.6)
    expect(remembered.reviews).toBe(1)
  })

  it('handles forget on card with missing ease field', () => {
    const partial = { id: 'c3', concept: 'T', levelLabel: 'Basic', front: 'Q', back: 'A' }
    const forgotten = SrsService.forget(partial)
    expect(forgotten.ease).toBe(2.3)
    expect(forgotten.interval).toBe(1)
  })

  it('is frozen (immutable)', () => {
    const card = SrsService.createCard({
      id: 'c1',
      concept: 'Test',
      levelLabel: 'Basic',
      front: 'Q?',
      back: 'A.',
    })
    expect(Object.isFrozen(card)).toBe(true)
  })
})
