import { motion } from 'framer-motion'

const IMPROVEMENT_ICONS = ['🔧', '📊', '🔑', '🔗', '📝', '💼', '🎯']
const PRIORITY_LABELS   = ['P1 — Critical', 'P2 — High', 'P3 — Medium', 'P4 — Medium', 'P5 — Low']
const PRIORITY_STYLES   = [
  'bg-red-500/15 text-red-400 border-red-500/25',
  'bg-orange-500/15 text-orange-400 border-orange-500/25',
  'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'bg-surface-700/50 text-surface-400 border-white/10',
]

export default function ImprovementsCard({ improvements, fullPage = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={fullPage ? 'space-y-4' : 'glass-card p-6'}
    >
      {/* Header — only in overview mode */}
      {!fullPage && (
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-lg">
            🚀
          </div>
          <div>
            <p className="section-label text-amber-400">Improvements</p>
            <p className="text-white font-semibold text-sm mt-0.5">Actionable next steps</p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-3">
        {improvements.slice(0, 5).map((improvement, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/6 border border-amber-500/15
              hover:border-amber-500/35 hover:bg-amber-500/10 transition-all duration-200"
          >
            {/* Step number */}
            <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-bold
              ${i < 2 ? 'bg-red-500/20 text-red-400' : i < 4 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-surface-400'}
              ${fullPage ? 'text-base' : 'text-sm'}`}
            >
              {i + 1}
            </div>

            <div className="flex-1 min-w-0">
              <p className={`text-white/85 leading-relaxed ${fullPage ? 'text-base' : 'text-sm'}`}>
                {improvement}
              </p>
              {fullPage && (
                <span className={`inline-flex items-center mt-2 text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${PRIORITY_STYLES[i]}`}>
                  {PRIORITY_LABELS[i]}
                </span>
              )}
            </div>

            {/* Icon */}
            <span className={`shrink-0 ${fullPage ? 'text-xl' : 'text-base'}`}>
              {IMPROVEMENT_ICONS[i % IMPROVEMENT_ICONS.length]}
            </span>
          </motion.div>
        ))}
      </div>

      {fullPage && (
        <p className="text-xs text-surface-500 pt-2">
          💡 Work through these top-to-bottom. P1 issues alone can be the difference between an ATS rejection and a callback.
        </p>
      )}
    </motion.div>
  )
}
