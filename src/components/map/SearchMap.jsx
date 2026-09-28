import { useEffect, useMemo, useRef } from 'react'
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'
import { Link } from 'react-router-dom'
import { formatINR, formatArea } from '../../utils/format'
import { cityCenter } from '../../utils/searchParams'

function priceIcon(listing) {
  const el = `<div class="price-pin${listing.featured ? ' featured' : ''}">${formatINR(listing.price)}</div>`
  return L.divIcon({
    className: 'price-marker',
    html: el,
    iconSize: [80, 28],
    iconAnchor: [40, 14],
  })
}

function BoundsWatcher({ onBoundsChange }) {
  const map = useMap()
  const timer = useRef(null)

  useMapEvents({
    moveend: () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        const b = map.getBounds()
        onBoundsChange?.({
          north: b.getNorth(),
          south: b.getSouth(),
          east: b.getEast(),
          west: b.getWest(),
        })
      }, 450)
    },
  })

  useEffect(() => () => clearTimeout(timer.current), [])
  return null
}

function FitCity({ cityId, listings, lockBounds }) {
  const map = useMap()
  const fitted = useRef(false)

  useEffect(() => {
    fitted.current = false
  }, [cityId])

  useEffect(() => {
    if (lockBounds || fitted.current) return
    if (listings.length) {
      const bounds = L.latLngBounds(listings.map((l) => [l.lat, l.lng]))
      map.fitBounds(bounds.pad(0.18))
      fitted.current = true
    } else {
      const c = cityCenter(cityId)
      map.setView([c.lat, c.lng], 12)
      fitted.current = true
    }
  }, [cityId, listings, lockBounds, map])

  return null
}

function ClusterLayer({ listings, selectedId, onSelect }) {
  const map = useMap()
  const groupRef = useRef(null)

  useEffect(() => {
    if (!map) return undefined
    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 55,
      spiderfyOnMaxZoom: true,
    })
    groupRef.current = group
    map.addLayer(group)

    return () => {
      map.removeLayer(group)
      groupRef.current = null
    }
  }, [map])

  useEffect(() => {
    const group = groupRef.current
    if (!group) return
    group.clearLayers()

    listings.forEach((listing) => {
      const marker = L.marker([listing.lat, listing.lng], { icon: priceIcon(listing) })
      const popup = L.popup({ maxWidth: 260 }).setContent(`
        <div class="nestora-popup">
          <img src="${listing.photos[0]}" alt="" style="width:100%;height:110px;object-fit:cover;border-radius:10px" />
          <div style="font-weight:800;margin-top:8px;color:#0B3D5C">${formatINR(listing.price)}</div>
          <div style="font-weight:600;font-size:13px;margin-top:2px">${listing.title}</div>
          <div style="font-size:12px;color:#4a6f85;margin-top:2px">${listing.localityName} · ${formatArea(listing.area)}</div>
          <a href="/property/${listing.id}" style="display:inline-block;margin-top:8px;font-size:12px;font-weight:700;color:#0B3D5C">View details →</a>
        </div>
      `)
      marker.bindPopup(popup)
      marker.on('click', () => onSelect?.(listing.id))
      group.addLayer(marker)
    })
  }, [listings, onSelect])

  useEffect(() => {
    if (!selectedId) return
    const listing = listings.find((l) => l.id === selectedId)
    if (!listing) return
    map.panTo([listing.lat, listing.lng], { animate: true })
  }, [selectedId, listings, map])

  return null
}

/** Fallback non-cluster markers for accessibility when cluster lib fails — kept unused but available */
export function SimpleMarkers({ listings, onSelect }) {
  return listings.map((listing) => (
    <Marker
      key={listing.id}
      position={[listing.lat, listing.lng]}
      icon={priceIcon(listing)}
      eventHandlers={{ click: () => onSelect?.(listing.id) }}
    >
      <Popup>
        <div className="w-52">
          <img src={listing.photos[0]} alt="" className="h-24 w-full rounded-lg object-cover" />
          <div className="mt-2 text-sm font-extrabold text-ink">{formatINR(listing.price)}</div>
          <div className="text-xs font-semibold">{listing.title}</div>
          <Link to={`/property/${listing.id}`} className="mt-2 inline-block text-xs font-bold text-ink">
            View details →
          </Link>
        </div>
      </Popup>
    </Marker>
  ))
}

export default function SearchMap({
  cityId,
  listings = [],
  selectedId,
  onSelect,
  onBoundsChange,
  className = '',
  lockFit = false,
}) {
  const center = useMemo(() => {
    const c = cityCenter(cityId)
    return [c.lat, c.lng]
  }, [cityId])

  return (
    <div className={`overflow-hidden rounded-2xl border border-border ${className}`}>
      <MapContainer
        center={center}
        zoom={12}
        className="h-full min-h-80 w-full"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitCity cityId={cityId} listings={listings} lockBounds={lockFit} />
        <BoundsWatcher onBoundsChange={onBoundsChange} />
        <ClusterLayer listings={listings} selectedId={selectedId} onSelect={onSelect} />
      </MapContainer>
    </div>
  )
}
