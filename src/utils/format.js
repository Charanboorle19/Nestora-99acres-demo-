export function formatINR(amount, { compact = true } = {}) {
  if (amount == null || Number.isNaN(Number(amount))) return '—'
  const n = Number(amount)

  if (!compact) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(n)
  }

  if (n >= 1_00_00_000) {
    const crore = n / 1_00_00_000
    return `₹${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2)} Cr`
  }
  if (n >= 1_00_000) {
    const lakh = n / 1_00_000
    return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(2)} L`
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatPricePerSqft(price, area) {
  if (!price || !area) return '—'
  return `${formatINR(Math.round(price / area), { compact: false })}/sq.ft`
}

export function formatArea(sqft) {
  if (!sqft) return '—'
  return `${new Intl.NumberFormat('en-IN').format(sqft)} sq.ft`
}

export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

export function parseQueryNumber(value, fallback = null) {
  if (value == null || value === '') return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export function unique(arr) {
  return [...new Set(arr)]
}

export function haversineKm(a, b) {
  const toRad = (d) => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

export function calcEMI(principal, annualRate, years) {
  const r = annualRate / 12 / 100
  const n = years * 12
  if (!principal || !n) return 0
  if (!r) return principal / n
  return (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1)
}

export function amortizationSchedule(principal, annualRate, years) {
  const emi = calcEMI(principal, annualRate, years)
  const r = annualRate / 12 / 100
  let balance = principal
  const rows = []
  const months = years * 12

  for (let i = 1; i <= months; i += 1) {
    const interest = balance * r
    const principalPart = emi - interest
    balance = Math.max(0, balance - principalPart)
    rows.push({
      month: i,
      emi: Math.round(emi),
      principal: Math.round(principalPart),
      interest: Math.round(interest),
      balance: Math.round(balance),
    })
  }
  return { emi: Math.round(emi), rows }
}

export function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${Math.max(1, mins)}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-IN')
}
