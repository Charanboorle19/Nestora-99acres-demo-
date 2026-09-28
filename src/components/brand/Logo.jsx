import { Link } from 'react-router-dom'
import { BRAND } from '../../utils/constants'
import { cn } from '../../utils/format'

export default function Logo({ className, markOnly = false }) {
  return (
    <Link to="/" className={cn('inline-flex items-center gap-2', className)} aria-label={BRAND.name}>
      <svg width="36" height="36" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#0B3D5C" />
        <path d="M14 36 L32 18 L50 36 V50 H38 V40 H26 V50 H14 Z" fill="#E8A838" />
        <circle cx="32" cy="34" r="4" fill="#0B3D5C" />
      </svg>
      {!markOnly && (
        <span className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
          {BRAND.name}
        </span>
      )}
    </Link>
  )
}
