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
    <Card className="min-w-0 overflow-hidden p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold sm:text-xl">Locality insights</h2>
          <p className="truncate text-sm text-ink-muted">{localityName}</p>
        </div>
        <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber/20 px-3 py-1 text-sm font-bold text-ink">
          <Star className="h-4 w-4 fill-amber text-amber" />
          {insights.rating?.toFixed(1)} / 5
        </div>
      </div>

      <div className="mt-4 -mx-1 h-48 w-full min-w-0 sm:mx-0 sm:mt-5 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={insights.priceTrend || []} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d6e2ec" />
            <XAxis dataKey="month" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => formatINR(v, { compact: true })}
              width={48}
            />
            <Tooltip formatter={(v) => [`${formatINR(v)}/sq.ft`, 'Avg price']} />
            <Line type="monotone" dataKey="price" stroke="#0B3D5C" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-xs text-ink-muted">Average price trend (₹ / sq.ft) — mock data</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-success">
            <ThumbsUp className="h-4 w-4 shrink-0" /> Pros
          </div>
          <ul className="space-y-1.5 text-sm text-ink-muted">
            {(insights.pros || []).map((p) => (
              <li key={p} className="wrap-break-word">
                • {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm font-bold text-danger">
            <ThumbsDown className="h-4 w-4 shrink-0" /> Cons
          </div>
          <ul className="space-y-1.5 text-sm text-ink-muted">
            {(insights.cons || []).map((c) => (
              <li key={c} className="wrap-break-word">
                • {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  )
}
