import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Activity, LifeAreaId } from '@/types'
import { generateId, nowISO } from '@/lib/utils'

interface ActivitiesStore {
  activities: Activity[]
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => Activity
  updateActivity: (id: string, updates: Partial<Activity>) => void
  deleteActivity: (id: string) => void
  getActivitiesForDate: (date: string) => Activity[]
  getActivitiesByArea: (lifeAreaId: LifeAreaId) => Activity[]
  getRecentActivities: (limit?: number) => Activity[]
  getThisWeekActivities: () => Activity[]
}

export const useActivitiesStore = create<ActivitiesStore>()(
  persist(
    (set, get) => ({
      activities: [],

      addActivity: (activity) => {
        const newActivity: Activity = { ...activity, id: generateId(), createdAt: nowISO() }
        set((state) => ({ activities: [newActivity, ...state.activities] }))
        return newActivity
      },

      updateActivity: (id, updates) =>
        set((state) => ({
          activities: state.activities.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),

      deleteActivity: (id) =>
        set((state) => ({ activities: state.activities.filter((a) => a.id !== id) })),

      getActivitiesForDate: (date) => get().activities.filter((a) => a.date === date),

      getActivitiesByArea: (lifeAreaId) => get().activities.filter((a) => a.lifeAreaId === lifeAreaId),

      getRecentActivities: (limit = 10) =>
        [...get().activities].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit),

      getThisWeekActivities: () => {
        const now = new Date()
        const start = new Date(now)
        start.setDate(now.getDate() - now.getDay())
        start.setHours(0, 0, 0, 0)
        const startStr = start.toISOString().split('T')[0]
        const todayStr = now.toISOString().split('T')[0]
        return get().activities.filter((a) => a.date >= startStr && a.date <= todayStr)
      },
    }),
    { name: 'bloom-activities' }
  )
)
