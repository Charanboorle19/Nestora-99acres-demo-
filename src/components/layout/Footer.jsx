import { Link } from 'react-router-dom'
import Logo from '../brand/Logo'
import { BRAND } from '../../utils/constants'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="[&_span]:text-white" />
          <p className="mt-3 max-w-md text-sm text-white/70">{BRAND.tagline}. A frontend-only demo marketplace for client presentations.</p>
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-wide text-amber">Explore</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            <Link to="/search?type=buy">Buy homes</Link>
            <Link to="/search?type=rent">Rent homes</Link>
            <Link to="/search?type=projects">New projects</Link>
            <Link to="/tools/emi">EMI calculator</Link>
          </div>
        </div>
        <div>
          <div className="text-sm font-bold uppercase tracking-wide text-amber">Sellers</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/80">
            <Link to="/post-property">Post property</Link>
            <Link to="/seller">Seller dashboard</Link>
            <Link to="/builder/aether-spaces">Builder profile (demo)</Link>
            <Link to="/project/aether-crest">Project microsite (demo)</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {BRAND.name}. Demo product — all listings and contacts are fictional.
      </div>
    </footer>
  )
}
