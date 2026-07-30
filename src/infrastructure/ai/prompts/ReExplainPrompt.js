/**
 * ReExplainPrompt — Construye prompts para re-explicaciones tras fallo.
 *
 * Prompt Engineering (Módulo 5): Prompts con contexto de error y áreas débiles.
 */

import { Level } from '../../../domain/entities/Level.js'
import { outputLanguageDirective } from './language.js'
import { QUIZ_QUALITY_RULES } from './QuizPrompt.js'

export function buildReExplainPrompt(concept, levelNumber, weakAreas) {
  const level = Level.create(levelNumber)
  const summary =
    weakAreas && weakAreas.length > 0
      ? weakAreas.map((w) => `- ${w.question || w}`).join('\n')
      : 'El estudiante ha tenido dificultades con este nivel.'

  return `Eres un motor de aprendizaje Feynman. El usuario ha suspendido la prueba del nivel "${level.label}" para el concepto "${concept}".
Resumen de sus dificultades:
${summary}

Escribe una re-explicación MÁS SIMPLE y 5 preguntas nuevas para el nivel ${levelNumber} ("${level.label}").
Céntrate especialmente en las áreas débiles de arriba. No repitas la misma formulación de las preguntas falladas.
MÁS SIMPLE significa palabras más fáciles, frases más cortas y analogías más claras — NO un texto más corto.
La re-explicación debe seguir siendo completa y autocontenida: entre 150 y 250 palabras.

Audiencia: ${level.audience}
Reglas de explicación:
${level.rules.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}
  Regla extra: Usa una analogía o un ejemplo DIFERENTE al del primer intento.

Reglas de calidad del quiz:
${QUIZ_QUALITY_RULES.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

Devuelve SOLO JSON válido:
{
  "explanation": string (150-250 palabras, más simple que antes, con otra analogía o ejemplo),
  "questions": [
    { "id": "l${levelNumber}q1", "question": string, "options": [string,string,string,string],
      "correct_index": 0|1|2|3, "explanation": string },
    ... (5 en total)
  ]
}
Sin markdown, sin preámbulos, sin bloques de código.
${outputLanguageDirective()}`
}
