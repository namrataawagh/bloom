import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId, nowISO } from '@/lib/utils'
import { format, startOfWeek } from 'date-fns'

export type SidequestCategory =
  | 'hobbies'
  | 'just-for-me'
  | 'sidequesting'
  | 'to-dos'
  | 'to-explore'
  | 'to-eat'

export const SIDEQUEST_CATEGORIES: { value: SidequestCategory; label: string }[] = [
  { value: 'hobbies',      label: 'Hobbies'      },
  { value: 'just-for-me',  label: 'Just for Me'  },
  { value: 'sidequesting', label: 'Sidequesting'  },
  { value: 'to-dos',       label: 'To Dos'        },
  { value: 'to-explore',   label: 'To Explore'    },
  { value: 'to-eat',       label: 'To Eat'        },
]

export const SIDEQUEST_CATEGORY_COLORS: Record<SidequestCategory, string> = {
  'hobbies':      '#9bd8a9',
  'just-for-me':  '#b8caf5',
  'sidequesting': '#fde99b',
  'to-dos':       '#e1e1e1',
  'to-explore':   '#9ed4ef',
  'to-eat':       '#fde99b',
}

export interface Sidequest {
  id: string
  category: SidequestCategory
  title: string
  notes?: string
  completedWeeks: string[] // 'YYYY-Www' ISO week keys
  createdAt: string
}

function currentWeekKey(): string {
  return format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-ww')
}

interface SidequestStore {
  sidequests: Sidequest[]
  addSidequest: (s: Omit<Sidequest, 'id' | 'createdAt' | 'completedWeeks'>) => void
  updateSidequest: (id: string, updates: Partial<Sidequest>) => void
  deleteSidequest: (id: string) => void
  toggleWeek: (id: string, weekKey?: string) => void
  isCompletedThisWeek: (id: string) => boolean
}

export const useSidequestStore = create<SidequestStore>()(persist((set, get) => ({
  sidequests: [],

  addSidequest: (s) => set((st) => ({
    sidequests: [...st.sidequests, { ...s, id: generateId(), completedWeeks: [], createdAt: nowISO() }]
  })),

  updateSidequest: (id, updates) => set((st) => ({
    sidequests: st.sidequests.map((s) => s.id === id ? { ...s, ...updates } : s)
  })),

  deleteSidequest: (id) => set((st) => ({ sidequests: st.sidequests.filter((s) => s.id !== id) })),

  toggleWeek: (id, weekKey) => {
    const key = weekKey || currentWeekKey()
    set((st) => ({
      sidequests: st.sidequests.map((s) => {
        if (s.id !== id) return s
        const has = s.completedWeeks.includes(key)
        return { ...s, completedWeeks: has ? s.completedWeeks.filter((w) => w !== key) : [...s.completedWeeks, key] }
      })
    }))
  },

  isCompletedThisWeek: (id) => {
    const key = currentWeekKey()
    const s = get().sidequests.find((sq) => sq.id === id)
    return s?.completedWeeks.includes(key) ?? false
  },
}), { name: 'bloom-sidequests' }))
