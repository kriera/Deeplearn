import { motion } from 'framer-motion'
import { Badge } from '../atoms/Badge.jsx'
import { ProgressBar } from '../atoms/ProgressBar.jsx'
import { Button } from '../atoms/Button.jsx'
import { BackButton } from '../atoms/BackButton.jsx'

export function LevelPage({ session, levelIndex, onGoToQuiz, onGoToEntry }) {
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <p className="text-slate-400 mb-4">No hay sesión activa.</p>
        <Button variant="secondary" onClick={onGoToEntry}>
          ← Volver al inicio
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
          Lee la explicación y responde el quiz de 5 preguntas para desbloquear el siguiente nivel.
        </p>
      </motion.div>

      <div className="glass rounded-3xl p-6 sm:p-8 mb-8">
        {level.explanation ? (
          <div aria-live="polite" aria-label={`Level ${level.number} explanation`}>
            <p className="text-slate-200 text-base leading-relaxed whitespace-pre-line">
              {level.explanation}
            </p>
          </div>
        ) : (
          <div aria-busy="true" aria-label="Loading level content">
            <div className="shimmer h-32 rounded-xl" />
          </div>
        )}
      </div>

      {!isLocked && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="primary" onClick={onGoToQuiz}>
            Responder quiz →
          </Button>
          <p className="text-center text-xs text-slate-500 mt-3">
            Necesitas 4/5 para desbloquear el siguiente nivel
          </p>
        </motion.div>
      )}

      {isLocked && (
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
          <p className="text-slate-400 text-sm">🔒 Completa los niveles anteriores para desbloquear este.</p>
        </div>
      )}
    </div>
  )
}
