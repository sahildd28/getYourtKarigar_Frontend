import React, { useEffect, useMemo, useState } from 'react'
import { fetchAllServiceWorks, fetchServiceCategories } from '../services/servicesCatalog'
import ServiceWorkGrid from './ServiceWorkGrid'
import WorkDetailModal from './WorkDetailModal'

const FALLBACK_WORKS = [
  {
    id: 'placeholder-1',
    title: 'Custom Wardrobe Fit-out',
    categoryName: 'Wardrobes',
    summary: 'Client: Mrs. Neha Shah (Bandra East, Mumbai)\n• The existing trolley had warped channels, uneven laminate, and limited storage.\n• Rebuilt with marine-grade plywood, added soft-close powder-coated channels, and created modular spice racks.\n• Matte teak laminate exterior with fully sealed edges for spill resistance.\nResult: A silent, organized pull-out pantry that matches the kitchen décor and keeps staples within easy reach. Upgraded a worn-out kitchen trolley into a smooth, soft-close storage hub for a Bandra apartment.',
    images: [
      { 
        imageUrl: 'https://res.cloudinary.com/dshupm40m/image/upload/c_crop,w_720,h_540,ar_4:3,g_auto/v1761485840/b5410c972c1666aba7f15e2a0055a402_syfap7.jpg', 
      },
    ],
  },
  {
    id: 'placeholder-2',
    title: 'Interior Panel Work',
    categoryName: 'Interiors',
    summary: 'Acoustic wooden panels that blend warmth with modern minimalism.',
    images: [
      { imageUrl: 'https://via.placeholder.com/800x900/3f3f3f/ffffff?text=Panels' },
    ],
  },
  {
    id: 'placeholder-3',
    title: 'Breakfast Counter',
    categoryName: 'Kitchens',
    summary: 'Compact counter with brass trims and hidden storage.',
    images: [
      { imageUrl: 'https://via.placeholder.com/800x900/4f4f4f/ffffff?text=Counter' },
    ],
  },
  {
    id: 'placeholder-4',
    title: 'Home Library',
    categoryName: 'Bespoke Furniture',
    summary: 'Floor-to-ceiling shelving with integrated ladder and warm lighting.',
    images: [
      { imageUrl: 'https://via.placeholder.com/800x900/5f5f5f/ffffff?text=Library' },
    ],
  },
]

function pickHeroImage(work) {
  if (Array.isArray(work?.images) && work.images.length > 0) {
    return work.images[0].imageUrl
  }
  if (Array.isArray(work?.heroImages) && work.heroImages.length > 0) {
    return work.heroImages[0]
  }
  return null
}

function formatWorkForDisplay(work) {
  return {
    ...work,
    heroImage: pickHeroImage(work),
    title: work.title || work.summary || 'Untitled project',
    categoryName: work.categoryName || work.category?.name || 'Custom Build',
    summary: work.summary || work.story || '',
  }
}

export default function HoneycombShowcase({ categories }) {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedWork, setSelectedWork] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [availableCategories, setAvailableCategories] = useState([])
  const [selectedCategoryKey, setSelectedCategoryKey] = useState('all')

  useEffect(() => {
    let active = true
    async function loadWorks() {
      setLoading(true)
      setError(null)
      try {
        let workingCategories = categories

        if (!Array.isArray(workingCategories) || !workingCategories.length) {
          try {
            workingCategories = await fetchServiceCategories()
          } catch (catErr) {
            console.warn('Failed to fetch service categories for showcase', catErr)
            workingCategories = []
          }
        }

        if (!active) return

        setAvailableCategories(Array.isArray(workingCategories) ? workingCategories : [])

        if (!Array.isArray(workingCategories) || !workingCategories.length) {
          setWorks(FALLBACK_WORKS)
          return
        }

        const data = await fetchAllServiceWorks({ categories: workingCategories, limit: 24, perCategoryLimit: 6 })
        if (!active) return
        if (Array.isArray(data) && data.length) {
          setWorks(data)
        } else {
          setWorks(FALLBACK_WORKS)
        }
      } catch (err) {
        if (!active) return
        console.error('Failed to load service works for showcase', err)
        setError(err)
        setWorks(FALLBACK_WORKS)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadWorks()
    return () => {
      active = false
    }
  }, [categories])

  const showcasedWorks = useMemo(() => {
    if (!Array.isArray(works) || !works.length) {
      return FALLBACK_WORKS.map(formatWorkForDisplay)
    }
    return works.map(formatWorkForDisplay)
  }, [works])

  const categoryOptions = useMemo(() => {
    const map = new Map()

    if (Array.isArray(availableCategories)) {
      availableCategories.forEach((cat) => {
        const key = String(cat?.id ?? cat?.slug ?? cat?.name ?? '').trim()
        const label = cat?.name || cat?.title || ''
        if (key && label && !map.has(key)) {
          map.set(key, label)
        }
      })
    }

    showcasedWorks.forEach((work) => {
      const key = String(work?.categoryId ?? work?.category?.id ?? work?.categorySlug ?? work?.categoryName ?? '').trim()
      const label = work?.categoryName || work?.category?.name || ''
      if (key && label && !map.has(key)) {
        map.set(key, label)
      }
    })

    const options = Array.from(map.entries()).map(([id, label]) => ({ id, label }))
    return [{ id: 'all', label: 'All projects' }, ...options]
  }, [availableCategories, showcasedWorks])

  useEffect(() => {
    const hasSelected = categoryOptions.some((opt) => opt.id === selectedCategoryKey)
    if (!hasSelected) {
      setSelectedCategoryKey('all')
    }
  }, [categoryOptions, selectedCategoryKey])

  const filteredWorks = useMemo(() => {
    if (selectedCategoryKey === 'all') {
      return showcasedWorks
    }
    return showcasedWorks.filter((work) => {
      const key = String(work?.categoryId ?? work?.category?.id ?? work?.categorySlug ?? work?.categoryName ?? '').trim()
      return key === selectedCategoryKey
    })
  }, [showcasedWorks, selectedCategoryKey])

  return (
    <section className="mt-12">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--gold)]/80">Project Showcase</p>
          <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Crafted projects across services</h3>
          <p className="mt-2 max-w-2xl text-sm text-gray-300">
            Scroll through our curated project grid. Each card opens the full story, image stack, and craftsmanship details for that service.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--gold)]/10 px-3 py-1 font-semibold text-[color:var(--gold)]">
            {filteredWorks.length}
            <span className="text-xs uppercase tracking-widest text-[color:var(--gold)]/80">projects</span>
          </span>
          {filteredWorks.length !== showcasedWorks.length && (
            <span className="text-xs text-gray-500">
              of {showcasedWorks.length}
            </span>
          )}
        </div>
      </header>

      {categoryOptions.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {categoryOptions.map((option) => {
            const isActive = option.id === selectedCategoryKey
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedCategoryKey(option.id)}
                className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-[color:var(--gold)] bg-[color:var(--gold)] text-black shadow'
                    : 'border-white/10 bg-[color:var(--bg-800)] text-gray-200 hover:border-white/20 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}

      {loading && (
        <div className="mb-6 rounded-2xl border border-white/5 bg-[color:var(--bg-800)]/50 p-6 text-center text-gray-300">
          Curating projects from every category…
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-700 bg-red-900/20 p-5 text-center text-red-200">
          Unable to load the latest projects. Showing curated highlights instead.
        </div>
      )}

      <ServiceWorkGrid
        works={filteredWorks}
        onSelect={(work) => {
          setSelectedWork(work)
          setSelectedImage(0)
        }}
        showCategoryTag
      />

      <WorkDetailModal
        work={selectedWork}
        selectedImage={selectedImage}
        onImageSelect={setSelectedImage}
        onClose={() => {
          setSelectedWork(null)
          setSelectedImage(0)
        }}
      />
    </section>
  )
}

HoneycombShowcase.defaultProps = {
  categories: null,
}
