import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { amortizationSchedule, calcEMI, formatINR, cn } from '../../utils/format'

export default function EmiCalculator({
  initialAmount = 8000000,
  initialRate = 8.5,
  initialYears = 20,
  compact = false,
  className = '',
}) {
  const [amount, setAmount] = useState(Number(initialAmount) || 8000000)
  const [rate, setRate] = useState(Number(initialRate) || 8.5)
  const [years, setYears] = useState(Number(initialYears) || 20)
  const [showMonthly, setShowMonthly] = useState(false)

  const { emi, rows } = useMemo(
    () => amortizationSchedule(amount, rate, years),
    [amount, rate, years],
  )

  const totalPayment = emi * years * 12
  const totalInterest = Math.max(0, totalPayment - amount)

  const yearlyChart = useMemo(() => {
    const byYear = []
    for (let y = 1; y <= years; y += 1) {
      const slice = rows.slice((y - 1) * 12, y * 12)
      byYear.push({
        year: `Y${y}`,
        principal: slice.reduce((s, r) => s + r.principal, 0),
        interest: slice.reduce((s, r) => s + r.interest, 0),
      })
    }
    return byYear
  }, [rows, years])

  const tableRows = showMonthly
    ? rows
    : yearlyChart.map((y, i) => ({
        month: i + 1,
        label: `Year ${i + 1}`,
        principal: y.principal,
        interest: y.interest,
        emi: emi * 12,
        balance: rows[Math.min(rows.length, (i + 1) * 12) - 1]?.balance ?? 0,
      }))

  return (
    <div className={cn('space-y-6', className)}>
      <div className={cn('grid gap-4', compact ? 'sm:grid-cols-3' : 'md:grid-cols-3')}>
        <label className="block text-sm font-semibold">
          Loan amount (₹)
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            value={amount}
            min={100000}
            step={100000}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
          />
          <input
            type="range"
            min={500000}
            max={50000000}
            step={100000}
            value={Math.min(50000000, Math.max(500000, amount))}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-2 w-full accent-ink"
          />
        </label>
        <label className="block text-sm font-semibold">
          Interest rate (% p.a.)
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            value={rate}
            min={1}
            max={20}
            step={0.1}
            onChange={(e) => setRate(Number(e.target.value) || 0)}
          />
          <input
            type="range"
            min={6}
            max={15}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="mt-2 w-full accent-ink"
          />
        </label>
        <label className="block text-sm font-semibold">
          Tenure (years)
          <input
            type="number"
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            value={years}
            min={1}
            max={30}
            onChange={(e) => setYears(Number(e.target.value) || 1)}
          />
          <input
            type="range"
            min={5}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="mt-2 w-full accent-ink"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="bg-ink p-4 text-white">
          <div className="text-xs font-semibold uppercase tracking-wide text-white/70">Monthly EMI</div>
          <div className="mt-1 text-2xl font-extrabold text-amber">{formatINR(emi, { compact: false })}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Total interest</div>
          <div className="mt-1 text-xl font-extrabold">{formatINR(totalInterest)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Total payment</div>
          <div className="mt-1 text-xl font-extrabold">{formatINR(totalPayment)}</div>
        </Card>
      </div>

      {!compact && (
        <>
          <Card className="p-4">
            <h3 className="font-display text-lg font-semibold">Amortization chart</h3>
            <p className="text-xs text-ink-muted">Principal vs interest paid each year</p>
            <div className="mt-4 h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#d6e2ec" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatINR(v)} width={72} />
                  <Tooltip formatter={(v) => formatINR(v, { compact: false })} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="principal"
                    stackId="1"
                    stroke="#0B3D5C"
                    fill="#0B3D5C"
                    fillOpacity={0.85}
                    name="Principal"
                  />
                  <Area
                    type="monotone"
                    dataKey="interest"
                    stackId="1"
                    stroke="#E8A838"
                    fill="#E8A838"
                    fillOpacity={0.9}
                    name="Interest"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
              <h3 className="font-display text-lg font-semibold">Repayment schedule</h3>
              <Button size="sm" variant="secondary" onClick={() => setShowMonthly((v) => !v)}>
                Show {showMonthly ? 'yearly' : 'monthly'}
              </Button>
            </div>
            <div className="max-h-96 overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 bg-mist">
                  <tr className="text-left text-xs uppercase tracking-wide text-ink-muted">
                    <th className="px-4 py-2">{showMonthly ? 'Month' : 'Year'}</th>
                    <th className="px-4 py-2">EMI / period</th>
                    <th className="px-4 py-2">Principal</th>
                    <th className="px-4 py-2">Interest</th>
                    <th className="px-4 py-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((r) => (
                    <tr key={r.month} className="border-t border-border">
                      <td className="px-4 py-2 font-semibold">{r.label || r.month}</td>
                      <td className="px-4 py-2">{formatINR(r.emi)}</td>
                      <td className="px-4 py-2">{formatINR(r.principal)}</td>
                      <td className="px-4 py-2">{formatINR(r.interest)}</td>
                      <td className="px-4 py-2">{formatINR(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {compact && (
        <p className="text-xs text-ink-muted">
          Est. EMI {formatINR(calcEMI(amount, rate, years), { compact: false })}/mo at {rate}% for {years} yrs
        </p>
      )}
    </div>
  )
}
