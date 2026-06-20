import { motion } from 'framer-motion'

export default function BulletRewriteDiff({ rewrite }) {
  const { before, after } = rewrite

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/25 flex items-center justify-center text-lg">
          ✏️
        </div>
        <div>
          <p className="section-label text-brand-400">AI Bullet Rewrite</p>
          <p className="text-white font-semibold text-sm mt-0.5">
            See how a weak bullet becomes a standout achievement
          </p>
        </div>
      </div>

      {/* Side-by-side cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-[10px] text-red-400 font-bold">✗</span>
            <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">Before</span>
          </div>
          <div className="relative p-4 rounded-xl bg-red-500/6 border border-red-500/20 min-h-[80px]">
            {/* Red left border accent */}
            <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-red-500/50 rounded-full" />
            <p className="text-white/75 text-sm leading-relaxed pl-2 italic">
              • {before}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 pl-1">
            {['Vague', 'No metric', 'Weak verb'].map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* After */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px] text-emerald-400 font-bold">✓</span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">After</span>
          </div>
          <div className="relative p-4 rounded-xl bg-emerald-500/6 border border-emerald-500/20 min-h-[80px]">
            {/* Green left border accent */}
            <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-emerald-500/50 rounded-full" />
            <p className="text-white/90 text-sm leading-relaxed pl-2 font-medium">
              • {after}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 pl-1">
            {['Quantified', 'Strong verb', 'Impact clear'].map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Arrow connector (desktop only) */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none">
        <span className="text-brand-400 text-2xl">→</span>
      </div>

      <p className="text-xs text-surface-500 mt-5 text-center">
        💡 Apply this pattern across all your bullets: strong action verb + what you did + measurable result
      </p>
    </motion.div>
  )
}
