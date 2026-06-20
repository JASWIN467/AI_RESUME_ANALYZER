import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function getScoreColor(score) {
  if (score >= 85) return '#34d399' // emerald
  if (score >= 70) return '#7c52f7' // brand violet
  if (score >= 50) return '#f59e0b' // amber
  return '#f87171'                  // red
}

function getScoreLabel(score) {
  if (score >= 85) return 'Excellent'
  if (score >= 70) return 'Good'
  if (score >= 50) return 'Fair'
  return 'Needs Work'
}

export default function ScoreGauge({ score }) {
  const [displayed, setDisplayed] = useState(0)
  const [animated, setAnimated] = useState(false)

  // Animate counter from 0 to score
  useEffect(() => {
    setDisplayed(0)
    setAnimated(false)
    const warmup = setTimeout(() => {
      setAnimated(true)
      let current = 0
      const step = 16 // ms per frame ~60fps
      const increment = score / (1400 / step)
      const interval = setInterval(() => {
        current += increment
        if (current >= score) {
          setDisplayed(score)
          clearInterval(interval)
        } else {
          setDisplayed(Math.floor(current))
        }
      }, step)
      return () => clearInterval(interval)
    }, 300)
    return () => clearTimeout(warmup)
  }, [score])

  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  // SVG arc gauge params (270° arc — 3/4 circle)
  const size = 240
  const strokeWidth = 18
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const arcFraction = 0.75
  const arcLength = circumference * arcFraction
  const dashOffset = arcLength - (arcLength * score) / 100
  const rotation = 135 // start bottom-left → end bottom-right

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6 flex flex-col items-center"
    >
      <p className="section-label mb-6">Overall Score</p>

      {/* SVG Gauge */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6d32ed" />
              <stop offset="100%" stopColor={color} />
            </linearGradient>
          </defs>

          {/* Background track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
          />
          {/* Filled arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={animated ? dashOffset : arcLength}
            strokeLinecap="round"
            transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
            style={{
              transition: 'stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
              filter: `drop-shadow(0 0 10px ${color}70)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span
            className="font-display text-6xl font-extrabold leading-none"
            style={{ color, textShadow: `0 0 24px ${color}50` }}
          >
            {displayed}
          </span>
          <span className="text-surface-400 text-sm">out of 100</span>
          <span
            className="mt-1.5 px-3 py-0.5 rounded-full text-xs font-semibold"
            style={{
              background: `${color}18`,
              color,
              border: `1px solid ${color}40`,
            }}
          >
            {label}
          </span>
        </div>
      </div>

      <p className="text-surface-500 text-xs mt-4 text-center max-w-[200px]">
        Weighted average across 5 resume dimensions
      </p>
    </motion.div>
  )
}
