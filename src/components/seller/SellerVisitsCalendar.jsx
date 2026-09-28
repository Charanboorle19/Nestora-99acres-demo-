import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { useVisitStore, useToastStore } from '../../store'
import { cn } from '../../utils/format'

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function daysInMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

export default function SellerVisitsCalendar() {
  const { visits, update } = useVisitStore()
  const toast = useToastStore((s) => s.push)
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))

  const cells = useMemo(() => {
    const first = startOfMonth(cursor)
    const total = daysInMonth(cursor)
    const pad = first.getDay()
    const out = []
    for (let i = 0; i < pad; i += 1) out.push(null)
    for (let d = 1; d <= total; d += 1) {
      const date = new Date(cursor.getFullYear(), cursor.getMonth(), d)
      out.push(date.toISOString().slice(0, 10))
    }
    return out
  }, [cursor])

  const byDate = useMemo(() => {
    const map = {}
    visits.forEach((v) => {
      map[v.date] = map[v.date] || []
      map[v.date].push(v)
    })
    return map
  }, [visits])

  const dayVisits = byDate[selectedDate] || []

  const reschedule = (visit) => {
    const next = new Date(visit.date)
    next.setDate(next.getDate() + 1)
    update(visit.id, { date: next.toISOString().slice(0, 10), status: 'rescheduled' })
    toast({ type: 'info', title: 'Rescheduled', message: 'Moved to the next day (demo)' })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Site visit requests</h2>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[9rem] text-center text-sm font-bold">
            {cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </div>
          <Button
            size="icon"
            variant="secondary"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card className="p-4">
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-ink-muted">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, i) => {
              if (!date) return <div key={`e-${i}`} />
              const count = byDate[date]?.length || 0
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    'flex h-14 flex-col items-center justify-center rounded-xl border text-sm font-semibold',
                    selectedDate === date ? 'border-ink bg-ink text-white' : 'border-border bg-white',
                    count && selectedDate !== date && 'border-amber bg-amber/10',
                  )}
                >
                  {Number(date.slice(-2))}
                  {count > 0 && <span className="text-[10px] opacity-80">{count} visit{count > 1 ? 's' : ''}</span>}
                </button>
              )
            })}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold">
            {new Date(selectedDate).toLocaleDateString('en-IN', {
              weekday: 'long',
              day: 'numeric',
              month: 'short',
            })}
          </h3>
          <div className="mt-3 space-y-3">
            {dayVisits.map((v) => (
              <div key={v.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link to={`/property/${v.listingId}`} className="font-bold hover:underline">
                      {v.listingTitle}
                    </Link>
                    <div className="text-xs text-ink-muted">
                      {v.slot} · {v.buyerName} · {v.buyerPhone}
                    </div>
                    <Badge tone="mist" className="mt-1">
                      {v.status}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Button size="sm" onClick={() => update(v.id, { status: 'accepted' })}>
                    Accept
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => update(v.id, { status: 'declined' })}>
                    Decline
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => reschedule(v)}>
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
            {!dayVisits.length && (
              <p className="py-8 text-center text-sm text-ink-muted">No visits on this day.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
