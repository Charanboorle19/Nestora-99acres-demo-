import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import LoginModal from '../auth/LoginModal'
import ToastViewport from '../ui/Toast'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <LoginModal />
      <ToastViewport />
    </div>
  )
}
