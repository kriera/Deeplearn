/**
 * eval — Evaluación de calidad del contenido generado por el modelo (LLMOps, Módulo 7).
 *
 * Golden dataset de conceptos fijos; para cada uno se genera explicación y quiz
 * con el modelo REAL y se validan aserciones programáticas sobre el contrato:
 * estructura, número de preguntas, distribución de correct_index, longitud e idioma.
 *
 * Uso: npm run eval  (requiere Ollama en marcha; ~2-5 min según el modelo)
 * Salida: informe por consola + docs/evals.md
 */

import { writeFileSync } from 'node:fs'
import { OllamaProvider } from '../src/infrastructure/ai/providers/OllamaProvider.js'

const BASE_URL = process.env.VITE_AI_BASE_URL || 'http://localhost:11434'
const MODEL = process.env.VITE_AI_MODEL || 'gpt-oss:120b-cloud'

// Golden dataset: casos deterministas para la heurística de idioma (es/en)
const GOLDEN_DATASET = [
  { concept: 'fotosíntesis', lang: 'es' },
  { concept: 'la revolución francesa', lang: 'es' },
  { concept: 'el sistema solar', lang: 'es' },
  { concept: 'teoría de la relatividad', lang: 'es' },
  { concept: 'photosynthesis', lang: 'en' },
  { concept: 'black holes', lang: 'en' },
  { concept: 'supply and demand', lang: 'en' },
  { concept: 'quantum entanglement', lang: 'en' },
]

const LEVEL_TO_TEST = 1 // Elemental: el más exigente en vocabulario

function wordCount(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length
}

/** Heurística de idioma del CONTENIDO generado (no del concepto). */
function looksSpanish(text) {
  const t = ` ${(text || '').toLowerCase()} `
  const es = [' el ', ' la ', ' de ', ' que ', ' los ', ' una ', ' es ', ' y ', ' en ']
  const en = [' the ', ' of ', ' and ', ' is ', ' to ', ' a ', ' it ']
  const esHits = es.reduce((n, w) => n + t.split(w).length - 1, 0)
  const enHits = en.reduce((n, w) => n + t.split(w).length - 1, 0)
  return esHits > enHits
}

function checkExplanation(explanation, expectedLang) {
  const checks = []
  const words = wordCount(explanation)
  checks.push({ name: 'explicación presente', pass: Boolean(explanation) })
  checks.push({ name: `longitud 60-200 palabras (${words})`, pass: words >= 60 && words <= 200 })
  const isSpanish = looksSpanish(explanation)
  checks.push({
    name: `idioma ${expectedLang}`,
    pass: expectedLang === 'es' ? isSpanish : !isSpanish,
  })
  return checks
}

function checkQuiz(questions, expectedLang) {
  const checks = []
  checks.push({ name: '5 preguntas', pass: Array.isArray(questions) && questions.length === 5 })
  if (!Array.isArray(questions) || questions.length === 0) return checks

  const allText = questions.map((q) => `${q.question} ${(q.options || []).join(' ')}`).join(' ')
  const indices = questions.map((q) => q.correct_index ?? q.correctIndex)
  const ids = new Set(questions.map((q) => q.id))

  checks.push({
    name: '4 opciones por pregunta',
    pass: questions.every((q) => Array.isArray(q.options) && q.options.length === 4),
  })
  checks.push({
    name: 'correct_index válido (0-3)',
    pass: indices.every((i) => Number.isInteger(i) && i >= 0 && i <= 3),
  })
  checks.push({
    name: `correct_index distribuido (${[...new Set(indices)].length} valores distintos)`,
    pass: new Set(indices).size >= 2,
  })
  checks.push({ name: 'ids únicos', pass: ids.size === questions.length })
  checks.push({
    name: 'explicación por pregunta',
    pass: questions.every((q) => Boolean(q.explanation)),
  })
  const isSpanish = looksSpanish(allText)
  checks.push({
    name: `idioma del quiz ${expectedLang}`,
    pass: expectedLang === 'es' ? isSpanish : !isSpanish,
  })
  return checks
}

async function main() {
  // Fail-fast si Ollama no está disponible
  try {
    await fetch(`${BASE_URL}/api/tags`)
  } catch {
    console.error(`✗ Ollama no responde en ${BASE_URL}. Arranca Ollama y reintenta.`)
    process.exit(2)
  }

  const provider = new OllamaProvider({ baseUrl: BASE_URL, model: MODEL })
  const results = []
  let failures = 0

  console.log(
    `Evaluando ${GOLDEN_DATASET.length} conceptos contra ${MODEL} (nivel ${LEVEL_TO_TEST})…\n`,
  )

  for (const { concept, lang } of GOLDEN_DATASET) {
    const started = Date.now()
    let checks = []
    let error = null
    try {
      const { explanation } = await provider.generateExplanation(concept, LEVEL_TO_TEST)
      checks.push(...checkExplanation(explanation, lang))
      const { questions } = await provider.generateQuiz(concept, LEVEL_TO_TEST, explanation)
      checks.push(...checkQuiz(questions, lang))
    } catch (err) {
      error = err.message
    }
    const seconds = ((Date.now() - started) / 1000).toFixed(1)
    const failed = error ? 1 : checks.filter((c) => !c.pass).length
    failures += failed

    const status = error ? '✗ ERROR' : failed === 0 ? '✓' : `✗ ${failed} fallos`
    console.log(`${status}  ${concept} (${seconds}s)`)
    for (const c of checks.filter((x) => !x.pass)) console.log(`     ✗ ${c.name}`)
    if (error) console.log(`     ✗ ${error}`)

    results.push({ concept, lang, seconds, checks, error })
  }

  const total = results.reduce((n, r) => n + r.checks.length, 0)
  const passed = results.reduce((n, r) => n + r.checks.filter((c) => c.pass).length, 0)
  console.log(`\nResultado: ${passed}/${total} checks OK, ${failures} fallos`)

  const lines = [
    '# Evals de contenido — DeepLearn',
    '',
    `> **Ejecutado:** ${new Date().toISOString()}`,
    `> **Modelo:** ${MODEL} · **Nivel evaluado:** ${LEVEL_TO_TEST} (Elemental)`,
    `> **Resultado:** ${passed}/${total} checks OK`,
    '',
    '| Concepto | Idioma | Checks | Fallos | Duración |',
    '|----------|--------|--------|--------|----------|',
    ...results.map((r) => {
      const failed = r.error ? '1 (error)' : String(r.checks.filter((c) => !c.pass).length)
      return `| ${r.concept} | ${r.lang} | ${r.checks.filter((c) => c.pass).length}/${r.checks.length} | ${failed} | ${r.seconds}s |`
    }),
    '',
    '## Fallos detectados',
    '',
    ...results.flatMap((r) => {
      const failedChecks = r.checks.filter((c) => !c.pass)
      if (!failedChecks.length && !r.error) return []
      return [
        `### ${r.concept}`,
        ...(r.error ? [`- ERROR: ${r.error}`] : failedChecks.map((c) => `- ${c.name}`)),
        '',
      ]
    }),
    failures === 0 ? '_Sin fallos._' : '',
    '',
    '## Metodología',
    '',
    'Golden dataset de 8 conceptos (4 es / 4 en). Por concepto se genera explicación y quiz',
    'del nivel Elemental con el modelo real y se validan: estructura del contrato JSON,',
    '5 preguntas × 4 opciones, `correct_index` válido y distribuido, ids únicos, explicación',
    'por pregunta, longitud de la explicación (60-200 palabras) e idioma del contenido.',
    '',
  ]
  writeFileSync(new URL('../docs/evals.md', import.meta.url), lines.join('\n'))
  console.log('Informe escrito en docs/evals.md')

  process.exit(failures > 0 ? 1 : 0)
}

main()
