import { motion } from 'framer-motion'
import { Badge } from '../atoms/Badge.jsx'
import { ProgressBar } from '../atoms/ProgressBar.jsx'
import { Button } from '../atoms/Button.jsx'
import { BackButton } from '../atoms/BackButton.jsx'
import { SkeletonCard } from '../atoms/SkeletonCard.jsx'
import { levelLabel } from '../i18n/levelLabels.js'

export function LevelPage({ session, levelIndex, onGoToQuiz, onGoToEntry, onRetry, regenerating }) {
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <p className="text-slate-300 mb-4">Empieza eligiendo un concepto que quieras dominar.</p>
        <Button variant="primary" onClick={onGoToEntry}>
          Elegir concepto
        </Button>
      </div>
    )
  }

  const level = session.levels[levelIndex]
  if (!level) return null

  const label = levelLabel(level.number)
  const isLocked = levelIndex >= session.levelsUnlocked
  const hasError = level.status === 'error' && !level.explanation
  const isGenerating = !hasError && !level.explanation
  // La explicación llega antes que el quiz (generación progresiva):
  const quizReady = level.questions?.length > 0
  const quizFailed = level.status === 'error' && Boolean(level.explanation) && !quizReady

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <BackButton onClick={onGoToEntry} />
        <p
          className="text-slate-400 text-sm font-medium capitalize truncate max-w-[60%]"
          title={session.concept}
        >
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
          Nivel {level.number} de 5 — {label}
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Explicación {label.toLowerCase()}
        </h2>
        <p className="text-slate-400 text-sm">
          Lee la explicación y responde el quiz de 5 preguntas para desbloquear el siguiente nivel.
        </p>
      </motion.div>

      <div className="glass rounded-3xl p-6 sm:p-8 mb-8">
        {level.explanation ? (
          <div aria-live="polite" aria-label={`Explicación del nivel ${level.number}`}>
            <p className="text-slate-200 text-base leading-relaxed whitespace-pre-line">
              {level.explanation}
            </p>
          </div>
        ) : hasError ? (
          <div role="alert" className="text-center py-4">
            <p className="text-slate-200 font-medium mb-2">No pudimos generar esta explicación.</p>
            <p className="text-slate-400 text-sm mb-5">
              Comprueba que Ollama esté en ejecución y vuelve a intentarlo.
            </p>
            <Button
              variant="secondary"
              onClick={() => onRetry?.(levelIndex)}
              loading={regenerating}
              disabled={regenerating}
            >
              {regenerating ? 'Generando…' : 'Reintentar generación'}
            </Button>
          </div>
        ) : (
          <div aria-busy="true">
            <SkeletonCard variant="paragraph" />
            <p className="text-slate-400 text-sm mt-4 text-center">
              Generando la explicación… puede tardar hasta un minuto.
            </p>
          </div>
        )}
      </div>

      {!isLocked && !hasError && quizFailed && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-center"
        >
          <p className="text-slate-200 font-medium mb-2">
            No pudimos generar el quiz de este nivel.
          </p>
          <p className="text-slate-400 text-sm mb-4">
            Comprueba que Ollama esté en ejecución y vuelve a intentarlo.
          </p>
          <Button
            variant="secondary"
            onClick={() => onRetry?.(levelIndex)}
            loading={regenerating}
            disabled={regenerating}
          >
            {regenerating ? 'Generando…' : 'Reintentar quiz'}
          </Button>
        </div>
      )}

      {!isLocked && !hasError && !quizFailed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="primary" onClick={onGoToQuiz} disabled={isGenerating || !quizReady}>
            {!isGenerating && !quizReady ? 'Preparando quiz…' : 'Responder quiz →'}
          </Button>
          <p className="text-center text-xs text-slate-400 mt-3">
            Necesitas 4/5 para desbloquear el siguiente nivel
          </p>
        </motion.div>
      )}

      {isLocked && (
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
          <p className="text-slate-400 text-sm">
            🔒 Completa los niveles anteriores para desbloquear este.
          </p>
        </div>
      )}
    </div>
  )
}
