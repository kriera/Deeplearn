/**
 * SrsPrompt — Construye prompts para generar tarjetas SRS.
 *
 * Prompt Engineering (Módulo 5): Prompts con audiencia y reglas de formato.
 */

import { Level } from '../../../domain/entities/Level.js'
import { detectLanguage, outputLanguageDirective } from './language.js'

export function buildSRSPrompt(concept, levelLabel, levelNumber) {
  const level = Level.create(levelNumber)
  const lang = detectLanguage(concept)

  return `You are a Feynman learning engine. The user just passed the "${levelLabel}" level (level ${levelNumber}) of "${concept}".
Audience for this level: ${level.audience}.

Generate 5 spaced-repetition flash cards that reinforce the key ideas from this level.
Cards must use vocabulary and concepts appropriate for this level's audience.

Return ONLY valid JSON:
{
  "cards": [
    { "id": "l${levelNumber}c1", "front": string, "back": string },
    ... (5 total)
  ]
}

Card rules:
- front: a question or cue (15 words or fewer, phrased at this level's vocabulary)
- back: the answer (40 words or fewer, using the same vocabulary)
No markdown, no preamble, no code fences.
${outputLanguageDirective(lang)}`
}
