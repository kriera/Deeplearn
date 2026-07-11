const VARIANTS = {
  teal: 'bg-teal-500/10 border border-teal-500/30 text-teal-300',
  amber: 'bg-amber-500/10 border border-amber-500/30 text-amber-300',
  purple: 'bg-purple-500/10 border border-purple-500/30 text-purple-300',
  slate: 'bg-slate-700/60 border border-slate-700 text-slate-400',
}

export function Badge({ variant = 'teal', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${VARIANTS[variant] || VARIANTS.teal} ${className}`}
    >
      {children}
    </span>
  )
}
