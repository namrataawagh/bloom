import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Goal, GoalMilestone, LifeAreaId } from '@/types'
import { generateId, nowISO } from '@/lib/utils'

interface GoalsStore {
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'milestones'>) => Goal
  updateGoal: (id: string, updates: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  addMilestone: (goalId: string, milestone: Omit<GoalMilestone, 'id' | 'goalId' | 'createdAt'>) => void
  updateMilestone: (goalId: string, milestoneId: string, updates: Partial<GoalMilestone>) => void
  deleteMilestone: (goalId: string, milestoneId: string) => void
  getGoalsByArea: (lifeAreaId: LifeAreaId) => Goal[]
  getActiveGoals: () => Goal[]
  getPinnedGoals: () => Goal[]
}

export const useGoalsStore = create<GoalsStore>()(
  persist(
    (set, get) => ({
      goals: [],

      addGoal: (goal) => {
        const newGoal: Goal = { ...goal, id: generateId(), milestones: [], createdAt: nowISO(), updatedAt: nowISO() }
        set((state) => ({ goals: [newGoal, ...state.goals] }))
        return newGoal
      },

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates, updatedAt: nowISO() } : g)),
        })),

      deleteGoal: (id) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

      addMilestone: (goalId, milestone) => {
        const newMs: GoalMilestone = { ...milestone, id: generateId(), goalId, isCompleted: false, createdAt: nowISO() }
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId ? { ...g, milestones: [...g.milestones, newMs], updatedAt: nowISO() } : g
          ),
        }))
      },

      updateMilestone: (goalId, milestoneId, updates) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  milestones: g.milestones.map((m) =>
                    m.id === milestoneId
                      ? { ...m, ...updates, completedAt: updates.isCompleted ? nowISO() : m.completedAt }
                      : m
                  ),
                  updatedAt: nowISO(),
                }
              : g
          ),
        })),

      deleteMilestone: (goalId, milestoneId) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? { ...g, milestones: g.milestones.filter((m) => m.id !== milestoneId), updatedAt: nowISO() }
              : g
          ),
        })),

      getGoalsByArea: (lifeAreaId) => get().goals.filter((g) => g.lifeAreaId === lifeAreaId),
      getActiveGoals: () => get().goals.filter((g) => g.status === 'in_progress' || g.status === 'not_started'),
      getPinnedGoals: () => get().goals.filter((g) => g.isPinned),
    }),
    { name: 'bloom-goals' }
  )
)
