/**
 * LevelPrompt — Construye prompts para generar explicaciones por nivel.
 *
 * Prompt Engineering (Módulo 5): Prompts específicos con contexto, audiencia y reglas.
 */

import { Level } from '../../../domain/entities/Level.js'

export function buildLevelExplanationPrompt(concept, levelNumber) {
  const level = Level.create(levelNumber)

  return `Generate ONLY a compact level ${levelNumber} ("${level.label}") explanation for "${concept}".

Audience: ${level.audience}
Explanation rules:
${level.rules.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

Content rules:
  - Keep the explanation between 90 and 150 words.
  - Include at least 3 concrete, testable facts or relationships.
  - Do not include quiz questions, bullet lists, summaries, markdown, or extra commentary.

Return ONLY valid JSON:
{
  "level": ${levelNumber},
  "label": "${level.label}",
  "explanation": string (90-150 words)
}
No markdown, no preamble, no code fences.`
}
