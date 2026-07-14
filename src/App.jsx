import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from './ui/hooks/useSession.js'
import { useQuiz } from './ui/hooks/useQuiz.js'
import { useSrs } from './ui/hooks/useSrs.js'
import { ConceptEntryPage } from './ui/pages/ConceptEntryPage.jsx'
import { LevelPage } from './ui/pages/LevelPage.jsx'
import { QuizPage } from './ui/pages/QuizPage.jsx'
import { CompletionPage } from './ui/pages/CompletionPage.jsx'

const SCREENS = { entry: 'entry', level: 'level', quiz: 'quiz', complete: 'complete' }
const TOTAL_LEVELS = 5

export default function App() {
  const {
    currentSession,
    sessions,
    loading,
    error,
    startSession,
    restoreSession,
    refreshSession,
    goToEntry,
  } = useSession()
  const { quizResult, submitting, submitQuiz, clearQuizResult } = useQuiz()
  const { dueCards, rememberCard, forgetCard, addCards } = useSrs()
  const [screen, setScreen] = useState('entry')
  const [levelIndex, setLevelIndex] = useState(0)

  const handleStart = async (concept) => {
    const result = await startSession(concept)
    if (result) {
      setLevelIndex(0)
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

  const ScreenComponent = {
    entry: ConceptEntryPage,
    level: LevelPage,
    quiz: QuizPage,
    complete: CompletionPage,
  }[screen]

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-500 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        Skip to content
      </a>
      <header
        className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-xl"
        role="banner"
        aria-label="DeepLearn header"
      >
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={handleGoToEntry}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            aria-label="Go to home"
          >
            <span className="text-xl" aria-hidden="true">🧠</span>
            <span className="font-bold text-white text-sm hidden sm:block">DeepLearn</span>
          </button>
          {currentSession && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 capitalize truncate max-w-[120px]">
                {currentSession.concept}
              </span>
            </div>
          )}
        </div>
      </header>

      <main id="main-content" className="flex-1" aria-live="polite" aria-label="Main content">
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
              />
            )}
            {screen === 'quiz' && (
              <QuizPage
                session={currentSession}
                levelIndex={levelIndex}
                onSubmitQuiz={handleSubmitQuiz}
                quizResult={quizResult}
                submitting={submitting}
                onBackToLevel={() => setScreen('level')}
                onNextLevel={handleNextLevel}
              />
            )}
            {screen === 'complete' && (
              <CompletionPage
                session={currentSession}
                onGoToEntry={handleGoToEntry}
                onRestart={() => {
                  setLevelIndex(0)
                  setScreen('level')
                }}
                dueCards={dueCards}
                onOpenSrs={() => {}}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-800/50 py-4 text-center text-xs text-slate-600">
        DeepLearn · Motor de aprendizaje Feynman · Datos almacenados localmente
      </footer>
    </div>
  )
}
