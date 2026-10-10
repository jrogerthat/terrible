import { useEffect, useState } from 'react'
import { Timer } from './components/Timer'
import { ProjectSection } from './components/ProjectSection'


export type Project = {
  id: number
  name: string
}

export type Todo = {
  id: number
  title: string
  description: string
  storyPoints: number | null
  isCompleted: boolean
  createdAt: string
  projectId: number
  projectName: string
}

const PROJECT_COLORS = [
  '#3b63d6',
  '#9b55c6',
  '#f648ac',
  '#eb6a7c',
  '#e28f48'
]


function App() {
  // ---- Timer state ----
  const [seconds, setSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)

  // ---- Todo state ----
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [storyPoints, setStoryPoints] = useState<string>('')

    // ---- Project state ----
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectName, setNewProjectName] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')

  // projectId -> color
  const [projectColors, setProjectColors] = useState<Record<number, string>>({})

  // Timer effect
  useEffect(() => {
    if (!timerRunning) return

    const id = setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)

    return () => clearInterval(id)
  }, [timerRunning])

  const handleStartStop = () => {
    setTimerRunning((running) => !running)
  }

  const handleReset = () => {
    setSeconds(0)
    setTimerRunning(false)
  }

  // ---- API calls ----

  async function fetchTodos() {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/todos')
      if (!res.ok) {
        throw new Error(`Failed to load todos: ${res.status}`)
      }

      const data = (await res.json()) as Todo[]
      setTodos(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

    async function createTodo(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !selectedProjectId) {
      setError('Title, description, and project are required.')
      return
    }

    try {
      setError(null)

      const res = await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          storyPoints: storyPoints === '' ? null : Number(storyPoints),
          projectId: Number(selectedProjectId),
        }),
      })

      if (!res.ok) {
        throw new Error(`Failed to create todo: ${res.status}`)
      }

      const created = (await res.json()) as Todo
      setTodos((prev) => [...prev, created])

      // Clear form
      setTitle('')
      setDescription('')
      setStoryPoints('')
      // keep selectedProjectId as-is, so you can add multiple todos to same project
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  async function completeTodo(id: number) {
    try {
      setError(null)

      const res = await fetch(`/todos/${id}/complete`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error(`Failed to complete todo: ${res.status}`)
      }

      const updated = (await res.json()) as Todo
      setTodos((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t)),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

      async function fetchProjects() {
    try {
      setError(null)

      const res = await fetch('/projects')
      if (!res.ok) {
        throw new Error(`Failed to load projects: ${res.status}`)
      }

      const data = (await res.json()) as Project[]
      setProjects(data)

      // assign colors for any projects that don't have one yet
      setProjectColors((prev) => {
        const next = { ...prev }
        let colorIndex = Object.keys(next).length

        for (const p of data) {
          if (!next[p.id]) {
            next[p.id] = PROJECT_COLORS[colorIndex % PROJECT_COLORS.length]
            colorIndex++
          }
        }

        return next
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }


  async function createProject(e: React.FormEvent) {
    e.preventDefault()

    if (!newProjectName.trim()) {
      setError('Project name is required.')
      return
    }

    try {
      setError(null)

      const res = await fetch('/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName }),
      })

      if (!res.ok) {
        throw new Error(`Failed to create project: ${res.status}`)
      }

      const created = (await res.json()) as Project
      setProjects((prev) => [...prev, created])
      setNewProjectName('')

      // assign a color for this project
      setProjectColors((prev) => {
        if (prev[created.id]) return prev
        const colorIndex = Object.keys(prev).length
        return {
          ...prev,
          [created.id]: PROJECT_COLORS[colorIndex % PROJECT_COLORS.length],
        }
      })

      // If no project selected yet, default to this new one
      if (!selectedProjectId) {
        setSelectedProjectId(String(created.id))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }



useEffect(() => {
  void (async () => {
    await fetchProjects()
    await fetchTodos()
  })()
}, [])


  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1>How Terrible</h1>

      {/* Timer */}
      <Timer />

        <ProjectSection
      projects={projects}
      newProjectName={newProjectName}
      onNewProjectNameChange={setNewProjectName}
      onCreateProject={createProject}
    />

      {/* Todos */}
      <section>
        <h2>Todos</h2>

        {error && (
          <p style={{ color: 'red' }}>
            {error}
          </p>
        )}

        <form onSubmit={createTodo} style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>
              Title
              <br />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>
              Description
              <br />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>
              Story points
              <br />
              <input
                type="number"
                min={0}
                value={storyPoints}
                onChange={(e) => setStoryPoints(e.target.value)}
              />
            </label>
          </div>
                <div style={{ marginBottom: '0.5rem' }}>
        <label>
          Project
          <br />
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            required
            disabled={projects.length === 0}
          >
            <option value="">
              {projects.length === 0 ? 'Create a project first…' : 'Select a project…'}
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      </div>

          <button type="submit">Add todo</button>
        </form>

        <div style={{ marginBottom: '0.5rem' }}>
          <button type="button" onClick={() => void fetchTodos()}>
            Refresh todos
          </button>
        </div>

        {loading && <p>Loading…</p>}

        {!loading && todos.length === 0 && <p>No todos yet.</p>}

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => {
            const color = projectColors[todo.projectId] ?? 'transparent'
            return(
            <li
              key={todo.id}
              style={{
                border: '1px solid #ccc',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                opacity: todo.isCompleted ? 0.6 : 1,
                backgroundColor: color + '33', // 33 = ~20% alpha if you want a light tint
              }}
            >
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{todo.title}</strong>
                  <span>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: projectColors[todo.projectId] ?? '#ccc',
                        marginRight: 4,
                        verticalAlign: 'middle',
                      }}
                    />
                    {todo.projectName}
                    {todo.storyPoints != null && ` • SP: ${todo.storyPoints}`}
                  </span>
                </div>

              <p>{todo.description}</p>
              <small>
                Created at:{' '}
                {new Date(todo.createdAt).toLocaleString()}
              </small>
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="button"
                  disabled={todo.isCompleted}
                  onClick={() => void completeTodo(todo.id)}
                >
                  {todo.isCompleted ? 'Completed' : 'Mark complete'}
                </button>
              </div>
            </li>
          )}
          )}
        </ul>
      </section>
    </main>
  )
}

export default App