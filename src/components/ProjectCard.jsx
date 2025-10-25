import React from 'react'
import normalizeDriveImage from '../utils/drive'

export default function ProjectCard({ project, onReadMore }) {
  const coverSrc = project.cover ? normalizeDriveImage(project.cover) : null
  const rawDate = project.projectDate || project.date || project.createdAt
  const displayDate = rawDate ? new Date(rawDate).toLocaleDateString() : '—'

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/5 bg-[color:var(--bg-800)] shadow-lg transition hover:-translate-y-1 hover:border-[color:var(--gold)]/40">
      <div className="relative h-48 overflow-hidden bg-black">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.35em] text-gray-500">
            Visual coming soon
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-4 bottom-4">
          <div className="text-[0.65rem] uppercase tracking-[0.35em] text-[color:var(--gold)]/80">{displayDate}</div>
          <h3 className="mt-1 text-lg font-semibold text-white line-clamp-2">{project.title}</h3>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <p className="text-sm text-gray-300 line-clamp-3">{project.summary}</p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2 text-xs text-gray-400">
            {project.tags?.map((tag) => {
              const label = typeof tag === 'string' ? tag : tag?.name
              if (!label) return null
              return (
                <span key={label} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-200">
                  {label}
                </span>
              )
            })}
          </div>
          <button
            onClick={() => onReadMore(project)}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--gold)]/40 px-3 py-1 text-sm font-semibold text-[color:var(--gold)] transition hover:border-[color:var(--gold)]"
          >
            Read more
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </article>
  )
}
