import { builders, localities } from './localities'
import { slugify } from '../utils/format'

const PROJECT_PHOTOS = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1400&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1400&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80',
]

const SEED = [
  {
    builderId: 'bld-aether',
    name: 'Aether Crest',
    localityId: 'hyd-gachibowli',
    status: 'Under construction',
    possession: 'Dec 2027',
    rera: 'P02400004521',
    configs: [
      { bhk: '2 BHK', area: 1180, priceFrom: 9200000, facing: ['East', 'West'], floors: '5-18' },
      { bhk: '3 BHK', area: 1650, priceFrom: 12800000, facing: ['North', 'East'], floors: '3-20' },
    ],
  },
  {
    builderId: 'bld-aether',
    name: 'Aether Parkview',
    localityId: 'blr-whitefield',
    status: 'New launch',
    possession: 'Mar 2028',
    rera: 'PRM/KA/RERA/1251/446/PR/220101',
    configs: [
      { bhk: '2 BHK', area: 1120, priceFrom: 8800000, facing: ['East'], floors: '2-15' },
      { bhk: '3 BHK', area: 1580, priceFrom: 13200000, facing: ['West', 'South'], floors: '4-22' },
      { bhk: '4 BHK', area: 2200, priceFrom: 19500000, facing: ['North-East'], floors: '10-24' },
    ],
  },
  {
    builderId: 'bld-lotus',
    name: 'Lotus Harbour',
    localityId: 'mum-powai',
    status: 'Ready to move',
    possession: 'Ready',
    rera: 'P51800028910',
    configs: [
      { bhk: '2 BHK', area: 980, priceFrom: 24500000, facing: ['East', 'North'], floors: '8-32' },
      { bhk: '3 BHK', area: 1380, priceFrom: 36000000, facing: ['West'], floors: '12-35' },
    ],
  },
  {
    builderId: 'bld-lotus',
    name: 'Lotus Greens',
    localityId: 'pune-baner',
    status: 'Under construction',
    possession: 'Jun 2027',
    rera: 'P52100031200',
    configs: [
      { bhk: '2 BHK', area: 1050, priceFrom: 7900000, facing: ['East'], floors: '1-16' },
      { bhk: '3 BHK', area: 1490, priceFrom: 11800000, facing: ['North', 'West'], floors: '2-18' },
    ],
  },
  {
    builderId: 'bld-northstar',
    name: 'Northstar Avenue',
    localityId: 'del-gurgaon-sector',
    status: 'Under construction',
    possession: 'Sep 2027',
    rera: 'GGM/443/2023/88',
    configs: [
      { bhk: '3 BHK', area: 1720, priceFrom: 22500000, facing: ['East', 'South'], floors: '5-28' },
      { bhk: '4 BHK', area: 2400, priceFrom: 32000000, facing: ['North'], floors: '10-30' },
    ],
  },
  {
    builderId: 'bld-cascade',
    name: 'Cascade Lakeside',
    localityId: 'hyd-kondapur',
    status: 'New launch',
    possession: 'Dec 2028',
    rera: 'P02400005110',
    configs: [
      { bhk: '2 BHK', area: 1100, priceFrom: 8100000, facing: ['East'], floors: '2-14' },
      { bhk: '3 BHK', area: 1520, priceFrom: 11200000, facing: ['West'], floors: '3-16' },
    ],
  },
  {
    builderId: 'bld-meridian',
    name: 'Meridian Sky',
    localityId: 'mum-worli',
    status: 'Under construction',
    possession: 'Mar 2029',
    rera: 'P51900040112',
    configs: [
      { bhk: '3 BHK', area: 1600, priceFrom: 78000000, facing: ['Sea-facing'], floors: '20-45' },
      { bhk: '4 BHK', area: 2800, priceFrom: 145000000, facing: ['Sea-facing'], floors: '30-48' },
    ],
  },
  {
    builderId: 'bld-northstar',
    name: 'Northstar Orchard',
    localityId: 'blr-sarjapur',
    status: 'Ready to move',
    possession: 'Ready',
    rera: 'PRM/KA/RERA/1251/309/PR/180620',
    configs: [
      { bhk: '2 BHK', area: 1080, priceFrom: 7600000, facing: ['East', 'West'], floors: '1-12' },
      { bhk: '3 BHK', area: 1480, priceFrom: 10900000, facing: ['North'], floors: '2-14' },
    ],
  },
]

function unitGrid(configs, seed) {
  const statuses = ['available', 'available', 'available', 'hold', 'sold']
  const facings = ['East', 'West', 'North', 'South', 'North-East']
  const units = []
  let n = 0
  configs.forEach((cfg, ci) => {
    for (let floor = 1; floor <= 12; floor += 1) {
      for (let u = 1; u <= 2; u += 1) {
        n += 1
        units.push({
          id: `u-${seed}-${n}`,
          unitNo: `${floor}${String(u).padStart(2, '0')}`,
          bhk: cfg.bhk,
          floor,
          facing: facings[(seed + n) % facings.length],
          area: cfg.area + ((n % 3) * 20),
          price: cfg.priceFrom + n * 25000,
          status: statuses[(seed + n) % statuses.length],
        })
      }
    }
  })
  return units
}

export const projects = SEED.map((p, i) => {
  const locality = localities.find((l) => l.id === p.localityId)
  const builder = builders.find((b) => b.id === p.builderId)
  return {
    id: `prj-${String(i + 1).padStart(2, '0')}`,
    slug: slugify(p.name),
    name: p.name,
    builderId: builder.id,
    builderName: builder.name,
    cityId: locality.cityId,
    localityId: locality.id,
    localityName: locality.name,
    lat: locality.lat,
    lng: locality.lng,
    status: p.status,
    possession: p.possession,
    rera: p.rera,
    overview: `${p.name} by ${builder.name} offers thoughtfully designed residences in ${locality.name}. Landscaped greens, modern amenities and strong connectivity define everyday living.`,
    heroImage: PROJECT_PHOTOS[i % PROJECT_PHOTOS.length],
    gallery: PROJECT_PHOTOS,
    configs: p.configs,
    units: unitGrid(p.configs, i + 1),
    priceList: p.configs.map((c) => ({
      bhk: c.bhk,
      area: c.area,
      priceFrom: c.priceFrom,
      priceTo: Math.round(c.priceFrom * 1.18),
    })),
    amenities: ['Clubhouse', 'Swimming Pool', 'Gym', 'Park', 'Jogging Track', 'Security', 'Power Backup', 'EV Charging'],
    locationAdvantages: [
      { label: 'IT / Business hub', distanceKm: 2.5 + (i % 4) },
      { label: 'International school', distanceKm: 1.2 + (i % 3) },
      { label: 'Metro / transit', distanceKm: 0.8 + (i % 5) * 0.4 },
      { label: 'Shopping mall', distanceKm: 1.8 + (i % 3) },
    ],
    floorPlans: p.configs.map((c, idx) => ({
      bhk: c.bhk,
      image: `https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80&sig=${i}${idx}`,
    })),
    constructionTimeline: [
      { phase: 'Foundation', date: '2024-Q2', status: 'done' },
      { phase: 'Structure', date: '2025-Q3', status: i % 2 === 0 ? 'done' : 'ongoing' },
      { phase: 'Finishing', date: '2026-Q4', status: i % 3 === 0 ? 'ongoing' : 'upcoming' },
      { phase: 'Handover', date: p.possession, status: p.status === 'Ready to move' ? 'done' : 'upcoming' },
    ],
    brochureUrl: '#',
  }
})
