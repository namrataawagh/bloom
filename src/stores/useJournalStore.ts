import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { JournalEntry } from '@/types'
import { generateId, nowISO } from '@/lib/utils'

interface JournalStore {
  entries: JournalEntry[]
  draft: Partial<JournalEntry> | null
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => JournalEntry
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void
  deleteEntry: (id: string) => void
  saveDraft: (draft: Partial<JournalEntry>) => void
  clearDraft: () => void
  getEntriesForDate: (date: string) => JournalEntry[]
  searchEntries: (query: string) => JournalEntry[]
}

export const useJournalStore = create<JournalStore>()(
  persist(
    (set, get) => ({
      entries: [],
      draft: null,

      addEntry: (entry) => {
        const newEntry: JournalEntry = { ...entry, id: generateId(), createdAt: nowISO(), updatedAt: nowISO() }
        set((state) => ({ entries: [newEntry, ...state.entries], draft: null }))
        return newEntry
      },

      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates, updatedAt: nowISO() } : e)),
        })),

      deleteEntry: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),

      saveDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: null }),
      getEntriesForDate: (date) => get().entries.filter((e) => e.entryDate === date),

      searchEntries: (query) => {
        const q = query.toLowerCase()
        return get().entries.filter(
          (e) =>
            e.title?.toLowerCase().includes(q) ||
            e.content.toLowerCase().includes(q) ||
            e.tags.some((t) => t.toLowerCase().includes(q))
        )
      },
    }),
    { name: 'bloom-journal' }
  )
)
