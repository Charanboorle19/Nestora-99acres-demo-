import { useEffect } from 'react'
import { X } from 'lucide-react'
import Button from '../ui/Button'
import { cn } from '../../utils/format'

export default function BottomSheet({ open, onClose, title, children, className }) {
  useEffect(() => {
    if (!open) return undefined
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:hidden">
      <button type="button" className="absolute inset-0 bg-ink/50" aria-label="Close" onClick={onClose} />
      <div
        className={cn(
          'relative z-10 flex max-h-[88vh] w-full flex-col rounded-t-3xl bg-white shadow-lift',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close filters">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  )
}
