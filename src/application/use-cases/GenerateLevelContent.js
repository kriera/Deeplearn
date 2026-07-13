/**
 * GenerateLevelContent — Caso de uso: generar contenido de un nivel vía IA.
 *
 * Clean Architecture (Módulo 2): Capa de aplicación, orquesta usando puertos.
 * DIP (Módulo 1): Depende de AiProvider (abstracción), no de Ollama/Anthropic.
 * Strategy Pattern (Módulo 1): El provider es intercambiable en runtime.
 * TDD (Módulo 6): Tests con provider fake.
 */

import { Session } from '../../domain/entities/Session.js'

const GenerateLevelContent = {
  async execute(session, levelIndex, aiProvider, sessionRepository) {
    const level = session.levels[levelIndex]
    if (!level) throw new Error(`Level ${levelIndex} not found`)

    const concept = session.concept
    const levelNumber = level.number

    const [{ explanation }, { questions }] = await Promise.all([
      aiProvider.generateExplanation(concept, levelNumber),
      aiProvider.generateQuiz(concept, levelNumber, ''),
    ])

    const updated = Session.setLevelContent(session, levelIndex, { explanation, questions })
    await sessionRepository.save(updated)

    return updated
  },
}

export { GenerateLevelContent }
