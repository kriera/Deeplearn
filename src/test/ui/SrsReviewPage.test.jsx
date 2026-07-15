/**
 * SrsReviewPage — Test de componente user-centric (Testing Library + userEvent).
 */

import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SrsReviewPage } from '../../ui/pages/SrsReviewPage.jsx'

const CARD = {
  id: 's1-l1c1',
  concept: 'fotosíntesis',
  levelLabel: 'Elemental',
  front: '¿Qué produce la fotosíntesis?',
  back: 'Glucosa y oxígeno.',
}

describe('SrsReviewPage', () => {
  it('oculta la respuesta hasta que el usuario la pide', async () => {
    const user = userEvent.setup()
    render(
      <SrsReviewPage dueCards={[CARD]} onRemember={vi.fn()} onForget={vi.fn()} onBack={vi.fn()} />,
    )

    expect(screen.getByText('¿Qué produce la fotosíntesis?')).toBeInTheDocument()
    expect(screen.queryByText('Glucosa y oxígeno.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Mostrar respuesta' }))

    expect(screen.getByText('Glucosa y oxígeno.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /La recordaba/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'La olvidé' })).toBeInTheDocument()
  })

  it('califica la tarjeta con el resultado elegido', async () => {
    const user = userEvent.setup()
    const onRemember = vi.fn()
    const onForget = vi.fn()
    render(
      <SrsReviewPage
        dueCards={[CARD]}
        onRemember={onRemember}
        onForget={onForget}
        onBack={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Mostrar respuesta' }))
    await user.click(screen.getByRole('button', { name: /La recordaba/ }))

    expect(onRemember).toHaveBeenCalledWith(CARD)
    expect(onForget).not.toHaveBeenCalled()
  })

  it('muestra un estado vacío positivo cuando no hay tarjetas pendientes', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()
    render(<SrsReviewPage dueCards={[]} onRemember={vi.fn()} onForget={vi.fn()} onBack={onBack} />)

    expect(screen.getByText('No tienes tarjetas pendientes')).toBeInTheDocument()
    expect(screen.getByText(/Supera niveles/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Volver' }))
    expect(onBack).toHaveBeenCalled()
  })

  it('muestra cuántas tarjetas quedan pendientes', () => {
    const second = { ...CARD, id: 's1-l1c2', front: '¿Dónde ocurre?' }
    render(
      <SrsReviewPage
        dueCards={[CARD, second]}
        onRemember={vi.fn()}
        onForget={vi.fn()}
        onBack={vi.fn()}
      />,
    )

    expect(screen.getByText('2 pendientes')).toBeInTheDocument()
  })
})
