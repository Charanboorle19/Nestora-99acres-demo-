import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Heart,
  Share2,
  Flag,
  BedDouble,
  Bath,
  Maximize2,
  Compass,
  Building2,
  Calculator,
} from 'lucide-react'
import PhotoGallery from '../components/property/PhotoGallery'
import ContactCard from '../components/property/ContactCard'
import EnquiryModal from '../components/property/EnquiryModal'
import SiteVisitModal from '../components/property/SiteVisitModal'
import ReportModal from '../components/property/ReportModal'
import LocalityInsights from '../components/property/LocalityInsights'
import NearbyPlaces from '../components/property/NearbyPlaces'
import SimilarCarousel from '../components/property/SimilarCarousel'
import EmiCalculator from '../components/tools/EmiCalculator'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Skeleton from '../components/ui/Skeleton'
import { getListingById, getSimilarListings } from '../services/api'
import { useShortlistStore } from '../store'
import { useToast } from '../components/ui/Toast'
import { formatArea, formatINR, formatPricePerSqft, cn } from '../utils/format'
import { CITIES } from '../utils/constants'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const toast = useToast()
  const shortlist = useShortlistStore()
  const [listing, setListing] = useState(null)
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enquiryOpen, setEnquiryOpen] = useState(false)
  const [visitOpen, setVisitOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const item = await getListingById(id)
        const sims = await getSimilarListings(item.id, 8)
        if (!alive) return
        setListing(item)
        setSimilar(sims)
      } catch {
        if (alive) setError('Listing not found')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-3 py-6 sm:px-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="aspect-4/3 w-full sm:aspect-16/10" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Property not found</h1>
        <p className="mt-2 text-sm text-ink-muted">This listing may have expired or the link is incorrect.</p>
        <Link
          to="/search"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-ink px-4 text-sm font-semibold text-white"
        >
          Back to search
        </Link>
      </div>
    )
  }

  const saved = shortlist.has(listing.id)
  const cityName = CITIES.find((c) => c.id === listing.cityId)?.name

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast.success('Link copied to clipboard')
      }
    } catch {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }

  const facts = [
    { icon: BedDouble, label: 'Config', value: listing.bhk || listing.propertyType },
    { icon: Maximize2, label: 'Built-up', value: formatArea(listing.area) },
    { icon: Bath, label: 'Baths', value: listing.bathrooms ?? '—' },
    { icon: Compass, label: 'Facing', value: listing.facing || '—' },
    { icon: Building2, label: 'Floor', value: listing.floor || '—' },
    { icon: Building2, label: 'Furnishing', value: listing.furnishing || '—' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-3 py-4 pb-28 sm:px-6 sm:py-6 lg:pb-8">
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Main column */}
        <div className="min-w-0 space-y-4 sm:space-y-6">
          <PhotoGallery
            photos={listing.photos}
            floorPlan={listing.floorPlan}
            videoTourUrl={listing.videoTourUrl}
            title={listing.title}
          />

          {/* Title + actions */}
          <div className="min-w-0">
            <div className="flex flex-wrap gap-1.5">
              {listing.featured && <Badge tone="featured">Featured</Badge>}
              {listing.verified && <Badge tone="verified">Verified</Badge>}
              <Badge tone="mist" className="capitalize">
                {listing.listingType}
              </Badge>
            </div>
            <h1 className="mt-2 wrap-break-word font-display text-xl font-semibold leading-snug text-ink sm:text-2xl lg:text-3xl">
              {listing.title}
            </h1>
            <p className="mt-1 wrap-break-word text-sm leading-relaxed text-ink-muted">
              {listing.address}, {listing.localityName}, {cityName}
            </p>

            {/* Mobile price */}
            <div className="mt-3 rounded-2xl border border-border bg-white p-4 shadow-soft lg:hidden">
              <div className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                {formatINR(listing.price)}
              </div>
              <div className="mt-0.5 text-sm text-ink-muted">
                {formatPricePerSqft(listing.price, listing.area)}
                {listing.listingType === 'rent' || listing.listingType === 'pg' ? ' · monthly' : ''}
              </div>
              <div className="mt-2 text-sm capitalize text-ink-muted">
                Posted by {listing.postedBy?.type}:{' '}
                <span className="font-semibold text-ink">{listing.postedBy?.name}</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full px-2"
                onClick={() => {
                  shortlist.toggle(listing.id)
                  toast.success(saved ? 'Removed from shortlist' : 'Added to shortlist')
                }}
              >
                <Heart className={cn('h-4 w-4 shrink-0', saved && 'fill-danger text-danger')} />
                <span className="truncate">Shortlist</span>
              </Button>
              <Button variant="secondary" size="sm" className="w-full px-2" onClick={share}>
                <Share2 className="h-4 w-4 shrink-0" />
                <span className="truncate">Share</span>
              </Button>
              <Button variant="ghost" size="sm" className="w-full px-2" onClick={() => setReportOpen(true)}>
                <Flag className="h-4 w-4 shrink-0" />
                <span className="truncate">Report</span>
              </Button>
            </div>
          </div>

          <Card className="min-w-0 p-4 sm:p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h2 className="font-display text-lg font-semibold sm:text-xl">Key facts</h2>
              {listing.reraId && (
                <div className="max-w-full truncate text-xs text-ink-muted sm:text-sm">RERA {listing.reraId}</div>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-3 sm:gap-3">
              {facts.map((f) => (
                <div key={f.label} className="min-w-0 rounded-xl bg-mist p-3">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted sm:text-xs sm:normal-case sm:tracking-normal">
                    <f.icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{f.label}</span>
                  </div>
                  <div className="mt-1 wrap-break-word text-sm font-bold capitalize text-ink">{f.value}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="min-w-0 p-4 sm:p-5">
            <h2 className="font-display text-lg font-semibold sm:text-xl">About this home</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{listing.description}</p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="min-w-0">
                <span className="font-semibold text-ink">Possession:</span>{' '}
                <span className="text-ink-muted">
                  {listing.possession}
                  {listing.possessionDate ? ` · ${listing.possessionDate}` : ''}
                </span>
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-ink">Age:</span>{' '}
                <span className="text-ink-muted">
                  {listing.ageYears ? `${listing.ageYears} years` : 'New / under construction'}
                </span>
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-ink">Parking:</span>{' '}
                <span className="text-ink-muted">{listing.parking} spot(s)</span>
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-ink">Carpet area:</span>{' '}
                <span className="text-ink-muted">{formatArea(listing.carpetArea)}</span>
              </div>
            </div>
          </Card>

          <Card className="min-w-0 p-4 sm:p-5">
            <h2 className="font-display text-lg font-semibold sm:text-xl">Amenities</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:grid-cols-3">
              {listing.amenities.map((a) => (
                <div
                  key={a}
                  className="wrap-break-word rounded-xl border border-border px-2.5 py-2 text-xs font-medium leading-snug sm:px-3 sm:text-sm"
                >
                  {a}
                </div>
              ))}
            </div>
          </Card>

          <LocalityInsights insights={listing.localityInsights} localityName={listing.localityName} />
          <NearbyPlaces listing={listing} />

          <Card className="min-w-0 p-4 sm:p-5">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-xl bg-mist p-2.5 sm:p-3">
                  <Calculator className="h-5 w-5 text-ink" />
                </div>
                <div className="min-w-0">
                  <div className="font-display text-base font-semibold sm:text-lg">EMI for this home</div>
                  <div className="text-sm text-ink-muted">Adjust tenure and rate — prefilled with listing price</div>
                </div>
              </div>
              <Link
                to={`/tools/emi?amount=${listing.price}`}
                className="shrink-0 text-sm font-bold text-ink hover:underline"
              >
                Full schedule →
              </Link>
            </div>
            <EmiCalculator key={listing.id} initialAmount={listing.price} compact />
          </Card>

          <SimilarCarousel listings={similar} />
        </div>

        {/* Desktop sidebar */}
        <aside className="hidden min-w-0 lg:block">
          <div className="sticky top-20 self-start">
            <ContactCard
              listing={listing}
              onEnquiry={() => setEnquiryOpen(true)}
              onVisit={() => setVisitOpen(true)}
            />
          </div>
        </aside>
      </div>

      {/* Mobile sticky CTAs */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 p-3 safe-pb backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-2">
          <Button className="min-w-0 flex-1" onClick={() => setEnquiryOpen(true)}>
            Contact
          </Button>
          <Button variant="amber" className="min-w-0 flex-1" onClick={() => setVisitOpen(true)}>
            Site visit
          </Button>
        </div>
      </div>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} listing={listing} />
      <SiteVisitModal open={visitOpen} onClose={() => setVisitOpen(false)} listing={listing} />
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} listing={listing} />
    </div>
  )
}
