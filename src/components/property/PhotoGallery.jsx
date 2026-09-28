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
    { id: 'video', label: 'Video' },
    { id: 'floor', label: 'Floor plan' },
  ]

  return (
    <div className="min-w-0">
      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-3 w-full max-w-full sm:max-w-md" />

      {tab === 'video' ? (
        <div className="aspect-video overflow-hidden rounded-xl border border-border bg-ink sm:rounded-2xl">
          {videoTourUrl ? (
            <iframe
              title={`${title} video tour`}
              src={videoTourUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-white/70">
              <Play className="h-10 w-10" />
              <p className="text-sm">Video tour not available for this listing</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-xl border border-border sm:rounded-2xl">
            <button
              type="button"
              className="block w-full"
              onClick={() => media.length && setLightbox(true)}
            >
              {media[index] ? (
                <img
                  src={media[index]}
                  alt={`${title} ${index + 1}`}
                  className="aspect-4/3 w-full object-cover sm:aspect-16/10"
                />
              ) : (
                <div className="flex aspect-4/3 items-center justify-center bg-mist text-sm text-ink-muted sm:aspect-16/10">
                  No {tab === 'floor' ? 'floor plan' : 'photos'} available
                </div>
              )}
            </button>
            {media.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-1.5 shadow-soft sm:left-3 sm:p-2"
                  onClick={() => setIndex((i) => (i - 1 + media.length) % media.length)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-1.5 shadow-soft sm:right-3 sm:p-2"
                  onClick={() => setIndex((i) => (i + 1) % media.length)}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  {index + 1} / {media.length}
                </div>
              </>
            )}
          </div>
          {media.length > 1 && (
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-thin">
              {media.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn(
                    'h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 sm:h-16 sm:w-24 sm:rounded-xl',
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
        <div className="fixed inset-0 z-80 flex flex-col bg-ink/95">
          <div className="flex items-center justify-between p-3 sm:p-4">
            <span className="text-sm font-semibold text-white">
              {index + 1} / {media.length}
            </span>
            <button
              type="button"
              className="rounded-full bg-white/10 p-2 text-white"
              onClick={() => setLightbox(false)}
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 sm:px-16">
            {media.length > 1 && (
              <button
                type="button"
                className="absolute left-2 rounded-full bg-white/10 p-2 text-white sm:left-4 sm:p-3"
                onClick={() => setIndex((i) => (i - 1 + media.length) % media.length)}
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            <img
              src={media[index]}
              alt=""
              className="max-h-full max-w-full object-contain"
            />
            {media.length > 1 && (
              <button
                type="button"
                className="absolute right-2 rounded-full bg-white/10 p-2 text-white sm:right-4 sm:p-3"
                onClick={() => setIndex((i) => (i + 1) % media.length)}
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
