import { Link } from 'react-router-dom'
import PostPropertyWizard from '../components/post/PostPropertyWizard'
import { useAuthStore } from '../store'
import EmptyState from '../components/ui/EmptyState'

export default function PostPropertyPage() {
  const { user, openLogin } = useAuthStore()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">Post your property</h1>
          <p className="text-sm text-ink-muted">
            Multi-step wizard with draft autosave — owners, agents and builders.
          </p>
        </div>
        {user && (
          <Link to="/seller" className="text-sm font-bold text-ink hover:underline">
            Seller dashboard →
          </Link>
        )}
      </div>

      {!user ? (
        <EmptyState
          title="Login to post a property"
          description="Use OTP 123456. Pick Owner, Agent or Builder for the best demo path."
          actionLabel="Login"
          onAction={() => openLogin('post-property')}
        />
      ) : (
        <PostPropertyWizard />
      )}
    </div>
  )
}
