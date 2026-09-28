import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import Card from '../ui/Card'
import { School, Hospital, TrainFront, ShoppingBag } from 'lucide-react'

const ICONS = {
  school: School,
  hospital: Hospital,
  metro: TrainFront,
  mall: ShoppingBag,
}

const COLORS = {
  school: '#1f7a4d',
  hospital: '#c0392b',
  metro: '#0B3D5C',
  mall: '#c98a1e',
}

function placeIcon(type) {
  const color = COLORS[type] || '#0B3D5C'
  return L.divIcon({
    className: 'price-marker',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.25)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}

export default function NearbyPlaces({ listing }) {
  const places = listing.nearby || []
  const center = useMemo(() => [listing.lat, listing.lng], [listing.lat, listing.lng])

  return (
    <Card className="min-w-0 overflow-hidden p-0">
      <div className="border-b border-border p-4 sm:p-5">
        <h2 className="font-display text-lg font-semibold sm:text-xl">Nearby places</h2>
        <p className="text-sm text-ink-muted">Schools, hospitals, transit and malls near this home</p>
      </div>
      <div className="grid min-w-0 gap-0 lg:grid-cols-2">
        <div className="h-52 min-w-0 sm:h-64 lg:h-80">
          <MapContainer center={center} zoom={14} className="h-full w-full" scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CircleMarker
              center={center}
              pathOptions={{ color: '#E8A838', fillColor: '#E8A838', fillOpacity: 0.9 }}
              radius={9}
            >
              <Popup>This property</Popup>
            </CircleMarker>
            {places.map((p) => (
              <Marker key={p.name + p.type} position={[p.lat, p.lng]} icon={placeIcon(p.type)}>
                <Popup>
                  <strong>{p.name}</strong>
                  <div className="text-xs capitalize">{p.type}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <ul className="max-h-64 divide-y divide-border overflow-y-auto lg:max-h-80">
          {places.map((p) => {
            const Icon = ICONS[p.type] || ShoppingBag
            return (
              <li key={p.name} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <div className="shrink-0 rounded-xl bg-mist p-2 text-ink">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="text-xs capitalize text-ink-muted">{p.type}</div>
                </div>
                <div className="shrink-0 text-sm font-bold text-ink">{p.distanceKm.toFixed(1)} km</div>
              </li>
            )
          })}
        </ul>
      </div>
    </Card>
  )
}
