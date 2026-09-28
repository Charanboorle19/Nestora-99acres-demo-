import { cn } from '../../utils/format'

export default function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={cn('flex gap-1 overflow-x-auto rounded-xl bg-fog/70 p-1 scrollbar-thin', className)} role="tablist">
      {tabs.map((tab) => {
        const id = typeof tab === 'string' ? tab : tab.id
        const label = typeof tab === 'string' ? tab : tab.label
        const active = value === id
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={cn(
              'shrink-0 whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold transition sm:px-3 sm:text-sm',
              active ? 'bg-white text-ink shadow-soft' : 'text-ink-muted hover:text-ink',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
