import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Building2, Star } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Skeleton from '../components/ui/Skeleton'
import { getBuilderBySlug } from '../services/api'
import { formatINR } from '../utils/format'
import { CITIES } from '../utils/constants'

export default function BuilderProfilePage() {
  const { slug } = useParams()
  const [builder, setBuilder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      try {
        const data = await getBuilderBySlug(slug)
        if (alive) setBuilder(data)
      } catch {
        if (alive) setError('Builder not found')
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => {
      alive = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-10">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (error || !builder) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Builder not found</h1>
        <Link to="/search?type=projects" className="mt-4 inline-block font-bold text-ink">
          Browse projects →
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Card className="overflow-hidden p-0">
        <div className="bg-gradient-to-br from-ink to-ink-soft px-6 py-10 text-white">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
              <Building2 className="h-8 w-8 text-amber" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold sm:text-4xl">{builder.name}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/75">
                Trusted Nestora partner since {builder.established}. Crafting residences across{' '}
                {builder.cityIds.map((id) => CITIES.find((c) => c.id === id)?.name).filter(Boolean).join(', ')}.
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-semibold">
                  <Star className="h-4 w-4 fill-amber text-amber" /> {builder.rating} rating
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">
                  {builder.projectsCompleted}+ projects delivered
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-semibold">
                  Est. {builder.established}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="font-display text-2xl font-semibold">Projects on Nestora</h2>
        <p className="text-sm text-ink-muted">{builder.projects.length} live microsites</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {builder.projects.map((p) => (
            <Link
              key={p.id}
              to={`/project/${p.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <img src={p.heroImage} alt={p.name} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="p-4">
                <Badge tone="mist">{p.status}</Badge>
                <div className="mt-2 font-bold text-ink">{p.name}</div>
                <div className="text-sm text-ink-muted">
                  {p.localityName} · from {formatINR(p.priceList[0]?.priceFrom)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
