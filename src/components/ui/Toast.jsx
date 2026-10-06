import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { useToastStore } from '../../store'
import { cn } from '../../utils/format'

const icons = {
  success: CheckCircle2,
  info: Info,
  error: AlertTriangle,
}

export default function ToastViewport() {
  const { toasts, dismiss } = useToastStore()

  return (
    <div className="pointer-events-none fixed inset-x-3 bottom-4 z-70 flex flex-col gap-2 sm:inset-x-auto sm:right-4 sm:w-[min(100%-2rem,22rem)]">
      {toasts.map((t) => {
        const Icon = icons[t.type] || Info
        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-white p-3 shadow-lift',
              t.type === 'error' && 'border-danger/30',
              t.type === 'success' && 'border-success/30',
            )}
          >
            <Icon
              className={cn(
                'mt-0.5 h-5 w-5 shrink-0',
                t.type === 'success' && 'text-success',
                t.type === 'error' && 'text-danger',
                t.type === 'info' && 'text-ink',
              )}
            />
            <div className="min-w-0 flex-1">
              {t.title && <div className="text-sm font-bold text-ink">{t.title}</div>}
              <div className="text-sm text-ink-muted">{t.message}</div>
            </div>
            <button type="button" onClick={() => dismiss(t.id)} className="text-ink-muted hover:text-ink">
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function useToast() {
  const push = useToastStore((s) => s.push)
  return {
    success: (message, title = 'Success') => push({ type: 'success', title, message }),
    error: (message, title = 'Something went wrong') => push({ type: 'error', title, message }),
    info: (message, title = 'High Rise Properties') => push({ type: 'info', title, message }),
  }
}
