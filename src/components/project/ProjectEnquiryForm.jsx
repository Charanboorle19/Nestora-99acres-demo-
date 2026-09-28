import { useState } from 'react'
import Button from '../ui/Button'
import { useAuthStore, useEnquiryStore, useNotificationStore } from '../../store'
import { useToast } from '../ui/Toast'

export default function ProjectEnquiryForm({ project }) {
  const { user, openLogin } = useAuthStore()
  const addEnquiry = useEnquiryStore((s) => s.add)
  const addNotification = useNotificationStore((s) => s.add)
  const toast = useToast()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [config, setConfig] = useState(project.configs?.[0]?.bhk || '')
  const [message, setMessage] = useState(`Interested in ${project.name}. Please share inventory and offers.`)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!user) {
      openLogin('project-enquiry')
      return
    }
    if (!name.trim() || phone.replace(/\D/g, '').length < 10) {
      toast.error('Enter name and a valid phone number')
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 350))
    addEnquiry({
      listingId: project.id,
      listingTitle: `${project.name} (${config || 'General'})`,
      sellerId: project.builderId,
      sellerName: project.builderName,
      buyerName: name,
      buyerPhone: phone,
      message,
      cityId: project.cityId,
      kind: 'project',
    })
    addNotification({
      title: 'Project enquiry sent',
      body: `${project.builderName} will follow up on ${project.name}.`,
    })
    toast.success('Enquiry sent to the builder')
    setLoading(false)
  }

  return (
    <form id="project-enquiry" onSubmit={submit} className="space-y-3">
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
        Preferred configuration
        <select
          className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm"
          value={config}
          onChange={(e) => setConfig(e.target.value)}
        >
          {project.configs?.map((c) => (
            <option key={c.bhk} value={c.bhk}>
              {c.bhk}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold">
        Message
        <textarea
          className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>
      <Button type="submit" className="w-full" loading={loading}>
        Request callback
      </Button>
    </form>
  )
}
