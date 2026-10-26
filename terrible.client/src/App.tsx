import { useEffect, useState } from 'react'
import { Timer } from './components/Timer'
import { ProjectSection } from './components/ProjectSection'
import { TodoSection } from './components/TodoSection'


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
      <div style={{display:'flex', flexDirection:'row', gap:'5px'}}>
        <div>
       <ProjectSection
      projects={projects}
      newProjectName={newProjectName}
      onNewProjectNameChange={setNewProjectName}
      onCreateProject={createProject}
    /></div>
      <div><h1>How Terrible</h1>
      {/* Timer */}
      <Timer /></div>
      
      <div>
            <TodoSection
        todos={todos}
        loading={loading}
        error={error}
        title={title}
        description={description}
        storyPoints={storyPoints}
        selectedProjectId={selectedProjectId}
        projects={projects}
        projectColors={projectColors}
        onTitleChange={setTitle}
        onDescriptionChange={setDescription}
        onStoryPointsChange={setStoryPoints}
        onSelectedProjectChange={setSelectedProjectId}
        onCreateTodo={createTodo}
        onRefreshTodos={() => void fetchTodos()}
        onCompleteTodo={completeTodo}
      />
      </div>
    </div>
    </main>
  )
}

export default App