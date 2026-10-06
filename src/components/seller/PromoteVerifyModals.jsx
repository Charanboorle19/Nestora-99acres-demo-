import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { formatINR } from '../../utils/format'
import { updateListing } from '../../services/api'
import { useNotificationStore, useToastStore } from '../../store'

export function PromoteModal({ open, onClose, listing, onDone }) {
  const [budget, setBudget] = useState(1500)
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const toast = useToastStore((s) => s.push)
  const addNotification = useNotificationStore((s) => s.add)

  if (!listing) return null

  const confirm = async () => {
    setLoading(true)
    await updateListing(listing.id, {
      featured: true,
      featuredUntil: new Date(Date.now() + days * 86400000).toISOString(),
      status: listing.status === 'expired' ? 'active' : listing.status,
    })
    addNotification({
      title: 'Listing promoted',
      body: `${listing.title} is Featured for ${days} days (budget ${formatINR(budget, { compact: false })}).`,
    })
    toast({ type: 'success', title: 'Promoted', message: 'Featured tag applied' })
    setLoading(false)
    onDone?.()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Feature this listing"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} onClick={confirm}>
            Pay & feature
          </Button>
        </div>
      }
    >
      <p className="text-sm text-ink-muted">
        Featured listings get amber badges and priority in search relevance. Fake checkout only.
      </p>
      <label className="mt-4 block text-sm font-semibold">
        Daily budget (₹)
        <input
          type="range"
          min={500}
          max={5000}
          step={100}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="mt-2 w-full accent-ink"
        />
        <div className="mt-1">{formatINR(budget, { compact: false })} / day</div>
      </label>
      <label className="mt-4 block text-sm font-semibold">
        Duration (days)
        <input
          type="range"
          min={3}
          max={30}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="mt-2 w-full accent-ink"
        />
        <div className="mt-1">{days} days · est. total {formatINR(budget * days, { compact: false })}</div>
      </label>
    </Modal>
  )
}

export function VerifyModal({ open, onClose, listing, onDone }) {
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToastStore((s) => s.push)
  const addNotification = useNotificationStore((s) => s.add)

  if (!listing) return null

  const submit = async () => {
    if (!fileName) {
      toast({ type: 'error', title: 'Upload required', message: 'Choose a mock ownership document' })
      return
    }
    setLoading(true)
    await updateListing(listing.id, { verified: true, status: 'active' })
    addNotification({
      title: 'Verification approved',
      body: `${listing.title} now shows a Verified badge (demo auto-approve).`,
    })
    toast({ type: 'success', title: 'Verified', message: 'Badge granted' })
    setLoading(false)
    onDone?.()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request verification"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} onClick={submit}>
            Submit documents
          </Button>
        </div>
      }
    >
      <p className="text-sm text-ink-muted">
        Upload a mock ownership / authority letter. High Rise Properties demo auto-approves and grants a Verified badge.
      </p>
      <label className="mt-4 flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-border bg-mist/60 px-4 py-8">
        <span className="text-sm font-semibold">{fileName || 'Choose PDF / image'}</span>
        <input
          type="file"
          className="hidden"
          accept=".pdf,image/*"
          onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
        />
      </label>
    </Modal>
  )
}
