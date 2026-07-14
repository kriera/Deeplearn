import { useState, useCallback } from 'react'
import { SubmitQuiz } from '../../application/use-cases/SubmitQuiz.js'
import { sessionRepository as repo, aiProvider } from '../../composition/container.js'
import { toUserMessage } from '../i18n/errorMessages.js'

export function useQuiz() {
  const [quizResult, setQuizResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const submitQuiz = useCallback(async (session, answers, levelIndex) => {
    setSubmitting(true)
    setError(null)
    try {
      const result = await SubmitQuiz.execute(session, answers, levelIndex, repo, aiProvider)
      setQuizResult(result)
      return result
    } catch (err) {
      setError(toUserMessage(err))
      return null
    } finally {
      setSubmitting(false)
    }
  }, [])

  const clearQuizResult = useCallback(() => {
    setQuizResult(null)
    setError(null)
  }, [])

  return { quizResult, submitting, error, submitQuiz, clearQuizResult }
}
