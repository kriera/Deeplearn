import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../atoms/Button.jsx'

export function ConceptEntryPage({
  onStart,
  onResume,
  sessions,
  loading,
  error,
  dueCount = 0,
  onOpenSrs,
}) {
  const [concept, setConcept] = useState('')

  const handleStart = () => {
    if (!concept.trim() || loading) return
    onStart(concept.trim())
  }

  const suggestions = [
    'Entrelazamiento cuántico',
    'La Revolución Francesa',
    'Redes neuronales transformer',
    'Replicación del ADN',
    'Oferta y demanda',
    'Relatividad general',
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="text-6xl mb-4"
          >
            🧠
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            <span className="gradient-text">Deja de solo leer.</span>
            <br />
            <span className="text-white">Empieza a entender de verdad.</span>
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            Cualquier concepto explicado en 5 niveles — de{' '}
            <strong className="text-teal-300">Elemental</strong> a{' '}
            <strong className="text-teal-300">Experto.</strong>
          </p>
        </div>

        {sessions.length > 0 && (
          <p className="text-center text-xs text-slate-400 mb-6">
            {sessions.length}{' '}
            {sessions.length === 1 ? 'concepto explorado' : 'conceptos explorados'}
          </p>
        )}

        {dueCount > 0 && (
          <button
            onClick={onOpenSrs}
            className="glass w-full flex items-center justify-between gap-3 rounded-2xl p-4 mb-4 border border-teal-500/30 hover:border-teal-400/60 transition-colors text-left"
          >
            <span className="text-sm text-slate-200">
              🗂️ Tienes <strong className="text-teal-300">{dueCount}</strong>{' '}
              {dueCount === 1 ? 'tarjeta pendiente' : 'tarjetas pendientes'} de repaso
            </span>
            <span className="text-teal-300 text-sm font-semibold shrink-0">Repasar →</span>
          </button>
        )}

        <div className="glass rounded-3xl p-6 mb-4">
          <label htmlFor="concept-input" className="block text-sm font-medium text-slate-300 mb-3">
            ¿Qué quieres aprender hoy?
          </label>
          <input
            id="concept-input"
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder="ej. Mecánica cuántica, Agujeros negros, Machine learning…"
            className="w-full bg-slate-800/50 border border-slate-600 rounded-2xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-base"
            disabled={loading}
            aria-invalid={error ? true : undefined}
            aria-describedby="concept-hint"
            autoComplete="off"
          />
          <p id="concept-hint" className="text-xs text-slate-400 mt-1">
            Escribe cualquier tema y lo desglosaremos con la técnica Feynman
          </p>
          <div className="flex flex-wrap gap-2 mt-3 mb-5">
            <span className="text-xs text-slate-400 self-center">Prueba:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setConcept(s)}
                className="text-xs px-3 py-2 rounded-full bg-slate-700/60 text-slate-300 hover:text-teal-300 transition-colors border border-slate-700"
                aria-label={`Probar sugerencia: ${s}`}
              >
                {s}
              </button>
            ))}
          </div>

          {error && (
            <div
              className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-4"
              role="alert"
              aria-live="assertive"
            >
              <span>{error}</span>
            </div>
          )}

          <Button onClick={handleStart} disabled={!concept.trim()} loading={loading}>
            {loading ? 'Generando… puede tardar un minuto' : 'Generar ruta de aprendizaje →'}
          </Button>
        </div>

        {sessions.length > 0 && (
          <div className="mt-10">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Sesiones recientes
            </h3>
            <div className="grid gap-3">
              {sessions.slice(0, 6).map((session) => (
                <button
                  key={session.id}
                  onClick={() => onResume?.(session.id)}
                  className="glass flex items-center gap-4 rounded-2xl p-4 border border-slate-700/50 text-left hover:border-teal-500/50 transition-colors"
                  aria-label={`Retomar sesión: ${session.concept}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate capitalize">
                      {session.concept}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {new Date(session.createdAt).toLocaleDateString()} ·{' '}
                      <span className="text-teal-400">
                        {session.levelsUnlocked - 1}/5 niveles completados
                      </span>
                    </p>
                  </div>
                  <span className="text-slate-400 text-sm" aria-hidden="true">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
