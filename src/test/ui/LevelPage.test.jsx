/**
 * LevelPage — Test de integración user-centric (Testing Library + userEvent).
 *
 * Cubre los estados que ve el usuario durante la generación progresiva:
 * explicación lista, quiz aún preparándose, error de generación, nivel
 * bloqueado y pantalla sin sesión. Criterio SPEC §8 "Cobertura UI".
 */

import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LevelPage } from '../../ui/pages/LevelPage.jsx'

function makeSession(overrides = {}) {
  return {
    concept: 'fotosíntesis',
    levelsUnlocked: 1,
    levels: [
      {
        number: 1,
        status: 'ready',
        explanation: 'Las plantas fabrican su comida con la luz del sol.',
        questions: [
          { id: 'q1', question: '¿Qué usan?', options: ['Sol', 'Luna'], correctIndex: 0 },
        ],
      },
    ],
    ...overrides,
  }
}

describe('LevelPage', () => {
  it('muestra la explicación y permite ir al quiz cuando está listo', async () => {
    const user = userEvent.setup()
    const onGoToQuiz = vi.fn()
    render(<LevelPage session={makeSession()} levelIndex={0} onGoToQuiz={onGoToQuiz} />)

    expect(
      screen.getByText('Las plantas fabrican su comida con la luz del sol.'),
    ).toBeInTheDocument()

    const quizButton = screen.getByRole('button', { name: /Responder quiz/ })
    expect(quizButton).toBeEnabled()

    await user.click(quizButton)
    expect(onGoToQuiz).toHaveBeenCalled()
  })

  it('mantiene el botón del quiz deshabilitado mientras el quiz se prepara (generación progresiva)', () => {
    const session = makeSession({
      levels: [
        {
          number: 1,
          status: 'ready',
          explanation: 'Ya hay explicación, pero el quiz llega después.',
          questions: [],
        },
      ],
    })
    render(<LevelPage session={session} levelIndex={0} onGoToQuiz={vi.fn()} />)

    const quizButton = screen.getByRole('button', { name: /Preparando quiz/ })
    expect(quizButton).toBeDisabled()
  })

  it('muestra el estado de generación con aria-busy cuando aún no hay explicación', () => {
    const session = makeSession({
      levels: [{ number: 1, status: 'pending', explanation: '', questions: [] }],
    })
    const { container } = render(
      <LevelPage session={session} levelIndex={0} onGoToQuiz={vi.fn()} />,
    )

    expect(screen.getByText(/Generando la explicación/)).toBeInTheDocument()
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument()
  })

  it('ofrece reintentar cuando la generación de la explicación falla', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const session = makeSession({
      levels: [{ number: 1, status: 'error', explanation: '', questions: [] }],
    })
    render(<LevelPage session={session} levelIndex={0} onGoToQuiz={vi.fn()} onRetry={onRetry} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reintentar generación' }))
    expect(onRetry).toHaveBeenCalledWith(0)
  })

  it('bloquea los niveles no desbloqueados', () => {
    const session = makeSession({
      levelsUnlocked: 1,
      levels: [
        makeSession().levels[0],
        { number: 2, status: 'ready', explanation: 'Nivel 2', questions: [] },
      ],
    })
    render(<LevelPage session={session} levelIndex={1} onGoToQuiz={vi.fn()} />)

    expect(screen.getByText(/Completa los niveles anteriores/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Responder quiz/ })).not.toBeInTheDocument()
  })

  it('invita a elegir un concepto cuando no hay sesión activa', async () => {
    const user = userEvent.setup()
    const onGoToEntry = vi.fn()
    render(<LevelPage session={null} levelIndex={0} onGoToEntry={onGoToEntry} />)

    await user.click(screen.getByRole('button', { name: 'Elegir concepto' }))
    expect(onGoToEntry).toHaveBeenCalled()
  })
})
