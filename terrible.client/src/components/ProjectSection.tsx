import type { Project } from '../App'

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
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2>Projects</h2>

      <form onSubmit={onCreateProject} style={{ marginBottom: '1rem' }}>
        <label>
          Name
          <br />
          <input
            value={newProjectName}
            onChange={(e) => onNewProjectNameChange(e.target.value)}
            required
          />
        </label>
        <button type="submit" style={{ marginLeft: '0.5rem' }}>
          Add project
        </button>
      </form>

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {projects.map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      )}
    </section>
  )
}