import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../atoms/Badge.jsx'
import { Button } from '../atoms/Button.jsx'
import { BackButton } from '../atoms/BackButton.jsx'
import { levelLabel } from '../i18n/levelLabels.js'

function QuestionCard({ question, index, total, selected, onSelect, submitted, review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-3xl p-6 mb-4"
    >
      <div className="flex items-center justify-between mb-4">
        <Badge variant="slate">
          Pregunta {index + 1} de {total}
        </Badge>
      </div>
      <p className="text-white font-medium text-base mb-4">{question.question}</p>
      <div className="grid gap-2" role="group" aria-label={`Opciones de la pregunta ${index + 1}`}>
        {question.options.map((option, optIndex) => {
          let optionClass = 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
          if (submitted && review) {
            if (optIndex === question.correctIndex) {
              optionClass = 'border-green-500/50 bg-green-500/10 text-green-300'
            } else if (optIndex === selected && selected !== question.correctIndex) {
              optionClass = 'border-red-500/50 bg-red-500/10 text-red-300'
            } else {
              optionClass = 'border-slate-700 bg-slate-800/30 opacity-50'
            }
          } else if (optIndex === selected) {
            optionClass = 'border-teal-500 bg-teal-500/15'
          }
          return (
            <button
              key={optIndex}
              onClick={() => !submitted && onSelect(optIndex)}
              disabled={submitted}
              aria-pressed={optIndex === selected}
              className={`flex items-center gap-3 p-3 rounded-xl border text-sm text-left transition-all ${optionClass}`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${
                  submitted && optIndex === question.correctIndex
                    ? 'bg-green-500 text-white'
                    : submitted && optIndex === selected && selected !== question.correctIndex
                      ? 'bg-red-500 text-white'
                      : optIndex === selected
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-700 text-slate-400'
                }`}
                aria-hidden="true"
              >
                {String.fromCharCode(65 + optIndex)}
              </span>
              <span className="flex-1">{option}</span>
            </button>
          )
        })}
      </div>
      {submitted && review && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`mt-4 p-3 rounded-xl text-sm ${review.correct ? 'bg-green-500/10 border border-green-500/20 text-green-300' : 'bg-amber-500/10 border border-amber-500/20 text-amber-300'}`}
        >
          <p className="font-semibold mb-1">{review.correct ? '✓ Correcta' : '✗ Incorrecta'}</p>
          <p>{question.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

export function QuizPage({
  session,
  levelIndex,
  onSubmitQuiz,
  quizResult,
  submitting,
  submitError,
  onBackToLevel,
  onNextLevel,
}) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const level = session?.levels[levelIndex]
  const rawQuestions = level?.questions || []
  // Normalize: model may return correct_index (snake_case) or correctIndex (camelCase)
  const questions = rawQuestions.map((q) => ({
    ...q,
    correctIndex: q.correctIndex ?? q.correct_index ?? -1,
  }))

  const handleSelect = (qIndex, optIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }))
  }

  const handleSubmit = async () => {
    const answerList = questions.map((q, i) => ({
      questionId: q.id,
      selectedIndex: answers[i] ?? null,
    }))
    const result = await onSubmitQuiz(session, answerList)
    if (result) setSubmitted(true)
  }

  const allAnswered = questions.every((_, i) => answers[i] !== undefined)
  const result = quizResult

  if (!session || !level) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <p className="text-slate-300 mb-4">
          Aún no hay un quiz en marcha. Empieza por la explicación del nivel.
        </p>
        <Button variant="secondary" onClick={onBackToLevel}>
          ← Ir al nivel
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <BackButton onClick={onBackToLevel} label="Volver al nivel" />
        <Badge variant="amber">Quiz — Nivel {level.number}</Badge>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold text-white mb-6">
              Quiz {levelLabel(level.number).toLowerCase()}
            </h2>
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                total={questions.length}
                selected={answers[i]}
                onSelect={(opt) => handleSelect(i, opt)}
                submitted={false}
              />
            ))}

            {submitError && (
              <div
                className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-4"
                role="alert"
              >
                <span>{submitError}</span>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              loading={submitting}
            >
              {submitting ? 'Corrigiendo…' : submitError ? 'Reintentar envío' : 'Enviar respuestas'}
            </Button>
          </motion.div>
        ) : result ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div
              className={`glass rounded-3xl p-8 text-center mb-6 ${result.passed ? 'border-teal-500/30' : 'border-amber-500/30'}`}
              aria-live="polite"
              aria-label={`Resultado del quiz: ${result.passed ? 'superado' : 'no superado'}. ${result.score} de ${result.total} aciertos`}
            >
              <div className="text-5xl mb-4">{result.passed ? '🎉' : '💪'}</div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {result.passed ? '¡Nivel superado!' : '¡Sigue intentando!'}
              </h2>
              <p className="text-slate-400 mb-4">
                Has acertado {result.score}/{result.total}
                {result.passed ? ' — ¡Nivel desbloqueado!' : ' — necesitas 4/5 para aprobar'}
              </p>
              <div className="flex gap-2 justify-center mb-4">
                {result.answerReview?.map((r, i) => (
                  <span
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                    ${r.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                  >
                    {r.correct ? '✓' : '✗'}
                  </span>
                ))}
              </div>
            </div>

            {result.answerReview?.map((r, i) => (
              <QuestionCard
                key={i}
                question={questions[i]}
                index={i}
                total={questions.length}
                selected={answers[i]}
                submitted={true}
                review={r}
              />
            ))}

            <div className="flex gap-3 mt-6">
              {result.passed ? (
                <Button onClick={onNextLevel}>
                  {levelIndex + 1 >= 5 ? 'Ver resultados →' : 'Siguiente nivel →'}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSubmitted(false)
                    setAnswers({})
                  }}
                >
                  Intentar de nuevo
                </Button>
              )}
              <Button variant="ghost" onClick={onBackToLevel}>
                Volver al nivel
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
