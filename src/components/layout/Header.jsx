import { useEffect, useRef, useState } from 'react'
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
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, openLogin, logout } = useAuthStore()
  const shortlistCount = useShortlistStore((s) => s.ids.length)
  const { items, markAllRead, markRead, unreadCount } = useNotificationStore()
  const unread = unreadCount()
  const menuRef = useRef(null)

  const dashboardPath =
    user?.role === 'buyer'
      ? '/dashboard'
      : user?.role === 'builder'
        ? '/seller'
        : user?.role === 'owner' || user?.role === 'agent'
          ? '/seller'
          : '/dashboard'

  useEffect(() => {
    const onDoc = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setBellOpen(false)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('touchstart', onDoc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('touchstart', onDoc)
    }
  }, [])

  const closeMenus = () => {
    setOpen(false)
    setBellOpen(false)
    setUserMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
      <div className="flex h-14 w-full items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="shrink-0 rounded-lg p-2 text-ink lg:hidden"
            onClick={() => {
              setOpen((v) => !v)
              setBellOpen(false)
              setUserMenuOpen(false)
            }}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Logo />
        </div>

        <nav className="hidden items-center gap-5 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
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

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-2" ref={menuRef}>
          <Button
            variant="ghost"
            size="icon"
            className="sm:inline-flex"
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
                setUserMenuOpen(false)
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
              <div className="absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border border-border bg-white p-3 shadow-lift">
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
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                className="gap-2"
                onClick={() => {
                  setUserMenuOpen((v) => !v)
                  setBellOpen(false)
                }}
              >
                <User className="h-4 w-4" />
                <span className="hidden max-w-28 truncate sm:inline">{user.name}</span>
              </Button>
              {userMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-border bg-white p-2 shadow-lift">
                  <div className="px-3 py-2 text-xs text-ink-muted capitalize">{user.role}</div>
                  <Link
                    to={dashboardPath}
                    onClick={closeMenus}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold hover:bg-mist"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link
                    to="/saved-searches"
                    onClick={closeMenus}
                    className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-mist"
                  >
                    Saved searches
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      closeMenus()
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-danger hover:bg-mist"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button size="sm" onClick={() => openLogin()}>
              Login
            </Button>
          )}
        </div>
      </div>

      {open && (
        <div className="max-h-[70vh] overflow-y-auto border-t border-border bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {[
              ['/', 'Home'],
              ['/search?type=buy', 'Buy'],
              ['/search?type=rent', 'Rent'],
              ['/search?type=projects', 'New Projects'],
              ['/tools/emi', 'EMI Tools'],
              ['/tools/loan-eligibility', 'Loan eligibility'],
              ['/post-property', 'Post Property'],
              ['/shortlist', 'Shortlist'],
              [user ? dashboardPath : null, 'Dashboard'],
              ['/saved-searches', 'Saved searches'],
              ['/seller', 'Seller dashboard'],
            ]
              .filter(([to]) => to)
              .map(([to, label]) => (
                <Link
                  key={to + label}
                  to={to}
                  onClick={closeMenus}
                  className="rounded-lg px-2 py-2.5 text-sm font-semibold active:bg-mist"
                >
                  {label}
                </Link>
              ))}
            <p className="px-2 pt-2 text-xs text-ink-muted">{BRAND.tagline}</p>
          </div>
        </div>
      )}
    </header>
  )
}
