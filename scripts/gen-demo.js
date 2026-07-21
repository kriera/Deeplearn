import { writeFileSync } from 'node:fs'
import { OllamaProvider } from '../src/infrastructure/ai/providers/OllamaProvider.js'
import { Level } from '../src/domain/entities/Level.js'

const provider = new OllamaProvider({
  baseUrl: process.env.VITE_AI_BASE_URL || 'http://localhost:11434',
  model: process.env.VITE_AI_MODEL || 'gpt-oss:120b-cloud',
})

const CONCEPT = 'la fotosíntesis'
const STAMP = '2026-07-15T10:00:00.000Z'

const levels = []
for (let n = 1; n <= 5; n++) {
  process.stdout.write(`nivel ${n}: explicación… `)
  const { explanation } = await provider.generateExplanation(CONCEPT, n)
  process.stdout.write(`quiz… `)
  const { questions } = await provider.generateQuiz(CONCEPT, n, explanation)
  levels.push({ number: n, status: 'ready', explanation, questions, generationError: null })
  console.log(`ok (${explanation.split(/\s+/).length} palabras, ${questions.length} preguntas)`)
  for (const q of questions) {
    const opt = q.options?.[q.correct_index]
    if (opt === undefined) {
      console.warn(`  ⚠ ${q.id}: correct_index ${q.correct_index} fuera de rango`)
    } else {
      // El índice puede ser plausible pero incorrecto: revisa contra la explicación.
      console.warn(`  ⟳ REVISAR ${q.id}: correcta=[${q.correct_index}] "${opt}"`)
    }
  }
}

process.stdout.write('tarjetas SRS (nivel 1)… ')
const label = Level.create(1).label
const { cards } = await provider.generateSRSCards(CONCEPT, 1, label)
const DEMO_CARDS = (cards || [])
  .filter((c) => c && c.front && c.back)
  .map((c, i) => ({
    id: `demo-fotosintesis-l1c${i + 1}`,
    concept: CONCEPT,
    levelLabel: label,
    front: c.front,
    back: c.back,
    interval: 1,
    ease: 2.5,
    nextReview: STAMP,
    createdAt: STAMP,
    lastReviewed: null,
    reviews: 0,
    remembered: 0,
    forgotten: 0,
  }))
console.log(`ok (${DEMO_CARDS.length} tarjetas)`)

const DEMO_SESSION = {
  id: 'demo-fotosintesis',
  concept: CONCEPT,
  normalizedConcept: 'la fotosíntesis',
  createdAt: STAMP,
  levelsUnlocked: 5,
  currentLevelIndex: 0,
  levels,
  attempts: [],
  evaluation: {
    preScore: null,
    postScore: null,
    feedback: '',
    startedAt: STAMP,
    completedAt: null,
  },
}

const banner = `/**
 * demoData — Sesión de ejemplo con contenido REAL generado por Ollama
 * (gpt-oss:120b-cloud). Permite explorar la app desplegada SIN Ollama instalado
 * (modo demo, ADR-005): los 5 niveles ya están generados y desbloqueados, así que
 * la navegación no dispara ninguna llamada al modelo.
 *
 * Base auto-generada con scripts/gen-demo. AVISO: el modelo suele colocar mal
 * \`correct_index\` (contradice su propia \`explanation\`). Revisa a mano cada
 * correct_index antes de dar por buena la salida — la última versión se curó así.
 */
`
const out = `${banner}
export const DEMO_SESSION = ${JSON.stringify(DEMO_SESSION, null, 2)}

export const DEMO_CARDS = ${JSON.stringify(DEMO_CARDS, null, 2)}
`
writeFileSync(new URL('../src/composition/demoData.js', import.meta.url), out)
console.log('→ src/composition/demoData.js escrito')
