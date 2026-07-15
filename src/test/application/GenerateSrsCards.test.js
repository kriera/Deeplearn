import { describe, expect, it, vi } from 'vitest'
import { GenerateSrsCards } from '../../application/use-cases/GenerateSrsCards.js'

describe('GenerateSrsCards', () => {
  const session = { id: 's1', concept: 'fotosíntesis' }

  it('crea tarjetas SM-2 desde el output del modelo y las persiste', async () => {
    const cardRepository = { save: vi.fn((c) => c) }
    const aiProvider = {
      generateSRSCards: vi.fn(() =>
        Promise.resolve({
          cards: [
            { id: 'l1c1', front: '¿Qué produce la fotosíntesis?', back: 'Glucosa y oxígeno.' },
            { id: 'l1c2', front: '¿Dónde ocurre?', back: 'En los cloroplastos.' },
          ],
        }),
      ),
    }

    const created = await GenerateSrsCards.execute(session, 1, aiProvider, cardRepository)

    expect(aiProvider.generateSRSCards).toHaveBeenCalledWith('fotosíntesis', 1, 'Elemental')
    expect(created).toHaveLength(2)
    // Id con prefijo de sesión: los ids del modelo se repiten entre conceptos
    expect(created[0].id).toBe('s1-l1c1')
    // Tarjeta SM-2 completa creada por el dominio
    expect(created[0].ease).toBe(2.5)
    expect(created[0].interval).toBe(1)
    expect(created[0].levelLabel).toBe('Elemental')
    expect(Object.isFrozen(created[0])).toBe(true)
    expect(cardRepository.save).toHaveBeenCalledTimes(2)
  })

  it('descarta tarjetas malformadas del modelo (sin front o back)', async () => {
    const cardRepository = { save: vi.fn((c) => c) }
    const aiProvider = {
      generateSRSCards: vi.fn(() =>
        Promise.resolve({
          cards: [
            { id: 'l1c1', front: 'Válida', back: 'Sí' },
            { id: 'l1c2', front: 'Sin respuesta' },
            null,
          ],
        }),
      ),
    }

    const created = await GenerateSrsCards.execute(session, 1, aiProvider, cardRepository)

    expect(created).toHaveLength(1)
    expect(cardRepository.save).toHaveBeenCalledTimes(1)
  })

  it('tolera una respuesta sin tarjetas', async () => {
    const cardRepository = { save: vi.fn() }
    const aiProvider = { generateSRSCards: vi.fn(() => Promise.resolve({})) }

    const created = await GenerateSrsCards.execute(session, 1, aiProvider, cardRepository)

    expect(created).toEqual([])
    expect(cardRepository.save).not.toHaveBeenCalled()
  })

  it('propaga el fallo del provider sin persistir', async () => {
    const cardRepository = { save: vi.fn() }
    const aiProvider = { generateSRSCards: vi.fn(() => Promise.reject(new Error('model offline'))) }

    await expect(GenerateSrsCards.execute(session, 1, aiProvider, cardRepository)).rejects.toThrow(
      'model offline',
    )
    expect(cardRepository.save).not.toHaveBeenCalled()
  })
})
