import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  ArrowRight,
  Megaphone,
  Home,
  KeyRound,
  Store,
  Video,
  BarChart3,
  Building2,
  MapPin,
  Ruler,
  Banknote,
  Phone,
  MessageCircle,
  ClipboardList,
  ShieldCheck,
  Handshake,
} from 'lucide-react'
import LandingNav from '../components/landing/LandingNav'
import LandingFooter from '../components/landing/LandingFooter'
import FeaturedPropertyCard from '../components/landing/FeaturedPropertyCard'
import Modal from '../components/ui/Modal'
import Button from '../components/ui/Button'
import { getFeaturedListings } from '../services/api'
import { requirements, LANDING_AREAS, LANDING_CATEGORIES } from '../data/requirements'
import { useToast } from '../components/ui/Toast'
import TestimonialsSection from '../components/landing/TestimonialsSection'
import PromoteModal from '../components/landing/PromoteModal'
import { BRAND } from '../utils/constants'
import '../components/landing/landing.css'

function buildSearchPath({ type = 'sale', area = '', category = '', query = '' } = {}) {
  const params = new URLSearchParams()
  params.set('city', 'hyderabad')
  if (type === 'lease') params.set('type', 'rent')
  else if (type === 'commercial') params.set('type', 'commercial')
  else params.set('type', 'buy')

  if (query) params.set('q', query)
  else if (area) params.set('q', area)

  if (category) {
    if (category.toLowerCase().includes('plot')) params.set('propertyType', 'Plot')
    else if (category.toLowerCase().includes('commercial') || category.toLowerCase().includes('warehouse')) {
      params.set('type', 'commercial')
    } else {
      params.set('q', [area, category].filter(Boolean).join(' '))
    }
  }

  return `/search?${params.toString()}`
}

const HERO_SEARCH_KEYWORDS = [
  { label: 'Lease properties in Hyderabad', type: 'lease' },
  { label: 'Properties for sale in Hyderabad', type: 'sale' },
  ...LANDING_AREAS.map((area) => ({ label: `Properties near ${area}`, area })),
]

export default function LandingPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [featured, setFeatured] = useState([])
  const [type, setType] = useState('sale')
  const [area, setArea] = useState('')
  const [category, setCategory] = useState('')
  const [query, setQuery] = useState('')
  const [keywordMenuOpen, setKeywordMenuOpen] = useState(false)
  const [highlightedKeyword, setHighlightedKeyword] = useState(0)
  const [requirementLead, setRequirementLead] = useState(null)
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [promoteOpen, setPromoteOpen] = useState(false)
  const [promotePackage, setPromotePackage] = useState('Not sure, advise me')

  const comingSoon = () => toast.info('Demo prototype: coming soon')

  const openRequirementLead = (requirement) => {
    setRequirementLead(requirement)
    setLeadName('')
    setLeadPhone('')
  }

  const closeRequirementLead = () => setRequirementLead(null)

  const openPromote = useCallback((packageInterest = 'Not sure, advise me') => {
    setPromotePackage(packageInterest)
    setPromoteOpen(true)
  }, [])
  const closePromote = useCallback(() => setPromoteOpen(false), [])

  const submitRequirementLead = (e) => {
    e.preventDefault()
    if (!leadName.trim() || leadPhone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter your name and a valid mobile number')
      return
    }
    toast.success(`Thanks ${leadName.trim()}, our team will contact you shortly.`)
    closeRequirementLead()
  }

  useEffect(() => {
    let alive = true
    getFeaturedListings(6).then((rows) => {
      if (alive) setFeatured(rows)
    })
    return () => {
      alive = false
    }
  }, [])

  const runSearch = (e) => {
    e?.preventDefault()
    navigate(buildSearchPath({ type, area, category, query: query.trim() }))
  }

  const matchingKeywords = query.trim()
    ? HERO_SEARCH_KEYWORDS.filter((keyword) => keyword.label.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : []

  const selectKeyword = (keyword) => {
    setQuery(keyword.label)
    if (keyword.type) setType(keyword.type)
    if (keyword.area) setArea(keyword.area)
    setKeywordMenuOpen(false)
    setHighlightedKeyword(0)
  }

  const handleKeywordKeyDown = (e) => {
    if (!keywordMenuOpen || matchingKeywords.length === 0) {
      if (e.key === 'ArrowDown' && query.trim()) setKeywordMenuOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedKeyword((current) => (current + 1) % matchingKeywords.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedKeyword((current) => (current - 1 + matchingKeywords.length) % matchingKeywords.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      selectKeyword(matchingKeywords[highlightedKeyword])
    } else if (e.key === 'Escape') {
      setKeywordMenuOpen(false)
    }
  }

  return (
    <div className="hrp-landing">
      <LandingNav onPromote={openPromote} />

      {/* Hero */}
      <section className="hrp-screen-section hrp-hero-section relative overflow-hidden text-white" style={{ background: 'var(--hrp-ink)' }}>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(ellipse 70% 60% at 80% 20%, rgba(245,180,0,0.35), transparent), linear-gradient(135deg, #0B1F3A 0%, #16325A 55%, #0B1F3A 100%)',
          }}
        />
        <div className="hrp-hero-content">
          <div className="hrp-hero-main">
            <div className="hrp-hero-copy">
              <p className="hrp-hero-kicker">Hyderabad · Commercial &amp; income property</p>
              <h1 className="hrp-display hrp-hero-title">
                Real property.<br />
                <span>Real decisions.</span>
              </h1>
              <p className="hrp-hero-description">
                PG hostels, plots, banquet halls and commercial buildings — matched with serious buyers, tenants and operators.
              </p>
              <div className="hrp-hero-actions">
                <button type="button" className="hrp-btn hrp-btn-amber h-12 px-5 text-base" onClick={() => navigate('/search')}>
                  Browse Properties <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="hrp-btn hrp-btn-ghost-light h-12 px-5 text-base"
                  onClick={() => navigate('/post-property')}
                >
                  List Your Property
                </button>
              </div>
            </div>

            <div className="hrp-hero-visual" aria-label="High Rise Properties market highlights">
              <div className="hrp-hero-visual-grid" />
              <div className="hrp-hero-building hrp-hero-building-back" />
              <div className="hrp-hero-building hrp-hero-building-front">
                <span /><span /><span /><span /><span /><span />
              </div>
              <div className="hrp-hero-stat hrp-hero-stat-top">
                <strong>44,600+</strong>
                <span>vetted buyers</span>
              </div>
              <div className="hrp-hero-stat hrp-hero-stat-bottom">
                <span className="hrp-hero-stat-dot" />
                <div><strong>Hyderabad</strong><span>active market</span></div>
              </div>
            </div>
          </div>

          {/* Property finder */}
          <form
            onSubmit={runSearch}
            className="hrp-hero-search rounded-2xl bg-white text-left hrp-shadow-lift"
            style={{ color: 'var(--hrp-ink)' }}
          >
            <div className="hrp-search-heading">
              <div>
                <span className="hrp-search-eyebrow">Start your property search</span>
                <strong>Find a place that works for you</strong>
              </div>
              <span className="hrp-search-location"><MapPin className="h-3.5 w-3.5" /> Hyderabad</span>
            </div>
            <div className="hrp-search-fields">
              <label className="hrp-search-field">
                <span>Search location or property</span>
                <input
                  type="search"
                  className="hrp-input"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setHighlightedKeyword(0)
                    setKeywordMenuOpen(Boolean(e.target.value.trim()))
                  }}
                  onFocus={() => setKeywordMenuOpen(Boolean(query.trim()))}
                  onBlur={() => window.setTimeout(() => setKeywordMenuOpen(false), 120)}
                  onKeyDown={handleKeywordKeyDown}
                  placeholder="e.g. lease properties near Miyapur"
                  aria-label="Search location or property"
                  aria-autocomplete="list"
                  aria-controls="hero-keyword-options"
                  aria-expanded={keywordMenuOpen && matchingKeywords.length > 0}
                />
                {keywordMenuOpen && matchingKeywords.length > 0 && (
                  <div id="hero-keyword-options" className="hrp-keyword-menu" role="listbox" aria-label="Matching property searches">
                    {matchingKeywords.map((keyword, index) => (
                      <button
                        key={keyword.label}
                        type="button"
                        className={`hrp-keyword-option${index === highlightedKeyword ? ' is-highlighted' : ''}`}
                        role="option"
                        aria-selected={index === highlightedKeyword}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectKeyword(keyword)}
                      >
                        <Search className="h-3.5 w-3.5" />
                        <span>{keyword.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </label>
              <label className="hrp-search-field">
                <span>Looking for</span>
                <select className="hrp-select" value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="sale">For Sale</option>
                  <option value="lease">For Lease</option>
                </select>
              </label>
              <label className="hrp-search-field">
                <span>Preferred area</span>
                <select className="hrp-select" value={area} onChange={(e) => setArea(e.target.value)}>
                  <option value="">All areas</option>
                  {LANDING_AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </label>
              <label className="hrp-search-field">
                <span>Property type</span>
                <select className="hrp-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">All categories</option>
                  {LANDING_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <button type="submit" className="hrp-btn hrp-btn-amber hrp-search-submit">
                <Search className="h-4 w-4" /> Search properties
              </button>
            </div>
          </form>
          <div className="hrp-hero-keywords" aria-label="Popular property searches">
            <span className="hrp-hero-keywords-label">Popular searches</span>
            <div className="hrp-hero-keywords-list">
              {HERO_SEARCH_KEYWORDS.map((keyword) => (
                <Link key={keyword.label} to={buildSearchPath(keyword)} className="hrp-hero-keyword">
                  {keyword.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What we deliver */}
      <section className="hrp-screen-section hrp-compact-section bg-[#F7F8FA] py-14 sm:py-16">
        <div className="w-full px-2 sm:px-3">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
            <div className="max-w-xl">
              <p
                className="text-[11px] font-bold uppercase tracking-[0.18em]"
                style={{ color: '#A68945' }}
              >
                End-to-end realty ecosystem
              </p>
              <h2
                className="hrp-display mt-2 text-3xl font-bold uppercase leading-tight sm:text-4xl"
                style={{ color: 'var(--hrp-ink)' }}
              >
                What we deliver across Hyderabad
              </h2>
            </div>
            <p
              className="max-w-md text-sm leading-relaxed sm:text-[15px] lg:pt-6"
              style={{ color: 'var(--hrp-ink-muted)' }}
            >
              From direct owner land transactions to commercial lease structuring and viral video broadcast, our
              model guarantees velocity and transparency.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: Home,
                title: 'Sales',
                body: 'Plots, gated layouts, multi-storey commercial buildings, and standalone properties with clean titles.',
                cta: 'See listings',
                action: () => navigate(buildSearchPath({ type: 'sale' })),
              },
              {
                icon: KeyRound,
                title: 'Leasing',
                body: 'Pre-leased commercial assets, operational PG/hostel buildings, industrial sheds, and ready warehousing.',
                cta: 'See listings',
                action: () => navigate(buildSearchPath({ type: 'lease' })),
              },
              {
                icon: Store,
                title: 'Commercial & Corporate',
                body: 'Custom corporate footprints: Q-commerce darkstores, automobile showroom pads, and retail anchors.',
                cta: 'View mandates',
                action: () => navigate('/search?type=commercial&city=hyderabad'),
              },
              {
                icon: Video,
                title: 'Property Promotion',
                body: '4K drone aerial footage, viral Instagram reels, bilingual presentation reaching 44.6K+ active investors.',
                cta: 'Shoot packages',
                action: openPromote,
              },
              {
                icon: BarChart3,
                title: 'Market Advisory',
                body: 'HMDA masterplan zoning, LRS title vetting, ORR radial corridor pricing, and high-yield asset valuation.',
                cta: 'Get advisory',
                action: comingSoon,
              },
            ].map((card) => {
              const Icon = card.icon
              return (
                <article
                  key={card.title}
                  className="flex flex-col rounded-2xl border border-[#E6EAF0] bg-white p-5 shadow-[0_8px_24px_rgba(11,31,58,0.06)]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EEFB]">
                    <Icon className="h-5 w-5" style={{ color: 'var(--hrp-ink)' }} strokeWidth={1.75} />
                  </div>
                  <h3
                    className="hrp-display mt-4 text-base font-bold uppercase leading-snug"
                    style={{ color: 'var(--hrp-ink)' }}
                  >
                    {card.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed" style={{ color: 'var(--hrp-ink-muted)' }}>
                    {card.body}
                  </p>
                  <button
                    type="button"
                    onClick={card.action}
                    className="mt-5 inline-flex items-center gap-1 self-start text-xs font-bold uppercase tracking-wide"
                    style={{ color: '#A68945' }}
                  >
                    {card.cta} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Corridor chips */}
      <section className="border-b bg-white" style={{ borderColor: 'var(--hrp-border)' }}>
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-4 sm:px-6">
          {LANDING_AREAS.map((a) => (
            <Link
              key={a}
              to={buildSearchPath({ area: a })}
              className="shrink-0 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wide transition hover:bg-[#0B1F3A] hover:text-white"
              style={{ borderColor: 'var(--hrp-border)', background: 'var(--hrp-mist)', color: 'var(--hrp-ink)' }}
            >
              {a}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="hrp-screen-section hrp-featured-section" aria-labelledby="featured-properties-title">
        <div className="hrp-featured-inner">
          <div className="hrp-featured-heading">
            <div>
              <div className="hrp-featured-kicker">Handpicked inventory</div>
              <h2 id="featured-properties-title" className="hrp-display">Featured properties</h2>
              <p>Quality listings for buyers, investors and businesses ready to move.</p>
            </div>
            <Link to="/search" className="hrp-featured-view-all">
              Explore all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="hrp-featured-rule">
            <span>{featured.length} curated listings</span>
            <span className="hrp-featured-rule-line" />
            <span>Updated regularly</span>
          </div>
          <div className="hrp-featured-grid">
            {featured.map((l) => (
              <FeaturedPropertyCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>

      {/* Active client requirements */}
      <section id="active-requirements" className="hrp-screen-section hrp-requirements" aria-labelledby="active-requirements-title">
        <div className="hrp-requirements-inner">
          <div className="hrp-requirements-heading">
            <div>
              <div className="hrp-requirements-kicker"><Megaphone className="h-3 w-3" /> Urgent mandates</div>
              <h2 id="active-requirements-title" className="hrp-display">Live active client requirements</h2>
            </div>
            <p className="hrp-requirements-note">
              Pre-approved corporate tenants and institutions seeking ready-to-lease commercial, PG or income-generating real estate.
            </p>
          </div>
          <div className="hrp-requirements-rule" />
          <div className="hrp-requirements-grid">
            {requirements.map((r) => (
              <article key={r.id} className="hrp-requirement-card">
                <div className="hrp-requirement-topline">
                  <span className="hrp-requirement-tag"><Building2 className="h-3 w-3" /> {r.company}</span>
                  <span className="hrp-requirement-type">{r.isSample ? 'Sample' : 'Verified'}</span>
                </div>
                <h3>{r.title}</h3>
                <div className="hrp-requirement-divider" />
                <div className="hrp-requirement-meta"><Ruler /> <span>{r.spec}</span></div>
                <div className="hrp-requirement-meta"><MapPin /> <span>{r.location}</span></div>
                <div className="hrp-requirement-meta"><Banknote /> <span>{r.terms}</span></div>
                <button
                  type="button"
                  className="hrp-btn hrp-btn-amber hrp-requirement-cta"
                  onClick={() => openRequirementLead(r)}
                >
                  I have this space <ArrowRight className="h-3 w-3" />
                </button>
              </article>
            ))}
          </div>
          <button type="button" onClick={comingSoon} className="hrp-requirements-footer-link">
            View all {requirements.length + 11} live requirements across Hyderabad <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </section>

      <Modal
        open={Boolean(requirementLead)}
        onClose={closeRequirementLead}
        title="Share your property details"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeRequirementLead}>Cancel</Button>
            <Button variant="amber" type="submit" form="requirement-lead-form">Submit details</Button>
          </div>
        }
      >
        <form id="requirement-lead-form" className="space-y-4" onSubmit={submitRequirementLead}>
          <div className="rounded-xl bg-mist p-3 text-sm text-ink-muted">
            Tell us about the space you have for <strong className="text-ink">{requirementLead?.title}</strong> in {requirementLead?.location}.
          </div>
          <label className="block text-sm font-semibold text-ink">
            Name
            <input
              className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm font-normal outline-none focus:border-ink"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
          </label>
          <label className="block text-sm font-semibold text-ink">
            Mobile number
            <input
              className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm font-normal outline-none focus:border-ink"
              value={leadPhone}
              onChange={(e) => setLeadPhone(e.target.value)}
              placeholder="Enter your mobile number"
              inputMode="tel"
              autoComplete="tel"
              maxLength={15}
              required
            />
          </label>
          <p className="text-xs text-ink-muted">Our property desk will call you to verify the space and match it with this requirement.</p>
        </form>
      </Modal>

      {/* How it works */}
      <section className="hrp-screen-section hrp-compact-section hrp-how-it-works" aria-labelledby="how-it-works-title">
        <div className="hrp-how-it-works-intro">
          <div className="hrp-how-it-works-title">
            <span>One clear process</span>
            <h2 id="how-it-works-title" className="hrp-display">How it works for owners &amp; buyers</h2>
            <p>From the first property detail to a serious conversation, we keep every step direct, verified and easy to follow.</p>
          </div>
          <div className="hrp-how-it-works-audience">
            <span className="hrp-how-it-works-audience-label">Built for both sides</span>
            <div><strong>Owners</strong><span>Get qualified demand</span></div>
            <div><strong>Buyers</strong><span>Find verified spaces</span></div>
          </div>
        </div>
        <div className="hrp-how-it-works-flow-label"><span>How your requirement moves</span><span className="hrp-how-it-works-flow-line" /></div>
        <div className="hrp-how-it-works-grid">
          <article className="hrp-how-it-works-step">
            <div className="hrp-how-it-works-step-topline">
              <span className="hrp-how-it-works-number">01</span>
              <ClipboardList className="hrp-how-it-works-icon" />
            </div>
            <h3>Share details or mandate</h3>
            <p>
              Send your property location, photos, survey number, or lease requirement directly via WhatsApp to +91 62817 36957 or our portal form.
            </p>
            <span className="hrp-how-it-works-step-note">Owner or buyer starts here</span>
          </article>
          <article className="hrp-how-it-works-step">
            <div className="hrp-how-it-works-step-topline">
              <span className="hrp-how-it-works-number">02</span>
              <ShieldCheck className="hrp-how-it-works-icon" />
            </div>
            <h3>On-site verification</h3>
            <p>
              Our field team inspects the asset in person, verifies road width, setback approvals, masterplan alignment, and validates fair corridor valuation.
            </p>
            <span className="hrp-how-it-works-step-note">Facts before follow-ups</span>
          </article>
          <article className="hrp-how-it-works-step">
            <div className="hrp-how-it-works-step-topline">
              <span className="hrp-how-it-works-number">03</span>
              <Handshake className="hrp-how-it-works-icon" />
            </div>
            <h3>Pre-qualified closure</h3>
            <p>
              We connect you directly to screened buyers or corporate tenants ready with immediate capital. Zero spam calls, zero fake promises.
            </p>
            <span className="hrp-how-it-works-step-note">A focused conversation</span>
          </article>
        </div>
      </section>

      <TestimonialsSection />

      {/* Owner listing CTA */}
      <section
        className="hrp-screen-section hrp-compact-section border-y"
        style={{ background: '#ffbd17', borderColor: '#e4a600' }}
        aria-labelledby="owner-listing-title"
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-6 text-center sm:px-6 sm:py-7">
          <span
            className="rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em]"
            style={{ background: 'var(--hrp-ink)', color: '#ffbd17' }}
          >
            Direct owner listings welcome
          </span>
          <h2
            id="owner-listing-title"
            className="hrp-display mt-4 max-w-3xl text-2xl font-bold uppercase leading-tight sm:text-3xl"
            style={{ color: '#050505' }}
          >
            Have a property to sell or lease in Hyderabad? List it with us today.
          </h2>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed sm:text-base" style={{ color: '#161616' }}>
            Broadcast your commercial building, PG hostel, or HMDA plot directly to 44,600+ vetted buyers and corporate decision-makers.
          </p>
          <div className="mt-4 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`tel:${BRAND.phoneTel}`}
              className="hrp-btn hrp-btn-ink h-11 w-full max-w-50.5 rounded-full px-4 text-xs font-extrabold uppercase tracking-wide shadow-lg sm:w-auto"
            >
              <Phone className="h-4 w-4" />
              Call desk: {BRAND.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent('Hi, I want to share my property details for listing.')}`}
              target="_blank"
              rel="noreferrer"
              className="hrp-btn h-11 w-full max-w-62 rounded-full bg-white px-4 text-xs font-extrabold uppercase tracking-wide text-(--hrp-ink) shadow-lg transition hover:bg-slate-50 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              WhatsApp property details
            </a>
          </div>
        </div>
      </section>

      <LandingFooter onPromote={openPromote} />
      <PromoteModal open={promoteOpen} onClose={closePromote} initialPackage={promotePackage} />
    </div>
  )
}
