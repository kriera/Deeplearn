import { motion } from 'framer-motion'

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white shadow-xl shadow-teal-500/20',
  secondary:
    'bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700',
  danger:
    'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white shadow-xl shadow-red-500/20',
  ghost: 'text-slate-400 hover:text-white hover:bg-slate-800',
}

export function Button({
  variant = 'primary',
  loading,
  disabled,
  children,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      disabled={disabled || loading}
      role="button"
      aria-busy={loading || undefined}
      className={`w-full py-4 rounded-2xl font-bold text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTS[variant] || VARIANTS.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-3">
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
          {children}
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}
