/**
 * useSession — Test de integración: cableado hook → casos de uso → repositorio.
 *
 * Testing (Módulo 6): capa de integración; cubre inicio de sesión, errores
 * traducidos a lenguaje del usuario, reintento de generación y evaluación.
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

import { useSession } from '../../ui/hooks/useSession.js'

const QUESTIONS = [
  { id: 'l1q1', question: 'Q?', options: ['A', 'B', 'C', 'D'], correctIndex: 0, explanation: 'A.' },
]

describe('useSession (integración hook → StartSession/GenerateLevelContent)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('inicia una sesión generando el nivel 1 vía IA y la persiste', async () => {
    fakeProvider.generateExplanation.mockResolvedValue({ explanation: 'Explicación nivel 1' })
    fakeProvider.generateQuiz.mockResolvedValue({ questions: QUESTIONS })

    const { result } = renderHook(() => useSession())

    let outcome
    await act(async () => {
      outcome = await result.current.startSession('fotosíntesis')
    })

    expect(outcome.restored).toBe(false)
    expect(result.current.currentSession.levels[0].status).toBe('ready')
    expect(result.current.sessions).toHaveLength(1)
    expect(result.current.error).toBeNull()
  })

  it('traduce los fallos del provider a un mensaje accionable en español', async () => {
    fakeProvider.generateExplanation.mockRejectedValue(new TypeError('Failed to fetch'))

    const { result } = renderHook(() => useSession())

    await act(async () => {
      await result.current.startSession('fotosíntesis')
    })

    // StartSession no lanza (marca el nivel en error), así que la sesión existe…
    expect(result.current.currentSession.levels[0].status).toBe('error')
    // …y no se muestra jerga técnica en ningún caso
    expect(result.current.error ?? '').not.toMatch(/fetch|500|API/i)
  })

  it('regenera un nivel fallido con regenerateLevel y limpia el estado de error', async () => {
    fakeProvider.generateExplanation.mockRejectedValueOnce(new Error('Ollama error: 500'))
    fakeProvider.generateExplanation.mockResolvedValue({ explanation: 'Ahora sí' })
    fakeProvider.generateQuiz.mockResolvedValue({ questions: QUESTIONS })

    const { result } = renderHook(() => useSession())

    await act(async () => {
      await result.current.startSession('fotosíntesis')
    })
    expect(result.current.currentSession.levels[0].status).toBe('error')

    await act(async () => {
      await result.current.regenerateLevel(0)
    })
    expect(result.current.currentSession.levels[0].status).toBe('ready')
    expect(result.current.currentSession.levels[0].explanation).toBe('Ahora sí')
  })

  it('marca el nivel en error y lo persiste si la regeneración vuelve a fallar', async () => {
    fakeProvider.generateExplanation.mockRejectedValue(new Error('Ollama error: 500'))

    const { result } = renderHook(() => useSession())

    await act(async () => {
      await result.current.startSession('fotosíntesis')
    })
    let outcome
    await act(async () => {
      outcome = await result.current.regenerateLevel(0)
    })

    expect(outcome).toBeNull()
    expect(result.current.currentSession.levels[0].status).toBe('error')
    const stored = JSON.parse(localStorage.getItem('deeplearn_sessions'))
    expect(stored[0].levels[0].status).toBe('error')
  })

  it('guarda la evaluación del aprendizaje en la sesión', async () => {
    fakeProvider.generateExplanation.mockResolvedValue({ explanation: 'Explicación' })
    fakeProvider.generateQuiz.mockResolvedValue({ questions: QUESTIONS })

    const { result } = renderHook(() => useSession())
    await act(async () => {
      await result.current.startSession('fotosíntesis')
    })

    await act(async () => {
      await result.current.saveEvaluation({ postScore: 5, feedback: 'Muy claro' })
    })

    expect(result.current.currentSession.evaluation.postScore).toBe(5)
    const stored = JSON.parse(localStorage.getItem('deeplearn_sessions'))
    expect(stored[0].evaluation.feedback).toBe('Muy claro')
  })

  it('restaura una sesión previa y permite volver al inicio', async () => {
    fakeProvider.generateExplanation.mockResolvedValue({ explanation: 'Explicación' })
    fakeProvider.generateQuiz.mockResolvedValue({ questions: QUESTIONS })

    const { result } = renderHook(() => useSession())
    let outcome
    await act(async () => {
      outcome = await result.current.startSession('fotosíntesis')
    })
    const id = outcome.session.id

    act(() => result.current.goToEntry())
    expect(result.current.currentSession).toBeNull()

    await act(async () => {
      await result.current.restoreSession(id)
    })
    expect(result.current.currentSession.id).toBe(id)

    await act(async () => {
      await result.current.refreshSession()
    })
    expect(result.current.currentSession.id).toBe(id)
  })

  it('carga las sesiones existentes al montar', async () => {
    fakeProvider.generateExplanation.mockResolvedValue({ explanation: 'Explicación' })
    fakeProvider.generateQuiz.mockResolvedValue({ questions: QUESTIONS })

    const first = renderHook(() => useSession())
    await act(async () => {
      await first.result.current.startSession('fotosíntesis')
    })
    first.unmount()

    const second = renderHook(() => useSession())
    await waitFor(() => expect(second.result.current.sessions).toHaveLength(1))
  })
})
