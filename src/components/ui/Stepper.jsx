import { Check } from 'lucide-react'
import { cn } from '../../utils/format'

export default function Stepper({ steps, current = 0, className }) {
  return (
    <ol className={cn('flex w-full items-center gap-1 overflow-x-auto pb-1 sm:gap-2', className)}>
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={step.id || step} className="flex min-w-0 shrink-0 items-center gap-1.5 sm:min-w-0 sm:flex-1 sm:gap-2">
            <div
              className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold sm:h-8 sm:w-8 sm:text-xs',
                done && 'bg-success text-white',
                active && 'bg-ink text-white',
                !done && !active && 'bg-fog text-ink-muted',
              )}
            >
              {done ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                'truncate text-[10px] font-semibold sm:text-sm',
                active ? 'inline max-w-20 text-ink' : 'hidden text-ink-muted sm:inline',
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
