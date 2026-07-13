/**
 * LevelPrompt — Construye prompts para generar explicaciones por nivel.
 *
 * Prompt Engineering (Módulo 5): Prompts específicos con contexto, audiencia y reglas.
 */

import { Level } from '../../../domain/entities/Level.js'

function detectLanguage(concept) {
  const sample = concept.toLowerCase()
  const spanishMarkers = ['á', 'é', 'í', 'ó', 'ú', 'ñ', 'ü', '¿', '¡', ' el ', ' la ', ' los ', ' las ', ' es ', ' una ', ' que ', ' por ', ' del ']
  const isSpanish = spanishMarkers.some((m) => sample.includes(m))
  return isSpanish ? 'es' : 'en'
}

const LANG_INSTRUCTIONS = {
  es: {
    action: 'Genera SOLO una explicación compacta',
    audience: 'Audiencia',
    rules: 'Reglas de explicación',
    contentRules: 'Reglas de contenido',
    contentItems: [
      'Mantén la explicación entre 90 y 150 palabras.',
      'Incluye al menos 3 hechos o relaciones concretas y comprobables.',
      'No incluyas preguntas de quiz, listas, resúmenes, markdown ni comentarios extra.',
    ],
    json: 'Devuelve SOLO JSON válido',
    noMarkdown: 'Sin markdown, sin preámbulos, sin bloques de código.',
  },
  en: {
    action: 'Generate ONLY a compact level',
    audience: 'Audience',
    rules: 'Explanation rules',
    contentRules: 'Content rules',
    contentItems: [
      'Keep the explanation between 90 and 150 words.',
      'Include at least 3 concrete, testable facts or relationships.',
      'Do not include quiz questions, bullet lists, summaries, markdown, or extra commentary.',
    ],
    json: 'Return ONLY valid JSON',
    noMarkdown: 'No markdown, no preamble, no code fences.',
  },
}

export function buildLevelExplanationPrompt(concept, levelNumber) {
  const level = Level.create(levelNumber)
  const lang = detectLanguage(concept)
  const t = LANG_INSTRUCTIONS[lang]

  return `${t.action} ${levelNumber} ("${level.label}") explanation for "${concept}".

${t.audience}: ${level.audience}
${t.rules}:
${level.rules.map((r, i) => `  ${i + 1}. ${r}`).join('\n')}

${t.contentRules}:
${t.contentItems.map((r, i) => `  - ${r}`).join('\n')}

${t.json}:
{
  "level": ${levelNumber},
  "label": "${level.label}",
  "explanation": string (90-150 words)
}
${t.noMarkdown}`
}
