/**
 * CompletionPage — Test de integración user-centric (Testing Library + userEvent).
 *
 * Cubre el estado vacío, las estadísticas de la sesión, el guardado de la
 * autoevaluación, el acceso al repaso SRS y la navegación. Criterio SPEC §8.
 */

import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CompletionPage } from '../../ui/pages/CompletionPage.jsx'

const SESSION = {
  concept: 'fotosíntesis',
  attempts: [
    { passed: true, score: 5 },
    { passed: false, score: 2 },
  ],
}

function setup(props = {}) {
  return render(
    <CompletionPage
      session={SESSION}
      onGoToEntry={vi.fn()}
      onRestart={vi.fn()}
      onSaveEvaluation={vi.fn().mockResolvedValue()}
      dueCount={0}
      onOpenSrs={vi.fn()}
      {...props}
    />,
  )
}

describe('CompletionPage', () => {
  it('muestra un estado vacío si no hay sesión', async () => {
    const user = userEvent.setup()
    const onGoToEntry = vi.fn()
    render(<CompletionPage session={null} onGoToEntry={onGoToEntry} />)

    expect(screen.getByText(/Completa los 5 niveles/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Volver al inicio' }))
    expect(onGoToEntry).toHaveBeenCalled()
  })

  it('muestra las estadísticas de la sesión', () => {
    setup()

    expect(screen.getByText('fotosíntesis')).toBeInTheDocument()
    expect(screen.getByText('5/5')).toBeInTheDocument()
    // puntuación media = round((5+2)/(2*5)*100) = 70%
    expect(screen.getByText('70%')).toBeInTheDocument()
  })

  it('guarda la autoevaluación con puntuación y feedback', async () => {
    const user = userEvent.setup()
    const onSaveEvaluation = vi.fn().mockResolvedValue()
    setup({ onSaveEvaluation })

    await user.type(screen.getByLabelText('Feedback opcional'), 'Muy claro')
    await user.click(screen.getByRole('button', { name: 'Guardar evaluación' }))

    expect(onSaveEvaluation).toHaveBeenCalledWith({ postScore: 4, feedback: 'Muy claro' })
    expect(await screen.findByText(/Evaluación guardada/)).toBeInTheDocument()
  })

  it('permite volver al inicio y reiniciar el concepto', async () => {
    const user = userEvent.setup()
    const onGoToEntry = vi.fn()
    const onRestart = vi.fn()
    setup({ onGoToEntry, onRestart })

    await user.click(screen.getByRole('button', { name: 'Aprender otro concepto' }))
    await user.click(screen.getByRole('button', { name: 'Reiniciar este concepto' }))
    expect(onGoToEntry).toHaveBeenCalled()
    expect(onRestart).toHaveBeenCalled()
  })

  it('ofrece el primer repaso cuando hay tarjetas listas', async () => {
    const user = userEvent.setup()
    const onOpenSrs = vi.fn()
    setup({ dueCount: 2, onOpenSrs })

    await user.click(screen.getByRole('button', { name: /tarjetas listas/ }))
    expect(onOpenSrs).toHaveBeenCalled()
  })
})
