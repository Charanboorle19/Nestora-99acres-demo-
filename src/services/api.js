import { delay } from '../utils/format'
import { listings, popularLocalities } from '../data/listings'
import { projects } from '../data/projects'
import { localities, builders, agents } from '../data/localities'
import { CITIES } from '../utils/constants'

const wait = (ms = 350) => delay(ms + Math.floor(Math.random() * 250))

function applyFilters(items, filters = {}) {
  let result = [...items]

  if (filters.cityId) result = result.filter((l) => l.cityId === filters.cityId)
  if (filters.localities?.length) {
    result = result.filter((l) => filters.localities.includes(l.localityId) || filters.localities.includes(l.localityName))
  }
  if (filters.listingType) result = result.filter((l) => l.listingType === filters.listingType)
  if (filters.propertyType) {
    const types = (Array.isArray(filters.propertyType) ? filters.propertyType : [filters.propertyType]).map(
      (t) => String(t).toLowerCase(),
    )
    result = result.filter((l) => types.includes(String(l.propertyType).toLowerCase()))
  }
  if (filters.propertyCategory) result = result.filter((l) => l.propertyCategory === filters.propertyCategory)
  if (filters.bhk?.length) result = result.filter((l) => filters.bhk.includes(l.bhk))
  if (filters.furnishing?.length) result = result.filter((l) => filters.furnishing.includes(l.furnishing))
  if (filters.possession?.length) result = result.filter((l) => filters.possession.includes(l.possession))
  if (filters.postedBy?.length) result = result.filter((l) => filters.postedBy.includes(l.postedBy?.type))
  if (filters.verifiedOnly) result = result.filter((l) => l.verified)
  if (filters.amenities?.length) {
    result = result.filter((l) => filters.amenities.every((a) => l.amenities.includes(a)))
  }
  if (filters.minPrice != null) result = result.filter((l) => l.price >= Number(filters.minPrice))
  if (filters.maxPrice != null) result = result.filter((l) => l.price <= Number(filters.maxPrice))
  if (filters.minArea != null) result = result.filter((l) => l.area >= Number(filters.minArea))
  if (filters.maxArea != null) result = result.filter((l) => l.area <= Number(filters.maxArea))
  if (filters.q) {
    const q = String(filters.q).toLowerCase()
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.localityName.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.postedBy?.name?.toLowerCase().includes(q),
    )
  }
  if (filters.bounds) {
    const { north, south, east, west } = filters.bounds
    result = result.filter((l) => l.lat <= north && l.lat >= south && l.lng <= east && l.lng >= west)
  }
  if (filters.status) result = result.filter((l) => l.status === filters.status)
  else result = result.filter((l) => l.status === 'active')

  const sort = filters.sort || 'relevance'
  if (sort === 'price_asc') result.sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price)
  else if (sort === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  else if (sort === 'area_desc') result.sort((a, b) => b.area - a.area)
  else {
    result.sort((a, b) => Number(b.featured) - Number(a.featured) || b.views - a.views)
  }

  return result
}

let listingDb = structuredClone(listings)

export async function getListings(filters = {}, { page = 1, pageSize = 12 } = {}) {
  await wait()
  const filtered = applyFilters(listingDb, filters)
  const start = (page - 1) * pageSize
  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
  }
}

export async function getListingById(id) {
  await wait(280)
  const item = listingDb.find((l) => l.id === id || l.slug === id)
  if (!item) throw new Error('Listing not found')
  return structuredClone(item)
}

export async function getSimilarListings(id, limit = 6) {
  await wait(300)
  const base = listingDb.find((l) => l.id === id)
  if (!base) return []
  return listingDb
    .filter((l) => l.id !== id && l.status === 'active' && (l.cityId === base.cityId || l.bhk === base.bhk))
    .slice(0, limit)
}

export async function getFeaturedListings(limit = 8) {
  await wait()
  return listingDb.filter((l) => l.featured && l.status === 'active').slice(0, limit)
}

export async function getPopularLocalities(cityId, limit = 8) {
  await wait(200)
  return popularLocalities.filter((l) => !cityId || l.cityId === cityId).slice(0, limit)
}

export async function getCities() {
  await wait(100)
  return CITIES
}

export async function getLocalities(cityId) {
  await wait(150)
  return localities.filter((l) => !cityId || l.cityId === cityId)
}

export async function searchSuggestions(query = '', cityId) {
  await wait(180)
  const q = query.trim().toLowerCase()
  if (!q) return { localities: [], projects: [], builders: [] }

  const locs = localities
    .filter((l) => (!cityId || l.cityId === cityId) && l.name.toLowerCase().includes(q))
    .slice(0, 6)
  const prjs = projects
    .filter((p) => (!cityId || p.cityId === cityId) && p.name.toLowerCase().includes(q))
    .slice(0, 4)
  const blds = builders.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 4)
  return { localities: locs, projects: prjs, builders: blds }
}

export async function getProjects(filters = {}) {
  await wait()
  let items = [...projects]
  if (filters.cityId) items = items.filter((p) => p.cityId === filters.cityId)
  if (filters.builderId) items = items.filter((p) => p.builderId === filters.builderId)
  return items
}

export async function getProjectBySlug(slug) {
  await wait(300)
  const project = projects.find((p) => p.slug === slug || p.id === slug)
  if (!project) throw new Error('Project not found')
  return structuredClone(project)
}

export async function getBuilderBySlug(slug) {
  await wait(250)
  const builder = builders.find((b) => b.slug === slug || b.id === slug)
  if (!builder) throw new Error('Builder not found')
  const builderProjects = projects.filter((p) => p.builderId === builder.id)
  return { ...builder, projects: builderProjects }
}

export async function createListing(payload) {
  await wait(500)
  const id = `lst-${String(listingDb.length + 1).padStart(3, '0')}`
  const created = {
    ...payload,
    id,
    status: 'pending',
    views: 0,
    shortlists: 0,
    enquiries: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  listingDb = [created, ...listingDb]
  persistListings()
  return created
}

export async function updateListing(id, patch) {
  await wait(350)
  listingDb = listingDb.map((l) => (l.id === id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l))
  persistListings()
  return listingDb.find((l) => l.id === id)
}

export async function getSellerListings(ownerKey, role) {
  await wait()
  const mine = listingDb.filter((l) => l.postedBy?.id === ownerKey)
  if (mine.length) return structuredClone(mine)
  const type = !role || role === 'buyer' ? 'owner' : role
  const byRole = listingDb.filter((l) => l.postedBy?.type === type)
  const pool = byRole.length ? byRole : listingDb
  return structuredClone(pool.slice(0, 12))
}

function persistListings() {
  try {
    localStorage.setItem('nestora_listings', JSON.stringify(listingDb))
  } catch {
    /* ignore quota */
  }
}

export function hydrateListingsFromStorage() {
  try {
    const raw = localStorage.getItem('nestora_listings')
    if (raw) listingDb = JSON.parse(raw)
  } catch {
    listingDb = structuredClone(listings)
  }
}

export async function getAgents() {
  await wait(100)
  return agents
}
