/**
 * SrsPrompt — Construye prompts para generar tarjetas SRS.
 *
 * Prompt Engineering (Módulo 5): Prompts con audiencia y reglas de formato.
 */

import { Level } from '../../../domain/entities/Level.js'
import { outputLanguageDirective } from './language.js'

export function buildSRSPrompt(concept, levelLabel, levelNumber) {
  const level = Level.create(levelNumber)

  return `Eres un motor de aprendizaje Feynman. El usuario acaba de superar el nivel "${levelLabel}" (nivel ${levelNumber}) de "${concept}".
Audiencia de este nivel: ${level.audience}.

Genera 5 tarjetas de repetición espaciada que refuercen las ideas clave de este nivel.
Las tarjetas deben usar el vocabulario y los conceptos apropiados para la audiencia de este nivel.

Devuelve SOLO JSON válido:
{
  "cards": [
    { "id": "l${levelNumber}c1", "front": string, "back": string },
    ... (5 en total)
  ]
}

Reglas de las tarjetas:
- front: una pregunta o pista (15 palabras o menos, con el vocabulario de este nivel)
- back: la respuesta (40 palabras o menos, con el mismo vocabulario)
Sin markdown, sin preámbulos, sin bloques de código.
${outputLanguageDirective()}`
}
