import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  Heart,
  Menu,
  Plus,
  Search,
  User,
  X,
  LayoutDashboard,
} from 'lucide-react'
import Logo from '../brand/Logo'
import Button from '../ui/Button'
import { useAuthStore, useNotificationStore, useShortlistStore } from '../../store'
import { BRAND } from '../../utils/constants'
import { cn } from '../../utils/format'

const navLinkClass = ({ isActive }) =>
  cn('text-sm font-semibold transition hover:text-ink', isActive ? 'text-ink' : 'text-ink-muted')

export default function Header() {
  const [open, setOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const navigate = useNavigate()
  const { user, openLogin, logout } = useAuthStore()
  const shortlistCount = useShortlistStore((s) => s.ids.length)
  const { items, markAllRead, markRead, unreadCount } = useNotificationStore()
  const unread = unreadCount()

  const dashboardPath =
    user?.role === 'buyer'
      ? '/dashboard'
      : user?.role === 'builder'
        ? '/seller'
        : user?.role === 'owner' || user?.role === 'agent'
          ? '/seller'
          : '/dashboard'

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-lg p-2 text-ink lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Logo />
        </div>

        <nav className="hidden items-center gap-5 lg:flex">
          <NavLink to="/search?type=buy" className={navLinkClass}>
            Buy
          </NavLink>
          <NavLink to="/search?type=rent" className={navLinkClass}>
            Rent
          </NavLink>
          <NavLink to="/search?type=projects" className={navLinkClass}>
            New Projects
          </NavLink>
          <NavLink to="/tools/emi" className={navLinkClass}>
            EMI Tools
          </NavLink>
          <NavLink to="/post-property" className={navLinkClass}>
            Post Property
          </NavLink>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex"
            onClick={() => navigate('/search')}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setBellOpen((v) => !v)
                markAllRead()
              }}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber" />
              )}
            </Button>
            {bellOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-white p-3 shadow-lift">
                <div className="mb-2 text-sm font-bold">Alerts</div>
                <div className="max-h-72 space-y-2 overflow-y-auto">
                  {items.length === 0 && (
                    <p className="py-6 text-center text-sm text-ink-muted">No notifications</p>
                  )}
                  {items.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markRead(n.id)}
                      className="w-full rounded-xl bg-mist/70 p-3 text-left hover:bg-mist"
                    >
                      <div className="text-sm font-semibold text-ink">{n.title}</div>
                      <div className="mt-0.5 text-xs text-ink-muted">{n.body}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={() => navigate('/shortlist')} aria-label="Shortlist">
            <div className="relative">
              <Heart className="h-5 w-5" />
              {shortlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] text-white">
                  {shortlistCount}
                </span>
              )}
            </div>
          </Button>

          <Button
            variant="amber"
            size="sm"
            className="hidden md:inline-flex"
            onClick={() => navigate('/post-property')}
          >
            <Plus className="h-4 w-4" /> Post
          </Button>

          {user ? (
            <div className="relative group">
              <Button variant="secondary" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline max-w-[7rem] truncate">{user.name}</span>
              </Button>
              <div className="invisible absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-white p-2 opacity-0 shadow-lift transition group-hover:visible group-hover:opacity-100">
                <div className="px-3 py-2 text-xs text-ink-muted capitalize">{user.role}</div>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-mist"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
                <Link
                  to="/saved-searches"
                  className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-mist"
                >
                  Saved searches
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-danger hover:bg-mist"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Button size="sm" onClick={() => openLogin()}>
              Login
            </Button>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-2">
            <Link to="/search?type=buy" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm font-semibold">
              Buy
            </Link>
            <Link to="/search?type=rent" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm font-semibold">
              Rent
            </Link>
            <Link to="/search?type=projects" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm font-semibold">
              New Projects
            </Link>
            <Link to="/tools/emi" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm font-semibold">
              EMI Tools
            </Link>
            <Link to="/post-property" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2 text-sm font-semibold">
              Post Property
            </Link>
            <p className="px-2 pt-2 text-xs text-ink-muted">{BRAND.tagline}</p>
          </div>
        </div>
      )}
    </header>
  )
}
