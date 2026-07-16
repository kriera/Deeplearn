/**
 * SubmitQuiz — Caso de uso: procesar las respuestas de un quiz.
 *
 * Clean Architecture (Módulo 2): Capa de aplicación, orquesta usando puertos.
 * SRP (Módulo 1): Única responsabilidad: evaluar respuestas y decidir pass/fail.
 * DIP (Módulo 1): Depende de AiProvider (abstracción) para regenerar contenido.
 * TDD (Módulo 6): Tests escritos antes de la implementación.
 */

import { Session } from '../../domain/entities/Session.js'

const PASS_THRESHOLD = 4

function buildAnswerReview(questions, answers) {
  return questions.map((q) => {
    const answer = answers.find((a) => a.questionId === q.id)
    const selectedIndex = answer?.selectedIndex ?? null
    // Model may return correct_index (snake_case) or correctIndex (camelCase)
    const correctIdx = q.correctIndex ?? q.correct_index ?? -1
    const correct = selectedIndex === correctIdx
    return {
      questionId: q.id,
      question: q.question ?? q.text,
      selectedIndex,
      selectedAnswer: Number.isInteger(selectedIndex) ? q.options[selectedIndex] : '',
      correctIndex: correctIdx,
      correctAnswer: q.options[correctIdx],
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
  async execute(session, answers, levelIndex, sessionRepository, aiProvider) {
    const idx = levelIndex ?? session.currentLevelIndex
    const level = session.levels[idx]
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
    let reExplanation = null

    if (passed) {
      // El contenido del siguiente nivel se genera en segundo plano desde la
      // UI (GenerateLevelContent): el resultado del quiz no espera al modelo.
      updated = Session.unlockNextLevel(updated)
      unlockedNextLevel = updated.levelsUnlocked > session.levelsUnlocked
    } else if (aiProvider) {
      // Generate re-explanation for failed quiz
      try {
        const result = await aiProvider.generateReExplanation(
          session.concept,
          level.number,
          weakAreas,
        )
        reExplanation = result.explanation
      } catch {
        // Re-explanation is optional; don't block on failure
      }
    }

    await sessionRepository.save(updated)

    return {
      passed,
      score,
      total,
      answerReview,
      weakAreas,
      unlockedNextLevel,
      reExplanation,
      session: updated,
    }
  },
}

export { SubmitQuiz }
