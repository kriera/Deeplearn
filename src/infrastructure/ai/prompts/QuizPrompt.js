/**
 * QuizPrompt — Construye prompts para generar quizzes por nivel.
 *
 * Prompt Engineering (Módulo 5): Prompts con contexto y reglas de calidad.
 * El prompt va íntegramente en español; `correct_index` y los índices 0-3 se
 * conservan literales porque son el contrato del JSON de salida.
 */

import { Level } from '../../../domain/entities/Level.js'
import { outputLanguageDirective } from './language.js'

export const QUIZ_QUALITY_RULES = [
  'Escribe exactamente 5 preguntas tipo test distintas.',
  'Cada pregunta debe evaluar una idea DIFERENTE de la explicación.',
  'Varía el tipo de pregunta: recuerdo directo, causa/efecto, aplicación de la analogía, "qué pasaría si" y detección de un error habitual.',
  'Las opciones incorrectas deben ser plausibles: longitud y tono similares a la correcta.',
  'Nunca uses respuestas en broma, "todas las anteriores", "ninguna de las anteriores" ni opciones obviamente falsas.',
  'NO copies frases literales de la explicación; parafrasea con palabras nuevas.',
  'Toda pregunta debe poder responderse usando SOLO la explicación, sin conocimientos externos.',
  'Reparte correct_index entre 0, 1, 2 y 3.',
  'Aclaración por pregunta: explica por qué encaja la respuesta correcta y por qué falla una opción incorrecta tentadora (1-2 frases).',
]

export function buildLevelQuizPrompt(concept, levelNumber, explanation) {
  const level = Level.create(levelNumber)

  return `Eres un motor de aprendizaje Feynman. Crea el quiz del nivel ${levelNumber} ("${level.label}") de "${concept}".

Audiencia: ${level.audience}
Contrato del quiz: ${level.quizRules}

Usa SOLO esta explicación como fuente de verdad:
---
${explanation}
---

Reglas de calidad del quiz:
${QUIZ_QUALITY_RULES.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

Devuelve SOLO JSON válido:
{
  "questions": [
    {
      "id": "l${levelNumber}q1",
      "question": string,
      "options": [string, string, string, string],
      "correct_index": 0|1|2|3,
      "explanation": string
    },
    ... (5 en total)
  ]
}
Sin markdown, sin preámbulos, sin bloques de código.
${outputLanguageDirective()}`
}
