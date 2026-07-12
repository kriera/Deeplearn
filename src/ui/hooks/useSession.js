import { useState, useEffect, useCallback } from 'react'
import { StartSession } from '../../application/use-cases/StartSession.js'
import { LocalStorageSessionRepository } from '../../infrastructure/storage/repositories/LocalStorageSessionRepository.js'

const repo = new LocalStorageSessionRepository()

export function useSession() {
  const [currentSession, setCurrentSession] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    repo.findAll().then(setSessions)
  }, [])

  const startSession = useCallback(async (concept) => {
    setLoading(true)
    setError(null)
    try {
      const result = await StartSession.execute(concept, repo)
      setCurrentSession(result.session)
      const all = await repo.findAll()
      setSessions(all)
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

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
    error,
    startSession,
    restoreSession,
    refreshSession,
    goToEntry,
  }
}
