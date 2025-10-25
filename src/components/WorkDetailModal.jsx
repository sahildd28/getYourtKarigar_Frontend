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

    body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`
    }

    // Restore original scroll state when the modal unmounts.
    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
    }
  }, [work])

  if (!work) {
    return null
  }

  const images = Array.isArray(work.images) ? work.images : []
  const activeImage = images[selectedImage]

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto p-3 sm:p-6">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl max-h-[90vh] flex-col overflow-y-auto rounded-2xl border border-white/5 bg-[color:var(--bg-900)] shadow-2xl lg:max-h-none lg:overflow-hidden">
        <div className="flex flex-col lg:max-h-[90vh] lg:flex-row">
          <div className="bg-black lg:w-2/3">
            {images.length ? (
              <div className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh]">
                <img
                  src={activeImage?.imageUrl}
                  alt={activeImage?.caption || work.title || 'Service work visual'}
                  className="h-full w-full object-cover"
                />
                {images.length > 1 && (
                  <div className="absolute inset-x-4 bottom-4 flex gap-2 overflow-x-auto">
                    {images.map((img, idx) => (
                      <button
                        key={img.id || idx}
                        type="button"
                        onClick={() => onImageSelect?.(idx)}
                        className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded border ${idx === selectedImage ? 'border-[color:var(--gold)] ring-2 ring-[color:var(--gold)]/60' : 'border-white/10'}`}
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
            ) : (
              <div className="flex h-[60vh] items-center justify-center text-gray-400 sm:h-[70vh] lg:h-[80vh]">
                No imagery available for this project yet.
              </div>
            )}
          </div>

          <div className="flex min-h-0 flex-1 flex-col p-6 lg:w-1/3">
            <div className="flex-1 overflow-y-auto pr-1">
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gold)]/80">{categoryLabel || work.categoryName || 'Service Project'}</p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{work.title || 'Project highlight'}</h3>
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
            <div className="sticky bottom-0 mt-6 flex justify-end bg-[color:var(--bg-900)] py-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-w-[120px] items-center justify-center rounded border border-white/15 px-4 py-2 text-sm font-semibold text-gray-200 transition hover:border-white/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
