import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Habit, HabitLog, HabitLogStatus } from '@/types'
import { generateId, nowISO } from '@/lib/utils'

interface HabitsStore {
  habits: Habit[]
  logs: HabitLog[]
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Habit
  updateHabit: (id: string, updates: Partial<Habit>) => void
  deleteHabit: (id: string) => void
  logHabit: (habitId: string, date: string, status: HabitLogStatus, note?: string) => void
  getLogForDate: (habitId: string, date: string) => HabitLog | undefined
  getLogsForDate: (date: string) => HabitLog[]
  getHabitsForDate: (date: string) => Habit[]
  getStreakCount: (habitId: string) => number
  getCompletionRate: (habitId: string, days: number) => number
}

export const useHabitsStore = create<HabitsStore>()(
  persist(
    (set, get) => ({
      habits: [],
      logs: [],

      addHabit: (habit) => {
        const newHabit: Habit = { ...habit, id: generateId(), createdAt: nowISO() }
        set((state) => ({ habits: [newHabit, ...state.habits] }))
        return newHabit
      },

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          logs: state.logs.filter((l) => l.habitId !== id),
        })),

      logHabit: (habitId, date, status, note) => {
        const existing = get().logs.find((l) => l.habitId === habitId && l.date === date)
        if (existing) {
          set((state) => ({
            logs: state.logs.map((l) => (l.id === existing.id ? { ...l, status, note } : l)),
          }))
        } else {
          const newLog: HabitLog = { id: generateId(), habitId, date, status, note, createdAt: nowISO() }
          set((state) => ({ logs: [newLog, ...state.logs] }))
        }
      },

      getLogForDate: (habitId, date) =>
        get().logs.find((l) => l.habitId === habitId && l.date === date),

      getLogsForDate: (date) => get().logs.filter((l) => l.date === date),

      getHabitsForDate: (date) => {
        const dayOfWeek = new Date(date + 'T00:00:00').getDay()
        return get().habits.filter((h) => {
          if (h.status !== 'active') return false
          if (h.startDate > date) return false
          if (h.endDate && h.endDate < date) return false
          if (h.frequency === 'daily') return true
          if (h.frequency === 'custom') return h.selectedDays.includes(dayOfWeek)
          return true
        })
      },

      getStreakCount: (habitId) => {
        const logs = get().logs.filter((l) => l.habitId === habitId).sort((a, b) => b.date.localeCompare(a.date))
        let streak = 0
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        for (let i = 0; i < 365; i++) {
          const dateStr = date.toISOString().split('T')[0]
          const log = logs.find((l) => l.date === dateStr)
          if (log && log.status === 'completed') {
            streak++
          } else if (i > 0) {
            break
          }
          date.setDate(date.getDate() - 1)
        }
        return streak
      },

      getCompletionRate: (habitId, days) => {
        const logs = get().logs.filter((l) => l.habitId === habitId)
        const completed = logs.filter((l) => l.status === 'completed').length
        return days > 0 ? Math.round((completed / days) * 100) : 0
      },
    }),
    { name: 'bloom-habits' }
  )
)
