import React from 'react'
import normalizeDriveImage from '../utils/drive'

export default function ProjectDetailModal({ project, onClose }) {
  if (!project) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm">
      <div className="flex min-h-full items-start justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--bg-900)] shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto fixed right-6 top-6 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/60 text-gray-200 shadow transition hover:bg-black/80"
            aria-label="Close project story"
          >
            ×
          </button>

          <div className="flex max-h-[calc(100vh-3rem)] flex-col overflow-y-auto">
            {project.cover && (
              <div className="relative h-64 w-full flex-shrink-0 overflow-hidden bg-black sm:h-72">
                <img
                  src={normalizeDriveImage(project.cover)}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-6 bottom-6">
                  <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--gold)]/80">
                    {project.tags?.map((tag) => (typeof tag === 'string' ? tag : tag?.name)).filter(Boolean).join(' • ') || 'Project highlight'}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{project.title}</h2>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6 px-6 pb-8 pt-6 sm:px-10">
              <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-400">
                  {project.projectDate ? new Date(project.projectDate).toLocaleDateString() : ''}
                </div>
                {project.summary && (
                  <p className="max-w-3xl text-sm leading-relaxed text-gray-300">
                    {project.summary}
                  </p>
                )}
              </header>

              <div className="space-y-6 text-sm leading-relaxed text-gray-200">
                {project.contentBlocks?.map((block, idx) => {
                  const key = (block.type === 'image' ? block.src : block.text)?.slice(0, 64) || idx

                  if (block.type === 'image') {
                    return (
                      <figure key={key} className="rounded-2xl border border-white/5 bg-black/30 p-3">
                        <div className="overflow-hidden rounded-xl">
                          <img
                            src={normalizeDriveImage(block.src)}
                            alt={block.caption || project.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-2 text-xs uppercase tracking-[0.25em] text-gray-400">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    )
                  }

                  return (
                    <p key={key} className="rounded-2xl border border-white/5 bg-[color:var(--bg-800)]/60 p-4">
                      {block.text}
                    </p>
                  )
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {project.tags?.map((tag) => {
                  const label = typeof tag === 'string' ? tag : tag?.name
                  if (!label) return null
                  return (
                    <span
                      key={label}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-gray-200"
                    >
                      {label}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
