import { Link } from 'react-router-dom'
import LoanEligibilityCalculator from '../components/tools/LoanEligibilityCalculator'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function LoanEligibilityPage() {
  return (
    <div className="w-full px-2 py-8 sm:px-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Loan eligibility</h1>
          <p className="text-sm text-ink-muted">
            Rough estimate of how much home loan you may qualify for.
          </p>
        </div>
        <Button variant="secondary" size="sm">
          <Link to="/tools/emi">EMI calculator →</Link>
        </Button>
      </div>

      <Card className="mt-8 p-5 sm:p-6">
        <LoanEligibilityCalculator />
      </Card>
    </div>
  )
}
