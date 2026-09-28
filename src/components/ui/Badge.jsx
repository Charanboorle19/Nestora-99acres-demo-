import { cn } from '../../utils/format'

export default function Badge({ children, tone = 'ink', className }) {
  const tones = {
    ink: 'bg-ink/10 text-ink',
    amber: 'bg-amber/25 text-ink',
    success: 'bg-success/15 text-success',
    danger: 'bg-danger/15 text-danger',
    mist: 'bg-mist text-ink-muted border border-border',
    featured: 'bg-amber text-ink',
    verified: 'bg-success text-white',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
