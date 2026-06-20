import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'

// Client-side PDF text extraction using pdfjs-dist
async function extractTextFromPDF(file) {
  const pdfjsLib = await import('pdfjs-dist')
  // Use the legacy build worker to avoid CORS issues in Vite
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).href

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map((item) => item.str).join(' ')
    fullText += pageText + '\n'
  }

  return fullText.trim()
}

const ACCEPTED_TYPES = ['application/pdf']

export default function UploadSection({
  onAnalyze,
  onLoadDemo,
  isLoading,
  onResumeChange,
  onJDChange,
  resumeText,
  jobDescription,
}) {
  const [activeTab, setActiveTab] = useState('upload') // 'upload' | 'paste'
  const [isDragOver, setIsDragOver] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [isParsing, setIsParsing] = useState(false)
  const fileInputRef = useRef(null)

  const processFile = useCallback(
    async (file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`Invalid file type "${file.name}". Only PDF files are accepted.`)
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File is too large. Please upload a PDF under 5MB.')
        return
      }

      setIsParsing(true)
      setFileName(file.name)

      try {
        const text = await extractTextFromPDF(file)
        if (!text || text.length < 50) {
          toast.error('Could not extract text from this PDF. Try the "Paste Text" tab instead.')
          setFileName(null)
          setIsParsing(false)
          return
        }
        onResumeChange(text)
        toast.success(`Extracted ${text.length.toLocaleString()} characters from "${file.name}"`)
      } catch (err) {
        console.error('PDF extraction error:', err)
        toast.error('Failed to read the PDF. It may be scanned/image-based. Try pasting text instead.')
        setFileName(null)
      } finally {
        setIsParsing(false)
      }
    },
    [onResumeChange],
  )

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files?.[0]
      if (file) processFile(file)
    },
    [processFile],
  )

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true) }
  const handleDragLeave = () => setIsDragOver(false)

  const handleFileInput = (e) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const handleAnalyze = () => {
    if (!resumeText || resumeText.trim().length < 50) {
      toast.error(
        activeTab === 'upload'
          ? 'Please upload a PDF first, or switch to the Paste Text tab.'
          : 'Please paste your resume text (at least 50 characters).',
      )
      return
    }
    onAnalyze(resumeText, jobDescription)
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* Animated background orbs */}
      <div className="orb w-96 h-96 bg-brand-600 top-[-10%] left-[-10%] animate-float" style={{ animationDelay: '0s' }} />
      <div className="orb w-80 h-80 bg-purple-600 bottom-[-5%] right-[-8%] animate-float" style={{ animationDelay: '2s' }} />
      <div className="orb w-64 h-64 bg-indigo-700 top-[60%] left-[5%] animate-float" style={{ animationDelay: '4s' }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center space-y-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/40 bg-brand-500/10 text-brand-300 text-xs font-semibold tracking-wide"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Powered by Gemini 3.5 Flash
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-balance"
        >
          Your Resume,{' '}
          <span className="gradient-text">Score & Ranked</span>
          <br />by AI in Seconds
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-surface-400 text-lg max-w-xl mx-auto leading-relaxed"
        >
          Get ATS compatibility scores, keyword gap analysis, and{' '}
          <span className="text-white/70">5 specific improvements</span> tailored to your target role.
        </motion.p>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card p-6 text-left mt-4"
        >
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-dark-400 rounded-xl mb-6">
            {['upload', 'paste'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-brand-600 text-white shadow-glow'
                    : 'text-surface-400 hover:text-white'
                }`}
              >
                {tab === 'upload' ? '📄 Upload PDF' : '📝 Paste Text'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'upload' ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Dropzone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
                    isDragOver
                      ? 'border-brand-400 bg-brand-500/10'
                      : fileName
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-white/15 hover:border-brand-500/50 hover:bg-white/5'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileInput}
                  />

                  {isParsing ? (
                    <div className="space-y-3">
                      <div className="w-10 h-10 mx-auto border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                      <p className="text-surface-400 text-sm">Extracting text from PDF…</p>
                    </div>
                  ) : fileName ? (
                    <div className="space-y-2">
                      <div className="text-4xl">✅</div>
                      <p className="text-emerald-400 font-semibold">{fileName}</p>
                      <p className="text-surface-400 text-sm">Text extracted successfully. Click to replace.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-5xl">📂</div>
                      <div>
                        <p className="text-white font-semibold">Drop your resume here</p>
                        <p className="text-surface-400 text-sm mt-1">or click to browse — PDF only, max 5MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="paste"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  value={resumeText}
                  onChange={(e) => onResumeChange(e.target.value)}
                  placeholder="Paste your full resume text here…&#10;&#10;Include all sections: Summary, Experience, Education, Skills, Projects."
                  rows={10}
                  className="w-full bg-dark-400 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 placeholder-surface-500 focus:outline-none focus:border-brand-500/50 resize-none transition-colors"
                />
                <p className="text-xs text-surface-500 mt-1.5">
                  {resumeText.length.toLocaleString()} / 15,000 characters
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Job Description */}
          <div className="mt-6 space-y-2">
            <label className="section-label">
              Target Job Description{' '}
              <span className="normal-case text-surface-500 font-normal tracking-normal">(optional but recommended)</span>
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => onJDChange(e.target.value)}
              placeholder="Paste the job description to get keyword gap analysis and tailored improvements…"
              rows={4}
              className="w-full bg-dark-400 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 placeholder-surface-500 focus:outline-none focus:border-brand-500/50 resize-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAnalyze}
              disabled={isLoading || isParsing}
              className="btn-primary flex-1 justify-center py-3 text-base"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <span>✨</span>
                  Analyze My Resume
                </>
              )}
            </button>
            <button
              onClick={onLoadDemo}
              className="btn-secondary sm:w-auto justify-center"
            >
              View Demo
            </button>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 text-xs text-surface-500"
        >
          {['🔒 Resume never stored', '⚡ Results in ~5 seconds', '🎯 ATS-optimized feedback'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
