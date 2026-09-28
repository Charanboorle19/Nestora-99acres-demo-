import { AMENITIES } from '../utils/constants'
import { localities, builders, agents, owners } from './localities'

const UNSPLASH = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
]

const FLOOR_PLANS = [
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=900&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
]

const TITLES = {
  Apartment: ['Skyline Residency', 'Green Meadows Flat', 'Urban Nest Apartment', 'Lakeview Heights', 'Parkside Living'],
  Villa: ['Palm Grove Villa', 'Sunset Villa', 'Heritage Villa', 'Garden Court Villa'],
  'Independent House': ['Family Independent Home', 'Spacious Duplex House', 'Corner Plot House'],
  'Builder Floor': ['Premium Builder Floor', 'Sunny Builder Floor'],
  Plot: ['Residential Plot', 'Gated Community Plot', 'Corner Plot'],
  Studio: ['Smart Studio', 'City Studio Pad'],
  Penthouse: ['Sky Penthouse', 'Terrace Penthouse'],
  Office: ['Ready Office Suite', 'IT Park Cabin'],
  Shop: ['High-street Retail Shop', 'Mall Frontage Shop'],
  Warehouse: ['Logistics Warehouse', 'Industrial Godown'],
}

function pick(arr, i) {
  return arr[i % arr.length]
}

function pickMany(arr, count, seed) {
  const out = []
  for (let i = 0; i < count; i += 1) out.push(arr[(seed + i * 3) % arr.length])
  return [...new Set(out)]
}

function reraId(cityId, i) {
  const map = {
    hyderabad: 'P0240000',
    bengaluru: 'PRM/KA/RERA/',
    mumbai: 'P51',
    pune: 'P521',
    'delhi-ncr': 'UPRERAPRJ',
  }
  return `${map[cityId] || 'RERA'}${10000 + i}`
}

function jitter(n, spread) {
  return n + ((spread * ((n * 17) % 10)) / 10 - spread / 2)
}

const SPECS = [
  // Hyderabad sale
  { localityId: 'hyd-gachibowli', type: 'Apartment', bhk: '3 BHK', listingType: 'sale', area: 1680, price: 1.25e7, postedBy: 'builder', featured: true },
  { localityId: 'hyd-hitech', type: 'Apartment', bhk: '2 BHK', listingType: 'sale', area: 1240, price: 9.8e6, postedBy: 'agent' },
  { localityId: 'hyd-kondapur', type: 'Apartment', bhk: '3 BHK', listingType: 'rent', area: 1550, price: 42000, postedBy: 'owner' },
  { localityId: 'hyd-jubilee', type: 'Villa', bhk: '4 BHK', listingType: 'sale', area: 4200, price: 6.5e7, postedBy: 'agent', verified: true },
  { localityId: 'hyd-banjara', type: 'Penthouse', bhk: '4 BHK', listingType: 'sale', area: 3800, price: 5.2e7, postedBy: 'owner', featured: true },
  { localityId: 'hyd-madhapur', type: 'Apartment', bhk: '2 BHK', listingType: 'rent', area: 1180, price: 38000, postedBy: 'agent' },
  { localityId: 'hyd-kukatpally', type: 'Independent House', bhk: '3 BHK', listingType: 'sale', area: 2100, price: 1.4e7, postedBy: 'owner' },
  { localityId: 'hyd-secunderabad', type: 'Builder Floor', bhk: '2 BHK', listingType: 'rent', area: 1100, price: 28000, postedBy: 'owner' },
  { localityId: 'hyd-gachibowli', type: 'Studio', bhk: '1 RK', listingType: 'rent', area: 420, price: 18000, postedBy: 'agent' },
  { localityId: 'hyd-hitech', type: 'Office', bhk: null, listingType: 'sale', area: 2200, price: 2.1e7, postedBy: 'builder', category: 'commercial' },
  { localityId: 'hyd-kondapur', type: 'Plot', bhk: null, listingType: 'sale', area: 2400, price: 1.8e7, postedBy: 'owner' },
  { localityId: 'hyd-madhapur', type: 'Apartment', bhk: '1 BHK', listingType: 'pg', area: 550, price: 12000, postedBy: 'owner' },
  { localityId: 'hyd-jubilee', type: 'Apartment', bhk: '3 BHK', listingType: 'rent', area: 1900, price: 85000, postedBy: 'agent', verified: true },
  // Bengaluru
  { localityId: 'blr-whitefield', type: 'Apartment', bhk: '3 BHK', listingType: 'sale', area: 1720, price: 1.45e7, postedBy: 'builder', featured: true },
  { localityId: 'blr-koramangala', type: 'Apartment', bhk: '2 BHK', listingType: 'rent', area: 1200, price: 55000, postedBy: 'owner', verified: true },
  { localityId: 'blr-indiranagar', type: 'Independent House', bhk: '4 BHK', listingType: 'sale', area: 2800, price: 4.8e7, postedBy: 'agent' },
  { localityId: 'blr-hsr', type: 'Apartment', bhk: '3 BHK', listingType: 'sale', area: 1580, price: 1.75e7, postedBy: 'builder' },
  { localityId: 'blr-electronic', type: 'Apartment', bhk: '2 BHK', listingType: 'sale', area: 1120, price: 7.2e6, postedBy: 'owner' },
  { localityId: 'blr-hebbal', type: 'Villa', bhk: '4 BHK', listingType: 'sale', area: 3600, price: 3.9e7, postedBy: 'builder', featured: true },
  { localityId: 'blr-jp-nagar', type: 'Apartment', bhk: '2 BHK', listingType: 'rent', area: 1050, price: 32000, postedBy: 'agent' },
  { localityId: 'blr-sarjapur', type: 'Apartment', bhk: '3 BHK', listingType: 'sale', area: 1640, price: 1.28e7, postedBy: 'builder' },
  { localityId: 'blr-whitefield', type: 'Plot', bhk: null, listingType: 'sale', area: 1500, price: 9.5e6, postedBy: 'owner' },
  { localityId: 'blr-hsr', type: 'Studio', bhk: '1 RK', listingType: 'pg', area: 380, price: 14000, postedBy: 'owner' },
  { localityId: 'blr-koramangala', type: 'Shop', bhk: null, listingType: 'rent', area: 650, price: 120000, postedBy: 'agent', category: 'commercial' },
  { localityId: 'blr-indiranagar', type: 'Apartment', bhk: '1 BHK', listingType: 'rent', area: 700, price: 35000, postedBy: 'owner' },
  { localityId: 'blr-sarjapur', type: 'Apartment', bhk: '4 BHK', listingType: 'sale', area: 2450, price: 2.1e7, postedBy: 'agent', verified: true },
  // Mumbai
  { localityId: 'mum-andheri', type: 'Apartment', bhk: '2 BHK', listingType: 'sale', area: 980, price: 2.9e7, postedBy: 'agent', featured: true },
  { localityId: 'mum-bandra', type: 'Apartment', bhk: '3 BHK', listingType: 'sale', area: 1450, price: 7.5e7, postedBy: 'builder', verified: true },
  { localityId: 'mum-powai', type: 'Apartment', bhk: '3 BHK', listingType: 'rent', area: 1350, price: 95000, postedBy: 'owner' },
  { localityId: 'mum-thane', type: 'Apartment', bhk: '2 BHK', listingType: 'sale', area: 1050, price: 1.7e7, postedBy: 'builder' },
  { localityId: 'mum-navi', type: 'Apartment', bhk: '3 BHK', listingType: 'sale', area: 1420, price: 1.95e7, postedBy: 'agent' },
  { localityId: 'mum-worli', type: 'Penthouse', bhk: '4 BHK', listingType: 'sale', area: 3200, price: 1.8e8, postedBy: 'builder', featured: true },
  { localityId: 'mum-goregaon', type: 'Apartment', bhk: '1 BHK', listingType: 'rent', area: 580, price: 42000, postedBy: 'owner' },
  { localityId: 'mum-andheri', type: 'Office', bhk: null, listingType: 'rent', area: 1800, price: 3.5e5, postedBy: 'agent', category: 'commercial' },
  { localityId: 'mum-thane', type: 'Plot', bhk: null, listingType: 'sale', area: 2000, price: 2.4e7, postedBy: 'owner' },
  { localityId: 'mum-powai', type: 'Apartment', bhk: '2 BHK', listingType: 'pg', area: 900, price: 22000, postedBy: 'owner' },
  { localityId: 'mum-navi', type: 'Villa', bhk: '4 BHK', listingType: 'sale', area: 3100, price: 4.2e7, postedBy: 'builder' },
  { localityId: 'mum-bandra', type: 'Apartment', bhk: '1 BHK', listingType: 'rent', area: 620, price: 78000, postedBy: 'agent', verified: true },
  // Pune
  { localityId: 'pune-hinjewadi', type: 'Apartment', bhk: '2 BHK', listingType: 'sale', area: 1080, price: 7.8e6, postedBy: 'builder' },
  { localityId: 'pune-baner', type: 'Apartment', bhk: '3 BHK', listingType: 'sale', area: 1550, price: 1.52e7, postedBy: 'builder', featured: true },
  { localityId: 'pune-kharadi', type: 'Apartment', bhk: '2 BHK', listingType: 'rent', area: 1120, price: 28000, postedBy: 'owner' },
  { localityId: 'pune-wakad', type: 'Apartment', bhk: '3 BHK', listingType: 'sale', area: 1480, price: 1.15e7, postedBy: 'agent' },
  { localityId: 'pune-koregaon', type: 'Independent House', bhk: '4 BHK', listingType: 'sale', area: 3200, price: 4.5e7, postedBy: 'owner', verified: true },
  { localityId: 'pune-hadapsar', type: 'Apartment', bhk: '2 BHK', listingType: 'sale', area: 1020, price: 7.4e6, postedBy: 'builder' },
  { localityId: 'pune-baner', type: 'Villa', bhk: '4 BHK', listingType: 'sale', area: 3400, price: 3.2e7, postedBy: 'builder' },
  { localityId: 'pune-hinjewadi', type: 'Studio', bhk: '1 RK', listingType: 'pg', area: 400, price: 11000, postedBy: 'owner' },
  { localityId: 'pune-kharadi', type: 'Office', bhk: null, listingType: 'sale', area: 2500, price: 2.8e7, postedBy: 'agent', category: 'commercial' },
  { localityId: 'pune-wakad', type: 'Plot', bhk: null, listingType: 'sale', area: 1800, price: 8.9e6, postedBy: 'owner' },
  { localityId: 'pune-hadapsar', type: 'Apartment', bhk: '1 BHK', listingType: 'rent', area: 620, price: 16000, postedBy: 'agent' },
  { localityId: 'pune-koregaon', type: 'Apartment', bhk: '3 BHK', listingType: 'rent', area: 1700, price: 65000, postedBy: 'owner' },
  // Delhi NCR
  { localityId: 'del-dwarka', type: 'Apartment', bhk: '3 BHK', listingType: 'sale', area: 1450, price: 1.65e7, postedBy: 'owner' },
  { localityId: 'del-saket', type: 'Apartment', bhk: '2 BHK', listingType: 'rent', area: 1100, price: 48000, postedBy: 'agent', verified: true },
  { localityId: 'del-gurgaon-sector', type: 'Apartment', bhk: '3 BHK', listingType: 'sale', area: 1680, price: 2.4e7, postedBy: 'builder', featured: true },
  { localityId: 'del-noida-62', type: 'Apartment', bhk: '2 BHK', listingType: 'sale', area: 1180, price: 1.05e7, postedBy: 'builder' },
  { localityId: 'del-vaishali', type: 'Builder Floor', bhk: '3 BHK', listingType: 'sale', area: 1600, price: 9.8e6, postedBy: 'owner' },
  { localityId: 'del-greater-noida', type: 'Apartment', bhk: '3 BHK', listingType: 'sale', area: 1520, price: 8.6e6, postedBy: 'builder' },
  { localityId: 'del-vasant', type: 'Independent House', bhk: '4 BHK', listingType: 'sale', area: 3600, price: 6.2e7, postedBy: 'agent', featured: true },
  { localityId: 'del-gurgaon-sector', type: 'Apartment', bhk: '2 BHK', listingType: 'rent', area: 1250, price: 42000, postedBy: 'owner' },
  { localityId: 'del-noida-62', type: 'Office', bhk: null, listingType: 'rent', area: 3000, price: 2.8e5, postedBy: 'agent', category: 'commercial' },
  { localityId: 'del-dwarka', type: 'Plot', bhk: null, listingType: 'sale', area: 2000, price: 1.5e7, postedBy: 'owner' },
  { localityId: 'del-saket', type: 'Studio', bhk: '1 RK', listingType: 'pg', area: 350, price: 15000, postedBy: 'owner' },
  { localityId: 'del-greater-noida', type: 'Villa', bhk: '4 BHK', listingType: 'sale', area: 3000, price: 2.2e7, postedBy: 'builder', verified: true },
  { localityId: 'del-vasant', type: 'Apartment', bhk: '3 BHK', listingType: 'rent', area: 1800, price: 90000, postedBy: 'agent' },
]

function buildListing(spec, index) {
  const locality = localities.find((l) => l.id === spec.localityId)
  const titleBase = pick(TITLES[spec.type] || ['Property'], index)
  const furnishing = pick(['Unfurnished', 'Semi-furnished', 'Fully furnished'], index)
  const possession = spec.listingType === 'sale'
    ? pick(['Ready to move', 'Under construction', 'New launch'], index)
    : 'Ready to move'
  const builder = builders.find((b) => b.cityIds.includes(locality.cityId)) || builders[index % builders.length]
  const agent = agents.find((a) => a.cityId === locality.cityId) || agents[index % agents.length]
  const owner = owners[index % owners.length]

  const postedByMeta =
    spec.postedBy === 'builder'
      ? { type: 'builder', id: builder.id, name: builder.name, phone: '+91 90XXX 7000' + (index % 10) }
      : spec.postedBy === 'agent'
        ? { type: 'agent', id: agent.id, name: agent.name, phone: agent.phone, firm: agent.firm }
        : { type: 'owner', id: owner.id, name: owner.name, phone: owner.phone }

  const photos = pickMany(UNSPLASH, 5 + (index % 4), index)
  const amenityCount = 6 + (index % 8)
  const amenities = pickMany(AMENITIES, amenityCount, index)
  const daysAgo = index % 28
  const postedAt = new Date(Date.now() - daysAgo * 86400000).toISOString()

  const status = index % 17 === 0 ? 'pending' : index % 23 === 0 ? 'expired' : 'active'
  const facing = pick(['East', 'West', 'North', 'South', 'North-East'], index)
  const floor = spec.type === 'Plot' || spec.type === 'Villa' || spec.type === 'Independent House'
    ? null
    : `${(index % 18) + 1} of ${(index % 5) + 12}`

  return {
    id: `lst-${String(index + 1).padStart(3, '0')}`,
    slug: `${titleBase.toLowerCase().replace(/\s+/g, '-')}-${locality.name.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
    title: `${spec.bhk ? `${spec.bhk} ` : ''}${titleBase}`,
    description: `Well-maintained ${spec.bhk || spec.type.toLowerCase()} in ${locality.name}. Close to workplaces, schools and daily essentials. Ideal for ${spec.listingType === 'rent' || spec.listingType === 'pg' ? 'tenants seeking convenience' : 'end-users and investors'}. RERA registered where applicable.`,
    propertyType: spec.type,
    propertyCategory: spec.category || (['Office', 'Shop', 'Warehouse'].includes(spec.type) ? 'commercial' : 'residential'),
    listingType: spec.listingType,
    bhk: spec.bhk,
    price: spec.price,
    area: spec.area,
    carpetArea: Math.round(spec.area * 0.82),
    furnishing: spec.type === 'Plot' ? null : furnishing,
    possession,
    possessionDate: possession === 'Ready to move' ? null : `202${7 + (index % 3)}-0${(index % 9) + 1}-15`,
    cityId: locality.cityId,
    localityId: locality.id,
    localityName: locality.name,
    address: `${12 + (index % 80)}, ${locality.name}`,
    lat: jitter(locality.lat, 0.02),
    lng: jitter(locality.lng, 0.02),
    amenities,
    photos,
    floorPlan: FLOOR_PLANS[index % FLOOR_PLANS.length],
    videoTourUrl: index % 3 === 0 ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : null,
    facing,
    floor,
    bathrooms: spec.bhk ? Math.min(4, Number(spec.bhk[0]) || 1) : 1,
    balconies: spec.bhk ? (index % 3) : 0,
    parking: index % 3 === 0 ? 2 : 1,
    ageYears: possession === 'Ready to move' ? index % 12 : 0,
    reraId: reraId(locality.cityId, index),
    verified: Boolean(spec.verified) || index % 5 === 0,
    featured: Boolean(spec.featured) || index % 11 === 0,
    featuredUntil: spec.featured ? new Date(Date.now() + 14 * 86400000).toISOString() : null,
    status,
    views: 120 + index * 17,
    shortlists: 8 + (index % 40),
    enquiries: 3 + (index % 25),
    postedBy: postedByMeta,
    builderId: spec.postedBy === 'builder' ? builder.id : (index % 4 === 0 ? builder.id : null),
    projectSlug: null,
    createdAt: postedAt,
    updatedAt: postedAt,
    localityInsights: {
      rating: locality.rating,
      pros: ['Good connectivity', 'Growing rental demand', 'Reputed schools nearby'].slice(0, 2 + (index % 2)),
      cons: ['Peak-hour traffic', 'Limited street parking'].slice(0, 1 + (index % 2)),
      priceTrend: Array.from({ length: 12 }, (_, m) => ({
        month: `M${m + 1}`,
        price: Math.round(locality.avgPricePerSqft * (0.92 + m * 0.01 + (index % 5) * 0.002)),
      })),
    },
    nearby: [
      { type: 'school', name: 'Greenfield Public School', lat: jitter(locality.lat, 0.01), lng: jitter(locality.lng, 0.01), distanceKm: 0.8 + (index % 5) * 0.3 },
      { type: 'hospital', name: 'CarePlus Hospital', lat: jitter(locality.lat, 0.012), lng: jitter(locality.lng, 0.012), distanceKm: 1.2 + (index % 4) * 0.4 },
      { type: 'metro', name: 'Metro / Transit Hub', lat: jitter(locality.lat, 0.015), lng: jitter(locality.lng, 0.015), distanceKm: 0.5 + (index % 6) * 0.25 },
      { type: 'mall', name: 'City Centre Mall', lat: jitter(locality.lat, 0.018), lng: jitter(locality.lng, 0.018), distanceKm: 1.5 + (index % 3) * 0.5 },
    ],
  }
}

export const listings = SPECS.map(buildListing)

export const popularLocalities = localities
  .map((l) => ({
    ...l,
    listingCount: listings.filter((x) => x.localityId === l.id && x.status === 'active').length,
  }))
  .sort((a, b) => b.listingCount - a.listingCount)
