import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, LifeAreaId } from '@/types'
import { generateId, nowISO } from '@/lib/utils'

interface TasksStore {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  completeTask: (id: string) => void
  getTasksForDate: (date: string) => Task[]
  getTasksByArea: (lifeAreaId: LifeAreaId) => Task[]
  getTodayTasks: () => Task[]
}

export const useTasksStore = create<TasksStore>()(
  persist(
    (set, get) => ({
      tasks: [],

      addTask: (task) => {
        const newTask: Task = { ...task, id: generateId(), createdAt: nowISO() }
        set((state) => ({ tasks: [newTask, ...state.tasks] }))
        return newTask
      },

      updateTask: (id, updates) =>
        set((state) => ({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),

      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: 'completed', completedAt: nowISO() } : t)),
        })),

      getTasksForDate: (date) =>
        get().tasks.filter((t) => t.dueDate === date && t.status !== 'completed'),

      getTasksByArea: (lifeAreaId) => get().tasks.filter((t) => t.lifeAreaId === lifeAreaId),

      getTodayTasks: () => {
        const today = new Date().toISOString().split('T')[0]
        return get().tasks.filter(
          (t) => t.status !== 'completed' && t.status !== 'cancelled' && (!t.dueDate || t.dueDate <= today)
        )
      },
    }),
    { name: 'bloom-tasks' }
  )
)
