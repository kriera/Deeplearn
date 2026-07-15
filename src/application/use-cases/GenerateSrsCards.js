/**
 * GenerateSrsCards — Caso de uso: generar tarjetas SRS al superar un nivel.
 *
 * Clean Architecture (Módulo 2): Capa de aplicación, orquesta usando puertos.
 * DIP (Módulo 1): Depende de AiProvider y del repositorio de tarjetas (abstracciones).
 * SRP (Módulo 1): Única responsabilidad: crear y persistir tarjetas de repaso.
 */

import { SrsService } from '../../domain/services/SrsService.js'
import { Level } from '../../domain/entities/Level.js'

const GenerateSrsCards = {
  async execute(session, levelNumber, aiProvider, cardRepository) {
    const level = Level.create(levelNumber)
    const { cards } = await aiProvider.generateSRSCards(session.concept, levelNumber, level.label)

    const created = (cards || [])
      .filter((c) => c && c.front && c.back)
      .map((c) =>
        SrsService.createCard({
          // Prefijo con el id de sesión: los ids del modelo (l1c1…) se repiten entre conceptos
          id: `${session.id}-${c.id}`,
          concept: session.concept,
          levelLabel: level.label,
          front: c.front,
          back: c.back,
        }),
      )

    for (const card of created) {
      await cardRepository.save(card)
    }
    return created
  },
}

export { GenerateSrsCards }
