export default function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Row 1: Gauge + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gauge skeleton */}
        <div className="glass-card p-6 flex flex-col items-center space-y-4">
          <div className="skeleton w-28 h-4 rounded" />
          <div className="skeleton w-52 h-52 rounded-full" />
          <div className="skeleton w-32 h-3 rounded" />
        </div>

        {/* Radar skeleton */}
        <div className="glass-card p-6 space-y-4">
          <div className="skeleton w-40 h-4 rounded" />
          <div className="skeleton w-full h-64 rounded-xl" />
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="skeleton w-8 h-4 rounded" />
                <div className="skeleton w-12 h-3 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Strengths + Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[0, 1].map((col) => (
          <div key={col} className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="skeleton w-9 h-9 rounded-xl" />
              <div className="space-y-1.5">
                <div className="skeleton w-20 h-3 rounded" />
                <div className="skeleton w-32 h-4 rounded" />
              </div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton w-full h-14 rounded-xl" />
            ))}
          </div>
        ))}
      </div>

      {/* Row 3: Keywords */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="skeleton w-9 h-9 rounded-xl" />
          <div className="space-y-1.5">
            <div className="skeleton w-28 h-3 rounded" />
            <div className="skeleton w-64 h-4 rounded" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {[80, 100, 70, 110, 90, 85, 75].map((w, i) => (
            <div key={i} className="skeleton h-7 rounded-full" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* Row 4: Bullet Rewrite */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="skeleton w-9 h-9 rounded-xl" />
          <div className="space-y-1.5">
            <div className="skeleton w-24 h-3 rounded" />
            <div className="skeleton w-56 h-4 rounded" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="skeleton w-full h-28 rounded-xl" />
          <div className="skeleton w-full h-28 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
