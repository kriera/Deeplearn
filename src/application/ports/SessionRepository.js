/**
 * SessionRepository — Puerto (interfaz) para almacenamiento de sesiones.
 *
 * DIP (Módulo 1): Depender de abstracciones, no de concreciones.
 * La capa de aplicación usa este puerto; la infraestructura lo implementa.
 */

const SessionRepository = {
  /** @returns {Promise<import('../../domain/entities/Session.js').Session>} */
  save(_session) {
    throw new Error('SessionRepository.save() not implemented')
  },

  /** @returns {Promise<import('../../domain/entities/Session.js').Session|null>} */
  findById(_id) {
    throw new Error('SessionRepository.findById() not implemented')
  },

  /** @returns {Promise<import('../../domain/entities/Session.js').Session[]>} */
  findAll() {
    throw new Error('SessionRepository.findAll() not implemented')
  },

  /** @returns {Promise<import('../../domain/entities/Session.js').Session|null>} */
  findByConcept(_concept) {
    throw new Error('SessionRepository.findByConcept() not implemented')
  },

  /** @returns {Promise<void>} */
  deleteById(_id) {
    throw new Error('SessionRepository.deleteById() not implemented')
  },
}

export { SessionRepository }
