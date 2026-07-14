/**
 * ReExplainPrompt — Construye prompts para re-explicaciones tras fallo.
 *
 * Prompt Engineering (Módulo 5): Prompts con contexto de error y áreas débiles.
 */

import { Level } from '../../../domain/entities/Level.js'
import { detectLanguage, outputLanguageDirective } from './language.js'

export function buildReExplainPrompt(concept, levelNumber, weakAreas) {
  const level = Level.create(levelNumber)
  const lang = detectLanguage(concept)
  const summary =
    weakAreas && weakAreas.length > 0
      ? weakAreas.map((w) => `- ${w.question || w}`).join('\n')
      : 'The learner struggled with this level.'

  return `You are a Feynman learning engine. The user failed the "${level.label}" level gate for the concept "${concept}".
Their struggle summary:
${summary}

Write a SIMPLER re-explanation and 5 new questions for level ${levelNumber} ("${level.label}").
Focus especially on the exact weak areas above. Do not repeat the same wording from the failed questions.

Audience: ${level.audience}
Explanation rules:
${level.rules.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}
  Extra rule: Use a DIFFERENT analogy or example than the first attempt.

Return ONLY valid JSON:
{
  "explanation": string (150-250 words, simpler than before, different analogy/example),
  "questions": [
    { "id": "l${levelNumber}q1", "question": string, "options": [string,string,string,string],
      "correct_index": 0|1|2|3, "explanation": string },
    ... (5 total)
  ]
}
No markdown, no preamble, no code fences.
${outputLanguageDirective(lang)}`
}
