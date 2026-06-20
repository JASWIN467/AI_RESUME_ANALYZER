import { motion } from 'framer-motion'

const STRENGTH_ICONS = ['🏆', '⚡', '🎯', '✅', '💡', '🌟', '🔥']

export default function StrengthsCard({ strengths, fullPage = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={fullPage ? 'space-y-4' : 'glass-card p-6'}
    >
      {/* Header — only shown in sidebar/overview mode */}
      {!fullPage && (
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-lg">
            💪
          </div>
          <div>
            <p className="section-label text-emerald-400">Strengths</p>
            <p className="text-white font-semibold text-sm mt-0.5">What's working well</p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className={fullPage ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
        {strengths.map((strength, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className={`flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/6 border border-emerald-500/15
              hover:border-emerald-500/35 hover:bg-emerald-500/10 transition-all duration-200
              ${fullPage ? 'cursor-default' : ''}`}
          >
            <span className={`shrink-0 mt-0.5 ${fullPage ? 'text-xl' : 'text-base'}`}>
              {STRENGTH_ICONS[i % STRENGTH_ICONS.length]}
            </span>
            <div>
              <p className={`text-white/85 leading-relaxed ${fullPage ? 'text-base' : 'text-sm'}`}>
                {strength}
              </p>
              {fullPage && (
                <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-medium">
                  Strength #{i + 1}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {fullPage && (
        <p className="text-xs text-surface-500 pt-2">
          💡 These are your differentiators — make sure they're front-loaded in your resume summary and LinkedIn profile.
        </p>
      )}
    </motion.div>
  )
}
