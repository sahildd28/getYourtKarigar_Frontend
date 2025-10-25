import React, { useEffect, useMemo, useState } from "react"
import ProjectsGrid from '../components/ProjectsGrid'
import ProjectDetailModal from '../components/ProjectDetailModal'
import { fetchProjects } from '../services/projectsService'

export default function OurProjects(){
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function loadProjects(){
      setLoading(true)
      setError(null)
      try {
        const data = await fetchProjects()
        if (!active) return
        const mapped = Array.isArray(data) ? data.map(mapProjectFromApi) : []
        setProjects(mapped)
      } catch(err) {
        console.error('Failed to load projects', err)
        if (active) setError(err)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadProjects()
    return () => {
      active = false
    }
  }, [])

  const selectedProject = useMemo(() => {
    if (!selected) return null
    return projects.find((p) => p.id === selected.id) || selected
  }, [projects, selected])

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--gold)]/80">Project Stories</p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Craftsmanship in Detail</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-300">
            Browse signature builds from our recent work. Tap a project card to open its full narrative, materials, and imagery.
          </p>
        </div>
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-300">
          {projects.length || 0} projects
        </span>
      </header>

      {loading && (
        <div className="mb-6 rounded-2xl border border-white/5 bg-[color:var(--bg-800)]/40 p-6 text-center text-gray-300">
          Loading project stories…
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-700 bg-red-900/20 p-6 text-center text-red-200">
          We couldn&apos;t fetch the latest projects. Please try again shortly.
        </div>
      )}

      {!loading && !error && (
        <ProjectsGrid projects={projects} onSelect={setSelected} />
      )}

      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelected(null)} />}
    </div>
  )
}

function mapProjectFromApi(raw = {}) {
  const contentBlocks = Array.isArray(raw.contentBlocks)
    ? raw.contentBlocks
        .slice()
        .sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
        .map((block) => {
          if (!block) return null
          const type = String(block.type || '').toLowerCase()
          if (type === 'image') {
            return {
              type: 'image',
              src: block.imageUrl || block.src,
              caption: block.caption || null,
            }
          }
          return {
            type: 'text',
            text: block.text || '',
          }
        })
        .filter(Boolean)
    : []

  const tags = Array.isArray(raw.tags)
    ? raw.tags.map((tag) => ({ name: tag?.name || tag })).filter((tag) => Boolean(tag.name))
    : []

  const projectDate = Array.isArray(raw.projectDate)
    ? new Date(raw.projectDate[0], (raw.projectDate[1] ?? 1) - 1, raw.projectDate[2] ?? 1)
    : raw.projectDate

  return {
    id: raw.id,
    title: raw.title,
    summary: raw.summary,
    cover: raw.cover,
    projectDate,
    createdAt: raw.createdAt,
    tags,
    contentBlocks,
  }
}
