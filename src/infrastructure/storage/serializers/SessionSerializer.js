/**
 * SessionSerializer — Serializa y deserializa sesiones para persistencia.
 *
 * SRP (Módulo 1): Única responsabilidad: convertir entre objetos y JSON.
 */

export class SessionSerializer {
  serialize(session) {
    return JSON.stringify(session)
  }

  deserialize(json) {
    if (!json) return null
    try {
      return JSON.parse(json)
    } catch {
      return null
    }
  }
}
