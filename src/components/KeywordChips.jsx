import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function KeywordChips({ keywords }) {
  const [dismissed, setDismissed] = useState(new Set())

  const dismiss = (kw) => setDismissed((prev) => new Set([...prev, kw]))
  const restoreAll = () => setDismissed(new Set())

  const visible = keywords.filter((kw) => !dismissed.has(kw))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center text-lg">
            🔍
          </div>
          <div>
            <p className="section-label text-amber-400">Missing Keywords</p>
            <p className="text-white font-semibold text-sm mt-0.5">
              Add these to your resume to pass ATS filters
            </p>
          </div>
        </div>
        {dismissed.size > 0 && (
          <button
            onClick={restoreAll}
            className="text-xs text-surface-400 hover:text-white transition-colors underline underline-offset-2"
          >
            Restore all
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-surface-500 text-sm py-4"
        >
          🎉 All keywords dismissed — don't forget to add them to your resume!
        </motion.p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {visible.map((kw) => (
              <motion.span
                key={kw}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.15 } }}
                layout
                className="chip group cursor-pointer hover:border-amber-400/60 hover:bg-amber-500/15"
                onClick={() => dismiss(kw)}
                title="Click to dismiss"
              >
                <span>{kw}</span>
                <span className="text-amber-500/50 group-hover:text-amber-400 transition-colors text-xs">×</span>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      )}

      <p className="text-xs text-surface-500 mt-4">
        💡 Click a keyword to mark it as added. These terms were found in the job description but missing from your resume.
      </p>
    </motion.div>
  )
}
