import React, { useEffect } from 'react'

export default function WorkDetailModal({
  work,
  selectedImage = 0,
  onImageSelect,
  onClose,
  categoryLabel,
}) {
  useEffect(() => {
    if (!work || typeof document === 'undefined' || typeof window === 'undefined') {
      return undefined
    }

    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

    // Prevent page scroll while the modal is open and account for the scrollbar gap.
    body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`
    }

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
    }
  }, [work])

  if (!work) {
    return null
  }

  const images = Array.isArray(work.images) ? work.images : []
  const activeImage = images[selectedImage] || images[0] || null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />

  <div className="relative z-10 w-full max-w-[calc(100vw-1.5rem)] max-h-[92dvh] overflow-y-auto rounded-2xl border border-white/5 bg-[color:var(--bg-900)] shadow-2xl sm:max-w-4xl lg:max-w-5xl lg:overflow-hidden xl:max-w-6xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90"
          aria-label="Close"
        >
          ×
        </button>

  <div className="grid h-full min-h-[320px] grid-cols-1 grid-rows-[auto_auto] overflow-hidden lg:grid-cols-[1.7fr_1fr] lg:grid-rows-1">
          <div className="flex h-full flex-col bg-black">
            <div className="relative flex-1 min-h-[260px] sm:min-h-[320px] lg:min-h-[480px] xl:min-h-[540px]">
              {activeImage ? (
                <img
                  src={activeImage.imageUrl}
                  alt={activeImage.caption || work.title || 'Service work visual'}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  No imagery available for this project yet.
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="relative z-10 flex gap-2 overflow-x-auto border-t border-white/5 bg-black/80 px-4 py-3 lg:px-6">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => onImageSelect?.(idx)}
                    className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded border ${idx === selectedImage ? 'border-[color:var(--gold)] ring-2 ring-[color:var(--gold)]/60' : 'border-white/15'}`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.caption || work.title || 'Project image'}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex h-full flex-col overflow-hidden px-5 pb-6 pt-14 lg:px-6 lg:pt-6">
            <div className="flex-1 overflow-y-auto pr-1">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gold)]/80">
                {categoryLabel || work.categoryName || 'Service Project'}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">
                {work.title || 'Project highlight'}
              </h3>
              {work.summary && (
                <p className="mt-3 text-sm leading-relaxed text-gray-300">{work.summary}</p>
              )}
              {work.story && (
                <div className="mt-4 space-y-4 whitespace-pre-line text-sm leading-relaxed text-gray-200">
                  {work.story}
                </div>
              )}
              {work.createdAt && (
                <p className="mt-4 text-xs uppercase tracking-widest text-gray-500">
                  Crafted on {new Date(work.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
