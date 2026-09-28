import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Jump to top instantly on route change — no smooth scroll animation. */
export default function ScrollToTop() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, search])

  return null
}
