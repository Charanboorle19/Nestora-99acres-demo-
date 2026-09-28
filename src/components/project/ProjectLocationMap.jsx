import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'

const pin = L.divIcon({
  className: 'price-marker',
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#E8A838;border:2px solid #0B3D5C"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

export default function ProjectLocationMap({ project }) {
  const center = [project.lat, project.lng]
  return (
    <div className="h-64 overflow-hidden rounded-2xl border border-border lg:h-80">
      <MapContainer center={center} zoom={13} className="h-full w-full" scrollWheelZoom={false}>
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker
          center={center}
          radius={10}
          pathOptions={{ color: '#0B3D5C', fillColor: '#E8A838', fillOpacity: 0.9 }}
        >
          <Popup>{project.name}</Popup>
        </CircleMarker>
        {(project.locationAdvantages || []).map((a, i) => (
          <Marker
            key={a.label}
            position={[project.lat + (i % 2 ? 0.012 : -0.01), project.lng + (i > 1 ? -0.012 : 0.01)]}
            icon={pin}
          >
            <Popup>
              {a.label} · {a.distanceKm} km
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
