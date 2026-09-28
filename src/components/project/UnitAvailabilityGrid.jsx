import { useMemo, useState } from 'react'
import { cn } from '../../utils/format'

const STATUS_STYLE = {
  available: 'bg-success/80 hover:bg-success text-white',
  hold: 'bg-amber text-ink',
  sold: 'bg-fog text-ink-muted line-through',
}

export default function UnitAvailabilityGrid({ units = [] }) {
  const [bhk, setBhk] = useState('all')
  const [floor, setFloor] = useState('all')
  const [facing, setFacing] = useState('all')

  const options = useMemo(() => {
    const bhks = [...new Set(units.map((u) => u.bhk))]
    const floors = [...new Set(units.map((u) => u.floor))].sort((a, b) => a - b)
    const facings = [...new Set(units.map((u) => u.facing))]
    return { bhks, floors, facings }
  }, [units])

  const filtered = units.filter((u) => {
    if (bhk !== 'all' && u.bhk !== bhk) return false
    if (floor !== 'all' && String(u.floor) !== String(floor)) return false
    if (facing !== 'all' && u.facing !== facing) return false
    return true
  })

  const counts = {
    available: filtered.filter((u) => u.status === 'available').length,
    hold: filtered.filter((u) => u.status === 'hold').length,
    sold: filtered.filter((u) => u.status === 'sold').length,
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <select
          className="h-9 rounded-xl border border-border bg-white px-3 text-sm font-semibold"
          value={bhk}
          onChange={(e) => setBhk(e.target.value)}
        >
          <option value="all">All BHK</option>
          {options.bhks.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-xl border border-border bg-white px-3 text-sm font-semibold"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
        >
          <option value="all">All floors</option>
          {options.floors.map((f) => (
            <option key={f} value={f}>
              Floor {f}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-xl border border-border bg-white px-3 text-sm font-semibold"
          value={facing}
          onChange={(e) => setFacing(e.target.value)}
        >
          <option value="all">All facing</option>
          {options.facings.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-success" /> Available ({counts.available})
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-amber" /> On hold ({counts.hold})
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-fog" /> Sold ({counts.sold})
        </span>
      </div>

      <div className="mt-4 grid max-h-80 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6 md:grid-cols-8">
        {filtered.map((u) => (
          <div
            key={u.id}
            title={`${u.unitNo} · ${u.bhk} · ${u.facing} · ${u.status}`}
            className={cn(
              'rounded-lg px-1 py-2 text-center text-[11px] font-bold transition',
              STATUS_STYLE[u.status] || STATUS_STYLE.available,
            )}
          >
            {u.unitNo}
          </div>
        ))}
      </div>
      {!filtered.length && (
        <p className="mt-4 text-center text-sm text-ink-muted">No units match these filters.</p>
      )}
    </div>
  )
}
