import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, MessageCircle, X } from 'lucide-react'

const PACKAGES = ['Digital Post', 'Reel + 4K Drone', 'Premium Push', 'Not sure, advise me']
const PROPERTY_TYPES = ['PG/Hostel Building', 'Homestay/Lodging', 'Plot/Land', 'Commercial Building', 'Shed/Warehouse', 'Banquet Hall', 'Apartment/Villa', 'Other']
const INITIAL_FORM = {
  packageInterest: 'Not sure, advise me', propertyType: '', intent: 'sale', location: '', mapsLink: '', size: '', unit: 'sq yds',
  name: '', phone: '', whatsapp: true, role: 'Owner', shootDate: '', flexible: false, notes: '',
}

function validate(form) {
  const errors = {}
  if (form.size && Number(form.size) <= 0) errors.size = 'Enter a valid size.'
  if (form.phone && !/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.'
  }
  return errors
}

export default function PromoteModal({ open, onClose, initialPackage = 'Not sure, advise me' }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const dialogRef = useRef(null)
  const firstFieldRef = useRef(null)

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM)
      setErrors({})
      setSubmitting(false)
      setSubmitted(false)
      return undefined
    }
    setForm({ ...INITIAL_FORM, packageInterest: PACKAGES.includes(initialPackage) ? initialPackage : INITIAL_FORM.packageInterest })
    setErrors({})
    setSubmitting(false)
    setSubmitted(false)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 0)
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = dialogRef.current.querySelectorAll('button:not([disabled]), input, select, textarea')
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, initialPackage, onClose])

  if (!open) return null

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }))
  }
  const blurValidate = (field) => setErrors(validate(form)[field] ? { ...errors, [field]: validate(form)[field] } : errors)
  const submit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSubmitting(true)
    await new Promise((resolve) => window.setTimeout(resolve, 800))
    console.log('Property promotion enquiry', form)
    setSubmitting(false)
    setSubmitted(true)
  }
  const whatsappMessage = encodeURIComponent(`Hi, I want to promote my property. Package: ${form.packageInterest}. Property type: ${form.propertyType}.`)
  const fieldClass = (field) => `hrp-promote-input${errors[field] ? ' hrp-promote-input-error' : ''}`
  const error = (field) => errors[field] && <span className="hrp-promote-error" role="alert">{errors[field]}</span>

  return (
    <div className="hrp-promote-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={dialogRef} className="hrp-promote-dialog" role="dialog" aria-modal="true" aria-labelledby="promote-modal-title">
        <div className="hrp-promote-header">
          <div><h2 id="promote-modal-title">Promote Your Property</h2><p>Share a few details and our team will get back to you.</p></div>
          <button type="button" className="hrp-promote-close" onClick={onClose} aria-label="Close promotion form"><X /></button>
        </div>
        {submitted ? (
          <div className="hrp-promote-confirmation">
            <CheckCircle2 className="hrp-promote-check" aria-hidden="true" />
            <h3>Details received</h3>
            <p>Our team will contact you shortly to discuss your property promotion.</p>
            <div className="hrp-promote-confirm-actions">
              <a className="hrp-promote-submit" href={`https://wa.me/916281736957?text=${whatsappMessage}`} target="_blank" rel="noreferrer"><MessageCircle /> Chat on WhatsApp</a>
              <button type="button" className="hrp-promote-secondary" onClick={onClose}>Back to home</button>
            </div>
          </div>
        ) : (
          <form className="hrp-promote-body" onSubmit={submit} noValidate>
            <div className="hrp-promote-grid">
              <label>Package interest<select ref={firstFieldRef} className={fieldClass('packageInterest')} value={form.packageInterest} onChange={(e) => update('packageInterest', e.target.value)}>{PACKAGES.map((item) => <option key={item}>{item}</option>)}</select></label>
              <label>Property type<select className={fieldClass('propertyType')} value={form.propertyType} onChange={(e) => update('propertyType', e.target.value)} onBlur={() => blurValidate('propertyType')}><option value="">Select property type</option>{PROPERTY_TYPES.map((item) => <option key={item}>{item}</option>)}</select>{error('propertyType')}</label>
              <fieldset><legend>Listing intent <span className="hrp-promote-required">*</span></legend><div className="hrp-promote-segmented">{[['sale', 'For Sale'], ['lease', 'For Lease']].map(([value, label]) => <button type="button" key={value} className={form.intent === value ? 'active' : ''} onClick={() => update('intent', value)}>{label}</button>)}</div></fieldset>
              <label>Location<input className={fieldClass('location')} value={form.location} onChange={(e) => update('location', e.target.value)} onBlur={() => blurValidate('location')} placeholder="Area, city" />{error('location')}</label>
              <label>Google Maps link <span className="hrp-promote-optional">(optional)</span><input className="hrp-promote-input" value={form.mapsLink} onChange={(e) => update('mapsLink', e.target.value)} placeholder="Paste a Maps link" /></label>
              <label>Size<input className={fieldClass('size')} type="number" min="1" value={form.size} onChange={(e) => update('size', e.target.value)} onBlur={() => blurValidate('size')} />{error('size')}</label>
              <label>Unit<select className="hrp-promote-input" value={form.unit} onChange={(e) => update('unit', e.target.value)}><option>sq yds</option><option>sq ft</option></select></label>
              <label>Your name<input className={fieldClass('name')} ref={undefined} value={form.name} onChange={(e) => update('name', e.target.value)} onBlur={() => blurValidate('name')} autoComplete="name" />{error('name')}</label>
              <label>Phone<input className={fieldClass('phone')} type="tel" inputMode="numeric" value={form.phone} onChange={(e) => update('phone', e.target.value)} onBlur={() => blurValidate('phone')} autoComplete="tel" maxLength="10" />{error('phone')}<span className="hrp-promote-checkbox"><input type="checkbox" checked={form.whatsapp} onChange={(e) => update('whatsapp', e.target.checked)} /> This is my WhatsApp number</span></label>
              <fieldset><legend>I am the <span className="hrp-promote-required">*</span></legend><div className="hrp-promote-segmented">{['Owner', 'Agent', 'Builder'].map((role) => <button type="button" key={role} className={form.role === role ? 'active' : ''} onClick={() => update('role', role)}>{role}</button>)}</div></fieldset>
              <label>Preferred shoot date <span className="hrp-promote-optional">(optional)</span><input className="hrp-promote-input" type="date" value={form.shootDate} disabled={form.flexible} onChange={(e) => update('shootDate', e.target.value)} /><span className="hrp-promote-checkbox"><input type="checkbox" checked={form.flexible} onChange={(e) => update('flexible', e.target.checked)} /> Flexible</span></label>
              <label className="hrp-promote-full">Notes <span className="hrp-promote-optional">(optional)</span><textarea className="hrp-promote-input" maxLength="250" value={form.notes} onChange={(e) => update('notes', e.target.value)} rows="3" /><span className="hrp-promote-counter">{form.notes.length}/250</span></label>
            </div>
            <p className="hrp-promote-live-errors" aria-live="polite">{Object.values(errors).filter(Boolean).length ? 'Please correct the highlighted fields.' : ''}</p>
            <button className="hrp-promote-submit" type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Details'}</button>
          </form>
        )}
      </div>
    </div>
  )
}