import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useToast } from '../ui/Toast'
import { useNotificationStore } from '../../store'
import { cn } from '../../utils/format'

const REASONS = [
  'Incorrect price or details',
  'Property already sold / rented',
  'Fraudulent listing',
  'Incorrect photos',
  'Other',
]

export default function ReportModal({ open, onClose, listing }) {
  const toast = useToast()
  const addNotification = useNotificationStore((s) => s.add)
  const [reason, setReason] = useState(REASONS[0])
  const [details, setDetails] = useState('')

  const submit = () => {
    addNotification({
      title: 'Report received',
      body: `Thanks for flagging ${listing?.title}. Our demo queue recorded: ${reason}.`,
    })
    toast.success('Listing reported — thank you')
    setDetails('')
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Report listing"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={submit}>
            Submit report
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-ink-muted">Help us keep High Rise Properties trustworthy. This is a mock report flow.</p>
        <div className="flex flex-col gap-2">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              className={cn(
                'rounded-xl border px-3 py-2 text-left text-sm font-semibold',
                reason === r ? 'border-ink bg-mist' : 'border-border',
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <textarea
          className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
          rows={3}
          placeholder="Additional details (optional)"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>
    </Modal>
  )
}
