import { useState } from 'react'
import { Plus, Camera, MapPin, Heart, Star, Trash2, Pencil } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { todayISO, generateId, nowISO, formatDate, cn } from '@/lib/utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Memory {
  id: string; title: string; description: string; date: string
  location?: string; tags: string[]; isFavourite: boolean; createdAt: string
}
interface MemoryStore {
  memories: Memory[]
  add: (m: Omit<Memory, 'id' | 'createdAt'>) => void
  update: (id: string, u: Partial<Memory>) => void
  delete: (id: string) => void
  toggleFav: (id: string) => void
}

const useMemoryStore = create<MemoryStore>()(persist((set) => ({
  memories: [],
  add: (m) => set((s) => ({ memories: [{ ...m, id: generateId(), createdAt: nowISO() }, ...s.memories] })),
  update: (id, u) => set((s) => ({ memories: s.memories.map((m) => m.id === id ? { ...m, ...u } : m) })),
  delete: (id) => set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),
  toggleFav: (id) => set((s) => ({ memories: s.memories.map((m) => m.id === id ? { ...m, isFavourite: !m.isFavourite } : m) })),
}), { name: 'bloom-memories' }))

function MemoryForm({ memory, onSave, onCancel }: { memory?: Memory; onSave: (d: any) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(memory?.title || '')
  const [description, setDescription] = useState(memory?.description || '')
  const [date, setDate] = useState(memory?.date || todayISO())
  const [location, setLocation] = useState(memory?.location || '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(memory?.tags || [])

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) { e.preventDefault(); setTags((prev) => [...new Set([...prev, tagInput.trim()])]); setTagInput('') }
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!title.trim()) return; onSave({ title, description, date, location, tags, isFavourite: memory?.isFavourite || false }) }} className="space-y-3">
      <Input label="Memory title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Solo trip to Pondicherry, First time trying pottery..." />
      <Textarea label="What do you want to remember?" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="The sights, sounds, feelings, people, tiny details..." />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input label="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Goa, Home kitchen" />
      </div>
      <div className="space-y-1.5">
        <label className="text-body-sm font-medium text-graphite">Tags</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-mint/20 text-graphite rounded-pill text-xs font-medium cursor-pointer hover:bg-papaya/10 hover:text-papaya transition-colors" onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}>#{tag} ×</span>
          ))}
        </div>
        <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Type a tag and press Enter" className="w-full h-9 px-3 text-sm rounded-xl border border-ash bg-white text-ink placeholder:text-stone focus:outline-none focus:ring-1 focus:ring-ink/10/10 transition-all" />
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1">{memory ? 'Update Memory' : 'Save Memory'}</Button>
      </div>
    </form>
  )
}

export function Memories() {
  const { memories, add, update, delete: del, toggleFav } = useMemoryStore()
  const [showForm, setShowForm] = useState(false)
  const [editMemory, setEditMemory] = useState<Memory | null>(null)
  const [filterFav, setFilterFav] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = memories
    .filter((m) => !filterFav || m.isFavourite)
    .filter((m) => !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => b.date.localeCompare(a.date))

  const favCount = memories.filter((m) => m.isFavourite).length

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader title="Memories" description="Collect the moments that make your life rich. Every experience counts."
        actions={<Button variant="primary" size="sm" onClick={() => { setShowForm(true); setEditMemory(null) }}><Plus className="h-4 w-4" /> Add memory</Button>} />

      {memories.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Memories saved', value: memories.length,   accent: 'bg-periwinkle/20' },
            { label: 'Favourites',     value: favCount,           accent: 'bg-marigold/20'   },
            { label: 'This year',      value: memories.filter((m) => m.date.startsWith(new Date().getFullYear().toString())).length, accent: 'bg-mint/20' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-3xl border border-ash p-4 text-center shadow-craft-xl">
              <div className={`w-8 h-8 rounded-xl ${s.accent} mx-auto mb-2`} />
              <div className="text-subheading font-semibold text-ink font-sans leading-none">{s.value}</div>
              <div className="text-caption text-stone mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editMemory) && (
        <Card>
          <CardHeader><CardTitle>{editMemory ? 'Edit Memory' : 'Capture a Memory'}</CardTitle></CardHeader>
          <CardContent>
            <MemoryForm
              memory={editMemory || undefined}
              onSave={(data) => { editMemory ? update(editMemory.id, data) : add(data); setShowForm(false); setEditMemory(null) }}
              onCancel={() => { setShowForm(false); setEditMemory(null) }}
            />
          </CardContent>
        </Card>
      )}

      {/* Search + filter */}
      {memories.length > 0 && (
        <div className="flex gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search memories or tags..."
            className="flex-1 h-10 px-4 text-sm rounded-xl border border-ash bg-white text-ink placeholder:text-stone focus:outline-none focus:ring-1 focus:ring-ink/10/10 transition-all" />
          <button onClick={() => setFilterFav(!filterFav)}
            className={cn('px-4 h-10 rounded-xl text-body-sm font-medium border transition-all', filterFav ? 'bg-marigold/10 border-ash text-graphite' : 'border-ash text-stone hover:border-stone bg-white')}>
            Favourites
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState icon={Camera} title="Start your memory collection" description="Log experiences, trips, firsts, and ordinary moments that feel worth keeping. This is your life's highlight reel."
          action={<Button variant="primary" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Save your first memory</Button>} />
      ) : (
        <div className="space-y-4">
          {filtered.map((memory) => (
            <Card key={memory.id} className={cn(memory.isFavourite && 'border-ash bg-marigold/10')}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-ink">{memory.title}</h3>
                      {memory.isFavourite && <Heart className="h-3.5 w-3.5 text-graphite fill-current" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone mb-2">
                      <span>{formatDate(memory.date)}</span>
                      {memory.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{memory.location}</span>}
                    </div>
                    {memory.description && <p className="text-sm text-graphite mb-3">{memory.description}</p>}
                    {memory.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {memory.tags.map((tag) => <span key={tag} className="text-xs px-2 py-0.5 bg-mint/20 text-graphite rounded-pill">#{tag}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => toggleFav(memory.id)} className={cn('p-1.5 rounded-lg transition-all', memory.isFavourite ? 'text-graphite hover:text-graphite' : 'text-stone hover:text-graphite')}><Heart className="h-4 w-4" /></button>
                    <button onClick={() => { setEditMemory(memory); setShowForm(false) }} className="p-1.5 rounded-lg text-stone hover:text-graphite hover:bg-linen transition-all"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => del(memory.id)} className="p-1.5 rounded-lg text-stone hover:text-papaya hover:bg-papaya/10 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
