import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from 'recharts'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { formatINR } from '../../utils/format'
import { updateListing } from '../../services/api'

const RANGES = [
  { id: '7d', label: '7 days', days: 7 },
  { id: '30d', label: '30 days', days: 30 },
  { id: '90d', label: '90 days', days: 90 },
]

function buildSeries(listings, days) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (days - 1 - i))
    const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    const seed = listings.reduce((s, l) => s + (l.views || 0), 0)
    const views = Math.max(2, Math.round((seed / days) * (0.6 + ((i * 17) % 10) / 10)))
    const leads = Math.max(0, Math.round(views * 0.08 + (i % 3)))
    return { label, views, leads }
  })
}

export default function SellerOverview({ listings = [] }) {
  const [range, setRange] = useState('30d')
  const days = RANGES.find((r) => r.id === range)?.days || 30
  const series = useMemo(() => buildSeries(listings, days), [listings, days])

  const totals = useMemo(() => {
    const views = listings.reduce((s, l) => s + (l.views || 0), 0)
    const leads = listings.reduce((s, l) => s + (l.enquiries || 0), 0)
    const shortlists = listings.reduce((s, l) => s + (l.shortlists || 0), 0)
    const conversion = views ? ((leads / views) * 100).toFixed(1) : '0.0'
    return { views, leads, shortlists, conversion }
  }, [listings])

  const top = [...listings]
    .sort((a, b) => (b.enquiries || 0) - (a.enquiries || 0) || (b.views || 0) - (a.views || 0))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold">Overview</h2>
        <div className="flex rounded-xl border border-border bg-white p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                range === r.id ? 'bg-mist text-ink' : 'text-ink-muted'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Views', value: totals.views },
          { label: 'Leads', value: totals.leads },
          { label: 'Shortlists', value: totals.shortlists },
          { label: 'Conversion', value: `${totals.conversion}%` },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-ink-muted">{s.label}</div>
            <div className="mt-1 text-2xl font-extrabold text-ink">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h3 className="font-semibold">Views over time</h3>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d6e2ec" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={36} />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#0B3D5C" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold">Leads over time</h3>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d6e2ec" />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={28} />
                <Tooltip />
                <Bar dataKey="leads" fill="#E8A838" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-border px-4 py-3 font-display text-lg font-semibold">
          Top performing listings
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-mist text-left text-xs uppercase text-ink-muted">
              <tr>
                <th className="px-4 py-2">Listing</th>
                <th className="px-4 py-2">Views</th>
                <th className="px-4 py-2">Leads</th>
                <th className="px-4 py-2">Shortlists</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {top.map((l) => (
                <tr key={l.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <Link to={`/property/${l.id}`} className="font-semibold hover:underline">
                      {l.title}
                    </Link>
                    <div className="text-xs text-ink-muted">{l.localityName}</div>
                  </td>
                  <td className="px-4 py-3">{l.views}</td>
                  <td className="px-4 py-3">{l.enquiries}</td>
                  <td className="px-4 py-3">{l.shortlists}</td>
                  <td className="px-4 py-3 font-bold">{formatINR(l.price)}</td>
                </tr>
              ))}
              {!top.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    No listings yet.{' '}
                    <Link to="/post-property" className="font-bold text-ink">
                      Post one
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export function SellerListingsTable({ listings, onRefresh, onPromote, onVerify }) {
  const [busy, setBusy] = useState(null)

  const act = async (id, patch, label) => {
    setBusy(id + label)
    await updateListing(id, patch)
    await onRefresh?.()
    setBusy(null)
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <h2 className="font-display text-lg font-semibold">My listings</h2>
        <Link
          to="/post-property"
          className="inline-flex h-8 items-center rounded-xl bg-ink px-3 text-xs font-semibold text-white"
        >
          Post property
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-mist text-left text-xs uppercase text-ink-muted">
            <tr>
              <th className="px-4 py-2">Listing</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Views</th>
              <th className="px-4 py-2">Leads</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id} className="border-t border-border align-top">
                <td className="px-4 py-3">
                  <Link to={`/property/${l.id}`} className="font-semibold hover:underline">
                    {l.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {l.featured && <Badge tone="featured">Featured</Badge>}
                    {l.verified && <Badge tone="verified">Verified</Badge>}
                  </div>
                  <div className="text-xs text-ink-muted">{l.localityName}</div>
                </td>
                <td className="px-4 py-3 capitalize">
                  <Badge
                    tone={
                      l.status === 'active' ? 'success' : l.status === 'pending' ? 'amber' : 'mist'
                    }
                  >
                    {l.status === 'paused' ? 'paused' : l.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">{l.views}</td>
                <td className="px-4 py-3">{l.enquiries}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={busy === l.id + 'pause'}
                      onClick={() =>
                        act(
                          l.id,
                          { status: l.status === 'paused' ? 'active' : 'paused' },
                          'pause',
                        )
                      }
                    >
                      {l.status === 'paused' ? 'Resume' : 'Pause'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={busy === l.id + 'renew'}
                      onClick={() => act(l.id, { status: 'active' }, 'renew')}
                    >
                      Renew
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => onPromote?.(l)}>
                      Promote
                    </Button>
                    {!l.verified && (
                      <Button size="sm" variant="secondary" onClick={() => onVerify?.(l)}>
                        Verify
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!listings.length && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-muted">
                  No listings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
