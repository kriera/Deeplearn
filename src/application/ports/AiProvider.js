/**
 * AiProvider — Puerto (interfaz) para generación de contenido con IA.
 *
 * DIP (Módulo 1): Depender de abstracciones, no de concreciones.
 * La capa de aplicación usa este puerto; la infraestructura lo implementa.
 */

const AiProvider = {
  /**
   * Genera una explicación para un nivel.
   * @returns {Promise<{explanation: string}>}
   */
  generateExplanation(_concept, _levelNumber) {
    throw new Error('AiProvider.generateExplanation() not implemented')
  },

  /**
   * Genera un quiz (5 preguntas) para un nivel.
   * @returns {Promise<{questions: Array}>}
   */
  generateQuiz(_concept, _levelNumber, _explanation) {
    throw new Error('AiProvider.generateQuiz() not implemented')
  },

  /**
   * Genera una re-explicación simplificada tras un fallo.
   * @returns {Promise<{explanation: string, questions: Array}>}
   */
  generateReExplanation(_concept, _levelNumber, _weakAreas) {
    throw new Error('AiProvider.generateReExplanation() not implemented')
  },

  /**
   * Genera tarjetas SRS para un nivel superado.
   * @returns {Promise<{cards: Array}>}
   */
  generateSRSCards(_concept, _levelNumber, _levelLabel) {
    throw new Error('AiProvider.generateSRSCards() not implemented')
  },
}

export { AiProvider }
