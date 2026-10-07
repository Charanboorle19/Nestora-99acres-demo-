import { Link } from 'react-router-dom'
import { Heart, MapPin, Bath, Maximize2 } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatINR, formatArea, cn } from '../../utils/format'
import { useShortlistStore } from '../../store'
import { useToast } from '../ui/Toast'

export default function ListingCard({ listing, layout = 'grid', selected, onSelect }) {
  const shortlist = useShortlistStore()
  const toast = useToast()
  const saved = shortlist.has(listing.id)
  const listingStatus = listing.listingType === 'sale' ? 'For Sale' : 'For Lease'

  const toggleSave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    shortlist.toggle(listing.id)
    toast.success(saved ? 'Removed from shortlist' : 'Saved to shortlist')
  }

  if (layout === 'list') {
    return (
      <article
        className={cn(
          'group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-soft transition sm:flex-row',
          selected ? 'border-ink ring-2 ring-ink/20' : 'border-border hover:shadow-lift',
        )}
      >
        <Link to={`/property/${listing.id}`} className="relative h-44 w-full shrink-0 sm:h-auto sm:w-56 md:w-64" onClick={onSelect}>
          <img src={listing.photos[0]} alt={listing.title} className="h-full w-full object-cover" />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {listing.featured && <Badge tone="featured">Featured</Badge>}
            {listing.verified && <Badge tone="verified">Verified</Badge>}
          </div>
        </Link>
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/property/${listing.id}`} onClick={onSelect}>
              <div className="text-xl font-extrabold text-ink">{formatINR(listing.price)}</div>
              <div className="mt-1 font-semibold text-ink group-hover:underline">{listing.title}</div>
            </Link>
            <Badge tone="amber" className="shrink-0 whitespace-nowrap">{listingStatus}</Badge>
            <Button variant="ghost" size="icon" onClick={toggleSave} aria-label="Shortlist">
              <Heart className={cn('h-5 w-5', saved && 'fill-danger text-danger')} />
            </Button>
          </div>
          <div className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
            <MapPin className="h-3.5 w-3.5" />
            {listing.localityName} · {listing.address}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-ink-muted">
            {listing.bhk && <span>{listing.bhk}</span>}
            <span className="inline-flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              {formatArea(listing.area)}
            </span>
            {listing.bathrooms != null && (
              <span className="inline-flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" />
                {listing.bathrooms} bath
              </span>
            )}
            <span className="capitalize">By {listing.postedBy?.type}</span>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-2xl border bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift',
        selected ? 'border-ink ring-2 ring-ink/20' : 'border-border',
      )}
    >
      <Link to={`/property/${listing.id}`} className="relative block h-44 overflow-hidden" onClick={onSelect}>
        <img
          src={listing.photos[0]}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1">
          {listing.featured && <Badge tone="featured">Featured</Badge>}
          {listing.verified && <Badge tone="verified">Verified</Badge>}
        </div>
        <button
          type="button"
          onClick={toggleSave}
          className="absolute right-3 top-3 rounded-full bg-white/95 p-2 shadow-soft"
          aria-label="Shortlist"
        >
          <Heart className={cn('h-4 w-4', saved && 'fill-danger text-danger')} />
        </button>
      </Link>
      <Link to={`/property/${listing.id}`} className="block p-4" onClick={onSelect}>
        <div className="flex items-start justify-between gap-2">
          <div className="text-lg font-extrabold text-ink">{formatINR(listing.price)}</div>
          <Badge tone="amber" className="shrink-0 whitespace-nowrap">{listingStatus}</Badge>
        </div>
        <div className="mt-1 line-clamp-1 font-semibold text-ink">{listing.title}</div>
        <div className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{listing.localityName}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-ink-muted">
          {listing.bhk && <span>{listing.bhk}</span>}
          <span>{formatArea(listing.area)}</span>
        </div>
      </Link>
    </article>
  )
}
