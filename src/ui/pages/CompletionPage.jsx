import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../atoms/Button.jsx'

export function CompletionPage({ session, onGoToEntry, onRestart, dueCards, onOpenSrs }) {
  const [postScore, setPostScore] = useState(session?.evaluation?.postScore || 4)
  const [feedback, setFeedback] = useState(session?.evaluation?.feedback || '')

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <p className="text-slate-400 mb-4">No se encontró ninguna sesión completada.</p>
        <Button variant="secondary" onClick={onGoToEntry}>
          Volver al inicio
        </Button>
      </div>
    )
  }

  const attempts = session.attempts || []
  const passedAttempts = attempts.filter((a) => a.passed).length
  const avgScore = attempts.length
    ? Math.round((attempts.reduce((sum, a) => sum + a.score, 0) / (attempts.length * 5)) * 100)
    : 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 sm:p-10 text-center"
      >
        <div className="text-6xl mb-5">🏆</div>
        <p className="text-teal-400 text-sm font-semibold uppercase tracking-wider mb-3">
          ¡Dominio experto alcanzado!
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 capitalize">
          {session.concept}
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto leading-relaxed mb-8">
          Has completado los cinco niveles Feynman. Sigue repasando tus tarjetas para convertir la comprensión a corto plazo en memoria a largo plazo.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8" aria-live="polite" aria-label="Completion statistics">
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-4">
            <p className="text-2xl font-bold text-white">5/5</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Niveles desbloqueados</p>
          </div>
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-4">
            <p className="text-2xl font-bold text-white">{passedAttempts}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Pruebas aprobadas</p>
          </div>
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-4">
            <p className="text-2xl font-bold text-white">{avgScore}%</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Puntuación media</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-800/50 p-5 text-left mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Evaluación del aprendizaje</h2>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Después de completar este concepto, ¿qué tal lo entiendes?
          </label>
          <div className="flex items-center gap-3 mb-4">
            <input
              type="range"
              min="1"
              max="5"
              value={postScore}
              onChange={(e) => setPostScore(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-10 text-center rounded-xl bg-slate-700 py-1 text-sm font-bold text-white">
              {postScore}/5
            </span>
          </div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Feedback opcional</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            className="w-full rounded-2xl border border-slate-600 bg-slate-900/60 p-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
            placeholder="¿Qué te ayudó a aprender? ¿Qué te resultó confuso?"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onGoToEntry}>Aprender otro concepto</Button>
          <Button variant="secondary" onClick={onRestart}>
            Reiniciar este concepto
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
