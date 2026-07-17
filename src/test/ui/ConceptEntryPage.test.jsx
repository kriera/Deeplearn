/**
 * ConceptEntryPage — Test de integración user-centric (Testing Library + userEvent).
 *
 * Cubre la entrada de concepto, sugerencias, estados de error/carga, el listado de
 * sesiones recientes y el acceso al repaso SRS. Criterio SPEC §8 "Cobertura UI".
 */

import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConceptEntryPage } from '../../ui/pages/ConceptEntryPage.jsx'

function setup(props = {}) {
  return render(
    <ConceptEntryPage
      onStart={vi.fn()}
      onResume={vi.fn()}
      sessions={[]}
      loading={false}
      error={null}
      dueCount={0}
      onOpenSrs={vi.fn()}
      {...props}
    />,
  )
}

describe('ConceptEntryPage', () => {
  it('inicia la sesión con el concepto escrito (recortado)', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()
    setup({ onStart })

    const btn = screen.getByRole('button', { name: /Generar ruta/ })
    expect(btn).toBeDisabled()

    await user.type(screen.getByLabelText('¿Qué quieres aprender hoy?'), '  fotosíntesis  ')
    expect(btn).toBeEnabled()

    await user.click(btn)
    expect(onStart).toHaveBeenCalledWith('fotosíntesis')
  })

  it('permite iniciar pulsando Enter', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()
    setup({ onStart })

    await user.type(screen.getByLabelText('¿Qué quieres aprender hoy?'), 'blockchain{Enter}')
    expect(onStart).toHaveBeenCalledWith('blockchain')
  })

  it('rellena el concepto al pulsar una sugerencia', async () => {
    const user = userEvent.setup()
    setup()

    await user.click(screen.getByRole('button', { name: 'Probar sugerencia: Oferta y demanda' }))
    expect(screen.getByLabelText('¿Qué quieres aprender hoy?')).toHaveValue('Oferta y demanda')
  })

  it('muestra el error y el estado de carga', () => {
    setup({ error: 'No se pudo generar', loading: true })

    expect(screen.getByRole('alert')).toHaveTextContent('No se pudo generar')
    expect(screen.getByText(/Generando… puede tardar/)).toBeInTheDocument()
  })

  it('lista sesiones recientes y permite retomarlas', async () => {
    const user = userEvent.setup()
    const onResume = vi.fn()
    const sessions = [
      {
        id: 's1',
        concept: 'fotosíntesis',
        createdAt: '2026-07-01T00:00:00.000Z',
        levelsUnlocked: 3,
      },
    ]
    setup({ sessions, onResume })

    expect(screen.getByText(/concepto explorado/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Retomar sesión: fotosíntesis' }))
    expect(onResume).toHaveBeenCalledWith('s1')
  })

  it('ofrece repasar cuando hay tarjetas pendientes', async () => {
    const user = userEvent.setup()
    const onOpenSrs = vi.fn()
    setup({ dueCount: 3, onOpenSrs })

    await user.click(screen.getByRole('button', { name: /tarjetas pendientes de repaso/ }))
    expect(onOpenSrs).toHaveBeenCalled()
  })
})
