import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react'
import Card from '../ui/Card'
import { formatINR } from '../../utils/format'

export default function LocalityInsights({ insights, localityName }) {
  if (!insights) return null

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold">Locality insights</h2>
          <p className="text-sm text-ink-muted">{localityName}</p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-full bg-amber/20 px-3 py-1 text-sm font-bold text-ink">
          <Star className="h-4 w-4 fill-amber text-amber" />
          {insights.rating?.toFixed(1)} / 5
        </div>
      </div>

      <div className="mt-5 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={insights.priceTrend || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d6e2ec" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => formatINR(v)}
              width={64}
            />
            <Tooltip formatter={(v) => [`${formatINR(v)}/sq.ft`, 'Avg price']} />
            <Line type="monotone" dataKey="price" stroke="#0B3D5C" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-xs text-ink-muted">Average price trend (₹ / sq.ft) — mock data</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-success">
            <ThumbsUp className="h-4 w-4" /> Pros
          </div>
          <ul className="space-y-1.5 text-sm text-ink-muted">
            {(insights.pros || []).map((p) => (
              <li key={p}>• {p}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-danger">
            <ThumbsDown className="h-4 w-4" /> Cons
          </div>
          <ul className="space-y-1.5 text-sm text-ink-muted">
            {(insights.cons || []).map((c) => (
              <li key={c}>• {c}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
