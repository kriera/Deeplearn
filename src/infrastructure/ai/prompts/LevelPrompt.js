/**
 * LevelPrompt — Construye prompts para generar explicaciones por nivel.
 *
 * Prompt Engineering (Módulo 5): Prompts específicos con contexto, audiencia y reglas.
 * El prompt va íntegramente en español para que no compita con la directiva de
 * idioma; las claves del JSON de salida se mantienen en inglés porque son el
 * contrato con BaseAiProvider y con los repositorios.
 */

import { Level } from '../../../domain/entities/Level.js'
import { outputLanguageDirective } from './language.js'

const CONTENT_RULES = [
  'Mantén la explicación entre 90 y 150 palabras.',
  'Incluye al menos 3 hechos o relaciones concretas y comprobables.',
  'No incluyas preguntas de quiz, listas, resúmenes, markdown ni comentarios extra.',
]

export function buildLevelExplanationPrompt(concept, levelNumber) {
  const level = Level.create(levelNumber)

  return `Eres un motor de aprendizaje Feynman. Genera SOLO una explicación compacta del nivel ${levelNumber} ("${level.label}") para "${concept}".

Audiencia: ${level.audience}
Reglas de explicación:
${level.rules.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

Reglas de contenido:
${CONTENT_RULES.map((r) => `  - ${r}`).join('\n')}

Devuelve SOLO JSON válido:
{
  "level": ${levelNumber},
  "label": "${level.label}",
  "explanation": string (90-150 palabras)
}
Sin markdown, sin preámbulos, sin bloques de código.
${outputLanguageDirective()}`
}
