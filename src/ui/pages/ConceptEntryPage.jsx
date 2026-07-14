import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../atoms/Button.jsx'

export function ConceptEntryPage({ onStart, sessions, loading, error }) {
  const [concept, setConcept] = useState('')

  const handleStart = () => {
    if (!concept.trim() || loading) return
    onStart(concept.trim())
  }

  const suggestions = [
    'Quantum entanglement',
    'The French Revolution',
    'Transformer neural networks',
    'DNA replication',
    'Supply and demand',
    'General relativity',
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
            <span className="gradient-text">Stop just reading.</span>
            <br />
            <span className="text-white">Start truly understanding.</span>
          </h1>
          <p className="text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            Explain any concept in 5 levels — from{' '}
            <strong className="text-teal-300">Elemental</strong> to{' '}
            <strong className="text-teal-300">Expert.</strong>
          </p>
        </div>

        {sessions.length > 0 && (
          <p className="text-center text-xs text-slate-600 mb-6">
            {sessions.length} conceptos explorados
          </p>
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
            aria-label="Enter a concept to learn"
            aria-describedby="concept-hint"
            autoComplete="off"
          />
          <p id="concept-hint" className="text-xs text-slate-500 mt-1">
            Type any topic you want to learn about using the Feynman technique
          </p>
          <div className="flex flex-wrap gap-2 mt-3 mb-5">
            <span className="text-xs text-slate-500">Prueba:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setConcept(s)}
                className="text-xs px-3 py-1 rounded-full bg-slate-700/60 text-slate-400 hover:text-teal-300 transition-colors border border-slate-700"
                aria-label={`Use suggestion: ${s}`}
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
            {loading ? 'Generando…' : 'Generar ruta de aprendizaje →'}
          </Button>
        </div>

        {sessions.length > 0 && (
          <div className="mt-10">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Sesiones recientes
            </h3>
            <div className="grid gap-3">
              {sessions.slice(0, 6).map((session) => (
                <div
                  key={session.id}
                  className="glass flex items-center gap-4 rounded-2xl p-4 border border-slate-700/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate capitalize">
                      {session.concept}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {new Date(session.createdAt).toLocaleDateString()} ·{' '}
                      <span className="text-teal-400">
                        {session.levelsUnlocked - 1}/5 niveles completados
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
