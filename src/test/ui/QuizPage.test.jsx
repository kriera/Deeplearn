/**
 * QuizPage — Test de integración user-centric (Testing Library + userEvent).
 *
 * Cubre el flujo del quiz que ve el usuario: responder las 5 preguntas,
 * el envío bloqueado hasta responder todas, el resultado aprobado/suspendido,
 * el reintento tras un error de envío y el estado vacío. Criterio SPEC §8.
 */

import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuizPage } from '../../ui/pages/QuizPage.jsx'

// 5 preguntas con textos de opción únicos para poder seleccionarlas sin ambigüedad.
const QUESTIONS = Array.from({ length: 5 }, (_, i) => ({
  id: `q${i + 1}`,
  question: `Pregunta número ${i + 1}`,
  options: [`Correcta ${i + 1}`, `Incorrecta ${i + 1}`, `Otra ${i + 1}`, `Más ${i + 1}`],
  correctIndex: 0,
  explanation: `Explicación de la pregunta ${i + 1}.`,
}))

function makeSession() {
  return { concept: 'fotosíntesis', levels: [{ number: 1, questions: QUESTIONS }] }
}

async function answerAll(user) {
  // Se re-consulta en cada iteración: el mock de framer-motion remonta el
  // subárbol en cada render, invalidando las referencias previas a los nodos.
  const total = screen.getAllByRole('group', { name: /Opciones de la pregunta/ }).length
  for (let i = 0; i < total; i++) {
    const group = screen.getByRole('group', { name: `Opciones de la pregunta ${i + 1}` })
    await user.click(within(group).getByRole('button', { name: /^Correcta/ }))
  }
}

describe('QuizPage', () => {
  it('bloquea el envío hasta responder las 5 preguntas y luego envía las respuestas', async () => {
    const user = userEvent.setup()
    const onSubmitQuiz = vi.fn().mockResolvedValue({ passed: true, score: 5, total: 5 })
    render(
      <QuizPage
        session={makeSession()}
        levelIndex={0}
        onSubmitQuiz={onSubmitQuiz}
        onBackToLevel={vi.fn()}
        onNextLevel={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Enviar respuestas' })).toBeDisabled()

    await answerAll(user)

    const submit = screen.getByRole('button', { name: 'Enviar respuestas' })
    expect(submit).toBeEnabled()

    await user.click(submit)

    expect(onSubmitQuiz).toHaveBeenCalledTimes(1)
    const [, answers] = onSubmitQuiz.mock.calls[0]
    expect(answers).toEqual(QUESTIONS.map((q) => ({ questionId: q.id, selectedIndex: 0 })))
  })

  it('muestra el resultado aprobado y avanza al siguiente nivel', async () => {
    const user = userEvent.setup()
    const result = {
      passed: true,
      score: 5,
      total: 5,
      answerReview: QUESTIONS.map(() => ({ correct: true })),
    }
    const onSubmitQuiz = vi.fn().mockResolvedValue(result)
    const onNextLevel = vi.fn()
    render(
      <QuizPage
        session={makeSession()}
        levelIndex={0}
        onSubmitQuiz={onSubmitQuiz}
        quizResult={result}
        onBackToLevel={vi.fn()}
        onNextLevel={onNextLevel}
      />,
    )

    await answerAll(user)
    await user.click(screen.getByRole('button', { name: 'Enviar respuestas' }))

    expect(screen.getByText('¡Nivel superado!')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Siguiente nivel/ }))
    expect(onNextLevel).toHaveBeenCalled()
  })

  it('permite reintentar cuando el quiz se suspende', async () => {
    const user = userEvent.setup()
    const result = {
      passed: false,
      score: 2,
      total: 5,
      answerReview: QUESTIONS.map((_, i) => ({ correct: i < 2 })),
    }
    const onSubmitQuiz = vi.fn().mockResolvedValue(result)
    render(
      <QuizPage
        session={makeSession()}
        levelIndex={0}
        onSubmitQuiz={onSubmitQuiz}
        quizResult={result}
        onBackToLevel={vi.fn()}
        onNextLevel={vi.fn()}
      />,
    )

    await answerAll(user)
    await user.click(screen.getByRole('button', { name: 'Enviar respuestas' }))

    expect(screen.getByText('¡Sigue intentando!')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Intentar de nuevo' })).toBeInTheDocument()
  })

  it('muestra el error de envío y permite reintentar', async () => {
    const user = userEvent.setup()
    render(
      <QuizPage
        session={makeSession()}
        levelIndex={0}
        onSubmitQuiz={vi.fn()}
        submitError="No pudimos corregir el quiz. Inténtalo de nuevo."
        onBackToLevel={vi.fn()}
        onNextLevel={vi.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('No pudimos corregir el quiz')
    await answerAll(user)
    expect(screen.getByRole('button', { name: 'Reintentar envío' })).toBeInTheDocument()
  })

  it('muestra un estado vacío cuando no hay quiz en marcha', async () => {
    const user = userEvent.setup()
    const onBackToLevel = vi.fn()
    render(
      <QuizPage
        session={null}
        levelIndex={0}
        onSubmitQuiz={vi.fn()}
        onBackToLevel={onBackToLevel}
      />,
    )

    expect(screen.getByText(/Aún no hay un quiz en marcha/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Ir al nivel/ }))
    expect(onBackToLevel).toHaveBeenCalled()
  })
})
