import { useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

function getScoreColor(score) {
  if (score >= 85) return '#34d399'
  if (score >= 70) return '#7c52f7'
  if (score >= 50) return '#f59e0b'
  return '#f87171'
}

export default function TopBar({ score, onReanalyze, contentRef }) {
  const downloadingRef = useRef(false)

  const handleDownload = async () => {
    if (downloadingRef.current) return
    downloadingRef.current = true

    const toastId = toast.loading('Generating PDF report…')

    try {
      const element = contentRef?.current
      if (!element) throw new Error('Dashboard element not found')

      const canvas = await html2canvas(element, {
        scale: 1.5,
        backgroundColor: '#0f0e1a',
        useCORS: true,
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 1.5, canvas.height / 1.5],
      })

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 1.5, canvas.height / 1.5)
      pdf.save(`resume-analysis-score-${score}.pdf`)
      toast.success('Report downloaded!', { id: toastId })
    } catch (err) {
      console.error('PDF generation error:', err)
      toast.error('Failed to generate PDF. Please try again.', { id: toastId })
    } finally {
      downloadingRef.current = false
    }
  }

  const scoreColor = getScoreColor(score)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-dark-300/80 backdrop-blur-xl border-b border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand + score badge */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-display font-bold text-white text-sm hidden sm:block">
            Resume Analysis
          </span>
          <span
            className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border"
            style={{
              color: scoreColor,
              borderColor: `${scoreColor}40`,
              background: `${scoreColor}12`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: scoreColor }} />
            Score: {score}/100
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={onReanalyze} className="btn-secondary text-xs px-3 py-1.5 gap-1.5">
            <span>↩</span>
            Re-analyze
          </button>
          <button onClick={handleDownload} className="btn-primary text-xs px-3 py-1.5 gap-1.5">
            <span>⬇</span>
            <span className="hidden sm:inline">Download Report</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
