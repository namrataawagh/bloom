import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId, nowISO } from '@/lib/utils'

// ─── Food ───────────────────────────────────────────────────────────────────
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'

export interface FoodLog {
  id: string
  date: string
  mealType: MealType
  description: string
  notes?: string
  createdAt: string
}

// ─── Exercise ────────────────────────────────────────────────────────────────
export interface ExerciseItem {
  id: string
  name: string
  category: string
}

export interface RoutineExercise {
  exerciseId: string
  sets?: number
  reps?: number
  durationMinutes?: number
}

export interface Routine {
  id: string
  name: string
  exercises: RoutineExercise[]
  createdAt: string
}

export interface WorkoutLog {
  id: string
  date: string
  routineId?: string
  routineName?: string
  notes?: string
  durationMinutes?: number
  rating?: number
  createdAt: string
}

// ─── Sleep ───────────────────────────────────────────────────────────────────
export interface SleepLog {
  id: string
  date: string      // night of (YYYY-MM-DD)
  sleepTime: string // HH:MM
  wakeTime: string  // HH:MM
  hoursSlept?: number
  quality?: 1 | 2 | 3 | 4 | 5
  notes?: string
  createdAt: string
}

// ─── Store ───────────────────────────────────────────────────────────────────
interface HealthExtStore {
  // Food
  foodLogs: FoodLog[]
  addFoodLog: (log: Omit<FoodLog, 'id' | 'createdAt'>) => void
  deleteFoodLog: (id: string) => void

  // Exercise library
  exercises: ExerciseItem[]
  addExercise: (name: string, category: string) => void
  deleteExercise: (id: string) => void

  // Routines
  routines: Routine[]
  addRoutine: (name: string, exercises: RoutineExercise[]) => void
  updateRoutine: (id: string, name: string, exercises: RoutineExercise[]) => void
  deleteRoutine: (id: string) => void

  // Workout logs
  workoutLogs: WorkoutLog[]
  addWorkoutLog: (log: Omit<WorkoutLog, 'id' | 'createdAt'>) => void
  deleteWorkoutLog: (id: string) => void

  // Sleep
  sleepLogs: SleepLog[]
  addSleepLog: (log: Omit<SleepLog, 'id' | 'createdAt'>) => void
  updateSleepLog: (id: string, updates: Partial<SleepLog>) => void
  deleteSleepLog: (id: string) => void
}

function calcHours(sleep: string, wake: string): number {
  const [sh, sm] = sleep.split(':').map(Number)
  const [wh, wm] = wake.split(':').map(Number)
  let diff = (wh * 60 + wm) - (sh * 60 + sm)
  if (diff < 0) diff += 24 * 60 // crossed midnight
  return Math.round((diff / 60) * 10) / 10
}

export const useHealthExtStore = create<HealthExtStore>()(persist((set) => ({
  foodLogs: [],
  addFoodLog: (log) => set((s) => ({ foodLogs: [{ ...log, id: generateId(), createdAt: nowISO() }, ...s.foodLogs] })),
  deleteFoodLog: (id) => set((s) => ({ foodLogs: s.foodLogs.filter((l) => l.id !== id) })),

  exercises: [
    { id: '1', name: 'Push-ups', category: 'Strength' },
    { id: '2', name: 'Squats', category: 'Strength' },
    { id: '3', name: 'Running', category: 'Cardio' },
    { id: '4', name: 'Plank', category: 'Core' },
    { id: '5', name: 'Yoga flow', category: 'Flexibility' },
    { id: '6', name: 'Pull-ups', category: 'Strength' },
    { id: '7', name: 'Cycling', category: 'Cardio' },
    { id: '8', name: 'Walk', category: 'Cardio' },
  ],
  addExercise: (name, category) => set((s) => ({ exercises: [...s.exercises, { id: generateId(), name, category }] })),
  deleteExercise: (id) => set((s) => ({ exercises: s.exercises.filter((e) => e.id !== id) })),

  routines: [],
  addRoutine: (name, exercises) => set((s) => ({ routines: [...s.routines, { id: generateId(), name, exercises, createdAt: nowISO() }] })),
  updateRoutine: (id, name, exercises) => set((s) => ({ routines: s.routines.map((r) => r.id === id ? { ...r, name, exercises } : r) })),
  deleteRoutine: (id) => set((s) => ({ routines: s.routines.filter((r) => r.id !== id) })),

  workoutLogs: [],
  addWorkoutLog: (log) => set((s) => ({ workoutLogs: [{ ...log, id: generateId(), createdAt: nowISO() }, ...s.workoutLogs] })),
  deleteWorkoutLog: (id) => set((s) => ({ workoutLogs: s.workoutLogs.filter((l) => l.id !== id) })),

  sleepLogs: [],
  addSleepLog: (log) => set((s) => ({ sleepLogs: [{ ...log, hoursSlept: calcHours(log.sleepTime, log.wakeTime), id: generateId(), createdAt: nowISO() }, ...s.sleepLogs] })),
  updateSleepLog: (id, updates) => set((s) => ({ sleepLogs: s.sleepLogs.map((l) => l.id === id ? { ...l, ...updates, hoursSlept: updates.sleepTime || updates.wakeTime ? calcHours(updates.sleepTime || l.sleepTime, updates.wakeTime || l.wakeTime) : l.hoursSlept } : l) })),
  deleteSleepLog: (id) => set((s) => ({ sleepLogs: s.sleepLogs.filter((l) => l.id !== id) })),
}), { name: 'bloom-health-ext' }))
