/**
 * Question — Value Object inmutable que modela una pregunta de opción múltiple.
 *
 * SRP (Módulo 1): Única responsabilidad: validar y representar una pregunta.
 * Clean Architecture (Módulo 2): Entidad de dominio pura, sin dependencias externas.
 */

function seededShuffle(items, seed) {
  const shuffled = [...items]
  let state = seed
  for (let i = shuffled.length - 1; i > 0; i--) {
    state = (state * 1103515245 + 12345) & 0x7fffffff
    const swapIndex = state % (i + 1)
    ;[shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]]
  }
  return shuffled
}

function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const Question = {
  create({ id, text, options, correctIndex, explanation }) {
    if (!text || text.trim().length === 0) {
      throw new Error('Question text is required')
    }
    if (!Array.isArray(options) || options.length !== 4) {
      throw new Error('Question must have exactly 4 options')
    }
    if (options.some((o) => !o || o.trim().length === 0)) {
      throw new Error('All options must be non-empty strings')
    }
    const normalized = options.map((o) => o.trim().toLowerCase())
    if (new Set(normalized).size !== normalized.length) {
      throw new Error('Options must be unique')
    }
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 3) {
      throw new Error('correctIndex must be between 0 and 3')
    }
    if (!explanation || explanation.trim().length < 20) {
      throw new Error('Explanation must be at least 20 characters')
    }

    const trimmedOptions = options.map((o) => o.trim())
    const resolvedId = id || `q-${Date.now()}`
    const correctAnswer = trimmedOptions[correctIndex]
    const shuffled = seededShuffle(trimmedOptions, hashString(resolvedId))
    const newCorrectIndex = shuffled.indexOf(correctAnswer)

    return Object.freeze({
      id: resolvedId,
      text: text.trim(),
      options: shuffled,
      correctIndex: newCorrectIndex,
      explanation: explanation.trim(),
    })
  },
}

export { Question }
