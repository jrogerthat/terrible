import { useState } from 'react'
import type { Project } from '../App'
import { Button } from './buttons'

interface ProjectSectionProps {
  projects: Project[]
  newProjectName: string
  onNewProjectNameChange: (value: string) => void
  onCreateProject: (e: React.FormEvent) => void
}

export function ProjectSection({
  projects,
  newProjectName,
  onNewProjectNameChange,
  onCreateProject,
}: ProjectSectionProps) {
  const [showForm, setShowForm] = useState(false)

  const hasProjects = projects.length > 0

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Projects</h2>

      {hasProjects ? (
        <ul style={{ marginBottom: '0.75rem' }}>
          {projects.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      ) : (
        <p style={{ marginBottom: '0.75rem' }}>No projects yet.</p>
      )}

      {/* Only button, always says "Add project" */}
      <Button
        className="btn btn-primary"
        type="button"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Cancel" : "Add project"}
      </Button>

      {showForm && (
        <form
          onSubmit={onCreateProject}
          style={{ marginTop: '0.75rem' }}
        >
          <label>
            Name
            <br />
            <input
              value={newProjectName}
              onChange={(e) => onNewProjectNameChange(e.target.value)}
              required
            />
          </label>
          <Button type="submit" className="btn btn-primary" style={{ marginLeft: '0.5rem' }}>
            Save
          </Button>
        </form>
      )}
    </section>
  )
}
