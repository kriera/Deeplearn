import { lazy, Suspense, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from './ui/hooks/useSession.js'
import { useQuiz } from './ui/hooks/useQuiz.js'
import { useSrs } from './ui/hooks/useSrs.js'
import { ConceptEntryPage } from './ui/pages/ConceptEntryPage.jsx'
import { SkeletonCard } from './ui/atoms/SkeletonCard.jsx'

// Code-splitting (DT-007): solo la pantalla de entrada carga eager;
// el resto se descarga cuando el usuario navega hasta ella.
const LevelPage = lazy(() =>
  import('./ui/pages/LevelPage.jsx').then((m) => ({ default: m.LevelPage })),
)
const QuizPage = lazy(() =>
  import('./ui/pages/QuizPage.jsx').then((m) => ({ default: m.QuizPage })),
)
const CompletionPage = lazy(() =>
  import('./ui/pages/CompletionPage.jsx').then((m) => ({ default: m.CompletionPage })),
)
const SrsReviewPage = lazy(() =>
  import('./ui/pages/SrsReviewPage.jsx').then((m) => ({ default: m.SrsReviewPage })),
)

const TOTAL_LEVELS = 5

export default function App() {
  const {
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
  } = useSession()
  const { quizResult, submitting, error: quizError, submitQuiz, clearQuizResult } = useQuiz()
  const { dueCards, rememberCard, forgetCard, generateForLevel } = useSrs()
  const [screen, setScreen] = useState('entry')
  const [levelIndex, setLevelIndex] = useState(0)
  const [srsReturnScreen, setSrsReturnScreen] = useState('entry')

  const handleStart = async (concept) => {
    const result = await startSession(concept)
    if (result) {
      setLevelIndex(0)
      setScreen('level')
    }
  }

  const handleResume = async (sessionId) => {
    const session = await restoreSession(sessionId)
    if (session) {
      setLevelIndex(Math.min(session.levelsUnlocked - 1, TOTAL_LEVELS - 1))
      setScreen('level')
    }
  }

  const handleGoToQuiz = () => {
    clearQuizResult()
    setScreen('quiz')
  }

  const handleSubmitQuiz = async (session, answers) => {
    const result = await submitQuiz(session, answers, levelIndex)
    if (result?.passed) {
      const fresh = await refreshSession()
      // En segundo plano, sin bloquear el resultado del quiz: contenido del
      // siguiente nivel y tarjetas de repaso. Sus fallos no rompen el flujo
      // (el nivel queda marcado 'error' y ofrece reintentar).
      if (result.unlockedNextLevel && fresh) {
        generateLevel(fresh, levelIndex + 1)
      }
      generateForLevel(session, levelIndex + 1).catch(() => {})
    }
    return result
  }

  const handleOpenSrs = (from) => {
    setSrsReturnScreen(from)
    setScreen('srs')
  }

  const handleNextLevel = () => {
    const next = levelIndex + 1
    if (next >= TOTAL_LEVELS) {
      setScreen('complete')
    } else {
      setLevelIndex(next)
      setScreen('level')
    }
  }

  const handleGoToEntry = () => {
    goToEntry()
    setScreen('entry')
    setLevelIndex(0)
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-700 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        Saltar al contenido
      </a>
      <header
        className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl"
        role="banner"
      >
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={handleGoToEntry}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Ir al inicio"
          >
            <span className="text-xl" aria-hidden="true">
              🧠
            </span>
            <span className="font-bold text-white text-sm hidden sm:block">DeepLearn</span>
          </button>
          {currentSession && (
            <div className="flex items-center gap-2">
              <span
                className="text-xs text-slate-400 capitalize truncate max-w-[45vw] sm:max-w-xs"
                title={currentSession.concept}
              >
                {currentSession.concept}
              </span>
            </div>
          )}
        </div>
      </header>

      <main id="main-content" className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-3xl mx-auto px-4 py-8">
              <SkeletonCard variant="card" />
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-5xl mx-auto"
            >
              {screen === 'entry' && (
                <ConceptEntryPage
                  onStart={handleStart}
                  onResume={handleResume}
                  sessions={sessions}
                  loading={loading}
                  error={error}
                  dueCount={dueCards.length}
                  onOpenSrs={() => handleOpenSrs('entry')}
                />
              )}
              {screen === 'level' && (
                <LevelPage
                  session={currentSession}
                  levelIndex={levelIndex}
                  onGoToQuiz={handleGoToQuiz}
                  onGoToEntry={handleGoToEntry}
                  onRetry={regenerateLevel}
                  regenerating={regenerating}
                />
              )}
              {screen === 'quiz' && (
                <QuizPage
                  session={currentSession}
                  levelIndex={levelIndex}
                  onSubmitQuiz={handleSubmitQuiz}
                  quizResult={quizResult}
                  submitting={submitting}
                  submitError={quizError}
                  onBackToLevel={() => setScreen('level')}
                  onNextLevel={handleNextLevel}
                />
              )}
              {screen === 'complete' && (
                <CompletionPage
                  session={currentSession}
                  onGoToEntry={handleGoToEntry}
                  onSaveEvaluation={saveEvaluation}
                  dueCount={dueCards.length}
                  onOpenSrs={() => handleOpenSrs('complete')}
                  onRestart={() => {
                    setLevelIndex(0)
                    setScreen('level')
                  }}
                />
              )}
              {screen === 'srs' && (
                <SrsReviewPage
                  dueCards={dueCards}
                  onRemember={rememberCard}
                  onForget={forgetCard}
                  onBack={() => setScreen(srsReturnScreen)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>

      <footer className="border-t border-slate-800/50 py-4 text-center text-xs text-slate-400">
        DeepLearn · Motor de aprendizaje Feynman · Datos almacenados localmente
      </footer>
    </div>
  )
}
