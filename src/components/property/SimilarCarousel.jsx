import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ListingCard from '../listings/ListingCard'
import Button from '../ui/Button'

export default function SimilarCarousel({ listings = [] }) {
  const ref = useRef(null)
  if (!listings.length) return null

  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Similar properties</h2>
        <div className="flex gap-1">
          <Button variant="secondary" size="icon" onClick={() => scroll(-1)} aria-label="Previous">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={() => scroll(1)} aria-label="Next">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-2 scroll-smooth">
        {listings.map((l) => (
          <div key={l.id} className="min-w-[260px] max-w-[280px] shrink-0">
            <ListingCard listing={l} />
          </div>
        ))}
      </div>
    </section>
  )
}
