import { Check } from 'lucide-react'
import { cn } from '../../utils/format'

export default function Stepper({ steps, current = 0, className }) {
  return (
    <ol className={cn('flex w-full items-center gap-2 overflow-x-auto', className)}>
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={step.id || step} className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                done && 'bg-success text-white',
                active && 'bg-ink text-white',
                !done && !active && 'bg-fog text-ink-muted',
              )}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                'truncate text-xs font-semibold sm:text-sm',
                active ? 'text-ink' : 'text-ink-muted',
              )}
            >
              {step.label || step}
            </span>
            {i < steps.length - 1 && <div className="mx-1 hidden h-px flex-1 bg-border sm:block" />}
          </li>
        )
      })}
    </ol>
  )
}
