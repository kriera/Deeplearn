import { motion } from 'framer-motion'

const VARIANTS = {
  text: 'h-4 w-3/4 rounded-lg',
  paragraph: 'space-y-3',
  card: 'rounded-3xl p-6 space-y-4',
  quiz: 'rounded-3xl p-6 space-y-3',
}

function SkeletonLine({ width = 'w-full', height = 'h-4', className = '' }) {
  return (
    <div
      className={`shimmer rounded-lg ${height} ${width} ${className}`}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard({ variant = 'text', className = '' }) {
  if (variant === 'text') {
    return (
      <div className={`${VARIANTS.text} ${className}`} aria-hidden="true">
        <SkeletonLine />
      </div>
    )
  }

  if (variant === 'paragraph') {
    return (
      <div
        className={`${VARIANTS.paragraph} ${className}`}
        role="status"
        aria-label="Cargando contenido"
      >
        <SkeletonLine width="w-full" />
        <SkeletonLine width="w-5/6" />
        <SkeletonLine width="w-4/6" />
        <span className="sr-only">Cargando…</span>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`glass ${VARIANTS.card} ${className}`}
        role="status"
        aria-label="Cargando"
      >
        <SkeletonLine width="w-1/3" height="h-6" />
        <SkeletonLine width="w-full" />
        <SkeletonLine width="w-4/5" />
        <span className="sr-only">Cargando…</span>
      </motion.div>
    )
  }

  if (variant === 'quiz') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass ${VARIANTS.quiz} ${className}`}
        role="status"
        aria-label="Cargando pregunta"
      >
        <SkeletonLine width="w-1/4" height="h-5" />
        <SkeletonLine width="w-3/4" height="h-5" />
        <div className="space-y-2 mt-3">
          <SkeletonLine width="w-full" height="h-10" />
          <SkeletonLine width="w-full" height="h-10" />
          <SkeletonLine width="w-full" height="h-10" />
          <SkeletonLine width="w-full" height="h-10" />
        </div>
        <span className="sr-only">Cargando pregunta…</span>
      </motion.div>
    )
  }

  return null
}
