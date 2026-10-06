import { Link } from 'react-router-dom'
import { BRAND } from '../../utils/constants'
import { useToast } from '../ui/Toast'

export default function LandingFooter({ onPromote }) {
  const toast = useToast()
  const comingSoon = () => toast.info('Demo prototype: coming soon')

  return (
    <footer className="mt-16 border-t text-white" style={{ background: 'var(--hrp-ink)', borderColor: 'var(--hrp-ink-soft)' }}>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="hrp-display text-2xl font-bold tracking-wide" style={{ color: 'var(--hrp-amber)' }}>
            High Rise Properties
          </div>
          <p className="mt-2 text-sm text-white/70">{BRAND.tagline}</p>
          <p className="mt-3 text-sm font-semibold">{BRAND.phoneDisplay}</p>
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block text-sm hover:underline"
            style={{ color: 'var(--hrp-amber)' }}
          >
            Instagram {BRAND.instagramHandle}
          </a>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white/50">Explore</div>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link to="/search" className="hover:text-[#F5B400]">
              Browse Properties
            </Link>
            <button type="button" onClick={comingSoon} className="text-left hover:text-[#F5B400]">
              Wanted / Requirements
            </button>
            <Link to="/post-property" className="hover:text-[#F5B400]">
              List Your Property
            </Link>
            <button type="button" onClick={onPromote} className="text-left hover:text-[#F5B400]">
              Promote my property
            </button>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-white/50">Notes</div>
          <p className="mt-3 text-sm text-white/70">
            Documents checked before listing. Testimonials, counts and some listings are marked as sample content for
            this demo.
          </p>
          <Link
            to="/seller"
            className="mt-4 inline-block text-sm font-bold underline-offset-2 hover:underline"
            style={{ color: 'var(--hrp-amber)' }}
          >
            Team login
          </Link>
          <div className="mt-4 inline-flex rounded-full border border-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/60">
            Demo prototype
          </div>
        </div>
      </div>
    </footer>
  )
}
