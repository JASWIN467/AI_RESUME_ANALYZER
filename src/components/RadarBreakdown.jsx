import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const CATEGORY_LABELS = {
  atsCompatibility: 'ATS',
  keywordMatch: 'Keywords',
  formatting: 'Formatting',
  impactVerbs: 'Impact',
  clarity: 'Clarity',
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { subject, value } = payload[0].payload
    return (
      <div className="glass-card px-3 py-2 text-sm">
        <p className="text-white font-semibold">{subject}</p>
        <p className="text-brand-400 font-bold">{value}/100</p>
      </div>
    )
  }
  return null
}

export default function RadarBreakdown({ scores }) {
  const data = Object.entries(scores).map(([key, value]) => ({
    subject: CATEGORY_LABELS[key] ?? key,
    value,
    fullMark: 100,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <p className="section-label mb-1">Category Breakdown</p>
      <p className="text-surface-500 text-xs mb-4">5-dimension resume analysis</p>

      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid
            gridType="polygon"
            stroke="rgba(255,255,255,0.08)"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            tickCount={4}
          />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#7c52f7"
            strokeWidth={2}
            fill="#7c52f7"
            fillOpacity={0.18}
            dot={{ fill: '#a78bfa', r: 4, strokeWidth: 0 }}
            activeDot={{ fill: '#c4b5fd', r: 6, strokeWidth: 0 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      {/* Category score pills */}
      <div className="grid grid-cols-5 gap-2 mt-2">
        {data.map(({ subject, value }) => {
          const color =
            value >= 85 ? '#34d399' :
            value >= 70 ? '#7c52f7' :
            value >= 50 ? '#f59e0b' : '#f87171'
          return (
            <div key={subject} className="flex flex-col items-center gap-1">
              <span
                className="text-sm font-bold"
                style={{ color }}
              >
                {value}
              </span>
              <span className="text-[10px] text-surface-500 text-center leading-tight">{subject}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
