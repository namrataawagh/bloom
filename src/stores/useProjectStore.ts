import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId, nowISO } from '@/lib/utils'

export interface ProjectTask {
  id: string
  title: string
  isCompleted: boolean
}

export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed'

export interface Project {
  id: string
  title: string
  description: string
  status: ProjectStatus
  progress: number // 0-100
  startDate: string
  targetDate?: string
  tasks: ProjectTask[]
  createdAt: string
  updatedAt: string
}

interface ProjectStore {
  projects: Project[]
  addProject: (p: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  toggleTask: (projectId: string, taskId: string) => void
  addTask: (projectId: string, title: string) => void
  deleteTask: (projectId: string, taskId: string) => void
  setProgress: (projectId: string, progress: number) => void
}

export const useProjectStore = create<ProjectStore>()(persist((set) => ({
  projects: [],

  addProject: (p) => set((s) => ({
    projects: [{ ...p, id: generateId(), createdAt: nowISO(), updatedAt: nowISO() }, ...s.projects]
  })),

  updateProject: (id, updates) => set((s) => ({
    projects: s.projects.map((p) => p.id === id ? { ...p, ...updates, updatedAt: nowISO() } : p)
  })),

  deleteProject: (id) => set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

  toggleTask: (projectId, taskId) => set((s) => ({
    projects: s.projects.map((p) => {
      if (p.id !== projectId) return p
      const tasks = p.tasks.map((t) => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)
      const completed = tasks.filter((t) => t.isCompleted).length
      const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : p.progress
      return { ...p, tasks, progress, updatedAt: nowISO() }
    })
  })),

  addTask: (projectId, title) => set((s) => ({
    projects: s.projects.map((p) => p.id !== projectId ? p : {
      ...p,
      tasks: [...p.tasks, { id: generateId(), title, isCompleted: false }],
      updatedAt: nowISO(),
    })
  })),

  deleteTask: (projectId, taskId) => set((s) => ({
    projects: s.projects.map((p) => p.id !== projectId ? p : {
      ...p,
      tasks: p.tasks.filter((t) => t.id !== taskId),
      updatedAt: nowISO(),
    })
  })),

  setProgress: (projectId, progress) => set((s) => ({
    projects: s.projects.map((p) => p.id === projectId ? { ...p, progress, updatedAt: nowISO() } : p)
  })),
}), { name: 'bloom-projects' }))
