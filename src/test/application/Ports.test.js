/**
 * Ports — Test de contrato de los puertos (interfaces) de la capa de aplicación.
 *
 * Los puertos son contratos abstractos: cada método debe lanzar "not implemented"
 * hasta que un adaptador de infraestructura lo implemente (DIP, Módulo 1). Este
 * test fija ese contrato y, además, incluye los puertos en la medición de
 * cobertura para que el umbral de 100% de la capa de aplicación sea real y no
 * quede vacío por archivos sin importar.
 */

import { describe, expect, it } from 'vitest'
import { AiProvider } from '../../application/ports/AiProvider.js'
import { SessionRepository } from '../../application/ports/SessionRepository.js'

describe('AiProvider (puerto)', () => {
  it('cada método lanza "not implemented" hasta que un adaptador lo implemente', () => {
    expect(() => AiProvider.generateExplanation('c', 1)).toThrow(/not implemented/)
    expect(() => AiProvider.generateQuiz('c', 1, 'e')).toThrow(/not implemented/)
    expect(() => AiProvider.generateReExplanation('c', 1, [])).toThrow(/not implemented/)
    expect(() => AiProvider.generateSRSCards('c', 1, 'Elemental')).toThrow(/not implemented/)
  })
})

describe('SessionRepository (puerto)', () => {
  it('cada método lanza "not implemented" hasta que un adaptador lo implemente', () => {
    expect(() => SessionRepository.save({})).toThrow(/not implemented/)
    expect(() => SessionRepository.findById('id')).toThrow(/not implemented/)
    expect(() => SessionRepository.findAll()).toThrow(/not implemented/)
    expect(() => SessionRepository.findByConcept('c')).toThrow(/not implemented/)
    expect(() => SessionRepository.deleteById('id')).toThrow(/not implemented/)
  })
})
