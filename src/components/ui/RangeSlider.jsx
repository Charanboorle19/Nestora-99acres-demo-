import { cn } from '../../utils/format'

export default function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value = [min, max],
  onChange,
  formatValue = (v) => v,
  className,
  label,
}) {
  const [lo, hi] = value
  const left = ((lo - min) / (max - min)) * 100
  const right = ((hi - min) / (max - min)) * 100

  return (
    <div className={cn('space-y-3', className)}>
      {label && <div className="text-sm font-semibold text-ink">{label}</div>}
      <div className="flex justify-between text-xs font-medium text-ink-muted">
        <span>{formatValue(lo)}</span>
        <span>{formatValue(hi)}</span>
      </div>
      <div className="relative h-6">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-fog" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-amber"
          style={{ left: `${left}%`, width: `${Math.max(0, right - left)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => {
            const next = Math.min(Number(e.target.value), hi)
            onChange([next, hi])
          }}
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => {
            const next = Math.max(Number(e.target.value), lo)
            onChange([lo, next])
          }}
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink"
        />
      </div>
    </div>
  )
}
