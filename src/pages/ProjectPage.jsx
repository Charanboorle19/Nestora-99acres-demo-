import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Download, MapPin, ShieldCheck } from 'lucide-react'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Skeleton from '../components/ui/Skeleton'
import UnitAvailabilityGrid from '../components/project/UnitAvailabilityGrid'
import ConstructionTimeline from '../components/project/ConstructionTimeline'
import ProjectEnquiryForm from '../components/project/ProjectEnquiryForm'
import ProjectLocationMap from '../components/project/ProjectLocationMap'
import { getProjectBySlug } from '../services/api'
import { formatINR, formatArea } from '../utils/format'
import { CITIES } from '../utils/constants'
import { useToast } from '../components/ui/Toast'
import { builders } from '../data/localities'

export default function ProjectPage() {
  const { slug } = useParams()
  const toast = useToast()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [galleryIdx, setGalleryIdx] = useState(0)

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getProjectBySlug(slug)
        if (alive) setProject(data)
      } catch {
        if (alive) setError('Project not found')
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
      <div className="space-y-4">
        <Skeleton className="h-[42vh] w-full rounded-none" />
        <div className="w-full space-y-4 px-2 py-6 sm:px-3">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Project not found</h1>
        <Link to="/search?type=projects" className="mt-4 inline-block font-bold text-ink">
          Browse new projects →
        </Link>
      </div>
    )
  }

  const cityName = CITIES.find((c) => c.id === project.cityId)?.name
  const builder = builders.find((b) => b.id === project.builderId)

  const downloadBrochure = () => {
    toast.success('Demo brochure download started (mock PDF)')
  }

  return (
    <div>
      <section className="relative min-h-[48vh] overflow-hidden">
        <img
          src={project.heroImage}
          alt={project.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 to-ink/20" />
        <div className="relative flex min-h-[42vh] w-full flex-col justify-end px-2 pb-8 pt-20 sm:min-h-[48vh] sm:px-3 sm:pb-10 sm:pt-24">
          <div className="flex flex-wrap gap-2">
            <Badge tone="featured">{project.status}</Badge>
            <Badge tone="mist" className="bg-white/15 text-white">
              Possession {project.possession}
            </Badge>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            {project.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80 sm:text-base">
            by{' '}
            <Link to={`/builder/${builder?.slug || project.builderId}`} className="font-bold text-amber hover:underline">
              {project.builderName}
            </Link>{' '}
            · {project.localityName}, {cityName}
          </p>
          <div className="mt-5 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button
              variant="amber"
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('project-enquiry')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Enquire now
            </Button>
            <Button variant="secondary" className="w-full bg-white/95 sm:w-auto" onClick={downloadBrochure}>
              <Download className="h-4 w-4" /> Download brochure
            </Button>
          </div>
        </div>
      </section>

      <div className="grid w-full gap-6 px-2 py-6 pb-8 sm:px-3 sm:py-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="order-2 min-w-0 space-y-6 lg:order-1">
          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{project.overview}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-1 rounded-xl bg-mist px-3 py-2 font-semibold">
                <ShieldCheck className="h-4 w-4 text-success" /> RERA {project.rera}
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl bg-mist px-3 py-2 font-semibold">
                <MapPin className="h-4 w-4 text-amber" /> {project.localityName}
              </span>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Configurations</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {project.configs.map((c) => (
                <div key={c.bhk} className="rounded-2xl border border-border p-4">
                  <div className="text-lg font-extrabold text-ink">{c.bhk}</div>
                  <div className="mt-1 text-sm text-ink-muted">{formatArea(c.area)}</div>
                  <div className="mt-2 text-base font-bold">From {formatINR(c.priceFrom)}</div>
                  <div className="mt-1 text-xs text-ink-muted">
                    Facing {c.facing?.join(', ')} · Floors {c.floors}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Unit availability</h2>
            <p className="text-sm text-ink-muted">Colour-coded inventory — filter by BHK, floor and facing</p>
            <div className="mt-4">
              <UnitAvailabilityGrid units={project.units} />
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-display text-xl font-semibold">Price list</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-mist text-left text-xs uppercase text-ink-muted">
                  <tr>
                    <th className="px-5 py-2">Config</th>
                    <th className="px-5 py-2">Area</th>
                    <th className="px-5 py-2">From</th>
                    <th className="px-5 py-2">To</th>
                  </tr>
                </thead>
                <tbody>
                  {project.priceList.map((row) => (
                    <tr key={row.bhk} className="border-t border-border">
                      <td className="px-5 py-3 font-semibold">{row.bhk}</td>
                      <td className="px-5 py-3">{formatArea(row.area)}</td>
                      <td className="px-5 py-3 font-bold">{formatINR(row.priceFrom)}</td>
                      <td className="px-5 py-3">{formatINR(row.priceTo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Floor plans</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {project.floorPlans.map((fp) => (
                <div key={fp.bhk} className="overflow-hidden rounded-2xl border border-border">
                  <img src={fp.image} alt={`${fp.bhk} floor plan`} className="h-44 w-full object-cover" />
                  <div className="p-3 text-sm font-bold">{fp.bhk} plan</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Amenities</h2>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {project.amenities.map((a) => (
                <div key={a} className="rounded-xl border border-border px-3 py-2 text-sm font-medium">
                  {a}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Location advantages</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <ProjectLocationMap project={project} />
              <ul className="space-y-3">
                {project.locationAdvantages.map((a) => (
                  <li key={a.label} className="flex items-center justify-between rounded-xl bg-mist px-4 py-3">
                    <span className="text-sm font-semibold">{a.label}</span>
                    <span className="text-sm font-bold text-ink">{a.distanceKm} km</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-display text-xl font-semibold">Gallery</h2>
            <img
              src={project.gallery[galleryIdx]}
              alt=""
              className="mt-4 aspect-video w-full rounded-2xl object-cover"
            />
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {project.gallery.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setGalleryIdx(i)}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 ${
                    i === galleryIdx ? 'border-ink' : 'border-transparent'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <h2 className="font-display text-xl font-semibold">RERA information</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3 border-b border-border py-2">
                  <dt className="text-ink-muted">Registration ID</dt>
                  <dd className="font-bold">{project.rera}</dd>
                </div>
                <div className="flex justify-between gap-3 border-b border-border py-2">
                  <dt className="text-ink-muted">Project status</dt>
                  <dd className="font-bold">{project.status}</dd>
                </div>
                <div className="flex justify-between gap-3 py-2">
                  <dt className="text-ink-muted">Promoter</dt>
                  <dd className="font-bold">{project.builderName}</dd>
                </div>
              </dl>
            </Card>
            <Card className="p-5">
              <h2 className="font-display text-xl font-semibold">Construction progress</h2>
              <div className="mt-4">
                <ConstructionTimeline timeline={project.constructionTimeline} />
              </div>
            </Card>
          </div>
        </div>

        <aside className="order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start">
          <Card className="p-4 sm:p-5">
            <div className="text-sm text-ink-muted">Starting from</div>
            <div className="text-2xl font-extrabold text-ink">
              {formatINR(project.priceList[0]?.priceFrom)}
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              {project.configs.length} configs · {project.localityName}
            </p>
            <div className="mt-5">
              <h3 className="mb-3 font-display text-lg font-semibold">Enquire with builder</h3>
              <ProjectEnquiryForm project={project} />
            </div>
            <Link
              to={`/builder/${builder?.slug || project.builderId}`}
              className="mt-4 block text-center text-sm font-bold text-ink hover:underline"
            >
              View all {project.builderName} projects →
            </Link>
          </Card>
        </aside>
      </div>
    </div>
  )
}
