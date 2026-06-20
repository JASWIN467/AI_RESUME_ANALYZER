import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster, toast } from 'react-hot-toast'

import UploadSection from './components/UploadSection.jsx'
import TopBar from './components/TopBar.jsx'
import ScoreGauge from './components/ScoreGauge.jsx'
import RadarBreakdown from './components/RadarBreakdown.jsx'
import StrengthsCard from './components/StrengthsCard.jsx'
import ImprovementsCard from './components/ImprovementsCard.jsx'
import KeywordChips from './components/KeywordChips.jsx'
import BulletRewriteDiff from './components/BulletRewriteDiff.jsx'
import SkeletonLoader from './components/SkeletonLoader.jsx'

const DEMO_DATA = {
  overallScore: 74,
  categoryScores: {
    atsCompatibility: 68,
    keywordMatch: 72,
    formatting: 85,
    impactVerbs: 70,
    clarity: 80,
  },
  strengths: [
    'Strong educational background with a relevant CS degree clearly positioned at the top',
    'Consistent use of past-tense action verbs across experience section (Led, Built, Deployed)',
    'Clean single-column layout that parses well in ATS without tables or graphics',
  ],
  improvements: [
    'Quantify your impact — replace "improved performance" with "reduced API latency by 40% (from 800ms to 480ms)"',
    'Add a Professional Summary section — ATS systems and recruiters spend <10s on first scan; a 2-3 line summary hooks them',
    'Missing core skill keywords: "TypeScript", "CI/CD", "REST APIs" — add these to your skills section verbatim',
    'Project section lacks links — add GitHub URLs next to each project so recruiters can validate your claims',
    'Education section lists GPA as 3.2 — below 3.5 is often filtered; consider removing it unless required',
  ],
  missingKeywords: ['TypeScript', 'CI/CD', 'REST APIs', 'Agile', 'Docker', 'Unit Testing', 'System Design'],
  bulletRewrite: {
    before: 'Worked on backend services to improve application speed',
    after: 'Optimized Node.js backend microservices, reducing average API response time by 42% (800ms → 465ms) and cutting server costs by $12K/year through connection pool tuning and query indexing',
  },
}

const TABS = [
  { id: 'overview',      label: 'Overview',      icon: '📊' },
  { id: 'strengths',     label: 'Strengths',      icon: '💪' },
  { id: 'improvements',  label: 'Improvements',   icon: '🚀' },
  { id: 'keywords',      label: 'Keywords',       icon: '🔍' },
  { id: 'rewrite',       label: 'Bullet Rewrite', icon: '✏️' },
]

export default function App() {
  const [phase, setPhase] = useState('upload')
  const [results, setResults] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const dashboardRef = useRef(null)
  const contentRef = useRef(null)

  const analyze = async (rText, jdText) => {
    const rt = rText ?? resumeText
    const jd = jdText ?? jobDescription

    if (!rt || rt.trim().length < 50) {
      toast.error('Please provide a resume with at least 50 characters.')
      return
    }

    setPhase('loading')
    setResults(null)
    setActiveTab('overview')

    try {
      let res
      try {
        res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: rt, jobDescription: jd }),
        })
      } catch {
        throw new Error('Cannot reach the API server. Run `npm run server` in a second terminal.')
      }

      let data
      try {
        data = await res.json()
      } catch {
        throw new Error(`Server returned an unreadable response (status ${res.status}). Make sure the API server is running.`)
      }

      if (!res.ok) throw new Error(data?.error ?? `Server error (${res.status})`)

      if (typeof data.overallScore !== 'number' || !data.categoryScores) {
        throw new Error('Unexpected response format from AI. Please try again.')
      }

      setResults(data)
      setPhase('results')
      setTimeout(() => dashboardRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch (err) {
      console.error('Analysis error:', err)
      toast.error(err.message || 'Something went wrong. Please try again.')
      setPhase('upload')
    }
  }

  const handleReanalyze = () => {
    setPhase('upload')
    setResults(null)
    setActiveTab('overview')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoadDemo = () => {
    setResults(DEMO_DATA)
    setPhase('results')
    setActiveTab('overview')
    setTimeout(() => dashboardRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  return (
    <div className="min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1828',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
          error:   { iconTheme: { primary: '#f87171', secondary: '#1a1828' } },
          success: { iconTheme: { primary: '#34d399', secondary: '#1a1828' } },
        }}
      />

      {/* Hero / Upload */}
      <UploadSection
        onAnalyze={analyze}
        onLoadDemo={handleLoadDemo}
        isLoading={phase === 'loading'}
        onResumeChange={setResumeText}
        onJDChange={setJobDescription}
        resumeText={resumeText}
        jobDescription={jobDescription}
      />

      {/* Skeleton */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <SkeletonLoader />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {phase === 'results' && results && (
          <motion.div
            key="results"
            ref={dashboardRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Sticky Top Bar */}
            <TopBar
              score={results.overallScore}
              onReanalyze={handleReanalyze}
              contentRef={contentRef}
            />

            {/* Tab Navigation */}
            <div className="sticky top-14 z-40 bg-dark-300/90 backdrop-blur-xl border-b border-white/[0.07]">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-brand-600/80 text-white shadow-glow'
                          : 'text-surface-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Dashboard Content */}
            <div ref={contentRef} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AnimatePresence mode="wait">

                {/* ── OVERVIEW ── */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <SectionHeader
                      icon="📊"
                      title="Score Overview"
                      subtitle="Your resume's overall performance across all dimensions"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ScoreGauge score={results.overallScore} />
                      <RadarBreakdown scores={results.categoryScores} />
                    </div>
                    {/* Quick-nav cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                      {[
                        { id: 'strengths',    icon: '💪', label: 'Strengths',     count: results.strengths?.length,           color: 'emerald' },
                        { id: 'improvements', icon: '🚀', label: 'Improvements',  count: results.improvements?.length,        color: 'amber' },
                        { id: 'keywords',     icon: '🔍', label: 'Mis. Keywords', count: results.missingKeywords?.length,     color: 'orange' },
                        { id: 'rewrite',      icon: '✏️', label: 'Rewrite',       count: results.bulletRewrite ? 1 : 0,       color: 'violet' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className="glass-card-hover p-4 text-left group"
                        >
                          <div className="text-2xl mb-2">{item.icon}</div>
                          <div className="text-xl font-bold text-white">{item.count}</div>
                          <div className="text-xs text-surface-400 mt-0.5 group-hover:text-white/70 transition-colors">{item.label}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── STRENGTHS ── */}
                {activeTab === 'strengths' && (
                  <motion.div
                    key="strengths"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <SectionHeader
                      icon="💪"
                      title="Resume Strengths"
                      subtitle="What's already working well — these are your competitive advantages"
                      accent="emerald"
                    />
                    <StrengthsCard strengths={results.strengths} fullPage />
                  </motion.div>
                )}

                {/* ── IMPROVEMENTS ── */}
                {activeTab === 'improvements' && (
                  <motion.div
                    key="improvements"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <SectionHeader
                      icon="🚀"
                      title="Actionable Improvements"
                      subtitle="Specific changes ordered by impact — fix these to land more interviews"
                      accent="amber"
                    />
                    <ImprovementsCard improvements={results.improvements} fullPage />
                  </motion.div>
                )}

                {/* ── KEYWORDS ── */}
                {activeTab === 'keywords' && (
                  <motion.div
                    key="keywords"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <SectionHeader
                      icon="🔍"
                      title="Missing Keywords"
                      subtitle="These terms appear in your target role but are absent from your resume — add them verbatim to pass ATS filters"
                      accent="orange"
                    />
                    {results.missingKeywords?.length > 0
                      ? <KeywordChips keywords={results.missingKeywords} />
                      : (
                        <div className="glass-card p-12 text-center text-surface-400">
                          🎉 No missing keywords found — great keyword coverage!
                        </div>
                      )
                    }
                  </motion.div>
                )}

                {/* ── BULLET REWRITE ── */}
                {activeTab === 'rewrite' && (
                  <motion.div
                    key="rewrite"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <SectionHeader
                      icon="✏️"
                      title="AI Bullet Rewrite"
                      subtitle="The AI picked your weakest bullet and rewrote it — apply this pattern to all bullets"
                      accent="violet"
                    />
                    {results.bulletRewrite?.before
                      ? <BulletRewriteDiff rewrite={results.bulletRewrite} />
                      : (
                        <div className="glass-card p-12 text-center text-surface-400">
                          No bullet rewrite available for this resume.
                        </div>
                      )
                    }
                  </motion.div>
                )}

              </AnimatePresence>

              <div className="h-16" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle, accent = 'brand' }) {
  const colorMap = {
    brand:   'text-brand-400',
    emerald: 'text-emerald-400',
    amber:   'text-amber-400',
    orange:  'text-orange-400',
    violet:  'text-violet-400',
  }
  return (
    <div className="flex items-start gap-4 pb-2 border-b border-white/[0.07]">
      <div className="text-3xl mt-0.5">{icon}</div>
      <div>
        <h2 className={`font-display text-2xl font-bold ${colorMap[accent] ?? colorMap.brand}`}>
          {title}
        </h2>
        <p className="text-surface-400 text-sm mt-1 max-w-xl">{subtitle}</p>
      </div>
    </div>
  )
}
