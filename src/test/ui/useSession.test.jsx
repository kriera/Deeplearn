/**
 * useSession — Test de integración: cableado hook → casos de uso → repositorio.
 *
 * Testing (Módulo 6): capa de integración; cubre inicio de sesión con
 * generación en segundo plano, actualización progresiva (explicación antes
 * que quiz), errores traducidos, reintento de generación y evaluación.
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

  it('inicia una sesión al instante y genera el nivel 1 en segundo plano', async () => {
    fakeProvider.generateExplanation.mockResolvedValue({ explanation: 'Explicación nivel 1' })
    fakeProvider.generateQuiz.mockResolvedValue({ questions: QUESTIONS })

    const { result } = renderHook(() => useSession())

    let outcome
    await act(async () => {
      outcome = await result.current.startSession('fotosíntesis')
    })

    // startSession devuelve sin esperar al modelo…
    expect(outcome.restored).toBe(false)
    expect(result.current.sessions).toHaveLength(1)
    expect(result.current.error).toBeNull()
    // …y el contenido llega en segundo plano
    await waitFor(() => expect(result.current.currentSession.levels[0].status).toBe('ready'))
    expect(result.current.currentSession.levels[0].questions).toHaveLength(1)
  })

  it('muestra la explicación en cuanto llega, mientras el quiz sigue generándose', async () => {
    let resolveQuiz
    fakeProvider.generateExplanation.mockResolvedValue({ explanation: 'Explicación rápida' })
    fakeProvider.generateQuiz.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveQuiz = resolve
        }),
    )

    const { result } = renderHook(() => useSession())
    await act(async () => {
      await result.current.startSession('fotosíntesis')
    })

    // La explicación ya es visible aunque el quiz no haya terminado
    await waitFor(() =>
      expect(result.current.currentSession.levels[0].explanation).toBe('Explicación rápida'),
    )
    expect(result.current.currentSession.levels[0].questions).toHaveLength(0)

    await act(async () => {
      resolveQuiz({ questions: QUESTIONS })
    })
    await waitFor(() => expect(result.current.currentSession.levels[0].questions).toHaveLength(1))
  })

  it('traduce los fallos del provider a un mensaje accionable en español', async () => {
    fakeProvider.generateExplanation.mockRejectedValue(new TypeError('Failed to fetch'))

    const { result } = renderHook(() => useSession())

    await act(async () => {
      await result.current.startSession('fotosíntesis')
    })

    // El fallo en segundo plano marca el nivel en error (la página ofrece reintentar)…
    await waitFor(() => expect(result.current.currentSession.levels[0].status).toBe('error'))
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
    await waitFor(() => expect(result.current.currentSession.levels[0].status).toBe('error'))

    await act(async () => {
      await result.current.regenerateLevel(0)
    })
    expect(result.current.currentSession.levels[0].status).toBe('ready')
    expect(result.current.currentSession.levels[0].explanation).toBe('Ahora sí')
    expect(result.current.currentSession.levels[0].generationError).toBeNull()
  })

  it('marca el nivel en error y lo persiste si la regeneración vuelve a fallar', async () => {
    fakeProvider.generateExplanation.mockRejectedValue(new Error('Ollama error: 500'))

    const { result } = renderHook(() => useSession())

    await act(async () => {
      await result.current.startSession('fotosíntesis')
    })
    await waitFor(() => expect(result.current.currentSession.levels[0].status).toBe('error'))

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
    await waitFor(() => expect(result.current.currentSession.levels[0].status).toBe('ready'))

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
    await waitFor(() => expect(result.current.currentSession.levels[0].status).toBe('ready'))
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

  it('completa una sesión interrumpida al restaurarla (explicación sin quiz)', async () => {
    fakeProvider.generateExplanation.mockResolvedValue({ explanation: 'Explicación' })
    fakeProvider.generateQuiz.mockResolvedValue({ questions: QUESTIONS })

    // Sesión persistida a medias: explicación generada, quiz nunca llegó
    // (p. ej. el navegador se cerró durante la generación)
    const interrupted = {
      id: 'half-1',
      concept: 'fotosíntesis',
      normalizedConcept: 'fotosíntesis',
      createdAt: new Date().toISOString(),
      levelsUnlocked: 1,
      currentLevelIndex: 0,
      levels: [
        {
          number: 1,
          status: 'ready',
          explanation: 'Ya estaba',
          questions: [],
          generationError: null,
        },
        { number: 2, status: 'locked', explanation: '', questions: [], generationError: null },
        { number: 3, status: 'locked', explanation: '', questions: [], generationError: null },
        { number: 4, status: 'locked', explanation: '', questions: [], generationError: null },
        { number: 5, status: 'locked', explanation: '', questions: [], generationError: null },
      ],
      attempts: [],
      evaluation: {
        preScore: null,
        postScore: null,
        feedback: '',
        startedAt: null,
        completedAt: null,
      },
    }
    localStorage.setItem('deeplearn_sessions', JSON.stringify([interrupted]))

    const { result } = renderHook(() => useSession())
    await act(async () => {
      await result.current.restoreSession('half-1')
    })

    // Reutiliza la explicación existente y solo genera el quiz que falta
    await waitFor(() => expect(result.current.currentSession.levels[0].questions).toHaveLength(1))
    expect(result.current.currentSession.levels[0].explanation).toBe('Ya estaba')
    expect(fakeProvider.generateExplanation).not.toHaveBeenCalled()
    expect(fakeProvider.generateQuiz).toHaveBeenCalledTimes(1)
  })

  it('no lanza dos generaciones simultáneas del mismo nivel', async () => {
    let resolveExplanation
    fakeProvider.generateExplanation.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveExplanation = resolve
        }),
    )
    fakeProvider.generateQuiz.mockResolvedValue({ questions: QUESTIONS })

    const { result } = renderHook(() => useSession())
    let outcome
    await act(async () => {
      outcome = await result.current.startSession('fotosíntesis')
    })

    // Con la primera generación en vuelo, una segunda llamada se descarta
    let second
    await act(async () => {
      second = await result.current.generateLevel(outcome.session, 0)
    })
    expect(second).toBeNull()
    expect(fakeProvider.generateExplanation).toHaveBeenCalledTimes(1)

    await act(async () => {
      resolveExplanation({ explanation: 'E' })
    })
    await waitFor(() => expect(result.current.currentSession.levels[0].status).toBe('ready'))
  })

  it('una generación en segundo plano no pisa la pantalla si la sesión ya no es la visible', async () => {
    let resolveQuiz
    fakeProvider.generateExplanation.mockResolvedValue({ explanation: 'E' })
    fakeProvider.generateQuiz.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveQuiz = resolve
        }),
    )

    const { result } = renderHook(() => useSession())
    await act(async () => {
      await result.current.startSession('fotosíntesis')
    })
    await waitFor(() => expect(result.current.currentSession.levels[0].explanation).toBe('E'))

    act(() => result.current.goToEntry())
    await act(async () => {
      resolveQuiz({ questions: QUESTIONS })
    })

    // La pantalla sigue en el inicio; el resultado quedó persistido igualmente
    expect(result.current.currentSession).toBeNull()
    const stored = JSON.parse(localStorage.getItem('deeplearn_sessions'))
    expect(stored[0].levels[0].questions).toHaveLength(1)
  })

  it('no relanza la generación al restaurar un nivel en estado de error', async () => {
    const failed = {
      id: 'err-1',
      concept: 'fotosíntesis',
      normalizedConcept: 'fotosíntesis',
      createdAt: new Date().toISOString(),
      levelsUnlocked: 1,
      currentLevelIndex: 0,
      levels: [
        { number: 1, status: 'error', explanation: '', questions: [], generationError: 'x' },
        { number: 2, status: 'locked', explanation: '', questions: [], generationError: null },
        { number: 3, status: 'locked', explanation: '', questions: [], generationError: null },
        { number: 4, status: 'locked', explanation: '', questions: [], generationError: null },
        { number: 5, status: 'locked', explanation: '', questions: [], generationError: null },
      ],
      attempts: [],
      evaluation: {
        preScore: null,
        postScore: null,
        feedback: '',
        startedAt: null,
        completedAt: null,
      },
    }
    localStorage.setItem('deeplearn_sessions', JSON.stringify([failed]))

    const { result } = renderHook(() => useSession())
    await act(async () => {
      await result.current.restoreSession('err-1')
    })

    // El nivel en error espera al reintento explícito del usuario
    expect(fakeProvider.generateExplanation).not.toHaveBeenCalled()
    expect(fakeProvider.generateQuiz).not.toHaveBeenCalled()
  })

  it('regenerateLevel y refreshSession sin sesión activa devuelven null', async () => {
    const { result } = renderHook(() => useSession())

    let regen
    let refresh
    await act(async () => {
      regen = await result.current.regenerateLevel(0)
      refresh = await result.current.refreshSession()
    })

    expect(regen).toBeNull()
    expect(refresh).toBeNull()
  })

  it('carga las sesiones existentes al montar', async () => {
    fakeProvider.generateExplanation.mockResolvedValue({ explanation: 'Explicación' })
    fakeProvider.generateQuiz.mockResolvedValue({ questions: QUESTIONS })

    const first = renderHook(() => useSession())
    await act(async () => {
      await first.result.current.startSession('fotosíntesis')
    })
    await waitFor(() => expect(first.result.current.currentSession.levels[0].status).toBe('ready'))
    first.unmount()

    const second = renderHook(() => useSession())
    await waitFor(() => expect(second.result.current.sessions).toHaveLength(1))
  })
})
