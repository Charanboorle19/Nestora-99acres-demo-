import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, Calculator } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import SearchBar from '../components/search/SearchBar'
import { ListingCardSkeleton } from '../components/ui/Skeleton'
import ListingCard from '../components/listings/ListingCard'
import { CITIES, BRAND } from '../utils/constants'
import { formatINR } from '../utils/format'
import { filtersToSearchParams } from '../utils/searchParams'
import { getFeaturedListings, getPopularLocalities, getProjects } from '../services/api'

export default function HomePage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('buy')
  const [cityId, setCityId] = useState('hyderabad')
  const [query, setQuery] = useState('')
  const [localities, setSelectedLocalities] = useState([])
  const [featured, setFeatured] = useState([])
  const [popular, setPopular] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      const [f, locs, prjs] = await Promise.all([
        getFeaturedListings(6),
        getPopularLocalities(cityId, 6),
        getProjects({ cityId }),
      ])
      if (!alive) return
      setFeatured(f)
      setPopular(locs)
      setProjects(prjs.slice(0, 4))
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [cityId])

  const onSearch = () => {
    const params = filtersToSearchParams({
      type: tab,
      cityId,
      q: query,
      localities,
      view: 'grid',
      page: 1,
    })
    navigate(`/search?${params.toString()}`)
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'linear-gradient(120deg, rgba(11,61,92,0.92) 0%, rgba(11,61,92,0.72) 45%, rgba(11,61,92,0.45) 100%), url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&q=80)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            {BRAND.name}
          </p>
          <h1 className="mt-3 max-w-xl text-balance text-xl font-medium text-white/90 sm:text-2xl">
            {BRAND.tagline}
          </h1>
          <p className="mt-3 max-w-lg text-sm text-white/70">
            Search buy, rent, PG and new projects across Hyderabad, Bengaluru, Mumbai, Pune and Delhi NCR.
          </p>

          <Card className="mt-8 max-w-4xl overflow-hidden border-0 p-3 sm:p-4">
            <SearchBar
              tab={tab}
              onTabChange={setTab}
              cityId={cityId}
              onCityChange={(id) => {
                setCityId(id)
                setSelectedLocalities([])
              }}
              query={query}
              onQueryChange={setQuery}
              selectedLocalities={localities}
              onLocalitiesChange={setSelectedLocalities}
              onSubmit={onSearch}
            />
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Featured homes</h2>
            <p className="text-sm text-ink-muted">Hand-picked listings from the mock catalogue</p>
          </div>
          <Link to="/search?type=buy" className="inline-flex items-center gap-1 text-sm font-bold text-ink">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading && Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
          {!loading && featured.map((item) => <ListingCard key={item.id} listing={item} />)}
        </div>
      </section>

      <section className="bg-white/60 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Popular localities</h2>
          <p className="text-sm text-ink-muted">In {CITIES.find((c) => c.id === cityId)?.name}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {popular.map((l) => (
              <Link
                key={l.id}
                to={`/search?city=${cityId}&locality=${l.id}`}
                className="rounded-2xl border border-border bg-white p-4 shadow-soft transition hover:border-ink/30"
              >
                <div className="flex items-center gap-2 font-bold text-ink">
                  <MapPin className="h-4 w-4 text-amber" />
                  {l.name}
                </div>
                <div className="mt-1 text-sm text-ink-muted">
                  Avg {formatINR(l.avgPricePerSqft)}/sq.ft · {l.listingCount} homes
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">New projects</h2>
            <p className="text-sm text-ink-muted">Open a microsite for configs, inventory and RERA</p>
          </div>
          <Link to="/search?type=projects" className="text-sm font-bold text-ink">
            See all
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/project/${p.slug}`}
              className="min-w-[260px] max-w-[280px] shrink-0 overflow-hidden rounded-2xl border border-border bg-white shadow-soft"
            >
              <img src={p.heroImage} alt={p.name} className="h-36 w-full object-cover" />
              <div className="p-4">
                <Badge tone="mist">{p.status}</Badge>
                <div className="mt-2 font-bold">{p.name}</div>
                <div className="text-sm text-ink-muted">
                  {p.localityName} · by {p.builderName}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <Card className="flex flex-col items-start gap-4 bg-gradient-to-br from-ink to-ink-soft p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white/10 p-3">
              <Calculator className="h-6 w-6 text-amber" />
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">Quick EMI check</h3>
              <p className="text-sm text-white/70">Estimate monthly payments with amortization charts.</p>
            </div>
          </div>
          <Button variant="amber" onClick={() => navigate('/tools/emi')}>
            Open EMI calculator
          </Button>
        </Card>
      </section>
    </div>
  )
}
