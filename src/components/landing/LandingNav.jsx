import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { BRAND } from '../../utils/constants'
import { useToast } from '../ui/Toast'
import { cn } from '../../utils/format'

const LINKS = [
  { to: '/search', label: 'Browse Properties', kind: 'route' },
  { to: 'active-requirements', label: 'Wanted', kind: 'scroll' },
  { to: '/post-property', label: 'List Your Property', kind: 'route' },
  { to: 'promote', label: 'Promote', kind: 'soon' },
]

export default function LandingNav({ onPromote }) {
  const [open, setOpen] = useState(false)
  const toast = useToast()

  const comingSoon = () => {
    toast.info('Demo prototype: coming soon')
    setOpen(false)
  }

  const scrollToRequirements = () => {
    document.getElementById('active-requirements')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }

  const promote = () => {
    onPromote?.()
    setOpen(false)
  }

  return (
    <header
      className="hrp-landing-nav fixed inset-x-0 top-0 z-40 border-b bg-white/95 backdrop-blur"
      style={{ borderColor: 'var(--hrp-border)' }}
    >
      <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2" aria-label={BRAND.name}>
          <svg width="36" height="36" viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect width="64" height="64" rx="14" fill="#0B1F3A" />
            <path d="M14 36 L32 18 L50 36 V50 H38 V40 H26 V50 H14 Z" fill="#F5B400" />
            <circle cx="32" cy="34" r="4" fill="#0B1F3A" />
          </svg>
          <span className="hrp-display text-xl font-bold tracking-tight sm:text-2xl" style={{ color: 'var(--hrp-ink)' }}>
            High Rise Properties
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) =>
            l.label === 'Promote' ? (
              <button key={l.label} type="button" onClick={promote} className="rounded-lg px-3 py-2 text-sm font-semibold text-[#5B6B7C] transition hover:bg-[#F3F4F6] hover:text-[#0B1F3A]">{l.label}</button>
            ) : l.kind === 'soon' ? (
              <button
                key={l.label}
                type="button"
                onClick={comingSoon}
                className="rounded-lg px-3 py-2 text-sm font-semibold transition"
                style={{ color: 'var(--hrp-ink-muted)' }}
              >
                {l.label}
              </button>
            ) : l.kind === 'scroll' ? (
              <button
                key={l.label}
                type="button"
                onClick={scrollToRequirements}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#5B6B7C] transition hover:bg-[#F3F4F6] hover:text-[#0B1F3A]"
              >
                {l.label}
              </button>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm font-semibold transition',
                    isActive ? 'bg-[#0B1F3A] text-white' : 'text-[#5B6B7C] hover:bg-[#F3F4F6] hover:text-[#0B1F3A]',
                  )
                }
              >
                {l.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${BRAND.phoneTel}`}
            className="hidden items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold sm:inline-flex"
            style={{ borderColor: 'var(--hrp-border)', color: 'var(--hrp-ink)' }}
          >
            <Phone className="h-4 w-4" style={{ color: 'var(--hrp-amber-dark)' }} />
            {BRAND.phoneDisplay}
          </a>
          <Link to="/post-property" className="hrp-btn hrp-btn-amber hidden h-9 px-3 text-sm sm:inline-flex">
            List Your Property
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border lg:hidden"
            style={{ borderColor: 'var(--hrp-border)' }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-white px-4 py-3 lg:hidden" style={{ borderColor: 'var(--hrp-border)' }}>
          <div className="flex flex-col gap-1">
            {LINKS.map((l) =>
              l.label === 'Promote' ? (
                <button key={l.label} type="button" onClick={promote} className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold" style={{ color: 'var(--hrp-ink)' }}>{l.label}</button>
              ) : l.kind === 'soon' ? (
                <button
                  key={l.label}
                  type="button"
                  onClick={comingSoon}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold"
                  style={{ color: 'var(--hrp-ink)' }}
                >
                  {l.label}
                </button>
              ) : l.kind === 'scroll' ? (
                <button
                  key={l.label}
                  type="button"
                  onClick={scrollToRequirements}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-semibold"
                  style={{ color: 'var(--hrp-ink)' }}
                >
                  {l.label}
                </button>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold"
                  style={{ color: 'var(--hrp-ink)' }}
                >
                  {l.label}
                </Link>
              ),
            )}
            <a href={`tel:${BRAND.phoneTel}`} className="rounded-lg px-3 py-2.5 text-sm font-bold" style={{ color: 'var(--hrp-ink)' }}>
              Call {BRAND.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
