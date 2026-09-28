import Button from './Button'

export default function EmptyState({
  title = 'Nothing here yet',
  description,
  actionLabel,
  onAction,
  icon: Icon,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white/70 px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-ink">
          <Icon className="h-7 w-7" />
        </div>
      )}
      <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-ink-muted">{description}</p>}
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
