import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthUser {
  username: string
  passcode: string // stored plain-text for simplicity; this is a personal local app
}

interface AuthStore {
  users: AuthUser[]
  currentUser: string | null
  login: (username: string, passcode: string) => boolean
  logout: () => void
  register: (username: string, passcode: string) => 'ok' | 'exists' | 'too_short'
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      login: (username, passcode) => {
        const user = get().users.find(
          (u) => u.username.toLowerCase() === username.toLowerCase() && u.passcode === passcode
        )
        if (user) {
          set({ currentUser: user.username })
          return true
        }
        return false
      },

      logout: () => set({ currentUser: null }),

      register: (username, passcode) => {
        const trimmed = username.trim()
        if (trimmed.length < 2 || passcode.length < 3) return 'too_short'
        const exists = get().users.some((u) => u.username.toLowerCase() === trimmed.toLowerCase())
        if (exists) return 'exists'
        set((s) => ({ users: [...s.users, { username: trimmed, passcode }] }))
        return 'ok'
      },
    }),
    { name: 'bloom-auth' }
  )
)
