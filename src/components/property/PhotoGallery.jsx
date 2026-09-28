import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react'
import Tabs from '../ui/Tabs'
import { cn } from '../../utils/format'

export default function PhotoGallery({ photos = [], floorPlan, videoTourUrl, title }) {
  const [tab, setTab] = useState('photos')
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const media =
    tab === 'photos'
      ? photos
      : tab === 'floor'
        ? floorPlan
          ? [floorPlan]
          : []
        : []

  useEffect(() => {
    setIndex(0)
  }, [tab, photos])

  useEffect(() => {
    if (!lightbox) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % Math.max(media.length, 1))
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + media.length) % Math.max(media.length, 1))
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, media.length])

  const tabs = [
    { id: 'photos', label: 'Photos' },
    { id: 'video', label: 'Video tour' },
    { id: 'floor', label: 'Floor plan' },
  ]

  return (
    <div>
      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-3 max-w-md" />

      {tab === 'video' ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-ink aspect-video">
          {videoTourUrl ? (
            <iframe
              title={`${title} video tour`}
              src={videoTourUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-white/70">
              <Play className="h-10 w-10" />
              <p className="text-sm">Video tour not available for this listing</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            className="relative block w-full overflow-hidden rounded-2xl border border-border"
            onClick={() => media.length && setLightbox(true)}
          >
            {media[index] ? (
              <img
                src={media[index]}
                alt={`${title} ${index + 1}`}
                className="aspect-[16/10] w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center bg-mist text-sm text-ink-muted">
                No {tab === 'floor' ? 'floor plan' : 'photos'} available
              </div>
            )}
            {media.length > 1 && (
              <>
                <span
                  role="presentation"
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-soft"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIndex((i) => (i - 1 + media.length) % media.length)
                  }}
                >
                  <ChevronLeft className="h-5 w-5" />
                </span>
                <span
                  role="presentation"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-soft"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIndex((i) => (i + 1) % media.length)
                  }}
                >
                  <ChevronRight className="h-5 w-5" />
                </span>
              </>
            )}
          </button>
          {media.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {media.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2',
                    i === index ? 'border-ink' : 'border-transparent opacity-80',
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {lightbox && media[index] && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/90 p-4">
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
            onClick={() => setLightbox(false)}
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white"
            onClick={() => setIndex((i) => (i - 1 + media.length) % media.length)}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img
            src={media[index]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
          />
          <button
            type="button"
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white sm:right-16"
            onClick={() => setIndex((i) => (i + 1) % media.length)}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  )
}
