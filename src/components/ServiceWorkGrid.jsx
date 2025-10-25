import React from 'react'

function excerpt(text, max = 140) {
  if (!text) return ''
  if (text.length <= max) return text
  return `${text.slice(0, max).trim()}…`
}

function pickHeroImage(work) {
  if (Array.isArray(work?.images) && work.images.length) {
    const firstWithUrl = work.images.find((img) => img?.imageUrl)
    if (firstWithUrl) {
      return firstWithUrl.imageUrl
    }
  }
  if (Array.isArray(work?.heroImages) && work.heroImages.length) {
    return work.heroImages[0]
  }
  return null
}

export default function ServiceWorkGrid({ works, onSelect, showCategoryTag }) {
  if (!Array.isArray(works) || works.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[color:var(--bg-800)]/40 p-8 text-center text-sm text-gray-300">
        No projects available yet. Check back soon for new additions.
      </div>
    )
  }

  return (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {works.map((work, index) => {
        const images = Array.isArray(work.images) ? work.images : []
        const heroImage = pickHeroImage(work)
        const imageCount = images.length || (heroImage ? 1 : 0)
        const createdDate = work.createdAt ? new Date(work.createdAt) : null
        const categoryLabel = work.categoryName || work.category?.name || null
        const summaryText = excerpt(work.summary || work.story || '', 160)
        const key = work.id ?? `${work.title || 'project'}-${index}`

        return (
          <article
            key={key}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--bg-800)] shadow-lg"
          >
            <button
              type="button"
              onClick={() => onSelect(work, index)}
              className="block w-full text-left"
              aria-label={`Open project ${work.title || index + 1}`}
            >
              <div className="relative h-56 overflow-hidden bg-black sm:h-60">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt={work.title || 'Service project visual'}
                    className="relative z-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[0.75rem] uppercase tracking-[0.35em] text-gray-500">
                    Preview coming soon
                  </div>
                )}
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-x-4 bottom-4 z-20">
                  {showCategoryTag && categoryLabel && (
                    <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gold)]/80">{categoryLabel}</p>
                  )}
                  <h3 className="mt-1 text-lg font-semibold text-white line-clamp-2">{work.title || 'Project highlight'}</h3>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{createdDate ? createdDate.toLocaleDateString() : '—'}</span>
                  <span>{imageCount} images</span>
                </div>
                {summaryText && (
                  <p className="mt-3 text-sm leading-relaxed text-gray-300">{summaryText}</p>
                )}
              </div>
            </button>
          </article>
        )
      })}
    </div>
  )
}

ServiceWorkGrid.defaultProps = {
  works: [],
  onSelect: () => {},
  showCategoryTag: false,
}
