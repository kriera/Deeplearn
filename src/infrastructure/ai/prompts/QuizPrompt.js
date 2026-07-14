/**
 * QuizPrompt — Construye prompts para generar quizzes por nivel.
 *
 * Prompt Engineering (Módulo 5): Prompts con contexto y reglas de calidad.
 */

import { Level } from '../../../domain/entities/Level.js'
import { detectLanguage, outputLanguageDirective } from './language.js'

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

const LANG_INSTRUCTIONS = {
  es: {
    role: 'Eres un motor de aprendizaje Feynman.',
    action: 'Crea el quiz',
    contract: 'Contrato del quiz',
    source: 'Usa SOLO esta explicación como fuente de verdad',
    rules: 'Reglas de calidad del quiz',
    json: 'Devuelve SOLO JSON válido',
    noMarkdown: 'Sin markdown, sin preámbulos, sin bloques de código.',
  },
  en: {
    role: 'You are a Feynman learning engine.',
    action: 'Create the quiz',
    contract: 'Level quiz contract',
    source: 'Use ONLY this explanation as your source of truth',
    rules: 'Quiz quality rules',
    json: 'Return ONLY valid JSON',
    noMarkdown: 'No markdown, no preamble, no code fences.',
  },
}

export function buildLevelQuizPrompt(concept, levelNumber, explanation) {
  const level = Level.create(levelNumber)
  const lang = detectLanguage(concept)
  const t = LANG_INSTRUCTIONS[lang]

  return `${t.role} ${t.action} for level ${levelNumber} ("${level.label}") of "${concept}".

Audience: ${level.audience}
${t.contract}: ${level.quizRules}

${t.source}:
---
${explanation}
---

${t.rules}:
${QUIZ_QUALITY_RULES.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

${t.json}:
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
${t.noMarkdown}
${outputLanguageDirective(lang)}`
}
