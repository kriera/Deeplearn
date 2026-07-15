import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../atoms/Badge.jsx'
import { Button } from '../atoms/Button.jsx'
import { BackButton } from '../atoms/BackButton.jsx'

export function SrsReviewPage({ dueCards, onRemember, onForget, onBack }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [reviewed, setReviewed] = useState(0)

  // Siempre se repasa la primera vencida: al calificarla sale de dueCards
  const card = dueCards[0]

  const handleGrade = async (grade) => {
    setShowAnswer(false)
    setReviewed((n) => n + 1)
    await grade(card)
  }

  if (!card) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="text-5xl mb-4">{reviewed > 0 ? '🎉' : '🌱'}</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {reviewed > 0 ? '¡Repaso completado!' : 'No tienes tarjetas pendientes'}
        </h2>
        <p className="text-slate-400 mb-6 max-w-md">
          {reviewed > 0
            ? `Has repasado ${reviewed} ${reviewed === 1 ? 'tarjeta' : 'tarjetas'}. Volverán a aparecer cuando toque reforzarlas.`
            : 'Supera niveles de un concepto para generar tarjetas de repaso espaciado.'}
        </p>
        <Button variant="primary" onClick={onBack}>
          Volver
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <BackButton onClick={onBack} label="Volver" />
        <Badge variant="teal">
          {dueCards.length} {dueCards.length === 1 ? 'pendiente' : 'pendientes'}
        </Badge>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Repaso espaciado</h2>
      <p className="text-slate-400 text-sm mb-8">
        Intenta responder de memoria antes de mostrar la respuesta.
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          className="glass rounded-3xl p-6 sm:p-8 mb-6"
          aria-live="polite"
        >
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-3">
            {card.concept} · {card.levelLabel}
          </p>
          <p className="text-white text-lg font-medium mb-4">{card.front}</p>

          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t border-slate-700 pt-4"
            >
              <p className="text-teal-300 text-base leading-relaxed">{card.back}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {!showAnswer ? (
        <Button variant="primary" onClick={() => setShowAnswer(true)}>
          Mostrar respuesta
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button variant="primary" onClick={() => handleGrade(onRemember)}>
            La recordaba ✓
          </Button>
          <Button variant="secondary" onClick={() => handleGrade(onForget)}>
            La olvidé
          </Button>
        </div>
      )}
    </div>
  )
}
