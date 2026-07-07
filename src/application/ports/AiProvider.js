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
  generateExplanation(concept, levelNumber) {
    throw new Error('AiProvider.generateExplanation() not implemented')
  },

  /**
   * Genera un quiz (5 preguntas) para un nivel.
   * @returns {Promise<{questions: Array}>}
   */
  generateQuiz(concept, levelNumber, explanation) {
    throw new Error('AiProvider.generateQuiz() not implemented')
  },

  /**
   * Genera una re-explicación simplificada tras un fallo.
   * @returns {Promise<{explanation: string, questions: Array}>}
   */
  generateReExplanation(concept, levelNumber, weakAreas) {
    throw new Error('AiProvider.generateReExplanation() not implemented')
  },

  /**
   * Genera tarjetas SRS para un nivel superado.
   * @returns {Promise<{cards: Array}>}
   */
  generateSRSCards(concept, levelNumber, levelLabel) {
    throw new Error('AiProvider.generateSRSCards() not implemented')
  },
}

export { AiProvider }
