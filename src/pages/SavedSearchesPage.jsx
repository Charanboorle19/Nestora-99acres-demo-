import { Link, useNavigate } from 'react-router-dom'
import { Bell, Bookmark, Trash2 } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { useAuthStore, useNotificationStore, useSavedSearchStore } from '../store'
import { useToast } from '../components/ui/Toast'
import { relativeTime } from '../utils/format'
import { CITIES } from '../utils/constants'

const FREQUENCIES = [
  { id: 'instant', label: 'Instant' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
]

export default function SavedSearchesPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, openLogin } = useAuthStore()
  const { searches, update, remove } = useSavedSearchStore()
  const addNotification = useNotificationStore((s) => s.add)

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <EmptyState
          icon={Bookmark}
          title="Sign in to manage saved searches"
          description="Save searches from the results page, then set alert frequency here."
          actionLabel="Login"
          onAction={() => openLogin('saved-searches')}
        />
      </div>
    )
  }

  const simulateAlert = (search) => {
    addNotification({
      title: `New matches · ${search.label}`,
      body: `Simulated ${search.frequency} alert: 2 new homes match your saved search.`,
    })
    toast.success('Demo alert sent to the notification bell')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Saved searches</h1>
          <p className="text-sm text-ink-muted">
            Alerts are simulated in-app via the notification bell.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/search')}>
          New search
        </Button>
      </div>

      {searches.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Bookmark}
            title="No saved searches"
            description="On any search results page, tap Save search to get alerts."
            actionLabel="Go to search"
            onAction={() => navigate('/search')}
          />
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {searches.map((s) => {
            const city = CITIES.find((c) => c.id === s.filters?.cityId)?.name
            return (
              <Card key={s.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-ink">{s.label}</div>
                    <div className="mt-1 text-xs text-ink-muted">
                      Saved {relativeTime(s.createdAt)}
                      {city ? ` · ${city}` : ''}
                      {s.filters?.type ? ` · ${s.filters.type}` : ''}
                    </div>
                    <div className="mt-2">
                      <Badge tone="mist">Alert: {s.frequency}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => simulateAlert(s)}>
                      <Bell className="h-4 w-4" /> Test alert
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(s.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">
                    Alert frequency
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {FREQUENCIES.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          update(s.id, { frequency: f.id })
                          toast.info(`Alerts set to ${f.label.toLowerCase()}`)
                        }}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          s.frequency === f.id
                            ? 'border-ink bg-ink text-white'
                            : 'border-border bg-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/search?${s.queryString || ''}`}
                  className="mt-4 inline-block text-sm font-bold text-ink hover:underline"
                >
                  Run this search →
                </Link>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
