import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListChecks,
  MessagesSquare,
  CalendarDays,
  Plus,
} from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import SellerOverview, { SellerListingsTable } from '../components/seller/SellerOverview'
import SellerLeads from '../components/seller/SellerLeads'
import SellerVisitsCalendar from '../components/seller/SellerVisitsCalendar'
import { PromoteModal, VerifyModal } from '../components/seller/PromoteVerifyModals'
import { useAuthStore } from '../store'
import { getSellerListings } from '../services/api'
import { cn } from '../utils/format'

const NAV = [
  { to: '/seller', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/seller/listings', label: 'Listings', icon: ListChecks },
  { to: '/seller/leads', label: 'Leads', icon: MessagesSquare },
  { to: '/seller/visits', label: 'Site visits', icon: CalendarDays },
]

export default function SellerDashboardPage() {
  const navigate = useNavigate()
  const { user, openLogin } = useAuthStore()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [promoteTarget, setPromoteTarget] = useState(null)
  const [verifyTarget, setVerifyTarget] = useState(null)

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const items = await getSellerListings(user.id, user.role)
    setListings(items)
    setLoading(false)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <EmptyState
          title="Seller login required"
          description="Sign in as Owner, Agent or Builder (OTP 123456) to manage listings and leads."
          actionLabel="Login"
          onAction={() => openLogin('seller')}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Seller dashboard</h1>
          <p className="text-sm capitalize text-ink-muted">
            {user.name} · {user.role}
          </p>
        </div>
        <Button onClick={() => navigate('/post-property')}>
          <Plus className="h-4 w-4" /> Post property
        </Button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold whitespace-nowrap',
                isActive ? 'border-ink bg-ink text-white' : 'border-border bg-white text-ink hover:border-ink/30',
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="rounded-2xl border border-border bg-white p-10 text-center text-sm text-ink-muted">
            Loading seller data…
          </div>
        ) : (
          <Routes>
            <Route index element={<SellerOverview listings={listings} />} />
            <Route
              path="listings"
              element={
                <SellerListingsTable
                  listings={listings}
                  onRefresh={refresh}
                  onPromote={setPromoteTarget}
                  onVerify={setVerifyTarget}
                />
              }
            />
            <Route path="leads" element={<SellerLeads />} />
            <Route path="visits" element={<SellerVisitsCalendar />} />
          </Routes>
        )}
      </div>

      <p className="mt-8 text-center text-xs text-ink-muted">
        Prefer the buyer view?{' '}
        <Link to="/dashboard" className="font-bold text-ink">
          Open buyer dashboard
        </Link>
      </p>

      <PromoteModal
        open={Boolean(promoteTarget)}
        listing={promoteTarget}
        onClose={() => setPromoteTarget(null)}
        onDone={refresh}
      />
      <VerifyModal
        open={Boolean(verifyTarget)}
        listing={verifyTarget}
        onClose={() => setVerifyTarget(null)}
        onDone={refresh}
      />
    </div>
  )
}
