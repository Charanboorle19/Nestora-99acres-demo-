import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ListingCard from '../listings/ListingCard'
import Button from '../ui/Button'

export default function SimilarCarousel({ listings = [] }) {
  const ref = useRef(null)
  if (!listings.length) return null

  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-2 sm:mb-4">
        <h2 className="min-w-0 font-display text-lg font-semibold sm:text-xl">Similar properties</h2>
        <div className="flex shrink-0 gap-1">
          <Button variant="secondary" size="icon" onClick={() => scroll(-1)} aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={() => scroll(1)} aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div
        ref={ref}
        className="-mx-3 flex gap-3 overflow-x-auto px-3 pb-2 scrollbar-thin sm:mx-0 sm:gap-4 sm:px-0"
      >
        {listings.map((l) => (
          <div key={l.id} className="w-[min(16.5rem,78vw)] shrink-0">
            <ListingCard listing={l} />
          </div>
        ))}
      </div>
    </section>
  )
}
