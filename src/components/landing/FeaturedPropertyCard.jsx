import { Link } from 'react-router-dom'
import { Phone, MessageCircle, MapPin, ArrowUpRight } from 'lucide-react'
import { formatINR, formatArea, cn } from '../../utils/format'
import { BRAND } from '../../utils/constants'

function waLink(message) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(message)}`
}

export default function FeaturedPropertyCard({ listing, className }) {
  if (!listing) return null

  const photo = listing.photos?.[0]
  const price = formatINR(listing.price)
  const area = formatArea(listing.area)
  const wa = waLink(
    `Hi High Rise Properties, I'm interested in: ${listing.title} (${listing.id}). Please share details.`,
  )

  return (
    <article
      className={cn('hrp-featured-card', className)}
      style={{ borderColor: 'var(--hrp-border)' }}
    >
      <Link to={`/property/${listing.id}`} className="hrp-featured-card-image group" style={{ background: 'var(--hrp-ink)' }}>
        <img
          src={photo}
          alt={listing.title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1">
          <span className="hrp-badge hrp-badge-amber">
            {listing.listingType === 'rent' || listing.listingType === 'pg' ? 'For Lease' : 'For Sale'}
          </span>
          {listing.verified && <span className="hrp-badge hrp-badge-ink">Verified</span>}
        </div>
        <span className="hrp-featured-card-arrow"><ArrowUpRight className="h-3.5 w-3.5" /></span>
      </Link>
      <div className="hrp-featured-card-content">
        <Link to={`/property/${listing.id}`}>
          <div className="hrp-featured-card-price hrp-display">
            {price}
          </div>
          <h3 className="hrp-featured-card-title line-clamp-2">
            {listing.title}
          </h3>
          <div className="hrp-featured-card-location">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{listing.localityName || listing.cityName || 'Hyderabad'}</span>
          </div>
          <div className="hrp-featured-card-meta">
            <span>{listing.propertyType}</span>
            {listing.bhk && <span>{listing.bhk}</span>}
            {area && <span>{area}</span>}
          </div>
        </Link>
        <div className="hrp-featured-card-actions">
          <a href={`tel:${BRAND.phoneTel}`} className="hrp-btn hrp-btn-ink">
            <Phone className="h-3.5 w-3.5" /> Call
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="hrp-btn"
            style={{ background: '#25D366' }}
          >
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
        </div>
      </div>
    </article>
  )
}
