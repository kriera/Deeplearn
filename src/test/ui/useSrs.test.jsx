/**
 * useSrs — Test de integración: hook → GenerateSrsCards/SrsService → repositorio.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'

const { fakeProvider } = vi.hoisted(() => ({
  fakeProvider: {
    generateExplanation: vi.fn(),
    generateQuiz: vi.fn(),
    generateReExplanation: vi.fn(),
    generateSRSCards: vi.fn(),
  },
}))

vi.mock('../../infrastructure/ai/AiProviderFactory.js', () => ({
  AiProviderFactory: { create: () => fakeProvider },
}))

import { useSrs } from '../../ui/hooks/useSrs.js'

const SESSION = { id: 's1', concept: 'fotosíntesis' }

describe('useSrs (integración)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    fakeProvider.generateSRSCards.mockResolvedValue({
      cards: [
        { id: 'l1c1', front: '¿Qué produce?', back: 'Glucosa.' },
        { id: 'l1c2', front: '¿Dónde ocurre?', back: 'Cloroplastos.' },
      ],
    })
  })

  it('genera tarjetas para un nivel y quedan vencidas de inmediato', async () => {
    const { result } = renderHook(() => useSrs())

    await act(async () => {
      await result.current.generateForLevel(SESSION, 1)
    })

    expect(result.current.cards).toHaveLength(2)
    expect(result.current.dueCards).toHaveLength(2)
    const stored = JSON.parse(localStorage.getItem('deeplearn_cards'))
    expect(stored).toHaveLength(2)
  })

  it('recordar una tarjeta la reprograma y la saca de las vencidas', async () => {
    const { result } = renderHook(() => useSrs())
    await act(async () => {
      await result.current.generateForLevel(SESSION, 1)
    })

    await act(async () => {
      await result.current.rememberCard(result.current.dueCards[0])
    })

    expect(result.current.dueCards).toHaveLength(1)
    const updated = result.current.cards.find((c) => c.id === 's1-l1c1')
    expect(updated.reviews).toBe(1)
    expect(updated.remembered).toBe(1)
    expect(new Date(updated.nextReview).getTime()).toBeGreaterThan(Date.now())
  })

  it('olvidar una tarjeta reinicia el intervalo a 1 día', async () => {
    const { result } = renderHook(() => useSrs())
    await act(async () => {
      await result.current.generateForLevel(SESSION, 1)
    })

    await act(async () => {
      await result.current.forgetCard(result.current.dueCards[0])
    })

    const updated = result.current.cards.find((c) => c.id === 's1-l1c1')
    expect(updated.interval).toBe(1)
    expect(updated.forgotten).toBe(1)
    expect(result.current.dueCards).toHaveLength(1)
  })

  it('carga las tarjetas persistidas al montar', async () => {
    const first = renderHook(() => useSrs())
    await act(async () => {
      await first.result.current.generateForLevel(SESSION, 1)
    })
    first.unmount()

    const second = renderHook(() => useSrs())
    await waitFor(() => expect(second.result.current.cards).toHaveLength(2))
  })
})
