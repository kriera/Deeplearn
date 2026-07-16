/**
 * GenerateLevelContent — Caso de uso: generar contenido de un nivel vía IA.
 *
 * Clean Architecture (Módulo 2): Capa de aplicación, orquesta usando puertos.
 * DIP (Módulo 1): Depende de AiProvider (abstracción), no de Ollama/Anthropic.
 * Strategy Pattern (Módulo 1): El provider es intercambiable en runtime.
 * TDD (Módulo 6): Tests con provider fake.
 *
 * Generación progresiva: la explicación se persiste y notifica en cuanto llega
 * (onExplanation), y el quiz se genera después. Así la UI puede mostrar la
 * explicación mientras el quiz sigue generándose. Si el nivel ya tiene
 * explicación (p. ej. reintento tras fallo del quiz, o sesión interrumpida),
 * se reutiliza y solo se genera el quiz.
 */

import { Session } from '../../domain/entities/Session.js'

const GenerateLevelContent = {
  async execute(session, levelIndex, aiProvider, sessionRepository, { onExplanation } = {}) {
    const level = session.levels[levelIndex]
    if (!level) throw new Error(`Level ${levelIndex} not found`)

    const concept = session.concept
    const levelNumber = level.number

    let updated = session
    let explanation = level.explanation

    if (!explanation) {
      const result = await aiProvider.generateExplanation(concept, levelNumber)
      explanation = result.explanation
      updated = Session.setLevelContent(updated, levelIndex, { explanation, questions: [] })
      await sessionRepository.save(updated)
      onExplanation?.(updated)
    }

    const { questions } = await aiProvider.generateQuiz(concept, levelNumber, explanation)

    updated = Session.setLevelContent(updated, levelIndex, { explanation, questions })
    await sessionRepository.save(updated)

    return updated
  },
}

export { GenerateLevelContent }
