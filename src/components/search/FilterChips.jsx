import { X } from 'lucide-react'

export default function FilterChips({ chips, onRemove, onClear }) {
  if (!chips.length) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.remove)}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-ink shadow-soft hover:border-ink/30"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
      <button type="button" onClick={onClear} className="text-xs font-bold text-ink-muted hover:text-ink">
        Clear filters
      </button>
    </div>
  )
}
