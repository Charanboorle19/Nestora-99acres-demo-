import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import LoginModal from '../auth/LoginModal'
import ToastViewport from '../ui/Toast'

export default function AppLayout() {
  const { pathname, search } = useLocation()
  const isLanding = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col">
      {!isLanding && <Header />}
      <main className="flex-1 overflow-x-hidden">
        <div key={`${pathname}${search}`} className={isLanding ? undefined : 'page-slide-in'}>
          <Outlet />
        </div>
      </main>
      {!isLanding && <Footer />}
      <LoginModal />
      <ToastViewport />
    </div>
  )
}
