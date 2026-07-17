/**
 * eval — Evaluación de calidad del contenido generado por el modelo (LLMOps, Módulo 7).
 *
 * Golden dataset de conceptos fijos; se genera contenido con el modelo REAL y se
 * validan aserciones programáticas sobre el contrato en 4 suites:
 *   A) Explicación + quiz del nivel 1 (Elemental) — 8 conceptos (4 es / 4 en)
 *   B) Explicación + quiz del nivel 5 (Experto) — 4 conceptos + contraste entre niveles
 *   C) Re-explicación tras fallo — 2 conceptos con áreas débiles simuladas
 *   D) Tarjetas SRS — 2 conceptos
 *
 * Uso: npm run eval  (requiere Ollama en marcha; ~5-15 min según el modelo)
 * Salida: informe por consola + docs/evals.md
 *
 * IMPORTANTE: es una herramienta MANUAL y NO DETERMINISTA. Se ejecuta bajo
 * demanda contra un modelo generativo real, por lo que el contenido —y por tanto
 * el número exacto de checks— puede variar entre ejecuciones. Por eso NO forma
 * parte del CI (evitar un gate inestable); su resultado es orientativo, no una
 * garantía reproducible al 100%. Las cotas de longitud llevan margen por nivel.
 */

import { writeFileSync } from 'node:fs'
import { OllamaProvider } from '../src/infrastructure/ai/providers/OllamaProvider.js'

const BASE_URL = process.env.VITE_AI_BASE_URL || 'http://localhost:11434'
const MODEL = process.env.VITE_AI_MODEL || 'gpt-oss:120b-cloud'

// Golden dataset: casos deterministas para la heurística de idioma (es/en)
const LEVEL1_DATASET = [
  { concept: 'fotosíntesis', lang: 'es' },
  { concept: 'la revolución francesa', lang: 'es' },
  { concept: 'el sistema solar', lang: 'es' },
  { concept: 'teoría de la relatividad', lang: 'es' },
  { concept: 'photosynthesis', lang: 'en' },
  { concept: 'black holes', lang: 'en' },
  { concept: 'supply and demand', lang: 'en' },
  { concept: 'quantum entanglement', lang: 'en' },
]

const LEVEL5_DATASET = [
  { concept: 'fotosíntesis', lang: 'es' },
  { concept: 'la revolución francesa', lang: 'es' },
  { concept: 'black holes', lang: 'en' },
  { concept: 'quantum entanglement', lang: 'en' },
]

const REEXPLAIN_DATASET = [
  {
    concept: 'fotosíntesis',
    lang: 'es',
    weakAreas: [
      { question: '¿Qué gas liberan las plantas durante la fotosíntesis?' },
      { question: '¿Dónde ocurre la fotosíntesis dentro de la célula?' },
    ],
  },
  {
    concept: 'black holes',
    lang: 'en',
    weakAreas: [{ question: 'What happens at the event horizon of a black hole?' }],
  },
]

const SRS_DATASET = [
  { concept: 'el sistema solar', lang: 'es' },
  { concept: 'supply and demand', lang: 'en' },
]

/* ------------------------------ helpers ------------------------------ */

function wordCount(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length
}

function avgSentenceLength(text) {
  const sentences = (text || '').split(/[.!?]+/).filter((s) => s.trim().length > 0)
  if (!sentences.length) return 0
  return wordCount(text) / sentences.length
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

function langCheck(name, text, expectedLang) {
  const isSpanish = looksSpanish(text)
  return {
    name: `${name}: idioma ${expectedLang}`,
    pass: expectedLang === 'es' ? isSpanish : !isSpanish,
  }
}

function checkExplanation(explanation, expectedLang, { min = 60, max = 200 } = {}) {
  const words = wordCount(explanation)
  return [
    { name: 'explicación presente', pass: Boolean(explanation) },
    { name: `longitud ${min}-${max} palabras (${words})`, pass: words >= min && words <= max },
    langCheck('explicación', explanation, expectedLang),
  ]
}

function checkQuiz(questions, expectedLang) {
  const checks = [{ name: '5 preguntas', pass: Array.isArray(questions) && questions.length === 5 }]
  if (!Array.isArray(questions) || questions.length === 0) return checks

  const indices = questions.map((q) => q.correct_index ?? q.correctIndex)
  const texts = questions.map((q) => (q.question || q.text || '').trim().toLowerCase())
  const allText = questions.map((q) => `${q.question} ${(q.options || []).join(' ')}`).join(' ')

  checks.push(
    {
      name: '4 opciones por pregunta',
      pass: questions.every((q) => Array.isArray(q.options) && q.options.length === 4),
    },
    {
      name: 'opciones únicas dentro de cada pregunta',
      pass: questions.every(
        (q) =>
          new Set((q.options || []).map((o) => String(o).trim())).size === (q.options || []).length,
      ),
    },
    {
      name: 'preguntas no repetidas',
      pass: new Set(texts).size === texts.length,
    },
    {
      name: 'correct_index válido (0-3)',
      pass: indices.every((i) => Number.isInteger(i) && i >= 0 && i <= 3),
    },
    {
      name: `correct_index distribuido (${new Set(indices).size} valores distintos)`,
      pass: new Set(indices).size >= 2,
    },
    {
      name: 'ids únicos',
      pass: new Set(questions.map((q) => q.id)).size === questions.length,
    },
    {
      name: 'explicación por pregunta',
      pass: questions.every((q) => Boolean(q.explanation)),
    },
    langCheck('quiz', allText, expectedLang),
  )
  return checks
}

function checkCards(cards, expectedLang) {
  const checks = [{ name: '5 tarjetas', pass: Array.isArray(cards) && cards.length === 5 }]
  if (!Array.isArray(cards) || cards.length === 0) return checks
  const allText = cards.map((c) => `${c.front} ${c.back}`).join(' ')
  checks.push(
    { name: 'front y back presentes', pass: cards.every((c) => c.front && c.back) },
    {
      name: 'front ≤ 25 palabras',
      pass: cards.every((c) => wordCount(c.front) <= 25),
    },
    {
      name: 'back ≤ 60 palabras',
      pass: cards.every((c) => wordCount(c.back) <= 60),
    },
    langCheck('tarjetas', allText, expectedLang),
  )
  return checks
}

/* ------------------------------ runner ------------------------------ */

const results = []
let provider

async function runCase(suite, label, fn) {
  const started = Date.now()
  let checks = []
  let info = []
  let error = null
  try {
    ;({ checks = [], info = [] } = await fn())
  } catch (err) {
    error = err.message
  }
  const seconds = ((Date.now() - started) / 1000).toFixed(1)
  const failed = error ? 1 : checks.filter((c) => !c.pass).length

  const status = error ? '✗ ERROR' : failed === 0 ? '✓' : `✗ ${failed} fallos`
  console.log(`${status}  [${suite}] ${label} (${seconds}s)`)
  for (const c of checks.filter((x) => !x.pass)) console.log(`     ✗ ${c.name}`)
  for (const i of info) console.log(`     ℹ ${i}`)
  if (error) console.log(`     ✗ ${error}`)

  results.push({ suite, label, seconds, checks, info, error })
}

async function main() {
  try {
    await fetch(`${BASE_URL}/api/tags`)
  } catch {
    console.error(`✗ Ollama no responde en ${BASE_URL}. Arranca Ollama y reintenta.`)
    process.exit(2)
  }

  provider = new OllamaProvider({ baseUrl: BASE_URL, model: MODEL })
  const level1Explanations = new Map()

  console.log(`Evaluando contra ${MODEL}…\n`)

  console.log('— Suite A: explicación + quiz, nivel 1 (Elemental)')
  for (const { concept, lang } of LEVEL1_DATASET) {
    await runCase('A·nivel1', concept, async () => {
      const { explanation } = await provider.generateExplanation(concept, 1)
      level1Explanations.set(concept, explanation)
      const { questions } = await provider.generateQuiz(concept, 1, explanation)
      return { checks: [...checkExplanation(explanation, lang), ...checkQuiz(questions, lang)] }
    })
  }

  console.log('\n— Suite B: explicación + quiz, nivel 5 (Experto) + contraste de niveles')
  for (const { concept, lang } of LEVEL5_DATASET) {
    await runCase('B·nivel5', concept, async () => {
      const { explanation } = await provider.generateExplanation(concept, 5)
      const { questions } = await provider.generateQuiz(concept, 5, explanation)
      // Nivel Experto: las explicaciones son legítimamente más largas y densas,
      // así que la cota superior es mayor que en el nivel Elemental (Suite A).
      const checks = [
        ...checkExplanation(explanation, lang, { min: 80, max: 260 }),
        ...checkQuiz(questions, lang),
      ]
      const info = []
      const l1 = level1Explanations.get(concept)
      if (l1) {
        checks.push({ name: 'explicación distinta a la del nivel 1', pass: explanation !== l1 })
        info.push(
          `complejidad (palabras/frase): nivel 1 = ${avgSentenceLength(l1).toFixed(1)}, nivel 5 = ${avgSentenceLength(explanation).toFixed(1)}`,
        )
      }
      return { checks, info }
    })
  }

  console.log('\n— Suite C: re-explicación tras fallo')
  for (const { concept, lang, weakAreas } of REEXPLAIN_DATASET) {
    await runCase('C·re-explicación', concept, async () => {
      const result = await provider.generateReExplanation(concept, 1, weakAreas)
      return {
        checks: [
          ...checkExplanation(result.explanation, lang, { min: 100, max: 300 }),
          ...checkQuiz(result.questions, lang),
        ],
      }
    })
  }

  console.log('\n— Suite D: tarjetas SRS')
  for (const { concept, lang } of SRS_DATASET) {
    await runCase('D·srs', concept, async () => {
      const { cards } = await provider.generateSRSCards(concept, 1, 'Elemental')
      return { checks: checkCards(cards, lang) }
    })
  }

  /* ------------------------------ informe ------------------------------ */

  const total = results.reduce((n, r) => n + r.checks.length, 0)
  const passed = results.reduce((n, r) => n + r.checks.filter((c) => c.pass).length, 0)
  const failures = results.reduce(
    (n, r) => n + (r.error ? 1 : r.checks.filter((c) => !c.pass).length),
    0,
  )
  console.log(`\nResultado: ${passed}/${total} checks OK, ${failures} fallos`)

  const lines = [
    '# Evals de contenido — DeepLearn',
    '',
    `> **Ejecutado:** ${new Date().toISOString()}`,
    `> **Modelo:** ${MODEL}`,
    `> **Resultado:** ${passed}/${total} checks OK · ${failures} fallos`,
    '',
    '> ⚠️ **Herramienta manual y no determinista.** Se ejecuta bajo demanda contra',
    '> un modelo generativo real; el contenido y el recuento de checks pueden variar',
    '> entre ejecuciones. No forma parte del CI (evita un gate inestable); su',
    '> resultado es orientativo, no una garantía reproducible al 100%.',
    '',
    '| Suite | Caso | Checks OK | Fallos | Duración |',
    '|-------|------|-----------|--------|----------|',
    ...results.map((r) => {
      const failed = r.error ? '1 (error)' : String(r.checks.filter((c) => !c.pass).length)
      return `| ${r.suite} | ${r.label} | ${r.checks.filter((c) => c.pass).length}/${r.checks.length} | ${failed} | ${r.seconds}s |`
    }),
    '',
    '## Fallos detectados',
    '',
    ...results.flatMap((r) => {
      const failedChecks = r.checks.filter((c) => !c.pass)
      if (!failedChecks.length && !r.error) return []
      return [
        `### [${r.suite}] ${r.label}`,
        ...(r.error ? [`- ERROR: ${r.error}`] : failedChecks.map((c) => `- ${c.name}`)),
        '',
      ]
    }),
    failures === 0 ? '_Sin fallos._' : '',
    '',
    '## Observaciones (no bloqueantes)',
    '',
    ...results.flatMap((r) => r.info.map((i) => `- [${r.suite}] ${r.label}: ${i}`)),
    '',
    '## Metodología',
    '',
    'Cuatro suites contra el modelo real: (A) explicación + quiz del nivel Elemental para 8',
    'conceptos (4 es / 4 en); (B) nivel Experto para 4 conceptos, verificando además que la',
    'explicación difiere de la elemental y midiendo complejidad por frase; (C) re-explicación',
    'con áreas débiles simuladas; (D) tarjetas SRS. Checks por caso: contrato JSON, 5 preguntas',
    'no repetidas × 4 opciones únicas, `correct_index` válido y distribuido, ids únicos,',
    'explicación por pregunta, longitudes acotadas e idioma del contenido generado.',
    '',
  ]
  writeFileSync(new URL('../docs/evals.md', import.meta.url), lines.join('\n'))
  console.log('Informe escrito en docs/evals.md')

  process.exit(failures > 0 ? 1 : 0)
}

main()
