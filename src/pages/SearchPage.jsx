import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Filter, Grid3X3, List, Map as MapIcon, BookmarkPlus } from 'lucide-react'
import SearchBar from '../components/search/SearchBar'
import SearchFilters from '../components/search/SearchFilters'
import FilterChips from '../components/search/FilterChips'
import BottomSheet from '../components/search/BottomSheet'
import ListingCard from '../components/listings/ListingCard'
import SearchMap from '../components/map/SearchMap'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import { ListingCardSkeleton } from '../components/ui/Skeleton'
import { getListings, getLocalities, getProjects } from '../services/api'
import {
  parseSearchParams,
  filtersToSearchParams,
  toApiFilters,
  activeFilterChips,
  DEFAULT_FILTERS,
} from '../utils/searchParams'
import { CITIES } from '../utils/constants'
import { formatINR } from '../utils/format'
import { useAuthStore, useSavedSearchStore, useNotificationStore } from '../store'
import { useToast } from '../components/ui/Toast'

const SORT_OPTIONS = [
  { id: 'relevance', label: 'Relevance' },
  { id: 'price_asc', label: 'Price ↑' },
  { id: 'price_desc', label: 'Price ↓' },
  { id: 'newest', label: 'Newest' },
  { id: 'area_desc', label: 'Area ↓' },
]

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { user, openLogin } = useAuthStore()
  const addSavedSearch = useSavedSearchStore((s) => s.add)
  const addNotification = useNotificationStore((s) => s.add)

  const filters = useMemo(() => parseSearchParams(searchParams), [searchParams])
  const [sheetOpen, setSheetOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 })
  const [mapItems, setMapItems] = useState([])
  const [projects, setProjects] = useState([])
  const [localityMap, setLocalityMap] = useState({})
  const [selectedId, setSelectedId] = useState(null)
  const [draftQuery, setDraftQuery] = useState(filters.q)
  const [draftLocalities, setDraftLocalities] = useState(filters.localities)

  useEffect(() => {
    setDraftQuery(filters.q)
    setDraftLocalities(filters.localities)
  }, [filters.q, filters.localities])

  useEffect(() => {
    getLocalities(filters.cityId).then((locs) => {
      const map = {}
      locs.forEach((l) => {
        map[l.id] = l.name
      })
      setLocalityMap(map)
    })
  }, [filters.cityId])

  const commitFilters = useCallback(
    (patch, { replace = false, keepBounds = true } = {}) => {
      const next = { ...filters, ...patch }
      setSearchParams(filtersToSearchParams(next, { keepBounds }), { replace })
    },
    [filters, setSearchParams],
  )

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      const api = toApiFilters(filters)

      if (api.isProject) {
        const items = await getProjects({ cityId: filters.cityId })
        if (!alive) return
        setProjects(items)
        setResult({ items: [], total: items.length, totalPages: 1 })
        setMapItems([])
        setLoading(false)
        return
      }

      const [pageData, allForMap] = await Promise.all([
        getListings(api, { page: filters.page, pageSize: 12 }),
        getListings({ ...api, bounds: filters.view === 'map' ? api.bounds : undefined }, { page: 1, pageSize: 200 }),
      ])
      if (!alive) return
      setResult(pageData)
      setMapItems(allForMap.items)
      setProjects([])
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [filters])

  const chips = activeFilterChips(filters, localityMap)
  const showMap = filters.view === 'map'
  const cityName = CITIES.find((c) => c.id === filters.cityId)?.name

  const runSearchBar = () => {
    commitFilters(
      {
        q: draftQuery,
        localities: draftLocalities,
        page: 1,
        bounds: null,
      },
      { keepBounds: false },
    )
  }

  const saveSearch = () => {
    if (!user) {
      openLogin('save-search')
      return
    }
    const label = [cityName, draftLocalities.map((id) => localityMap[id]).filter(Boolean).join(', '), filters.type]
      .filter(Boolean)
      .join(' · ')
    addSavedSearch({
      label: label || 'High Rise Properties search',
      frequency: 'daily',
      queryString: filtersToSearchParams({ ...filters, q: draftQuery, localities: draftLocalities }).toString(),
      filters: { ...filters, q: draftQuery, localities: draftLocalities },
    })
    addNotification({
      title: 'Search saved',
      body: `We'll alert you daily for new matches in ${cityName}.`,
    })
    toast.success('Search saved — check the bell for alerts')
  }

  const clearFilters = () => {
    setSearchParams(
      filtersToSearchParams({
        ...DEFAULT_FILTERS,
        type: filters.type,
        cityId: filters.cityId,
        view: filters.view,
      }),
    )
    setDraftQuery('')
    setDraftLocalities([])
  }

  return (
    <div className="w-full px-2 py-6 sm:px-3">
      <div className="rounded-2xl border border-border bg-white p-3 shadow-soft sm:p-4">
        <SearchBar
          tab={filters.type}
          onTabChange={(type) =>
            commitFilters({ type, page: 1, minPrice: null, maxPrice: null, bounds: null }, { keepBounds: false })
          }
          cityId={filters.cityId}
          onCityChange={(cityId) =>
            commitFilters({ cityId, localities: [], page: 1, bounds: null }, { keepBounds: false })
          }
          query={draftQuery}
          onQueryChange={setDraftQuery}
          selectedLocalities={draftLocalities}
          onLocalitiesChange={setDraftLocalities}
          onSubmit={runSearchBar}
          compact
        />
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-xl font-semibold text-ink sm:text-2xl">
            {filters.type === 'projects' ? 'New projects' : 'Properties'} in {cityName}
          </h1>
          <p className="text-sm text-ink-muted">
            {loading ? 'Searching…' : `${result.total} result${result.total === 1 ? '' : 's'}`}
          </p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <Button variant="secondary" size="sm" className="md:hidden" onClick={() => setSheetOpen(true)}>
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button variant="secondary" size="sm" className="min-w-0 flex-1 sm:flex-none" onClick={saveSearch}>
            <BookmarkPlus className="h-4 w-4 shrink-0" />
            <span className="truncate">Save</span>
          </Button>
          <select
            className="h-9 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 text-sm font-semibold sm:flex-none"
            value={filters.sort}
            onChange={(e) => commitFilters({ sort: e.target.value, page: 1 })}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
          <div className="ml-auto flex rounded-xl border border-border bg-white p-0.5 sm:ml-0">
            <button
              type="button"
              className={`rounded-lg p-2 ${filters.view === 'grid' ? 'bg-mist text-ink' : 'text-ink-muted'}`}
              onClick={() => commitFilters({ view: 'grid' })}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={`rounded-lg p-2 ${filters.view === 'list' ? 'bg-mist text-ink' : 'text-ink-muted'}`}
              onClick={() => commitFilters({ view: 'list' })}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={`rounded-lg p-2 ${filters.view === 'map' ? 'bg-mist text-ink' : 'text-ink-muted'}`}
              onClick={() => commitFilters({ view: 'map' })}
              aria-label="Map view"
            >
              <MapIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <FilterChips
          chips={chips}
          onRemove={(partial) => commitFilters({ ...partial, page: 1 }, { keepBounds: !('bounds' in partial) })}
          onClear={clearFilters}
        />
      </div>

      <div className={`mt-6 grid gap-6 ${showMap ? 'lg:grid-cols-[1fr_1.1fr]' : 'lg:grid-cols-[16rem_1fr]'}`}>
        {!showMap && (
          <div className="hidden rounded-2xl border border-border bg-white p-4 shadow-soft md:block">
            <SearchFilters
              filters={filters}
              onChange={(patch) => commitFilters(patch, { keepBounds: false })}
              onClear={clearFilters}
            />
          </div>
        )}

        <div className={showMap ? 'order-2 lg:order-1' : ''}>
          {filters.type === 'projects' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {loading && Array.from({ length: 4 }).map((_, i) => <ListingCardSkeleton key={i} />)}
              {!loading &&
                projects.map((p) => (
                  <Link
                    key={p.id}
                    to={`/project/${p.slug}`}
                    className="overflow-hidden rounded-2xl border border-border bg-white shadow-soft"
                  >
                    <img src={p.heroImage} alt={p.name} className="h-40 w-full object-cover" />
                    <div className="p-4">
                      <Badge tone="mist">{p.status}</Badge>
                      <div className="mt-2 font-bold">{p.name}</div>
                      <div className="text-sm text-ink-muted">
                        {p.localityName} · from {formatINR(p.priceList[0]?.priceFrom)}
                      </div>
                    </div>
                  </Link>
                ))}
              {!loading && projects.length === 0 && (
                <EmptyState
                  title="No projects found"
                  description="Try another city or check New Projects from the home page."
                  actionLabel="Go home"
                  onAction={() => navigate('/')}
                />
              )}
            </div>
          ) : (
            <>
              <div
                className={
                  showMap || filters.view === 'list'
                    ? 'flex flex-col gap-3'
                    : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
                }
              >
                {loading &&
                  Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
                {!loading &&
                  result.items.map((item) => (
                    <ListingCard
                      key={item.id}
                      listing={item}
                      layout={showMap || filters.view === 'list' ? 'list' : 'grid'}
                      selected={selectedId === item.id}
                      onSelect={() => setSelectedId(item.id)}
                    />
                  ))}
              </div>

              {!loading && result.items.length === 0 && (
                <EmptyState
                  title="No homes match these filters"
                  description="Widen your budget, clear the map area filter, or try nearby localities."
                  actionLabel="Clear filters"
                  onAction={clearFilters}
                />
              )}

              {result.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={filters.page <= 1}
                    onClick={() => commitFilters({ page: filters.page - 1 })}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-semibold text-ink-muted">
                    Page {filters.page} of {result.totalPages}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={filters.page >= result.totalPages}
                    onClick={() => commitFilters({ page: filters.page + 1 })}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {showMap && filters.type !== 'projects' && (
          <div className="order-1 h-80 sm:h-105 lg:sticky lg:top-20 lg:order-2 lg:h-[calc(100vh-7rem)]">
            <SearchMap
              cityId={filters.cityId}
              listings={mapItems}
              selectedId={selectedId}
              onSelect={setSelectedId}
              lockFit={Boolean(filters.bounds)}
              onBoundsChange={(bounds) => commitFilters({ bounds, page: 1 }, { replace: true })}
              className="h-full"
            />
            <p className="mt-2 text-xs text-ink-muted">Pan or zoom the map to refresh results in view.</p>
          </div>
        )}
      </div>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filters">
        <SearchFilters
          filters={filters}
          onChange={(patch) => {
            commitFilters(patch, { keepBounds: false })
          }}
          onClear={() => {
            clearFilters()
            setSheetOpen(false)
          }}
        />
        <Button className="mt-4 w-full" onClick={() => setSheetOpen(false)}>
          Show {result.total} homes
        </Button>
      </BottomSheet>
    </div>
  )
}
