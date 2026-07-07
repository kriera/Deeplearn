/**
 * StartSession — Caso de uso: iniciar una nueva sesión de aprendizaje.
 *
 * Clean Architecture (Módulo 2): Capa de aplicación, orquesta usando puertos.
 * DIP (Módulo 1): Depende de SessionRepository (abstracción), no de implementación concreta.
 * TDD (Módulo 6): Tests con repositorio fake.
 */

import { Session } from '../../domain/entities/Session.js'

function normalizeConcept(concept) {
  return concept
    .trim()
    .toLowerCase()
    .replace(/^what\s+is\s+/i, '')
    .trim()
}

const StartSession = {
  async execute(concept, sessionRepository) {
    const normalized = normalizeConcept(concept)

    // Check for existing session
    const existing = await sessionRepository.findByConcept(normalized)
    if (existing) {
      return { session: existing, restored: true }
    }

    const session = Session.create(concept)
    await sessionRepository.save(session)
    return { session, restored: false }
  },
}

export { StartSession }
