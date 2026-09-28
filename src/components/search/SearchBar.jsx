import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, MapPin, Search, X } from 'lucide-react'
import Button from '../ui/Button'
import Tabs from '../ui/Tabs'
import { CITIES, SEARCH_TABS } from '../../utils/constants'
import { searchSuggestions, getLocalities } from '../../services/api'
import useDebounce from '../../hooks/useDebounce'
import { cn } from '../../utils/format'

export default function SearchBar({
  tab,
  onTabChange,
  cityId,
  onCityChange,
  query,
  onQueryChange,
  selectedLocalities = [],
  onLocalitiesChange,
  onSubmit,
  compact = false,
  showTabs = true,
}) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [suggestions, setSuggestions] = useState({ localities: [], projects: [], builders: [] })
  const [cityLocalities, setCityLocalities] = useState([])
  const debouncedQ = useDebounce(query, 220)
  const wrapRef = useRef(null)

  useEffect(() => {
    getLocalities(cityId).then(setCityLocalities)
  }, [cityId])

  useEffect(() => {
    let alive = true
    if (!debouncedQ.trim()) {
      setSuggestions({ localities: [], projects: [], builders: [] })
      return undefined
    }
    searchSuggestions(debouncedQ, cityId).then((res) => {
      if (alive) setSuggestions(res)
    })
    return () => {
      alive = false
    }
  }, [debouncedQ, cityId])

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const toggleLocality = (loc) => {
    const exists = selectedLocalities.includes(loc.id)
    const next = exists
      ? selectedLocalities.filter((id) => id !== loc.id)
      : [...selectedLocalities, loc.id]
    onLocalitiesChange?.(next)
    onQueryChange?.('')
    setOpen(false)
  }

  const localityLabel = (id) => cityLocalities.find((l) => l.id === id)?.name || id

  const showPanel =
    open &&
    (suggestions.localities.length ||
      suggestions.projects.length ||
      suggestions.builders.length ||
      (!query.trim() && cityLocalities.length))

  return (
    <div className={cn('w-full', compact ? '' : '')} ref={wrapRef}>
      {showTabs && (
        <Tabs
          tabs={SEARCH_TABS.map((t) => ({ id: t.id, label: t.label }))}
          value={tab}
          onChange={onTabChange}
        />
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setOpen(false)
          onSubmit?.()
        }}
        className={cn('mt-3 grid gap-2', compact ? 'sm:grid-cols-[9rem_1fr_auto]' : 'sm:grid-cols-[10rem_1fr_auto]')}
      >
        <select
          className="h-12 w-full rounded-xl border border-border bg-white px-3 text-sm font-semibold outline-none"
          value={cityId}
          onChange={(e) => {
            onCityChange?.(e.target.value)
            onLocalitiesChange?.([])
          }}
        >
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <div className="relative min-w-0">
          <div className="flex min-h-12 flex-wrap items-center gap-1 rounded-xl border border-border bg-white px-2 py-1.5 focus-within:border-ink">
            {selectedLocalities.map((id) => (
              <span
                key={id}
                className="inline-flex max-w-full items-center gap-1 rounded-lg bg-mist px-2 py-1 text-xs font-semibold text-ink"
              >
                <span className="truncate">{localityLabel(id)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${localityLabel(id)}`}
                  onClick={() => onLocalitiesChange?.(selectedLocalities.filter((x) => x !== id))}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <input
              className="min-w-0 flex-1 border-0 bg-transparent px-2 py-1.5 text-sm outline-none sm:min-w-32"
              placeholder={selectedLocalities.length ? 'Add another locality…' : 'Locality, project or builder'}
              value={query}
              onChange={(e) => {
                onQueryChange?.(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
            />
            <Search className="mr-1 hidden h-4 w-4 shrink-0 text-ink-muted sm:block" />
          </div>

          {showPanel && (
            <div className="absolute z-30 mt-1 max-h-80 w-full overflow-y-auto rounded-2xl border border-border bg-white p-2 shadow-lift">
              {!query.trim() && (
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                  Popular in city
                </div>
              )}
              {(query.trim() ? suggestions.localities : cityLocalities.slice(0, 8)).map((loc) => {
                const active = selectedLocalities.includes(loc.id)
                return (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => toggleLocality(loc)}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-mist',
                      active && 'bg-mist',
                    )}
                  >
                    <MapPin className="h-4 w-4 text-amber" />
                    <span className="font-semibold">{loc.name}</span>
                    <span className="ml-auto text-xs text-ink-muted">{active ? 'Selected' : 'Locality'}</span>
                  </button>
                )
              })}
              {suggestions.projects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate(`/project/${p.slug}`)
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-mist"
                >
                  <Building2 className="h-4 w-4 text-ink" />
                  <span className="font-semibold">{p.name}</span>
                  <span className="ml-auto text-xs text-ink-muted">Project</span>
                </button>
              ))}
              {suggestions.builders.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    navigate(`/builder/${b.slug}`)
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-mist"
                >
                  <Building2 className="h-4 w-4 text-ink" />
                  <span className="font-semibold">{b.name}</span>
                  <span className="ml-auto text-xs text-ink-muted">Builder</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button type="submit" size="lg" className="h-12 w-full sm:w-auto">
          Search
        </Button>
      </form>
    </div>
  )
}
