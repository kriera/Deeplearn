/**
 * Session — Aggregate Root que representa una sesión de aprendizaje completa.
 *
 * Clean Architecture (Módulo 2): Entidad de dominio pura.
 * SRP (Módulo 1): Única responsabilidad: gestionar el estado de una sesión.
 */

import { v4 as uuidv4 } from 'uuid'

function normalizeConcept(concept) {
  return concept
    .trim()
    .toLowerCase()
    .replace(/^what\s+is\s+/i, '')
    .trim()
}

function createLevel(number) {
  return Object.freeze({
    number,
    status: number === 1 ? 'pending' : 'locked', // 'locked' | 'pending' | 'generating' | 'ready' | 'error'
    explanation: '',
    questions: [],
    generationError: null,
  })
}

const Session = {
  create(concept) {
    const id = uuidv4()
    const now = new Date().toISOString()
    return Object.freeze({
      id,
      concept: concept.trim(),
      normalizedConcept: normalizeConcept(concept),
      createdAt: now,
      levelsUnlocked: 1,
      currentLevelIndex: 0,
      levels: [1, 2, 3, 4, 5].map(createLevel),
      attempts: [],
      evaluation: Object.freeze({
        preScore: null,
        postScore: null,
        feedback: '',
        startedAt: now,
        completedAt: null,
      }),
    })
  },

  unlockNextLevel(session) {
    const next = session.levelsUnlocked + 1
    if (next > 5) return session
    const levels = session.levels.map((l, i) => {
      if (i + 1 === next) {
        return Object.freeze({ ...l, status: 'pending' })
      }
      return l
    })
    return Object.freeze({
      ...session,
      levelsUnlocked: next,
      levels,
    })
  },

  recordAttempt(session, attempt) {
    return Object.freeze({
      ...session,
      attempts: [...session.attempts, Object.freeze(attempt)],
    })
  },

  setLevelContent(session, levelIndex, { explanation, questions }) {
    const levels = session.levels.map((l, i) => {
      if (i === levelIndex) {
        return Object.freeze({
          ...l,
          status: 'ready',
          explanation,
          questions,
        })
      }
      return l
    })
    return Object.freeze({ ...session, levels })
  },

  setEvaluation(session, { postScore, feedback }) {
    return Object.freeze({
      ...session,
      evaluation: Object.freeze({
        ...session.evaluation,
        postScore,
        feedback,
        completedAt: postScore !== null ? new Date().toISOString() : null,
      }),
    })
  },
}

export { Session }
