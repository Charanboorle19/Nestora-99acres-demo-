import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Tabs from '../ui/Tabs'
import { QUICK_REPLY_TEMPLATES } from '../../utils/constants'
import { relativeTime, cn } from '../../utils/format'
import { useEnquiryStore, useToastStore } from '../../store'

const STATUSES = ['new', 'contacted', 'site visit', 'closed']

export default function SellerLeads() {
  const { enquiries, update } = useEnquiryStore()
  const toast = useToastStore((s) => s.push)
  const [view, setView] = useState('table')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const items = useMemo(() => {
    if (statusFilter === 'all') return enquiries
    return enquiries.filter((e) => e.status === statusFilter)
  }, [enquiries, statusFilter])

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(STATUSES.map((s) => [s, []]))
    enquiries.forEach((e) => {
      const key = STATUSES.includes(e.status) ? e.status : 'new'
      map[key].push(e)
    })
    return map
  }, [enquiries])

  const applyTemplate = (text) => {
    if (!selected) return
    update(selected.id, {
      notes: `${selected.notes ? `${selected.notes}\n` : ''}Reply: ${text}`,
      status: selected.status === 'new' ? 'contacted' : selected.status,
    })
    toast({ type: 'success', title: 'Quick reply saved', message: 'Logged on the lead note' })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Lead management</h2>
        <div className="flex flex-wrap gap-2">
          <select
            className="h-9 rounded-xl border border-border bg-white px-3 text-sm font-semibold"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <Tabs
            tabs={[
              { id: 'table', label: 'Table' },
              { id: 'kanban', label: 'Kanban' },
            ]}
            value={view}
            onChange={setView}
            className="w-auto"
          />
        </div>
      </div>

      {view === 'table' && (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-mist text-left text-xs uppercase text-ink-muted">
                <tr>
                  <th className="px-4 py-2">Lead</th>
                  <th className="px-4 py-2">Property</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">When</th>
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <tr
                    key={e.id}
                    className={cn(
                      'cursor-pointer border-t border-border hover:bg-mist/50',
                      selected?.id === e.id && 'bg-mist',
                    )}
                    onClick={() => setSelected(e)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-semibold">{e.buyerName}</div>
                      <div className="text-xs text-ink-muted">{e.buyerPhone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/property/${e.listingId}`} className="hover:underline" onClick={(ev) => ev.stopPropagation()}>
                        {e.listingTitle}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-lg border border-border px-2 py-1 text-xs font-semibold capitalize"
                        value={e.status}
                        onClick={(ev) => ev.stopPropagation()}
                        onChange={(ev) => update(e.id, { status: ev.target.value })}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{relativeTime(e.createdAt)}</td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-ink-muted">
                      No buyer enquiries yet. They appear here when buyers contact listings.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {view === 'kanban' && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {STATUSES.map((status) => (
            <div key={status} className="rounded-2xl border border-border bg-white/80 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">{status}</span>
                <Badge tone="mist">{byStatus[status].length}</Badge>
              </div>
              <div className="space-y-2">
                {byStatus[status].map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setSelected(e)}
                    className="w-full rounded-xl border border-border bg-white p-3 text-left shadow-soft"
                  >
                    <div className="text-sm font-bold">{e.buyerName}</div>
                    <div className="mt-1 line-clamp-2 text-xs text-ink-muted">{e.listingTitle}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <Card className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg font-semibold">{selected.buyerName}</h3>
              <p className="text-sm text-ink-muted">
                {selected.buyerPhone} · {selected.listingTitle}
              </p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>
              Close
            </Button>
          </div>
          <p className="mt-3 rounded-xl bg-mist p-3 text-sm">{selected.message}</p>
          <label className="mt-4 block text-sm font-semibold">
            Notes
            <textarea
              className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
              rows={3}
              value={selected.notes || ''}
              onChange={(e) => {
                update(selected.id, { notes: e.target.value })
                setSelected({ ...selected, notes: e.target.value })
              }}
            />
          </label>
          <div className="mt-3">
            <div className="mb-2 text-xs font-bold uppercase text-ink-muted">Quick replies</div>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLY_TEMPLATES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="rounded-full border border-border bg-white px-3 py-1.5 text-left text-xs font-semibold hover:border-ink/40"
                >
                  {t.slice(0, 42)}…
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
