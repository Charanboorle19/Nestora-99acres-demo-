import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { cityCenter } from '../../utils/searchParams'

const pinIcon = L.divIcon({
  className: 'price-marker',
  html: `<div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:#E8A838;border:2px solid #0B3D5C;transform:rotate(-45deg);box-shadow:0 4px 10px rgba(11,61,92,.35)"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
})

function ClickPicker({ position, onChange }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return position ? <Marker position={[position.lat, position.lng]} icon={pinIcon} /> : null
}

export default function MapPinPicker({ cityId, value, onChange, className = '' }) {
  const center = useMemo(() => {
    if (value?.lat) return [value.lat, value.lng]
    const c = cityCenter(cityId)
    return [c.lat, c.lng]
  }, [cityId, value])

  return (
    <div className={`overflow-hidden rounded-2xl border border-border ${className}`}>
      <MapContainer center={center} zoom={13} className="h-64 w-full" scrollWheelZoom={false}>
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickPicker position={value} onChange={onChange} />
      </MapContainer>
      <p className="bg-mist px-3 py-2 text-xs text-ink-muted">
        Click the map to drop a pin
        {value?.lat ? ` · ${value.lat.toFixed(5)}, ${value.lng.toFixed(5)}` : ''}
      </p>
    </div>
  )
}
