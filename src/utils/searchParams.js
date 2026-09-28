import { SEARCH_TABS, CITIES } from './constants'
import { parseQueryNumber } from './format'

const LIST = (v) => (v ? String(v).split(',').map((s) => s.trim()).filter(Boolean) : [])

export const DEFAULT_FILTERS = {
  type: 'buy',
  cityId: 'hyderabad',
  localities: [],
  q: '',
  minPrice: null,
  maxPrice: null,
  minArea: null,
  maxArea: null,
  bhk: [],
  propertyType: [],
  furnishing: [],
  possession: [],
  postedBy: [],
  amenities: [],
  verifiedOnly: false,
  sort: 'relevance',
  view: 'grid',
  page: 1,
  bounds: null,
}

export function tabToApiFilters(type) {
  const tab = SEARCH_TABS.find((t) => t.id === type) || SEARCH_TABS[0]
  const out = {}
  if (tab.listingType) out.listingType = tab.listingType
  if (tab.propertyCategory) out.propertyCategory = tab.propertyCategory
  if (tab.propertyType) {
    out.propertyType = [tab.propertyType === 'plot' ? 'Plot' : tab.propertyType]
  }
  if (tab.isProject) out.isProject = true
  return out
}

export function priceBoundsForType(type) {
  if (type === 'rent' || type === 'pg') {
    return { min: 5000, max: 200000, step: 1000 }
  }
  if (type === 'commercial') {
    return { min: 500000, max: 100000000, step: 500000 }
  }
  return { min: 1000000, max: 200000000, step: 500000 }
}

export function parseSearchParams(searchParams) {
  const type = searchParams.get('type') || 'buy'
  const cityId = searchParams.get('city') || 'hyderabad'
  const north = parseQueryNumber(searchParams.get('north'))
  const south = parseQueryNumber(searchParams.get('south'))
  const east = parseQueryNumber(searchParams.get('east'))
  const west = parseQueryNumber(searchParams.get('west'))

  return {
    type,
    cityId,
    localities: LIST(searchParams.get('locality')),
    q: searchParams.get('q') || '',
    minPrice: parseQueryNumber(searchParams.get('minPrice')),
    maxPrice: parseQueryNumber(searchParams.get('maxPrice')),
    minArea: parseQueryNumber(searchParams.get('minArea')),
    maxArea: parseQueryNumber(searchParams.get('maxArea')),
    bhk: LIST(searchParams.get('bhk')),
    propertyType: LIST(searchParams.get('propertyType')),
    furnishing: LIST(searchParams.get('furnishing')),
    possession: LIST(searchParams.get('possession')),
    postedBy: LIST(searchParams.get('postedBy')),
    amenities: LIST(searchParams.get('amenities')),
    verifiedOnly: searchParams.get('verified') === '1',
    sort: searchParams.get('sort') || 'relevance',
    view: searchParams.get('view') || 'grid',
    page: Math.max(1, parseQueryNumber(searchParams.get('page'), 1)),
    bounds:
      north != null && south != null && east != null && west != null
        ? { north, south, east, west }
        : null,
  }
}

export function filtersToSearchParams(filters, { keepBounds = true } = {}) {
  const params = new URLSearchParams()
  if (filters.type && filters.type !== 'buy') params.set('type', filters.type)
  if (filters.cityId) params.set('city', filters.cityId)
  if (filters.localities?.length) params.set('locality', filters.localities.join(','))
  if (filters.q) params.set('q', filters.q)
  if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice))
  if (filters.minArea != null) params.set('minArea', String(filters.minArea))
  if (filters.maxArea != null) params.set('maxArea', String(filters.maxArea))
  if (filters.bhk?.length) params.set('bhk', filters.bhk.join(','))
  if (filters.propertyType?.length) params.set('propertyType', filters.propertyType.join(','))
  if (filters.furnishing?.length) params.set('furnishing', filters.furnishing.join(','))
  if (filters.possession?.length) params.set('possession', filters.possession.join(','))
  if (filters.postedBy?.length) params.set('postedBy', filters.postedBy.join(','))
  if (filters.amenities?.length) params.set('amenities', filters.amenities.join(','))
  if (filters.verifiedOnly) params.set('verified', '1')
  if (filters.sort && filters.sort !== 'relevance') params.set('sort', filters.sort)
  if (filters.view && filters.view !== 'grid') params.set('view', filters.view)
  if (filters.page && filters.page > 1) params.set('page', String(filters.page))
  if (keepBounds && filters.bounds) {
    params.set('north', String(filters.bounds.north))
    params.set('south', String(filters.bounds.south))
    params.set('east', String(filters.bounds.east))
    params.set('west', String(filters.bounds.west))
  }
  return params
}

export function toApiFilters(filters) {
  const tab = tabToApiFilters(filters.type)
  const propertyType = [
    ...(tab.propertyType || []),
    ...(filters.propertyType || []),
  ]

  return {
    cityId: filters.cityId,
    localities: filters.localities,
    q: filters.q || undefined,
    listingType: tab.listingType,
    propertyCategory: tab.propertyCategory,
    propertyType: propertyType.length ? propertyType : undefined,
    bhk: filters.bhk,
    furnishing: filters.furnishing,
    possession: filters.possession,
    postedBy: filters.postedBy,
    amenities: filters.amenities,
    verifiedOnly: filters.verifiedOnly,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minArea: filters.minArea,
    maxArea: filters.maxArea,
    sort: filters.sort,
    bounds: filters.bounds || undefined,
    isProject: tab.isProject,
  }
}

export function cityCenter(cityId) {
  return CITIES.find((c) => c.id === cityId) || CITIES[0]
}

export function activeFilterChips(filters, localityNames = {}) {
  const chips = []
  if (filters.localities?.length) {
    filters.localities.forEach((id) => {
      chips.push({ key: `loc-${id}`, label: localityNames[id] || id, remove: { localities: filters.localities.filter((x) => x !== id) } })
    })
  }
  if (filters.q) chips.push({ key: 'q', label: `"${filters.q}"`, remove: { q: '' } })
  if (filters.minPrice != null || filters.maxPrice != null) {
    chips.push({
      key: 'price',
      label: 'Budget',
      remove: { minPrice: null, maxPrice: null },
    })
  }
  if (filters.minArea != null || filters.maxArea != null) {
    chips.push({ key: 'area', label: 'Area', remove: { minArea: null, maxArea: null } })
  }
  filters.bhk?.forEach((b) =>
    chips.push({ key: `bhk-${b}`, label: b, remove: { bhk: filters.bhk.filter((x) => x !== b) } }),
  )
  filters.propertyType?.forEach((t) =>
    chips.push({
      key: `pt-${t}`,
      label: t,
      remove: { propertyType: filters.propertyType.filter((x) => x !== t) },
    }),
  )
  filters.furnishing?.forEach((f) =>
    chips.push({
      key: `fur-${f}`,
      label: f,
      remove: { furnishing: filters.furnishing.filter((x) => x !== f) },
    }),
  )
  filters.possession?.forEach((p) =>
    chips.push({
      key: `pos-${p}`,
      label: p,
      remove: { possession: filters.possession.filter((x) => x !== p) },
    }),
  )
  filters.postedBy?.forEach((p) =>
    chips.push({
      key: `pb-${p}`,
      label: p,
      remove: { postedBy: filters.postedBy.filter((x) => x !== p) },
    }),
  )
  filters.amenities?.forEach((a) =>
    chips.push({
      key: `am-${a}`,
      label: a,
      remove: { amenities: filters.amenities.filter((x) => x !== a) },
    }),
  )
  if (filters.verifiedOnly) {
    chips.push({ key: 'verified', label: 'Verified only', remove: { verifiedOnly: false } })
  }
  if (filters.bounds) {
    chips.push({ key: 'map', label: 'Map area', remove: { bounds: null } })
  }
  return chips
}
