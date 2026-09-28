import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import { calcEMI, formatINR } from '../../utils/format'

/** Rough Indian home-loan eligibility heuristic for demo purposes */
export function estimateEligibleLoan({
  monthlyIncome,
  otherEmi = 0,
  rate = 8.5,
  years = 20,
  foir = 0.5,
}) {
  const maxEmi = Math.max(0, monthlyIncome * foir - otherEmi)
  const r = rate / 12 / 100
  const n = years * 12
  if (!maxEmi || !n) return { maxEmi: 0, eligibleLoan: 0, suggestedEmi: 0 }
  const eligibleLoan = r
    ? (maxEmi * ((1 + r) ** n - 1)) / (r * (1 + r) ** n)
    : maxEmi * n
  return {
    maxEmi: Math.round(maxEmi),
    eligibleLoan: Math.round(eligibleLoan),
    suggestedEmi: Math.round(calcEMI(eligibleLoan, rate, years)),
  }
}

export default function LoanEligibilityCalculator({ className = '' }) {
  const [income, setIncome] = useState(120000)
  const [otherEmi, setOtherEmi] = useState(15000)
  const [rate, setRate] = useState(8.5)
  const [years, setYears] = useState(20)
  const [foir, setFoir] = useState(50)

  const result = useMemo(
    () =>
      estimateEligibleLoan({
        monthlyIncome: income,
        otherEmi,
        rate,
        years,
        foir: foir / 100,
      }),
    [income, otherEmi, rate, years, foir],
  )

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold">
          Net monthly income (₹)
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value) || 0)}
          />
        </label>
        <label className="block text-sm font-semibold">
          Existing EMIs (₹ / month)
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            value={otherEmi}
            onChange={(e) => setOtherEmi(Number(e.target.value) || 0)}
          />
        </label>
        <label className="block text-sm font-semibold">
          Assumed interest rate (% p.a.)
          <input
            type="number"
            step="0.1"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
          />
        </label>
        <label className="block text-sm font-semibold">
          Preferred tenure (years)
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            value={years}
            onChange={(e) => setYears(Number(e.target.value) || 1)}
          />
        </label>
        <label className="block text-sm font-semibold md:col-span-2">
          FOIR / max EMI share of income ({foir}%)
          <input
            type="range"
            min={35}
            max={60}
            value={foir}
            onChange={(e) => setFoir(Number(e.target.value))}
            className="mt-2 w-full accent-ink"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="bg-ink p-4 text-white sm:col-span-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/70">Eligible loan</div>
          <div className="mt-1 text-2xl font-extrabold text-amber">
            {formatINR(result.eligibleLoan)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase text-ink-muted">Max EMI capacity</div>
          <div className="mt-1 text-xl font-extrabold">{formatINR(result.maxEmi, { compact: false })}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase text-ink-muted">EMI on eligible loan</div>
          <div className="mt-1 text-xl font-extrabold">
            {formatINR(result.suggestedEmi, { compact: false })}
          </div>
        </Card>
      </div>

      <p className="text-xs text-ink-muted">
        Demo estimate only — banks use credit score, employment type and other factors. Not financial advice.
      </p>

      <Link
        to={`/tools/emi?amount=${result.eligibleLoan}&rate=${rate}&years=${years}`}
        className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-ink hover:bg-mist"
      >
        Open EMI schedule for this amount →
      </Link>
    </div>
  )
}
