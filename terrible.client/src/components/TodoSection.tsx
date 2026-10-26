import type { Project, Todo } from '../App'
import { useState } from 'react'
import { Button } from './buttons'

interface TodoSectionProps {
  todos: Todo[]
  loading: boolean
  error: string | null

  // form fields
  title: string
  description: string
  storyPoints: string
  selectedProjectId: string

  // data
  projects: Project[]
  projectColors: Record<number, string>

  // handlers
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onStoryPointsChange: (value: string) => void
  onSelectedProjectChange: (value: string) => void
  onCreateTodo: (e: React.FormEvent) => void
  onRefreshTodos: () => void
  onCompleteTodo: (id: number) => void
}

export function TodoSection({
  todos,
  loading,
  error,
  title,
  description,
  storyPoints,
  selectedProjectId,
  projects,
  projectColors,
  onTitleChange,
  onDescriptionChange,
  onStoryPointsChange,
  onSelectedProjectChange,
  onCreateTodo,
  onRefreshTodos,
  onCompleteTodo,
}: TodoSectionProps) {
  const [showForm, setShowForm] = useState(false)

  return (
    <section>
      <h2>Todos</h2>

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}

      {/* Toggle button to show/hide form */}
      <Button
        type="button"
        onClick={() => setShowForm((prev) => !prev)}
        style={{ marginBottom: '0.75rem' }}
      >
        Add todo
      </Button>

      {showForm && (
        <form onSubmit={onCreateTodo} style={{ marginBottom: '1.5rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>
              Title
              <br />
              <input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
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
                onChange={(e) => onDescriptionChange(e.target.value)}
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
                onChange={(e) => onStoryPointsChange(e.target.value)}
              />
            </label>
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>
              Project
              <br />
              <select
                value={selectedProjectId}
                onChange={(e) => onSelectedProjectChange(e.target.value)}
                required
                disabled={projects.length === 0}
              >
                <option value="">
                  {projects.length === 0
                    ? 'Create a project first…'
                    : 'Select a project…'}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Button type="submit">Save todo</Button>
        </form>
      )}

      <div style={{ marginBottom: '0.5rem' }}>
        <Button type="button" onClick={onRefreshTodos}>
          Refresh todos
        </Button>
      </div>

      {loading && <p>Loading…</p>}

      {!loading && todos.length === 0 && <p>No todos yet.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map((todo) => {
          const color = projectColors[todo.projectId] ?? 'transparent'
          return (
            <li
              key={todo.id}
              style={{
                border: '1px solid #ccc',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                opacity: todo.isCompleted ? 0.6 : 1,
                backgroundColor: color + '33', // light tint
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
                      backgroundColor:
                        projectColors[todo.projectId] ?? '#ccc',
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
                Created at: {new Date(todo.createdAt).toLocaleString()}
              </small>
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="button"
                  disabled={todo.isCompleted}
                  onClick={() => onCompleteTodo(todo.id)}
                >
                  {todo.isCompleted ? 'Completed' : 'Mark complete'}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}