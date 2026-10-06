import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Heart,
  MessageSquare,
  Bookmark,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import Tabs from '../components/ui/Tabs'
import {
  useAuthStore,
  useEnquiryStore,
  useVisitStore,
  useShortlistStore,
  useSavedSearchStore,
} from '../store'
import { getListingById } from '../services/api'
import { formatINR, relativeTime } from '../utils/format'
import ListingCard from '../components/listings/ListingCard'
import { ListingCardSkeleton } from '../components/ui/Skeleton'

export default function BuyerDashboardPage() {
  const navigate = useNavigate()
  const { user, openLogin } = useAuthStore()
  const enquiries = useEnquiryStore((s) => s.enquiries)
  const visits = useVisitStore((s) => s.visits)
  const updateVisit = useVisitStore((s) => s.update)
  const shortlistIds = useShortlistStore((s) => s.ids)
  const savedSearches = useSavedSearchStore((s) => s.searches)
  const [tab, setTab] = useState('overview')
  const [shortlistItems, setShortlistItems] = useState([])
  const [loadingShortlist, setLoadingShortlist] = useState(false)

  const today = new Date().toISOString().slice(0, 10)
  const upcomingVisits = useMemo(
    () => visits.filter((v) => v.date >= today && v.status !== 'declined' && v.status !== 'completed'),
    [visits, today],
  )
  const pastVisits = useMemo(
    () => visits.filter((v) => v.date < today || v.status === 'completed' || v.status === 'declined'),
    [visits, today],
  )

  useEffect(() => {
    if (tab !== 'shortlist' && tab !== 'overview') return undefined
    let alive = true
    ;(async () => {
      setLoadingShortlist(true)
      const items = await Promise.all(
        shortlistIds.slice(0, 6).map(async (id) => {
          try {
            return await getListingById(id)
          } catch {
            return null
          }
        }),
      )
      if (!alive) return
      setShortlistItems(items.filter(Boolean))
      setLoadingShortlist(false)
    })()
    return () => {
      alive = false
    }
  }, [shortlistIds, tab])

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <EmptyState
          title="Sign in to view your dashboard"
          description="Track enquiries, site visits, shortlist and saved searches in one place."
          actionLabel="Login"
          onAction={() => openLogin('dashboard')}
        />
      </div>
    )
  }

  const stats = [
    { label: 'Enquiries', value: enquiries.length, icon: MessageSquare, to: null, tabId: 'enquiries' },
    { label: 'Upcoming visits', value: upcomingVisits.length, icon: CalendarDays, tabId: 'visits' },
    { label: 'Shortlist', value: shortlistIds.length, icon: Heart, tabId: 'shortlist' },
    { label: 'Saved searches', value: savedSearches.length, icon: Bookmark, tabId: 'searches' },
  ]

  return (
    <div className="w-full px-2 py-8 sm:px-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Hello, {user.name.split(' ')[0]}</h1>
          <p className="text-sm text-ink-muted capitalize">Buyer dashboard · {user.role}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/search')}>
          Continue browsing
        </Button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setTab(s.tabId)}
            className="rounded-2xl border border-border bg-white p-4 text-left shadow-soft transition hover:border-ink/30"
          >
            <div className="flex items-center justify-between">
              <s.icon className="h-5 w-5 text-amber" />
              <span className="text-2xl font-extrabold text-ink">{s.value}</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-ink-muted">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="mt-6">
        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'enquiries', label: 'Enquiries' },
            { id: 'visits', label: 'Site visits' },
            { id: 'shortlist', label: 'Shortlist' },
            { id: 'searches', label: 'Saved searches' },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      <div className="mt-6 space-y-6">
        {tab === 'overview' && (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Recent enquiries</h2>
                  <button type="button" className="text-xs font-bold text-ink" onClick={() => setTab('enquiries')}>
                    View all
                  </button>
                </div>
                {enquiries.length === 0 ? (
                  <p className="text-sm text-ink-muted">No enquiries yet. Contact a seller from a listing page.</p>
                ) : (
                  <ul className="space-y-3">
                    {enquiries.slice(0, 3).map((e) => (
                      <li key={e.id} className="rounded-xl bg-mist/80 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <Link to={`/property/${e.listingId}`} className="font-semibold hover:underline">
                            {e.listingTitle}
                          </Link>
                          <Badge tone="mist">{e.status}</Badge>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{e.message}</p>
                        <div className="mt-1 text-[11px] text-ink-muted">{relativeTime(e.createdAt)}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">Upcoming visits</h2>
                  <button type="button" className="text-xs font-bold text-ink" onClick={() => setTab('visits')}>
                    View all
                  </button>
                </div>
                {upcomingVisits.length === 0 ? (
                  <p className="text-sm text-ink-muted">No upcoming site visits scheduled.</p>
                ) : (
                  <ul className="space-y-3">
                    {upcomingVisits.slice(0, 3).map((v) => (
                      <li key={v.id} className="flex items-start gap-3 rounded-xl bg-mist/80 p-3">
                        <Clock className="mt-0.5 h-4 w-4 text-amber" />
                        <div>
                          <Link to={`/property/${v.listingId}`} className="font-semibold hover:underline">
                            {v.listingTitle}
                          </Link>
                          <div className="text-xs text-ink-muted">
                            {new Date(v.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                            })}{' '}
                            · {v.slot}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold">Shortlisted homes</h2>
                <Link to="/shortlist" className="inline-flex items-center gap-1 text-xs font-bold text-ink">
                  Open shortlist <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loadingShortlist &&
                  Array.from({ length: 3 }).map((_, i) => <ListingCardSkeleton key={i} />)}
                {!loadingShortlist &&
                  shortlistItems.map((item) => <ListingCard key={item.id} listing={item} />)}
                {!loadingShortlist && shortlistItems.length === 0 && (
                  <p className="text-sm text-ink-muted">Heart listings to see them here.</p>
                )}
              </div>
            </div>
          </>
        )}

        {tab === 'enquiries' && (
          <Card className="overflow-hidden p-0">
            {enquiries.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  title="No enquiries sent"
                  description="Use Contact Owner/Agent on a property page."
                  actionLabel="Browse homes"
                  onAction={() => navigate('/search')}
                />
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-mist text-left text-xs uppercase text-ink-muted">
                  <tr>
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Seller</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Sent</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((e) => (
                    <tr key={e.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <Link to={`/property/${e.listingId}`} className="font-semibold hover:underline">
                          {e.listingTitle}
                        </Link>
                        <p className="mt-0.5 line-clamp-1 text-xs text-ink-muted">{e.message}</p>
                      </td>
                      <td className="px-4 py-3">{e.sellerName}</td>
                      <td className="px-4 py-3">
                        <Badge tone="mist">{e.status}</Badge>
                      </td>
                      <td className="px-4 py-3 text-ink-muted">{relativeTime(e.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        )}

        {tab === 'visits' && (
          <div className="space-y-6">
            <section>
              <h2 className="mb-3 font-display text-lg font-semibold">Upcoming</h2>
              {upcomingVisits.length === 0 ? (
                <p className="text-sm text-ink-muted">No upcoming visits.</p>
              ) : (
                <div className="grid gap-3">
                  {upcomingVisits.map((v) => (
                    <Card key={v.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                      <div>
                        <Link to={`/property/${v.listingId}`} className="font-bold hover:underline">
                          {v.listingTitle}
                        </Link>
                        <div className="text-sm text-ink-muted">
                          {v.localityName} · {new Date(v.date).toLocaleDateString('en-IN')} · {v.slot}
                        </div>
                        <Badge tone="amber" className="mt-2">
                          {v.status}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateVisit(v.id, { status: 'completed' })}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Mark done
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </section>
            <section>
              <h2 className="mb-3 font-display text-lg font-semibold">Past</h2>
              {pastVisits.length === 0 ? (
                <p className="text-sm text-ink-muted">No past visits yet.</p>
              ) : (
                <ul className="space-y-2">
                  {pastVisits.map((v) => (
                    <li
                      key={v.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm"
                    >
                      <span className="font-semibold">{v.listingTitle}</span>
                      <span className="text-ink-muted">
                        {v.date} · {v.slot} · {v.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        {tab === 'shortlist' && (
          <div>
            <div className="mb-4 flex justify-end">
              <Link to="/shortlist" className="text-sm font-bold text-ink hover:underline">
                Full shortlist & compare →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loadingShortlist &&
                Array.from({ length: 3 }).map((_, i) => <ListingCardSkeleton key={i} />)}
              {!loadingShortlist &&
                shortlistItems.map((item) => <ListingCard key={item.id} listing={item} />)}
              {!loadingShortlist && shortlistItems.length === 0 && (
                <EmptyState
                  title="Shortlist is empty"
                  actionLabel="Browse"
                  onAction={() => navigate('/search')}
                />
              )}
            </div>
          </div>
        )}

        {tab === 'searches' && (
          <div className="space-y-3">
            {savedSearches.length === 0 ? (
              <EmptyState
                title="No saved searches"
                description="Save a search from the results page to get alerts."
                actionLabel="Search homes"
                onAction={() => navigate('/search')}
              />
            ) : (
              savedSearches.map((s) => (
                <Card key={s.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <div className="font-bold">{s.label}</div>
                    <div className="text-xs text-ink-muted">
                      {s.frequency} alerts · saved {relativeTime(s.createdAt)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary">
                      <Link to={`/search?${s.queryString || ''}`}>Run</Link>
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Link to="/saved-searches">Manage</Link>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <Card className="mt-8 flex flex-wrap items-center justify-between gap-3 bg-linear-to-r from-ink to-ink-soft p-5 text-white">
        <div>
          <div className="font-display text-lg font-semibold">Plan your budget</div>
          <div className="text-sm text-white/70">
            Typical shortlist prices start around {formatINR(shortlistItems[0]?.price || 8000000)}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to="/tools/emi"
            className="inline-flex h-10 items-center rounded-xl bg-amber px-4 text-sm font-bold text-ink"
          >
            EMI calculator
          </Link>
          <Link
            to="/tools/loan-eligibility"
            className="inline-flex h-10 items-center rounded-xl border border-white/30 px-4 text-sm font-bold text-white"
          >
            Loan eligibility
          </Link>
        </div>
      </Card>
    </div>
  )
}
