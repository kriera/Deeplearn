import { motion } from 'framer-motion'
import { Badge } from '../atoms/Badge.jsx'
import { ProgressBar } from '../atoms/ProgressBar.jsx'
import { Button } from '../atoms/Button.jsx'
import { BackButton } from '../atoms/BackButton.jsx'

export function LevelPage({ session, levelIndex, onGoToQuiz, onGoToEntry }) {
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <p className="text-slate-400 mb-4">No active session.</p>
        <Button variant="secondary" onClick={onGoToEntry}>
          ← Back to Home
        </Button>
      </div>
    )
  }

  const level = session.levels[levelIndex]
  if (!level) return null

  const isLocked = levelIndex >= session.levelsUnlocked

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <BackButton onClick={onGoToEntry} />
        <p className="text-slate-500 text-sm font-medium capitalize truncate max-w-[60%]">
          {session.concept}
        </p>
      </div>

      <div className="mb-10">
        <ProgressBar current={levelIndex + 1} total={5} />
      </div>

      <motion.div
        key={`header-${levelIndex}`}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 mb-6"
      >
        <Badge variant={levelIndex === 0 ? 'teal' : levelIndex === 4 ? 'purple' : 'amber'}>
          Level {level.number} — {level.label}
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">{level.label} Overview</h2>
        <p className="text-slate-400 text-sm">
          Read the explanation below, then take the 5-question quiz to unlock the next level.
        </p>
      </motion.div>

      <div className="glass rounded-3xl p-6 sm:p-8 mb-8">
        {level.explanation ? (
          <p className="text-slate-200 text-base leading-relaxed whitespace-pre-line">
            {level.explanation}
          </p>
        ) : (
          <div className="shimmer h-32 rounded-xl" />
        )}
      </div>

      {!isLocked && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="primary" onClick={onGoToQuiz}>
            Take the Quiz →
          </Button>
          <p className="text-center text-xs text-slate-500 mt-3">
            Score 4/5 or higher to unlock the next level
          </p>
        </motion.div>
      )}

      {isLocked && (
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
          <p className="text-slate-400 text-sm">🔒 Complete previous levels to unlock this one.</p>
        </div>
      )}
    </div>
  )
}
