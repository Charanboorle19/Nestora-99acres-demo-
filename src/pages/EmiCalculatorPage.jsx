import { Link, useSearchParams } from 'react-router-dom'
import EmiCalculator from '../components/tools/EmiCalculator'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function EmiCalculatorPage() {
  const [params] = useSearchParams()
  const amount = Number(params.get('amount')) || 8000000
  const rate = Number(params.get('rate')) || 8.5
  const years = Number(params.get('years')) || 20

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">EMI calculator</h1>
          <p className="text-sm text-ink-muted">
            Estimate monthly payments with a full amortization chart and schedule.
          </p>
        </div>
        <Button variant="secondary" size="sm">
          <Link to="/tools/loan-eligibility">Loan eligibility →</Link>
        </Button>
      </div>

      <Card className="mt-8 p-5 sm:p-6">
        <EmiCalculator
          key={`${amount}-${rate}-${years}`}
          initialAmount={amount}
          initialRate={rate}
          initialYears={years}
        />
      </Card>
    </div>
  )
}
