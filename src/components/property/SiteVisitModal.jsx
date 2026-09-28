import { useMemo, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useAuthStore, useVisitStore, useNotificationStore } from '../../store'
import { useToast } from '../ui/Toast'
import { cn } from '../../utils/format'

const SLOTS = ['10:00 AM', '11:30 AM', '1:00 PM', '3:00 PM', '5:00 PM', '6:30 PM']

function nextDates(count = 10) {
  const out = []
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  for (let i = 1; i <= count; i += 1) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    out.push(d)
  }
  return out
}

export default function SiteVisitModal({ open, onClose, listing }) {
  const { user, openLogin } = useAuthStore()
  const addVisit = useVisitStore((s) => s.add)
  const addNotification = useNotificationStore((s) => s.add)
  const toast = useToast()
  const dates = useMemo(() => nextDates(), [])
  const [dateIdx, setDateIdx] = useState(0)
  const [slot, setSlot] = useState(SLOTS[1])
  const [note, setNote] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [visit, setVisit] = useState(null)

  const reset = () => {
    setConfirmed(false)
    setVisit(null)
    setNote('')
    setDateIdx(0)
    setSlot(SLOTS[1])
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const submit = () => {
    if (!user) {
      openLogin('site-visit')
      return
    }
    const date = dates[dateIdx]
    const entry = addVisit({
      listingId: listing.id,
      listingTitle: listing.title,
      localityName: listing.localityName,
      sellerName: listing.postedBy?.name,
      date: date.toISOString().slice(0, 10),
      slot,
      note,
      buyerName: user.name,
      buyerPhone: user.phone,
    })
    setVisit(entry)
    setConfirmed(true)
    addNotification({
      title: 'Site visit requested',
      body: `${listing.title} · ${date.toLocaleDateString('en-IN')} at ${slot}`,
    })
    toast.success('Site visit scheduled')
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={confirmed ? 'Visit confirmed' : 'Schedule site visit'}
      size="lg"
      footer={
        confirmed ? (
          <div className="flex justify-end">
            <Button onClick={handleClose}>Done</Button>
          </div>
        ) : (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={submit}>Confirm visit</Button>
          </div>
        )
      }
    >
      {confirmed && visit ? (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="rounded-full bg-success/15 p-4 text-success">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="mt-4 font-display text-2xl font-semibold">You're all set</h3>
          <p className="mt-2 max-w-md text-sm text-ink-muted">
            Site visit for <strong>{listing.title}</strong> on{' '}
            <strong>{new Date(visit.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</strong>{' '}
            at <strong>{visit.slot}</strong>. The {listing.postedBy?.type} will confirm shortly.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-ink-muted">
            Pick a date and slot to visit {listing?.title} in {listing?.localityName}.
          </p>
          <div>
            <div className="mb-2 text-sm font-semibold">Date</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {dates.map((d, i) => (
                <button
                  key={d.toISOString()}
                  type="button"
                  onClick={() => setDateIdx(i)}
                  className={cn(
                    'min-w-18 rounded-xl border px-3 py-2 text-center transition',
                    i === dateIdx ? 'border-ink bg-ink text-white' : 'border-border bg-white hover:border-ink/30',
                  )}
                >
                  <div className="text-[10px] font-bold uppercase opacity-80">
                    {d.toLocaleDateString('en-IN', { weekday: 'short' })}
                  </div>
                  <div className="text-lg font-extrabold">{d.getDate()}</div>
                  <div className="text-[10px] uppercase">{d.toLocaleDateString('en-IN', { month: 'short' })}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold">Time slot</div>
            <div className="flex flex-wrap gap-2">
              {SLOTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-semibold',
                    slot === s ? 'border-ink bg-ink text-white' : 'border-border bg-white',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <label className="block text-sm font-semibold">
            Note (optional)
            <textarea
              className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any preference for the visit?"
            />
          </label>
        </div>
      )}
    </Modal>
  )
}
