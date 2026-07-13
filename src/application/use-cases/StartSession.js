/**
 * StartSession — Caso de uso: iniciar una nueva sesión de aprendizaje.
 *
 * Clean Architecture (Módulo 2): Capa de aplicación, orquesta usando puertos.
 * DIP (Módulo 1): Depende de SessionRepository y AiProvider (abstracciones).
 * TDD (Módulo 6): Tests con repositorio y provider fake.
 */

import { Session } from '../../domain/entities/Session.js'
import { GenerateLevelContent } from './GenerateLevelContent.js'

function normalizeConcept(concept) {
  return concept
    .trim()
    .toLowerCase()
    .replace(/^what\s+is\s+/i, '')
    .trim()
}

const StartSession = {
  async execute(concept, sessionRepository, aiProvider) {
    const normalized = normalizeConcept(concept)

    const existing = await sessionRepository.findByConcept(normalized)
    if (existing) {
      return { session: existing, restored: true }
    }

    let session = Session.create(concept)
    await sessionRepository.save(session)

    // Generate level 1 content via AI
    if (aiProvider) {
      try {
        session = await GenerateLevelContent.execute(session, 0, aiProvider, sessionRepository)
      } catch (err) {
        // Level stays in 'pending' state; user can retry
        session = Session.setLevelContent(session, 0, {
          explanation: '',
          questions: [],
        })
        const levels = session.levels.map((l, i) =>
          i === 0 ? { ...l, status: 'error', generationError: err.message } : l,
        )
        session = { ...session, levels }
        await sessionRepository.save(session)
      }
    }

    return { session, restored: false }
  },
}

export { StartSession }
