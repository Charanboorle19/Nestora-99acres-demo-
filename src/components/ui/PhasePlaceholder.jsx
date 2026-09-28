import { Link } from 'react-router-dom'
import Card from './Card'
import Badge from './Badge'
import Button from './Button'

export default function PhasePlaceholder({ title, phase, description, links = [] }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Card className="p-8">
        <Badge tone="amber">Phase {phase} coming next</Badge>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">{title}</h1>
        <p className="mt-3 text-ink-muted">{description}</p>
        {links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {links.map((l) => (
              <Button key={l.to} variant="secondary">
                <Link to={l.to}>{l.label}</Link>
              </Button>
            ))}
          </div>
        )}
        <p className="mt-8 text-sm text-ink-muted">
          Route is wired and ready. Full UI ships in the upcoming phase.
        </p>
      </Card>
    </div>
  )
}
