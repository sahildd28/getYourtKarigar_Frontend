import React, { useEffect, useMemo, useState } from 'react'
import { fetchWorksByCategoryId } from '../services/servicesCatalog'
import ServiceWorkGrid from './ServiceWorkGrid'
import WorkDetailModal from './WorkDetailModal'

export default function Gallery({ category, categoryId }) {
  const [works, setWorks] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedWork, setSelectedWork] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    let mounted = true
    async function load() {
      if (!categoryId) {
        setWorks(null)
        return
      }
      setLoading(true)
      try {
        const data = await fetchWorksByCategoryId(categoryId)
        if (!mounted) return
        setWorks(data)
        console.log('Fetched works for categoryId=', categoryId, data)
      } catch (err) {
        console.error('Failed to fetch works', err)
        if (mounted) setError(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [categoryId])

  // placeholder when no works
  const placeholder = useMemo(
    () => [
      {
        id: 'placeholder-1',
        title: 'Project Preview',
        summary: 'Designs in this category will appear here once published.',
        createdAt: Date.now(),
        images: [
          { imageUrl: 'https://via.placeholder.com/1200x800?text=Project+Preview' },
        ],
      },
      {
        id: 'placeholder-2',
        title: 'Project Preview',
        summary: 'Designs in this category will appear here once published.',
        createdAt: Date.now(),
        images: [
          { imageUrl: 'https://via.placeholder.com/1200x800?text=Project+Preview' },
        ],
      },
    ],
    []
  )

  const items = works && Array.isArray(works) && works.length ? works : placeholder

  return (
    <section className="my-8">
      <div className="mb-6 flex justify-end">
        <span className="inline-flex items-center rounded-full bg-[color:var(--gold)]/10 px-3 py-1 text-sm font-semibold text-[color:var(--gold)]">
          {items.length} projects
        </span>
      </div>

      {loading && (
        <div className="rounded-xl border border-white/5 bg-[color:var(--bg-800)]/40 p-6 text-center text-gray-300">Loading projects…</div>
      )}

      {error && (
        <div className="rounded-xl border border-red-600 bg-red-900/20 p-6 text-center text-red-200">Failed to load projects.</div>
        )}

        <ServiceWorkGrid
          works={items}
          onSelect={(work) => {
            setSelectedWork(work)
            setSelectedImage(0)
          }}
        />

      {/* Modal viewer */}
      <WorkDetailModal
        work={selectedWork}
        selectedImage={selectedImage}
        onImageSelect={setSelectedImage}
        onClose={() => {
          setSelectedWork(null)
          setSelectedImage(0)
        }}
        categoryLabel={category || selectedWork?.categoryName}
      />
    </section>
  )
}
