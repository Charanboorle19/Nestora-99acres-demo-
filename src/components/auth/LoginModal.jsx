import { useState } from 'react'
import { ROLES, BRAND } from '../../utils/constants'
import { useAuthStore } from '../../store'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { useToast } from '../ui/Toast'

export default function LoginModal() {
  const { showLogin, closeLogin, login, demoOtp } = useAuthStore()
  const toast = useToast()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('buyer')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')

  const reset = () => {
    setStep(1)
    setOtp('')
  }

  const handleClose = () => {
    reset()
    closeLogin()
  }

  const sendOtp = () => {
    if (phone.replace(/\D/g, '').length < 10) {
      toast.error('Enter a valid 10-digit mobile number')
      return
    }
    setStep(2)
    toast.info(`Demo OTP sent. Use ${demoOtp}`)
  }

  const verify = () => {
    if (otp !== demoOtp) {
      toast.error(`Invalid OTP. Demo code is ${demoOtp}`)
      return
    }
    login({ name: name || 'Demo User', phone, role })
    toast.success(`Signed in as ${ROLES.find((r) => r.id === role)?.label}`)
    reset()
  }

  return (
    <Modal open={showLogin} onClose={handleClose} title={`Sign in to ${BRAND.name}`} size="md">
      {step === 1 ? (
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">Choose a role for this demo. OTP is mocked — use <strong>{BRAND.otp}</strong>.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  role === r.id ? 'border-ink bg-mist' : 'border-border hover:border-ink/30'
                }`}
              >
                <div className="text-sm font-bold text-ink">{r.label}</div>
                <div className="mt-1 text-xs text-ink-muted">{r.description}</div>
              </button>
            ))}
          </div>
          <label className="block text-sm font-semibold">
            Full name
            <input
              className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </label>
          <label className="block text-sm font-semibold">
            Mobile number
            <input
              className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-ink"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile"
              inputMode="tel"
            />
          </label>
          <Button className="w-full" onClick={sendOtp}>
            Get OTP
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-ink-muted">
            Enter the 6-digit OTP sent to {phone || 'your number'}. Demo OTP: <strong>{demoOtp}</strong>
          </p>
          <input
            className="w-full rounded-xl border border-border px-3 py-3 text-center text-2xl tracking-[0.4em] outline-none focus:border-ink"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="••••••"
            inputMode="numeric"
          />
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="flex-1" onClick={verify}>
              Verify & continue
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
