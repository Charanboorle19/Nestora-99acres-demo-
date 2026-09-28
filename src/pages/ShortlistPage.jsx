import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GitCompare, Heart, Trash2 } from 'lucide-react'
import ListingCard from '../components/listings/ListingCard'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import { ListingCardSkeleton } from '../components/ui/Skeleton'
import { useCompareStore, useShortlistStore } from '../store'
import { getListingById } from '../services/api'
import { formatINR, formatArea, formatPricePerSqft } from '../utils/format'
import { useToast } from '../components/ui/Toast'

const COMPARE_ROWS = [
  { key: 'price', label: 'Price', render: (l) => formatINR(l.price) },
  { key: 'psf', label: '₹ / sq.ft', render: (l) => formatPricePerSqft(l.price, l.area) },
  { key: 'bhk', label: 'BHK', render: (l) => l.bhk || '—' },
  { key: 'area', label: 'Area', render: (l) => formatArea(l.area) },
  { key: 'type', label: 'Type', render: (l) => l.propertyType },
  { key: 'furnish', label: 'Furnishing', render: (l) => l.furnishing || '—' },
  { key: 'possession', label: 'Possession', render: (l) => l.possession },
  { key: 'locality', label: 'Locality', render: (l) => l.localityName },
  { key: 'posted', label: 'Posted by', render: (l) => l.postedBy?.type },
  { key: 'verified', label: 'Verified', render: (l) => (l.verified ? 'Yes' : 'No') },
]

export default function ShortlistPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { ids, toggle, clear } = useShortlistStore()
  const compare = useCompareStore()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('grid')

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      if (!ids.length) {
        setItems([])
        setLoading(false)
        return
      }
      const listings = await Promise.all(
        ids.map(async (id) => {
          try {
            return await getListingById(id)
          } catch {
            return null
          }
        }),
      )
      if (!alive) return
      setItems(listings.filter(Boolean))
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [ids])

  const compared = items.filter((i) => compare.ids.includes(i.id)).slice(0, 3)

  const toggleCompare = (id) => {
    const ok = compare.toggle(id)
    if (ok === false) toast.error('You can compare up to 3 properties')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Shortlist</h1>
          <p className="text-sm text-ink-muted">{ids.length} saved home{ids.length === 1 ? '' : 's'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={mode === 'compare' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setMode(mode === 'compare' ? 'grid' : 'compare')}
            disabled={compare.ids.length < 2 && mode !== 'compare'}
          >
            <GitCompare className="h-4 w-4" /> Compare ({compare.ids.length}/3)
          </Button>
          {ids.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clear()
                compare.clear()
                toast.info('Shortlist cleared')
              }}
            >
              <Trash2 className="h-4 w-4" /> Clear all
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="mt-8">
          <EmptyState
            icon={Heart}
            title="No shortlisted homes yet"
            description="Tap the heart on search results or property pages to save homes here."
            actionLabel="Browse homes"
            onAction={() => navigate('/search')}
          />
        </div>
      )}

      {!loading && mode !== 'compare' && items.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <ListingCard listing={item} />
              <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                <Button
                  size="sm"
                  variant={compare.ids.includes(item.id) ? 'amber' : 'secondary'}
                  className="flex-1 bg-white/95"
                  onClick={() => toggleCompare(item.id)}
                >
                  {compare.ids.includes(item.id) ? 'In compare' : 'Add to compare'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-white/95"
                  onClick={() => toggle(item.id)}
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && mode === 'compare' && (
        <Card className="mt-8 overflow-x-auto p-0">
          {compared.length < 2 ? (
            <div className="p-8 text-center text-sm text-ink-muted">
              Select 2–3 homes with “Add to compare”, then open compare again.
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-mist/60">
                  <th className="sticky left-0 bg-mist/60 px-4 py-3 text-left font-semibold">Feature</th>
                  {compared.map((l) => (
                    <th key={l.id} className="min-w-[12rem] px-4 py-3 text-left">
                      <Link to={`/property/${l.id}`} className="font-bold text-ink hover:underline">
                        {l.title}
                      </Link>
                      <div className="mt-1">
                        {l.featured && <Badge tone="featured">Featured</Badge>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row) => (
                  <tr key={row.key} className="border-b border-border">
                    <td className="sticky left-0 bg-white px-4 py-3 font-semibold text-ink-muted">
                      {row.label}
                    </td>
                    {compared.map((l) => (
                      <td key={l.id} className="px-4 py-3 font-medium capitalize">
                        {row.render(l)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  )
}
