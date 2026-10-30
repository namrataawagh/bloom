import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MoodLog } from '@/types'
import { generateId, nowISO } from '@/lib/utils'

interface MoodStore {
  logs: MoodLog[]
  logMood: (log: Omit<MoodLog, 'id' | 'createdAt'>) => MoodLog
  updateLog: (id: string, updates: Partial<MoodLog>) => void
  deleteLog: (id: string) => void
  getLogForDate: (date: string) => MoodLog | undefined
  getRecentLogs: (days?: number) => MoodLog[]
}

export const useMoodStore = create<MoodStore>()(
  persist(
    (set, get) => ({
      logs: [],

      logMood: (log) => {
        const existing = get().logs.find((l) => l.date === log.date)
        if (existing) {
          const updated = { ...existing, ...log }
          set((state) => ({ logs: state.logs.map((l) => (l.id === existing.id ? updated : l)) }))
          return updated
        }
        const newLog: MoodLog = { ...log, id: generateId(), createdAt: nowISO() }
        set((state) => ({ logs: [newLog, ...state.logs] }))
        return newLog
      },

      updateLog: (id, updates) =>
        set((state) => ({ logs: state.logs.map((l) => (l.id === id ? { ...l, ...updates } : l)) })),

      deleteLog: (id) =>
        set((state) => ({ logs: state.logs.filter((l) => l.id !== id) })),

      getLogForDate: (date) => get().logs.find((l) => l.date === date),

      getRecentLogs: (days = 30) => {
        const cutoff = new Date()
        cutoff.setDate(cutoff.getDate() - days)
        const cutoffStr = cutoff.toISOString().split('T')[0]
        return [...get().logs].filter((l) => l.date >= cutoffStr).sort((a, b) => b.date.localeCompare(a.date))
      },
    }),
    { name: 'bloom-mood' }
  )
)
