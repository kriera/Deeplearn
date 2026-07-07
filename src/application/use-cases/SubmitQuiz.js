/**
 * SubmitQuiz — Caso de uso: procesar las respuestas de un quiz.
 *
 * Clean Architecture (Módulo 2): Capa de aplicación, orquesta usando puertos.
 * SRP (Módulo 1): Única responsabilidad: evaluar respuestas y decidir pass/fail.
 * TDD (Módulo 6): Tests escritos antes de la implementación.
 */

import { Session } from '../../domain/entities/Session.js'

const PASS_THRESHOLD = 4

function buildAnswerReview(questions, answers) {
  return questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id)
    const selectedIndex = answer?.selectedIndex ?? null
    const correct = selectedIndex === q.correctIndex
    return {
      questionId: q.id,
      question: q.text,
      selectedIndex,
      selectedAnswer: Number.isInteger(selectedIndex) ? q.options[selectedIndex] : '',
      correctIndex: q.correctIndex,
      correctAnswer: q.options[q.correctIndex],
      explanation: q.explanation,
      correct,
    }
  })
}

function findWeakAreas(answerReview) {
  return answerReview
    .filter((a) => !a.correct)
    .map((a) => ({
      questionId: a.questionId,
      question: a.question,
      correctAnswer: a.correctAnswer,
      explanation: a.explanation,
    }))
}

const SubmitQuiz = {
  async execute(session, answers, sessionRepository) {
    const level = session.levels[session.currentLevelIndex]
    if (!level.questions || level.questions.length === 0) {
      throw new Error('No questions loaded for this level')
    }

    const answerReview = buildAnswerReview(level.questions, answers)
    const score = answerReview.filter((a) => a.correct).length
    const total = answerReview.length
    const passed = score >= PASS_THRESHOLD
    const weakAreas = findWeakAreas(answerReview)

    const attempt = {
      level: level.number,
      score,
      total,
      passed,
      timestamp: new Date().toISOString(),
      weakAreas,
    }

    let updated = Session.recordAttempt(session, attempt)

    let unlockedNextLevel = false
    if (passed) {
      updated = Session.unlockNextLevel(updated)
      unlockedNextLevel = updated.levelsUnlocked > session.levelsUnlocked
    }

    await sessionRepository.save(updated)

    return {
      passed,
      score,
      total,
      answerReview,
      weakAreas,
      unlockedNextLevel,
      session: updated,
    }
  },
}

export { SubmitQuiz }
