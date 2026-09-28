import { Check, Circle, Loader } from 'lucide-react'
import { cn } from '../../utils/format'

export default function ConstructionTimeline({ timeline = [] }) {
  return (
    <ol className="relative space-y-0 border-l-2 border-border pl-6">
      {timeline.map((item, i) => {
        const done = item.status === 'done'
        const ongoing = item.status === 'ongoing'
        return (
          <li key={item.phase} className={cn('relative pb-8', i === timeline.length - 1 && 'pb-0')}>
            <span
              className={cn(
                'absolute -left-[1.95rem] flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white',
                done && 'border-success text-success',
                ongoing && 'border-amber text-amber',
                !done && !ongoing && 'border-border text-ink-muted',
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : ongoing ? <Loader className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}
            </span>
            <div className="font-bold text-ink">{item.phase}</div>
            <div className="text-sm text-ink-muted">
              {item.date} · <span className="capitalize">{item.status}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
