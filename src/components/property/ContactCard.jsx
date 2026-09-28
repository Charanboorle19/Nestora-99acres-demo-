import { useEffect, useState } from 'react'
import { Phone, CalendarDays, MessageSquare, ShieldCheck } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { useAuthStore } from '../../store'
import { formatINR, formatPricePerSqft } from '../../utils/format'

export default function ContactCard({
  listing,
  onEnquiry,
  onVisit,
  className = '',
}) {
  const { user, openLogin, loginIntent, clearLoginIntent } = useAuthStore()
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (user && loginIntent === 'view-phone') {
      setRevealed(true)
      clearLoginIntent()
    }
  }, [user, loginIntent, clearLoginIntent])

  const viewPhone = () => {
    if (!user) {
      openLogin('view-phone')
      return
    }
    setRevealed(true)
  }

  return (
    <Card className={`p-5 ${className}`}>
      <div className="text-2xl font-extrabold text-ink">{formatINR(listing.price)}</div>
      <div className="mt-1 text-sm text-ink-muted">
        {formatPricePerSqft(listing.price, listing.area)}
        {listing.listingType === 'rent' || listing.listingType === 'pg' ? ' · monthly' : ''}
      </div>

      <div className="mt-4 rounded-xl bg-mist p-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-bold capitalize">{listing.postedBy?.type}</div>
            <div className="text-sm text-ink">{listing.postedBy?.name}</div>
            {listing.postedBy?.firm && (
              <div className="text-xs text-ink-muted">{listing.postedBy.firm}</div>
            )}
          </div>
          {listing.verified && (
            <Badge tone="verified" className="gap-1">
              <ShieldCheck className="h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
        <div className="mt-3 text-sm font-semibold text-ink">
          {revealed ? listing.postedBy?.phone : '+91 XXXXX XXXXX'}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Button className="w-full" onClick={onEnquiry}>
          <MessageSquare className="h-4 w-4" /> Contact {listing.postedBy?.type || 'seller'}
        </Button>
        <Button variant="secondary" className="w-full" onClick={viewPhone}>
          <Phone className="h-4 w-4" /> {revealed ? 'Phone revealed' : 'View phone number'}
        </Button>
        <Button variant="amber" className="w-full" onClick={onVisit}>
          <CalendarDays className="h-4 w-4" /> Schedule site visit
        </Button>
      </div>
    </Card>
  )
}
