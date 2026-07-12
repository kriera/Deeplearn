import { useState, useCallback } from 'react'
import { SubmitQuiz } from '../../application/use-cases/SubmitQuiz.js'
import { LocalStorageSessionRepository } from '../../infrastructure/storage/repositories/LocalStorageSessionRepository.js'

const repo = new LocalStorageSessionRepository()

export function useQuiz() {
  const [quizResult, setQuizResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submitQuiz = useCallback(async (session, answers) => {
    setSubmitting(true)
    try {
      const result = await SubmitQuiz.execute(session, answers, repo)
      setQuizResult(result)
      return result
    } finally {
      setSubmitting(false)
    }
  }, [])

  const clearQuizResult = useCallback(() => {
    setQuizResult(null)
  }, [])

  return { quizResult, submitting, submitQuiz, clearQuizResult }
}
