import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserPreferences } from '@/types'
import { DEFAULT_LIFE_AREAS, AFFIRMATIONS } from '@/lib/constants'
import { getRandomItem, nowISO } from '@/lib/utils'

interface UserStore {
  preferences: UserPreferences
  todayAffirmation: string
  updatePreferences: (updates: Partial<UserPreferences>) => void
  setDisplayName: (name: string) => void
  refreshAffirmation: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      preferences: {
        displayName: 'Friend',
        greeting: '',
        affirmation: '',
        showMyLifeCard: false,
        dashboardLayout: 'expanded',
        lifeAreas: DEFAULT_LIFE_AREAS,
        currency: 'INR',
        createdAt: nowISO(),
      },
      todayAffirmation: getRandomItem(AFFIRMATIONS),
      updatePreferences: (updates) =>
        set((state) => ({ preferences: { ...state.preferences, ...updates } })),
      setDisplayName: (name) =>
        set((state) => ({ preferences: { ...state.preferences, displayName: name } })),
      refreshAffirmation: () => set({ todayAffirmation: getRandomItem(AFFIRMATIONS) }),
    }),
    { name: 'bloom-user' }
  )
)
