/**
 * useQuiz — Test de integración: cableado hook → caso de uso → repositorio.
 *
 * Testing (Módulo 6): capa de integración ("sweet spot"), verifica que las
 * dependencias llegan al caso de uso en la posición correcta — los tests
 * unitarios de SubmitQuiz no cubren este wiring.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { Session } from '../../domain/entities/Session.js'

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

import { useQuiz } from '../../ui/hooks/useQuiz.js'

function buildQuestions(prefix) {
  return [1, 2, 3, 4, 5].map((n) => ({
    id: `${prefix}-q${n}`,
    question: `Pregunta ${n}?`,
    options: ['A', 'B', 'C', 'D'],
    correctIndex: 0,
    explanation: `Porque ${n}`,
  }))
}

function buildSession() {
  const session = Session.create('fotosíntesis')
  return Session.setLevelContent(session, 0, {
    explanation: 'Explicación nivel 1',
    questions: buildQuestions('l1'),
  })
}

function answersFor(questions, selectedIndex) {
  return questions.map((q) => ({ questionId: q.id, selectedIndex }))
}

describe('useQuiz (integración hook → SubmitQuiz)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('aprueba el quiz y desbloquea el siguiente nivel sin esperar al modelo', async () => {
    const session = buildSession()
    const { result } = renderHook(() => useQuiz())

    let outcome
    await act(async () => {
      outcome = await result.current.submitQuiz(
        session,
        answersFor(session.levels[0].questions, 0),
        0,
      )
    })

    expect(outcome.passed).toBe(true)
    expect(outcome.score).toBe(5)
    expect(outcome.unlockedNextLevel).toBe(true)
    // El contenido del siguiente nivel se genera en segundo plano desde App,
    // no dentro del envío del quiz
    expect(fakeProvider.generateExplanation).not.toHaveBeenCalled()
    expect(result.current.quizResult).toEqual(outcome)
  })

  it('suspende el quiz y solicita una re-explicación con las áreas débiles', async () => {
    fakeProvider.generateReExplanation.mockResolvedValue({ explanation: 'Otra analogía' })

    const session = buildSession()
    const { result } = renderHook(() => useQuiz())

    let outcome
    await act(async () => {
      outcome = await result.current.submitQuiz(
        session,
        answersFor(session.levels[0].questions, 1),
        0,
      )
    })

    expect(outcome.passed).toBe(false)
    expect(outcome.score).toBe(0)
    expect(outcome.reExplanation).toBe('Otra analogía')
    expect(fakeProvider.generateReExplanation).toHaveBeenCalledWith(
      'fotosíntesis',
      1,
      expect.arrayContaining([expect.objectContaining({ questionId: 'l1-q1' })]),
    )
  })

  it('corrige el nivel indicado por levelIndex, no el nivel actual de la sesión (regresión)', async () => {
    fakeProvider.generateReExplanation.mockResolvedValue({ explanation: 'Refuerzo nivel 2' })

    let session = buildSession()
    session = Session.setLevelContent(session, 1, {
      explanation: 'Explicación nivel 2',
      questions: buildQuestions('l2'),
    })
    const { result } = renderHook(() => useQuiz())

    let outcome
    await act(async () => {
      outcome = await result.current.submitQuiz(
        session,
        answersFor(session.levels[1].questions, 1),
        1,
      )
    })

    expect(outcome.answerReview[0].questionId).toBe('l2-q1')
    expect(fakeProvider.generateReExplanation).toHaveBeenCalledWith(
      'fotosíntesis',
      2,
      expect.any(Array),
    )
  })

  it('limpia el resultado del quiz con clearQuizResult', async () => {
    fakeProvider.generateReExplanation.mockResolvedValue({ explanation: 'Otra analogía' })

    const session = buildSession()
    const { result } = renderHook(() => useQuiz())

    await act(async () => {
      await result.current.submitQuiz(session, answersFor(session.levels[0].questions, 1), 0)
    })
    expect(result.current.quizResult).not.toBeNull()

    act(() => result.current.clearQuizResult())
    expect(result.current.quizResult).toBeNull()
  })

  it('persiste la sesión actualizada en el repositorio', async () => {
    const session = buildSession()
    const { result } = renderHook(() => useQuiz())

    await act(async () => {
      await result.current.submitQuiz(session, answersFor(session.levels[0].questions, 0), 0)
    })

    const stored = JSON.parse(localStorage.getItem('deeplearn_sessions'))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(session.id)
    expect(stored[0].attempts).toHaveLength(1)
    // Desbloqueado pero pendiente de generación (que lanza App en segundo plano)
    expect(stored[0].levels[1].status).toBe('pending')
  })
})
