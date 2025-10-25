import React from 'react'
import ProjectCard from './ProjectCard'

export default function ProjectsGrid({ projects, onSelect }) {
  if (!Array.isArray(projects) || !projects.length) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[color:var(--bg-800)]/40 p-10 text-center text-sm text-gray-300">
        Projects will appear here soon. Our team is preparing fresh highlights.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onReadMore={onSelect} />
      ))}
    </div>
  )
}

ProjectsGrid.defaultProps = {
  projects: [],
  onSelect: () => {},
}
