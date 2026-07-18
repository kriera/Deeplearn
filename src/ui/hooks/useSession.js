import { useState, useEffect, useCallback, useRef } from 'react'
import { StartSession } from '../../application/use-cases/StartSession.js'
import { GenerateLevelContent } from '../../application/use-cases/GenerateLevelContent.js'
import { Session } from '../../domain/entities/Session.js'
import { sessionRepository as repo, aiProvider } from '../../composition/container.js'
import { toUserMessage } from '../i18n/errorMessages.js'

const TOTAL_LEVELS = 5

function levelNeedsContent(level) {
  if (!level) return false
  if (level.status === 'error') return false
  return !level.explanation || level.questions.length === 0
}

export function useSession() {
  const [currentSession, setCurrentSession] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState(null)
  // Generaciones en vuelo (`${sessionId}:${levelIndex}`) para no lanzar dos
  // veces la misma llamada al modelo desde distintos puntos de la UI.
  const inFlight = useRef(new Set())

  useEffect(() => {
    repo.findAll().then(setSessions)
  }, [])

  // Solo aplica la actualización si esa sesión sigue siendo la visible:
  // una generación en segundo plano no debe pisar otra sesión restaurada.
  const applyIfCurrent = useCallback((updated) => {
    setCurrentSession((prev) => (prev?.id === updated.id ? updated : prev))
  }, [])

  /**
   * Genera el contenido de un nivel actualizando la UI progresivamente:
   * la explicación se muestra en cuanto llega y el quiz se completa después.
   * Puede lanzarse sin await (segundo plano); los errores marcan el nivel
   * como 'error' y la página del nivel ofrece reintentar.
   */
  const generateLevel = useCallback(
    async (session, levelIndex) => {
      const key = `${session.id}:${levelIndex}`
      if (inFlight.current.has(key)) return null
      inFlight.current.add(key)
      let latest = session
      try {
        const updated = await GenerateLevelContent.execute(session, levelIndex, aiProvider, repo, {
          onExplanation: (partial) => {
            latest = partial
            applyIfCurrent(partial)
          },
        })
        applyIfCurrent(updated)
        return updated
      } catch (err) {
        const levels = latest.levels.map((l, i) =>
          i === levelIndex ? { ...l, status: 'error', generationError: err.message } : l,
        )
        const failed = { ...latest, levels }
        await repo.save(failed)
        applyIfCurrent(failed)
        return null
      } finally {
        inFlight.current.delete(key)
      }
    },
    [applyIfCurrent],
  )

  // Si al nivel actual le falta contenido (sesión nueva, interrumpida o
  // desbloqueada sin generar), lanza la generación en segundo plano.
  const ensureLevelContent = useCallback(
    (session) => {
      if (!session) return
      const levelIndex = Math.min(session.levelsUnlocked - 1, TOTAL_LEVELS - 1)
      if (levelNeedsContent(session.levels[levelIndex])) {
        generateLevel(session, levelIndex)
      }
    },
    [generateLevel],
  )

  const startSession = useCallback(
    async (concept) => {
      setLoading(true)
      setError(null)
      try {
        const result = await StartSession.execute(concept, repo)
        setCurrentSession(result.session)
        const all = await repo.findAll()
        setSessions(all)
        ensureLevelContent(result.session)
        return result
      } catch (err) {
        setError(toUserMessage(err))
        return null
      } finally {
        setLoading(false)
      }
    },
    [ensureLevelContent],
  )

  const regenerateLevel = useCallback(
    async (levelIndex) => {
      if (!currentSession) return null
      setRegenerating(true)
      setError(null)
      try {
        // Limpia el estado de error para que el reintento parta de 'pending'
        const levels = currentSession.levels.map((l, i) =>
          i === levelIndex ? { ...l, status: 'pending', generationError: null } : l,
        )
        return await generateLevel({ ...currentSession, levels }, levelIndex)
      } finally {
        setRegenerating(false)
      }
    },
    [currentSession, generateLevel],
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

  // Modo demo (ADR-005): carga una sesión de ejemplo pre-generada para explorar
  // la app sin Ollama instalado. Los 5 niveles ya están listos y desbloqueados,
  // así que no dispara ninguna generación. Import dinámico → se descarga solo al
  // pulsar el botón (code-splitting, DT-007).
  const loadDemoSession = useCallback(async () => {
    const { DEMO_SESSION } = await import('../../composition/demoData.js')
    await repo.save(DEMO_SESSION)
    setCurrentSession(DEMO_SESSION)
    setSessions(await repo.findAll())
    return DEMO_SESSION
  }, [])

  const restoreSession = useCallback(
    async (sessionId) => {
      const session = await repo.findById(sessionId)
      setCurrentSession(session)
      if (session) ensureLevelContent(session)
      return session
    },
    [ensureLevelContent],
  )

  const refreshSession = useCallback(async () => {
    if (!currentSession?.id) return null
    const updated = await repo.findById(currentSession.id)
    setCurrentSession(updated)
    return updated
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
    generateLevel,
    saveEvaluation,
    restoreSession,
    refreshSession,
    goToEntry,
    loadDemoSession,
  }
}
