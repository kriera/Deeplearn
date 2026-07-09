/**
 * LocalStorageSessionRepository — Implementación del puerto SessionRepository
 * usando localStorage del navegador.
 *
 * Hexagonal Architecture (Módulo 2): Adaptador concreto del puerto SessionRepository.
 * DIP (Módulo 1): La capa de aplicación depende del puerto, no de esta implementación.
 * Repository Pattern (Módulo 1): Abstracción sobre la fuente de datos.
 */

import { SessionSerializer } from '../serializers/SessionSerializer.js'

export class LocalStorageSessionRepository {
  constructor(storageKey = 'deeplearn_sessions') {
    this._key = storageKey
    this._serializer = new SessionSerializer()
  }

  async save(session) {
    const sessions = await this._loadAll()
    const idx = sessions.findIndex((s) => s.id === session.id)
    if (idx >= 0) {
      sessions[idx] = session
    } else {
      sessions.push(session)
    }
    this._persist(sessions)
    return session
  }

  async findById(id) {
    const sessions = await this._loadAll()
    return sessions.find((s) => s.id === id) || null
  }

  async findAll() {
    return this._loadAll()
  }

  async findByConcept(normalizedConcept) {
    const sessions = await this._loadAll()
    return sessions.find((s) => s.normalizedConcept === normalizedConcept) || null
  }

  async deleteById(id) {
    const sessions = await this._loadAll()
    this._persist(sessions.filter((s) => s.id !== id))
  }

  async _loadAll() {
    try {
      const raw = localStorage.getItem(this._key)
      return this._serializer.deserialize(raw) || []
    } catch {
      return []
    }
  }

  _persist(sessions) {
    try {
      localStorage.setItem(this._key, this._serializer.serialize(sessions))
    } catch {
      throw new Error('Storage quota exceeded')
    }
  }
}
