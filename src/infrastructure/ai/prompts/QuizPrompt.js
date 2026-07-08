/**
 * QuizPrompt — Construye prompts para generar quizzes por nivel.
 *
 * Prompt Engineering (Módulo 5): Prompts con contexto y reglas de calidad.
 */

import { Level } from '../../../domain/entities/Level.js'

const QUIZ_QUALITY_RULES = [
  'Write exactly 5 distinct multiple-choice questions.',
  'Each question must test a DIFFERENT idea from the explanation.',
  'Vary question types: direct recall, cause/effect, analogy application, "what would happen if", and misconception check.',
  'Wrong options must be plausible: similar length and tone to the correct answer.',
  'Never use joke answers, "all of the above", "none of the above", or options that are obviously wrong.',
  'Do NOT copy sentences verbatim from the explanation; paraphrase in fresh wording.',
  'Every question must be answerable using ONLY the explanation — no outside knowledge.',
  'Spread correct_index across 0, 1, 2, and 3.',
  'Per-question explanation: restate why the correct answer fits and why one tempting wrong choice fails (1-2 sentences).',
]

export function buildLevelQuizPrompt(concept, levelNumber, explanation) {
  const level = Level.create(levelNumber)

  return `You are a Feynman learning engine. Create the quiz for level ${levelNumber} ("${level.label}") of "${concept}".

Audience: ${level.audience}
Level quiz contract: ${level.quizRules}

Use ONLY this explanation as your source of truth:
---
${explanation}
---

Quiz quality rules:
${QUIZ_QUALITY_RULES.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "l${levelNumber}q1",
      "question": string,
      "options": [string, string, string, string],
      "correct_index": 0|1|2|3,
      "explanation": string
    },
    ... (5 total)
  ]
}
No markdown, no preamble, no code fences.`
}
