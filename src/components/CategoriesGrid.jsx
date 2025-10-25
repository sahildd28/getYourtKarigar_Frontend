import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchServiceCategories } from '../services/servicesCatalog'

const fallbackServices = [
  'Kitchen Trolley Repairs',
  'Wardrobe Repairs',
  'Storage Solutions',
  'Safety Doors',
  'Sitting Arrangements',
  'Teapoy',
  'Coffee / Computer Tables',
  'Hinges & Window Repairs',
  'Antique Wooden Piece Creation',
  'Mandir',
  'Wooden Polish',
  'Flat Interiors'
]

export default function CategoriesGrid() {
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadCategories() {
      try {
        const data = await fetchServiceCategories()
        if (!isMounted) return
        if (Array.isArray(data) && data.length) {
          console.log('Service categories fetched from API:', data)
          setCategories(data)
        } else {
          console.warn('Service categories API returned empty list, falling back to static services.')
        }
      } catch (err) {
        console.error('Failed to load service categories:', err)
        setError(err)
      }
    }

    loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const items = useMemo(() => {
    if (categories.length) {
      return categories
        .slice()
        .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' }))
        .map((category) => ({
          key: category.slug || category.id || category.name,
          name: category.name,
          id: category.id,
          imageUrl: category.imageUrl || category.image_url || category.thumbnailUrl || null,
          description: category.shortDescription || category.description || '',
          summary: category.showcaseSummary || category.summary || category.shortDescription || category.description || '',
        }))
    }

    return fallbackServices
      .slice()
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
      .map((name, index) => ({
        key: `${name}-${index}`,
        name,
        imageUrl: null,
        description: 'Explore bespoke solutions shaped around your space.',
        summary: 'Tailored craftsmanship, from consultation to installation.',
      }))
  }, [categories])

  return (
    <section id="services" className="my-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--gold)]/80">Our Services</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Spaces crafted for every need</h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-300">
            Choose a service to browse featured builds, finishes, and custom details tailored to that craft.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 self-start rounded-full bg-[color:var(--gold)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--gold)]">
          {items.length} services
        </span>
      </div>
      {error && (
        <p className="mb-4 text-sm text-red-400">
          Unable to load the latest categories. Showing curated list instead.
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map(({ key, name, id, imageUrl, description, summary }) => (
          <Link
            key={key}
            to={`/gallery?category=${encodeURIComponent(name)}${id ? `&categoryId=${encodeURIComponent(id)}` : ''}`}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[color:var(--bg-800)] shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:border-[color:var(--gold)]/50"
            aria-label={`View ${name}`}
          >
            <div className="relative h-40 overflow-hidden bg-black">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={name}
                  className="relative z-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-[0.7rem] uppercase tracking-[0.3em] text-gray-500">
                  Visual coming soon
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              <div className="absolute inset-x-4 bottom-4 z-20">
                <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--gold)]/80">{name}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 px-4 pb-5 pt-4">
              {summary ? (
                <p className="text-base font-medium leading-relaxed text-gray-200 line-clamp-3">{summary}</p>
              ) : (
                <p className="text-sm leading-relaxed text-gray-300 line-clamp-2">{description}</p>
              )}
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--gold)]/80">
                View projects
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
