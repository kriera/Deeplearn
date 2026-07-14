import { useState, useEffect, useCallback } from 'react'
import { StartSession } from '../../application/use-cases/StartSession.js'
import { GenerateLevelContent } from '../../application/use-cases/GenerateLevelContent.js'
import { Session } from '../../domain/entities/Session.js'
import { sessionRepository as repo, aiProvider } from '../../composition/container.js'
import { toUserMessage } from '../i18n/errorMessages.js'

export function useSession() {
  const [currentSession, setCurrentSession] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    repo.findAll().then(setSessions)
  }, [])

  const startSession = useCallback(async (concept) => {
    setLoading(true)
    setError(null)
    try {
      const result = await StartSession.execute(concept, repo, aiProvider)
      setCurrentSession(result.session)
      const all = await repo.findAll()
      setSessions(all)
      return result
    } catch (err) {
      setError(toUserMessage(err))
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const regenerateLevel = useCallback(
    async (levelIndex) => {
      if (!currentSession) return null
      setRegenerating(true)
      setError(null)
      try {
        const updated = await GenerateLevelContent.execute(
          currentSession,
          levelIndex,
          aiProvider,
          repo,
        )
        setCurrentSession(updated)
        return updated
      } catch (err) {
        const levels = currentSession.levels.map((l, i) =>
          i === levelIndex ? { ...l, status: 'error', generationError: err.message } : l,
        )
        const updated = { ...currentSession, levels }
        await repo.save(updated)
        setCurrentSession(updated)
        return null
      } finally {
        setRegenerating(false)
      }
    },
    [currentSession],
  )

  const saveEvaluation = useCallback(
    async ({ postScore, feedback }) => {
      if (!currentSession) return null
      const updated = Session.setEvaluation(currentSession, { postScore, feedback })
      await repo.save(updated)
      setCurrentSession(updated)
      return updated
    },
    [currentSession],
  )

  const restoreSession = useCallback(async (sessionId) => {
    const session = await repo.findById(sessionId)
    setCurrentSession(session)
    return session
  }, [])

  const refreshSession = useCallback(async () => {
    if (!currentSession?.id) return
    const updated = await repo.findById(currentSession.id)
    setCurrentSession(updated)
  }, [currentSession?.id])

  const goToEntry = useCallback(() => {
    setCurrentSession(null)
    setError(null)
  }, [])

  return {
    currentSession,
    sessions,
    loading,
    regenerating,
    error,
    startSession,
    regenerateLevel,
    saveEvaluation,
    restoreSession,
    refreshSession,
    goToEntry,
  }
}
