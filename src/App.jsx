import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from './ui/hooks/useSession.js'
import { useQuiz } from './ui/hooks/useQuiz.js'
import { ConceptEntryPage } from './ui/pages/ConceptEntryPage.jsx'
import { LevelPage } from './ui/pages/LevelPage.jsx'
import { QuizPage } from './ui/pages/QuizPage.jsx'
import { CompletionPage } from './ui/pages/CompletionPage.jsx'

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
    saveEvaluation,
    restoreSession,
    refreshSession,
    goToEntry,
  } = useSession()
  const { quizResult, submitting, error: quizError, submitQuiz, clearQuizResult } = useQuiz()
  const [screen, setScreen] = useState('entry')
  const [levelIndex, setLevelIndex] = useState(0)

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
      await refreshSession()
    }
    return result
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
              <span className="text-xs text-slate-400 capitalize truncate max-w-[120px]">
                {currentSession.concept}
              </span>
            </div>
          )}
        </div>
      </header>

      <main id="main-content" className="flex-1">
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
                onRestart={() => {
                  setLevelIndex(0)
                  setScreen('level')
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-800/50 py-4 text-center text-xs text-slate-400">
        DeepLearn · Motor de aprendizaje Feynman · Datos almacenados localmente
      </footer>
    </div>
  )
}
