import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useAuthStore, useEnquiryStore, useNotificationStore } from '../../store'
import { useToast } from '../ui/Toast'

export default function EnquiryModal({ open, onClose, listing }) {
  const { user, openLogin } = useAuthStore()
  const addEnquiry = useEnquiryStore((s) => s.add)
  const addNotification = useNotificationStore((s) => s.add)
  const toast = useToast()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [message, setMessage] = useState(
    `Hi, I'm interested in ${listing?.title || 'this property'}. Please share more details.`,
  )
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!user) {
      openLogin('enquiry')
      return
    }
    if (!name.trim() || phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter your name and a valid phone number')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    addEnquiry({
      listingId: listing.id,
      listingTitle: listing.title,
      sellerId: listing.postedBy?.id,
      sellerName: listing.postedBy?.name,
      buyerName: name,
      buyerPhone: phone,
      message,
      cityId: listing.cityId,
    })
    addNotification({
      title: 'Enquiry sent',
      body: `Your message about ${listing.title} was shared with the ${listing.postedBy?.type}.`,
    })
    toast.success('Enquiry sent successfully')
    setLoading(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Contact ${listing?.postedBy?.type || 'seller'}`}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={loading} onClick={submit}>
            Send enquiry
          </Button>
        </div>
      }
    >
      <form className="space-y-3" onSubmit={submit}>
        <p className="text-sm text-ink-muted">
          Reaches <strong>{listing?.postedBy?.name}</strong> for {listing?.title}.
        </p>
        <label className="block text-sm font-semibold">
          Name
          <input
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold">
          Phone
          <input
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="tel"
          />
        </label>
        <label className="block text-sm font-semibold">
          Message
          <textarea
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
      </form>
    </Modal>
  )
}
