import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GripVertical, ImagePlus, Trash2, CheckCircle2 } from 'lucide-react'
import Stepper from '../ui/Stepper'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import MapPinPicker from './MapPinPicker'
import {
  AMENITIES,
  BHK_OPTIONS,
  CITIES,
  FURNISHING_OPTIONS,
  LISTING_PLANS,
  POSSESSION_OPTIONS,
  PROPERTY_TYPES,
} from '../../utils/constants'
import { useAuthStore, useDraftStore, useNotificationStore, useToastStore } from '../../store'
import { createListing } from '../../services/api'
import { getLocalities } from '../../services/api'
import { formatINR, cn } from '../../utils/format'

const STEPS = [
  { id: 'basic', label: 'Basic' },
  { id: 'location', label: 'Location' },
  { id: 'details', label: 'Details' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'media', label: 'Photos' },
  { id: 'plan', label: 'Plan' },
]

const EMPTY = {
  title: '',
  listingType: 'sale',
  propertyType: 'Apartment',
  bhk: '2 BHK',
  cityId: 'hyderabad',
  localityId: '',
  localityName: '',
  address: '',
  lat: null,
  lng: null,
  area: 1200,
  carpetArea: 980,
  furnishing: 'Semi-furnished',
  possession: 'Ready to move',
  facing: 'East',
  floor: '5 of 12',
  bathrooms: 2,
  parking: 1,
  price: 8500000,
  description: '',
  amenities: ['Lift', 'Parking', 'Security', 'Power Backup'],
  photos: [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  ],
  videoTourUrl: '',
  planId: 'gold',
}

export default function PostPropertyWizard() {
  const navigate = useNavigate()
  const { user, openLogin } = useAuthStore()
  const { draft, saveDraft, clearDraft } = useDraftStore()
  const addNotification = useNotificationStore((s) => s.add)
  const toast = useToastStore((s) => s.push)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(draft || EMPTY)
  const [localities, setLocalities] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const plan = LISTING_PLANS.find((p) => p.id === form.planId) || LISTING_PLANS[0]

  useEffect(() => {
    getLocalities(form.cityId).then(setLocalities)
  }, [form.cityId])

  useEffect(() => {
    const t = setTimeout(() => saveDraft(form), 600)
    return () => clearTimeout(t)
  }, [form, saveDraft])

  const patch = (partial) => setForm((f) => ({ ...f, ...partial }))

  const validate = (idx = step) => {
    const e = {}
    if (idx === 0) {
      if (!form.title.trim()) e.title = 'Title is required'
      if (!form.listingType) e.listingType = 'Required'
    }
    if (idx === 1) {
      if (!form.localityId) e.localityId = 'Select a locality'
      if (!form.address.trim()) e.address = 'Address is required'
      if (form.lat == null) e.lat = 'Drop a map pin'
    }
    if (idx === 2) {
      if (!form.area || form.area < 100) e.area = 'Enter a valid area'
    }
    if (idx === 3) {
      if (!form.price || form.price < 1000) e.price = 'Enter a valid price'
      if (!form.description.trim() || form.description.length < 20) e.description = 'Add a short description'
    }
    if (idx === 5) {
      if (!form.photos.length) e.photos = 'Add at least one photo'
      if (form.photos.length > plan.photoLimit) e.photos = `Plan allows ${plan.photoLimit} photos`
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate()) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const back = () => setStep((s) => Math.max(s - 1, 0))

  const onFiles = (files) => {
    const urls = [...files].map((f) => URL.createObjectURL(f))
    const nextPhotos = [...form.photos, ...urls].slice(0, plan.photoLimit)
    patch({ photos: nextPhotos })
  }

  const movePhoto = (from, to) => {
    if (to < 0 || to >= form.photos.length) return
    const photos = [...form.photos]
    const [item] = photos.splice(from, 1)
    photos.splice(to, 0, item)
    patch({ photos })
  }

  const publish = async () => {
    if (!user) {
      openLogin('post-property')
      return
    }
    if (!validate(5) || !validate(1) || !validate(0)) {
      toast({ type: 'error', title: 'Incomplete', message: 'Please fix validation errors' })
      return
    }
    setCheckoutOpen(true)
  }

  const confirmCheckout = async () => {
    setSubmitting(true)
    const locality = localities.find((l) => l.id === form.localityId)
    const role = user.role === 'buyer' ? 'owner' : user.role
    try {
      const created = await createListing({
        title: form.title,
        slug: form.title.toLowerCase().replace(/\s+/g, '-'),
        description: form.description,
        propertyType: form.propertyType,
        propertyCategory: ['Office', 'Shop', 'Warehouse'].includes(form.propertyType)
          ? 'commercial'
          : 'residential',
        listingType: form.listingType,
        bhk: form.propertyType === 'Plot' ? null : form.bhk,
        price: Number(form.price),
        area: Number(form.area),
        carpetArea: Number(form.carpetArea) || Math.round(form.area * 0.8),
        furnishing: form.furnishing,
        possession: form.possession,
        cityId: form.cityId,
        localityId: form.localityId,
        localityName: locality?.name || form.localityName,
        address: form.address,
        lat: form.lat,
        lng: form.lng,
        amenities: form.amenities,
        photos: form.photos,
        floorPlan: form.photos[0],
        videoTourUrl: form.videoTourUrl || null,
        facing: form.facing,
        floor: form.floor,
        bathrooms: Number(form.bathrooms) || 1,
        balconies: 1,
        parking: Number(form.parking) || 1,
        ageYears: 0,
        reraId: `NESTORA-DEMO-${Date.now().toString().slice(-6)}`,
        verified: false,
        featured: plan.featuredSlots > 0,
        featuredUntil: plan.featuredSlots > 0 ? new Date(Date.now() + 14 * 86400000).toISOString() : null,
        status: 'pending',
        views: 0,
        shortlists: 0,
        enquiries: 0,
        postedBy: {
          type: role,
          id: user.id,
          name: user.name,
          phone: user.phone,
        },
        planId: form.planId,
        localityInsights: {
          rating: 4.2,
          pros: ['Good connectivity', 'Growing demand'],
          cons: ['Peak-hour traffic'],
          priceTrend: Array.from({ length: 12 }, (_, m) => ({
            month: `M${m + 1}`,
            price: 6000 + m * 40,
          })),
        },
        nearby: [
          { type: 'school', name: 'Nearby School', lat: form.lat + 0.01, lng: form.lng + 0.01, distanceKm: 1.1 },
          { type: 'hospital', name: 'City Hospital', lat: form.lat - 0.01, lng: form.lng + 0.008, distanceKm: 1.8 },
          { type: 'metro', name: 'Transit Hub', lat: form.lat + 0.006, lng: form.lng - 0.01, distanceKm: 0.9 },
          { type: 'mall', name: 'Local Mall', lat: form.lat - 0.008, lng: form.lng - 0.006, distanceKm: 2.2 },
        ],
      })
      clearDraft()
      addNotification({
        title: 'Listing submitted',
        body: `${created.title} is pending verification on the ${plan.name} plan.`,
      })
      toast({ type: 'success', title: 'Published', message: 'Listing submitted for verification' })
      setDone(created)
      setCheckoutOpen(false)
    } catch {
      toast({ type: 'error', title: 'Failed', message: 'Could not create listing' })
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <Card className="mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-semibold">Listing submitted</h2>
        <p className="mt-2 text-sm text-ink-muted">
          <strong>{done.title}</strong> is pending verification. Manage it from your seller dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={() => navigate(`/property/${done.id}`)}>View listing</Button>
          <Button variant="secondary" onClick={() => navigate('/seller/listings')}>
            Seller dashboard
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Stepper steps={STEPS} current={step} />

      <Card className="p-5 sm:p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Basic details</h2>
            <label className="block text-sm font-semibold">
              Listing title
              <input
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
                value={form.title}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder="e.g. Spacious 2 BHK in Gachibowli"
              />
              {errors.title && <span className="text-xs text-danger">{errors.title}</span>}
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                Looking to
                <select
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                  value={form.listingType}
                  onChange={(e) => patch({ listingType: e.target.value })}
                >
                  <option value="sale">Sell</option>
                  <option value="rent">Rent / Lease</option>
                  <option value="pg">PG / Co-living</option>
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Property type
                <select
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                  value={form.propertyType}
                  onChange={(e) => patch({ propertyType: e.target.value })}
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Location</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                City
                <select
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                  value={form.cityId}
                  onChange={(e) => {
                    const c = cityCenterSafe(e.target.value)
                    patch({ cityId: e.target.value, localityId: '', lat: c.lat, lng: c.lng })
                  }}
                >
                  {CITIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Locality
                <select
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                  value={form.localityId}
                  onChange={(e) => {
                    const loc = localities.find((l) => l.id === e.target.value)
                    patch({
                      localityId: e.target.value,
                      localityName: loc?.name || '',
                      lat: loc?.lat ?? form.lat,
                      lng: loc?.lng ?? form.lng,
                    })
                  }}
                >
                  <option value="">Select locality</option>
                  {localities.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                {errors.localityId && <span className="text-xs text-danger">{errors.localityId}</span>}
              </label>
            </div>
            <label className="block text-sm font-semibold">
              Address
              <input
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
                value={form.address}
                onChange={(e) => patch({ address: e.target.value })}
              />
              {errors.address && <span className="text-xs text-danger">{errors.address}</span>}
            </label>
            <MapPinPicker
              cityId={form.cityId}
              value={form.lat != null ? { lat: form.lat, lng: form.lng } : null}
              onChange={({ lat, lng }) => patch({ lat, lng })}
            />
            {errors.lat && <span className="text-xs text-danger">{errors.lat}</span>}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Property details</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-semibold">
                BHK
                <select
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                  value={form.bhk}
                  onChange={(e) => patch({ bhk: e.target.value })}
                >
                  {BHK_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Built-up area (sq.ft)
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                  value={form.area}
                  onChange={(e) => patch({ area: Number(e.target.value) })}
                />
              </label>
              <label className="block text-sm font-semibold">
                Furnishing
                <select
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                  value={form.furnishing}
                  onChange={(e) => patch({ furnishing: e.target.value })}
                >
                  {FURNISHING_OPTIONS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Possession
                <select
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                  value={form.possession}
                  onChange={(e) => patch({ possession: e.target.value })}
                >
                  {POSSESSION_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                Facing
                <input
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                  value={form.facing}
                  onChange={(e) => patch({ facing: e.target.value })}
                />
              </label>
              <label className="block text-sm font-semibold">
                Floor
                <input
                  className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                  value={form.floor}
                  onChange={(e) => patch({ floor: e.target.value })}
                />
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Pricing</h2>
            <label className="block text-sm font-semibold">
              Expected price (₹)
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                value={form.price}
                onChange={(e) => patch({ price: Number(e.target.value) })}
              />
              <div className="mt-1 text-xs text-ink-muted">{formatINR(form.price)}</div>
              {errors.price && <span className="text-xs text-danger">{errors.price}</span>}
            </label>
            <label className="block text-sm font-semibold">
              Description
              <textarea
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
                rows={5}
                value={form.description}
                onChange={(e) => patch({ description: e.target.value })}
                placeholder="Highlight layout, sunlight, society, nearby landmarks…"
              />
              {errors.description && <span className="text-xs text-danger">{errors.description}</span>}
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => {
                const on = form.amenities.includes(a)
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() =>
                      patch({
                        amenities: on
                          ? form.amenities.filter((x) => x !== a)
                          : [...form.amenities, a],
                      })
                    }
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-semibold',
                      on ? 'border-ink bg-ink text-white' : 'border-border bg-white',
                    )}
                  >
                    {a}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Photos & video</h2>
            <p className="text-sm text-ink-muted">
              Drag to reorder. Plan limit: {plan.photoLimit} photos. Demo accepts local previews + Unsplash URLs.
            </p>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-mist/50 px-4 py-10 hover:bg-mist">
              <ImagePlus className="h-8 w-8 text-ink-muted" />
              <span className="mt-2 text-sm font-semibold">Drop images or click to upload</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files || [])}
              />
            </label>
            {errors.photos && <span className="text-xs text-danger">{errors.photos}</span>}
            <div className="grid gap-3 sm:grid-cols-3">
              {form.photos.map((src, i) => (
                <div key={src + i} className="relative overflow-hidden rounded-xl border border-border">
                  <img src={src} alt="" className="h-32 w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/70 px-2 py-1 text-white">
                    <button type="button" onClick={() => movePhoto(i, i - 1)} aria-label="Move left">
                      <GripVertical className="h-4 w-4" />
                    </button>
                    <div className="flex gap-2">
                      <button type="button" className="text-xs font-bold" onClick={() => movePhoto(i, i - 1)}>
                        ←
                      </button>
                      <button type="button" className="text-xs font-bold" onClick={() => movePhoto(i, i + 1)}>
                        →
                      </button>
                      <button
                        type="button"
                        onClick={() => patch({ photos: form.photos.filter((_, idx) => idx !== i) })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <label className="block text-sm font-semibold">
              Video tour URL (optional)
              <input
                className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
                value={form.videoTourUrl}
                onChange={(e) => patch({ videoTourUrl: e.target.value })}
                placeholder="https://www.youtube.com/embed/…"
              />
            </label>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Choose a plan</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-mist text-left text-xs uppercase text-ink-muted">
                  <tr>
                    <th className="px-3 py-2">Plan</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Days</th>
                    <th className="px-3 py-2">Photos</th>
                    <th className="px-3 py-2">Leads</th>
                    <th className="px-3 py-2">Featured</th>
                  </tr>
                </thead>
                <tbody>
                  {LISTING_PLANS.map((p) => (
                    <tr
                      key={p.id}
                      className={cn('cursor-pointer border-t border-border', form.planId === p.id && 'bg-amber/10')}
                      onClick={() => patch({ planId: p.id })}
                    >
                      <td className="px-3 py-3 font-bold">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            checked={form.planId === p.id}
                            onChange={() => patch({ planId: p.id })}
                          />
                          {p.name}
                          {p.popular && <Badge tone="featured">Popular</Badge>}
                        </label>
                      </td>
                      <td className="px-3 py-3">{p.price ? formatINR(p.price, { compact: false }) : 'Free'}</td>
                      <td className="px-3 py-3">{p.durationDays}</td>
                      <td className="px-3 py-3">{p.photoLimit}</td>
                      <td className="px-3 py-3">{p.leadLimit}</td>
                      <td className="px-3 py-3">{p.featuredSlots}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink-muted">
              {plan.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          <p className="text-xs text-ink-muted">Draft autosaved locally</p>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="secondary" onClick={back}>
                Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button onClick={next}>Continue</Button>
            ) : (
              <Button onClick={publish}>Checkout & publish</Button>
            )}
          </div>
        </div>
      </Card>

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <Card className="w-full max-w-md p-6">
            <h3 className="font-display text-xl font-semibold">Fake checkout</h3>
            <p className="mt-2 text-sm text-ink-muted">
              Pay <strong>{plan.price ? formatINR(plan.price, { compact: false }) : '₹0'}</strong> for the{' '}
              {plan.name} plan. No real payment is processed.
            </p>
            <div className="mt-4 rounded-xl bg-mist p-3 text-sm">
              <div className="font-semibold">{form.title || 'Untitled listing'}</div>
              <div className="text-ink-muted">
                {plan.durationDays} days · {plan.photoLimit} photos · {plan.leadLimit} leads
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setCheckoutOpen(false)}>
                Cancel
              </Button>
              <Button loading={submitting} onClick={confirmCheckout}>
                Confirm {plan.price ? 'payment' : 'publish'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function cityCenterSafe(cityId) {
  const c = CITIES.find((x) => x.id === cityId) || CITIES[0]
  return { lat: c.lat, lng: c.lng }
}
