/**
 * InMemorySessionRepository — Implementación en memoria del puerto SessionRepository.
 * Útil para tests y desarrollo sin persistencia real.
 *
 * Hexagonal Architecture (Módulo 2): Adaptador concreto del puerto SessionRepository.
 * DIP (Módulo 1): La capa de aplicación depende del puerto, no de esta implementación.
 */

export class InMemorySessionRepository {
  constructor() {
    this._sessions = new Map()
  }

  async save(session) {
    this._sessions.set(session.id, { ...session })
    return session
  }

  async findById(id) {
    return this._sessions.get(id) || null
  }

  async findAll() {
    return Array.from(this._sessions.values())
  }

  async findByConcept(normalizedConcept) {
    for (const session of this._sessions.values()) {
      if (session.normalizedConcept === normalizedConcept) {
        return session
      }
    }
    return null
  }

  async deleteById(id) {
    this._sessions.delete(id)
  }
}
