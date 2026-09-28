import { cn } from '../../utils/format'

const variants = {
  primary: 'bg-ink text-white hover:bg-ink-soft shadow-soft',
  secondary: 'bg-white text-ink border border-border hover:bg-mist',
  amber: 'bg-amber text-ink hover:bg-amber-dark shadow-soft',
  ghost: 'bg-transparent text-ink hover:bg-fog/60',
  danger: 'bg-danger text-white hover:bg-danger/90',
  outline: 'border border-ink/20 text-ink hover:border-ink/40 hover:bg-white',
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'h-10 w-10 p-0',
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      )}
      {children}
    </button>
  )
}
