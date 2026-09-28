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
import { formatArea, formatINR, cn } from '../utils/format'
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
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="aspect-[16/10] w-full" />
        <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
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
    { icon: BedDouble, label: 'Configuration', value: listing.bhk || listing.propertyType },
    { icon: Maximize2, label: 'Built-up', value: formatArea(listing.area) },
    { icon: Bath, label: 'Bathrooms', value: listing.bathrooms ?? '—' },
    { icon: Compass, label: 'Facing', value: listing.facing || '—' },
    { icon: Building2, label: 'Floor', value: listing.floor || '—' },
    { icon: Building2, label: 'Furnishing', value: listing.furnishing || '—' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2">
            {listing.featured && <Badge tone="featured">Featured</Badge>}
            {listing.verified && <Badge tone="verified">Verified</Badge>}
            <Badge tone="mist" className="capitalize">
              {listing.listingType}
            </Badge>
          </div>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">{listing.title}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {listing.address}, {listing.localityName}, {cityName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              shortlist.toggle(listing.id)
              toast.success(saved ? 'Removed from shortlist' : 'Added to shortlist')
            }}
          >
            <Heart className={cn('h-4 w-4', saved && 'fill-danger text-danger')} /> Shortlist
          </Button>
          <Button variant="secondary" size="sm" onClick={share}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setReportOpen(true)}>
            <Flag className="h-4 w-4" /> Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <PhotoGallery
            photos={listing.photos}
            floorPlan={listing.floorPlan}
            videoTourUrl={listing.videoTourUrl}
            title={listing.title}
          />

          <Card className="p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-3xl font-extrabold text-ink lg:hidden">{formatINR(listing.price)}</div>
                <h2 className="font-display text-xl font-semibold">Key facts</h2>
              </div>
              <div className="text-sm text-ink-muted">RERA {listing.reraId}</div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="rounded-xl bg-mist p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
                    <f.icon className="h-3.5 w-3.5" />
                    {f.label}
                  </div>
                  <div className="mt-1 text-sm font-bold text-ink">{f.value}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">About this home</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{listing.description}</p>
            <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <span className="font-semibold text-ink">Possession:</span>{' '}
                <span className="text-ink-muted">
                  {listing.possession}
                  {listing.possessionDate ? ` · ${listing.possessionDate}` : ''}
                </span>
              </div>
              <div>
                <span className="font-semibold text-ink">Age:</span>{' '}
                <span className="text-ink-muted">
                  {listing.ageYears ? `${listing.ageYears} years` : 'New / under construction'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-ink">Parking:</span>{' '}
                <span className="text-ink-muted">{listing.parking} spot(s)</span>
              </div>
              <div>
                <span className="font-semibold text-ink">Carpet area:</span>{' '}
                <span className="text-ink-muted">{formatArea(listing.carpetArea)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Amenities</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {listing.amenities.map((a) => (
                <div key={a} className="rounded-xl border border-border px-3 py-2 text-sm font-medium">
                  {a}
                </div>
              ))}
            </div>
          </Card>

          <LocalityInsights insights={listing.localityInsights} localityName={listing.localityName} />
          <NearbyPlaces listing={listing} />

          <Card className="p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-mist p-3">
                  <Calculator className="h-5 w-5 text-ink" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">EMI for this home</div>
                  <div className="text-sm text-ink-muted">Adjust tenure and rate — prefilled with listing price</div>
                </div>
              </div>
              <Link
                to={`/tools/emi?amount=${listing.price}`}
                className="text-sm font-bold text-ink hover:underline"
              >
                Full schedule →
              </Link>
            </div>
            <EmiCalculator key={listing.id} initialAmount={listing.price} compact />
          </Card>

          <SimilarCarousel listings={similar} />
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <ContactCard
            listing={listing}
            onEnquiry={() => setEnquiryOpen(true)}
            onVisit={() => setVisitOpen(true)}
          />
        </div>
      </div>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} listing={listing} />
      <SiteVisitModal open={visitOpen} onClose={() => setVisitOpen(false)} listing={listing} />
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} listing={listing} />
    </div>
  )
}
