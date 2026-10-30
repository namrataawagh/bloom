import { useState } from 'react'
import { Plus, Users, Heart, Calendar, Pencil, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDate, generateId, nowISO, todayISO, cn } from '@/lib/utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Friend {
  id: string; displayName: string; relationshipCategory: string
  birthday?: string; interests: string; notes: string
  lastCatchUp?: string; upcomingPlan?: string; createdAt: string; updatedAt: string
}
interface FriendStore {
  friends: Friend[]
  add: (f: Omit<Friend, 'id' | 'createdAt' | 'updatedAt'>) => void
  update: (id: string, u: Partial<Friend>) => void
  delete: (id: string) => void
}

const useFriendsStore = create<FriendStore>()(persist((set) => ({
  friends: [],
  add: (f) => set((s) => ({ friends: [{ ...f, id: generateId(), createdAt: nowISO(), updatedAt: nowISO() }, ...s.friends] })),
  update: (id, u) => set((s) => ({ friends: s.friends.map((f) => f.id === id ? { ...f, ...u, updatedAt: nowISO() } : f) })),
  delete: (id) => set((s) => ({ friends: s.friends.filter((f) => f.id !== id) })),
}), { name: 'bloom-friendships' }))

const categories = ['Close friend', 'Good friend', 'Acquaintance', 'Family', 'Colleague', 'Mentor']

function FriendCard({ friend, onEdit, onDelete }: { friend: Friend; onEdit: () => void; onDelete: () => void }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-marigold/20 flex items-center justify-center shrink-0">
              <span className="text-lg font-semibold text-graphite">{friend.displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="font-semibold text-ink">{friend.displayName}</p>
                <Badge variant="stone" size="sm">{friend.relationshipCategory}</Badge>
              </div>
              {friend.interests && <p className="text-sm text-stone mb-1">Interests: {friend.interests}</p>}
              {friend.lastCatchUp && <p className="text-xs text-stone">Last catch-up: {formatDate(friend.lastCatchUp)}</p>}
              {friend.upcomingPlan && <p className="text-xs text-graphite mt-1">Upcoming: {friend.upcomingPlan}</p>}
              {friend.notes && <p className="text-sm text-stone mt-2 border-t border-ash pt-2">{friend.notes}</p>}
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={onEdit} className="p-1.5 rounded-lg text-stone hover:text-graphite hover:bg-linen transition-all"><Pencil className="h-3.5 w-3.5" /></button>
            <button onClick={onDelete} className="p-1.5 rounded-lg text-stone hover:text-papaya hover:bg-papaya/10 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FriendForm({ friend, onSave, onCancel }: { friend?: Friend; onSave: (data: any) => void; onCancel: () => void }) {
  const [name, setName] = useState(friend?.displayName || '')
  const [cat, setCat] = useState(friend?.relationshipCategory || 'Good friend')
  const [interests, setInterests] = useState(friend?.interests || '')
  const [notes, setNotes] = useState(friend?.notes || '')
  const [lastCatchUp, setLastCatchUp] = useState(friend?.lastCatchUp || '')
  const [upcomingPlan, setUpcomingPlan] = useState(friend?.upcomingPlan || '')
  const [birthday, setBirthday] = useState(friend?.birthday || '')

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; onSave({ displayName: name, relationshipCategory: cat, interests, notes, lastCatchUp, upcomingPlan, birthday }) }} className="space-y-3">
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Their name" />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-body-sm font-medium text-graphite">Category</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="w-full h-10 px-3 text-sm rounded-xl border border-ash bg-white text-ink focus:outline-none focus:ring-1 focus:ring-ink/10/10">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <Input label="Birthday (optional)" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
      </div>
      <Input label="Interests / things they love" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g. hiking, anime, books..." />
      <Input label="Last catch-up" type="date" value={lastCatchUp} onChange={(e) => setLastCatchUp(e.target.value)} />
      <Input label="Upcoming plan" value={upcomingPlan} onChange={(e) => setUpcomingPlan(e.target.value)} placeholder="e.g. Coffee on Saturday" />
      <Textarea label="Notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What should you remember? Conversation notes, things to ask about..." />
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1">{friend ? 'Update' : 'Add Friend'}</Button>
      </div>
    </form>
  )
}

export function Friendships() {
  const { friends, add, update, delete: del } = useFriendsStore()
  const [showForm, setShowForm] = useState(false)
  const [editFriend, setEditFriend] = useState<Friend | null>(null)
  const [search, setSearch] = useState('')

  const filtered = friends.filter((f) => !search || f.displayName.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader title="Friendships" description="Nurture the connections that matter. Invest in people who invest in you."
        actions={<Button variant="primary" size="sm" onClick={() => { setShowForm(true); setEditFriend(null) }}><Plus className="h-4 w-4" /> Add person</Button>} />

      {friends.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Close friends', value: friends.filter((f) => f.relationshipCategory === 'Close friend').length, color: 'text-graphite' },
            { label: 'People tracked', value: friends.length, color: 'text-graphite' },
            { label: 'With upcoming plans', value: friends.filter((f) => f.upcomingPlan).length, color: 'text-graphite' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-ash p-4 text-center shadow-craft-xl">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-stone mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {(showForm || editFriend) && (
        <Card>
          <CardHeader><CardTitle>{editFriend ? 'Edit' : 'Add Person'}</CardTitle></CardHeader>
          <CardContent>
            <FriendForm
              friend={editFriend || undefined}
              onSave={(data) => { editFriend ? update(editFriend.id, data) : add(data); setShowForm(false); setEditFriend(null) }}
              onCancel={() => { setShowForm(false); setEditFriend(null) }}
            />
          </CardContent>
        </Card>
      )}

      {friends.length > 0 && (
        <div className="relative">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search people..." className="w-full h-10 pl-4 pr-4 text-sm rounded-xl border border-ash bg-white text-ink placeholder:text-stone focus:outline-none focus:ring-1 focus:ring-ink/10/10 transition-all" />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="Start your friendship map" description="Keep notes on people you care about - interests, plans, and moments worth remembering." action={<Button variant="primary" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Add your first person</Button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((f) => (
            <FriendCard key={f.id} friend={f} onEdit={() => { setEditFriend(f); setShowForm(false) }} onDelete={() => del(f.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
