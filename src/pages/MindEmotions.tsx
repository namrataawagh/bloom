import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Brain, BookOpen, Trash2, Sparkles } from 'lucide-react'
import { useMoodStore } from '@/stores/useMoodStore'
import { useJournalStore } from '@/stores/useJournalStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { MOOD_LABELS } from '@/lib/constants'
import { todayISO, generateId, nowISO, formatDate, cn } from '@/lib/utils'
import { MoodLabel } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Affirmation { id: string; text: string; createdAt: string }
interface SelfDevNote { id: string; trigger: string; feeling: string; need: string; response: string; createdAt: string }
interface MindStore {
  affirmations: Affirmation[]
  selfDevNotes: SelfDevNote[]
  addAffirmation: (text: string) => void
  deleteAffirmation: (id: string) => void
  addSelfDevNote: (note: Omit<SelfDevNote, 'id' | 'createdAt'>) => void
  deleteSelfDevNote: (id: string) => void
}

const useMindStore = create<MindStore>()(persist((set) => ({
  affirmations: [], selfDevNotes: [],
  addAffirmation: (text) => set((s) => ({ affirmations: [{ id: generateId(), text, createdAt: nowISO() }, ...s.affirmations] })),
  deleteAffirmation: (id) => set((s) => ({ affirmations: s.affirmations.filter((a) => a.id !== id) })),
  addSelfDevNote: (note) => set((s) => ({ selfDevNotes: [{ ...note, id: generateId(), createdAt: nowISO() }, ...s.selfDevNotes] })),
  deleteSelfDevNote: (id) => set((s) => ({ selfDevNotes: s.selfDevNotes.filter((n) => n.id !== id) })),
}), { name: 'bloom-mind' }))

export function MindEmotions() {
  const { logs: moodLogs } = useMoodStore()
  const { entries } = useJournalStore()
  const { affirmations, selfDevNotes, addAffirmation, deleteAffirmation, addSelfDevNote, deleteSelfDevNote } = useMindStore()
  const [tab, setTab] = useState<'mood' | 'journal' | 'reflect' | 'affirmations'>('mood')
  const [affText, setAffText] = useState('')
  const [showReflectForm, setShowReflectForm] = useState(false)
  const [trigger, setTrigger] = useState(''); const [feeling, setFeeling] = useState(''); const [need, setNeed] = useState(''); const [response, setResponse] = useState('')

  const emotionalJournals = entries.filter((e) => e.entryType === 'emotional_reflection' || e.entryType === 'daily_reflection').slice(0, 5)
  const recentMoods = moodLogs.slice(0, 14)

  // Mood frequency
  const moodFreq: Record<string, number> = {}
  recentMoods.forEach((l) => l.moodLabels.forEach((m) => { moodFreq[m] = (moodFreq[m] || 0) + 1 }))
  const topMoods = Object.entries(moodFreq).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const submitReflect = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trigger && !feeling) return
    addSelfDevNote({ trigger, feeling, need, response })
    setTrigger(''); setFeeling(''); setNeed(''); setResponse(''); setShowReflectForm(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader title="Mind & Emotions" description="Know yourself gently. Reflect, regulate, and grow." />

      {/* Tabs */}
      <div className="flex gap-1 bg-linen rounded-xl p-1 overflow-x-auto">
        {([['mood', 'Mood Trends'], ['journal', 'Reflections'], ['reflect', 'Self-Inquiry'], ['affirmations', 'Affirmations']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2 rounded-lg text-body-sm font-medium transition-all whitespace-nowrap', tab === t ? 'bg-white text-ink shadow-craft-xl' : 'text-stone hover:text-graphite')}>
            {label}
          </button>
        ))}
      </div>

      {/* Mood Trends */}
      {tab === 'mood' && (
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle>Mood - Last 14 Days</CardTitle></CardHeader>
            <CardContent>
              {recentMoods.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm text-stone mb-3">Log your mood from the dashboard to see patterns here.</p>
                  <Link to="/"><Button variant="ghost" size="sm">Go to Dashboard</Button></Link>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {topMoods.map(([mood, count]) => {
                      const info = MOOD_LABELS.find((m) => m.value === mood)
                      return (
                        <div key={mood} className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-pill shrink-0" style={{ backgroundColor: info?.color }} />
                          <div className="flex-1 h-1.5 bg-linen rounded-pill overflow-hidden">
                            <div className="h-full rounded-pill" style={{ width: `${(count / (topMoods[0]?.[1] || 1)) * 100}%`, backgroundColor: info?.color }} />
                          </div>
                          <span className="text-caption text-stone w-28">{info?.label} ({count}x)</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentMoods.map((log) => (
                      <div key={log.id} title={log.date} className="flex flex-col items-center gap-0.5">
                        <div className="flex gap-0.5">
                          {log.moodLabels.slice(0, 2).map((m) => {
                            const info = MOOD_LABELS.find((ml) => ml.value === m)
                            return <div key={m} className="w-2 h-2 rounded-pill" style={{ backgroundColor: info?.color }} />
                          })}
                        </div>
                        <span className="text-caption text-stone">{log.date.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reflections */}
      {tab === 'journal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone">Emotional reflection & daily reflection entries</p>
            <Link to="/journal"><Button variant="ghost" size="sm"><Plus className="h-3 w-3" /> New entry</Button></Link>
          </div>
          {emotionalJournals.length === 0 ? (
            <EmptyState icon={BookOpen} title="No reflection entries yet" description="Write emotional reflections or daily check-ins in the Journal to see them here." action={<Link to="/journal"><Button variant="outline"><Plus className="h-4 w-4" /> Write a reflection</Button></Link>} />
          ) : emotionalJournals.map((e) => (
            <Card key={e.id} hover>
              <CardContent className="pt-4">
                <p className="font-medium text-ink mb-1">{e.title || 'Reflection'}</p>
                <p className="text-xs text-stone mb-2">{formatDate(e.entryDate)}</p>
                <p className="text-sm text-stone line-clamp-2">{e.content.replace(/<[^>]+>/g, '')}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Self-inquiry */}
      {tab === 'reflect' && (
        <div className="space-y-4">
          <Button variant="ghost" size="sm" onClick={() => setShowReflectForm(true)}><Plus className="h-4 w-4" /> New self-inquiry</Button>
          {showReflectForm && (
            <Card>
              <CardContent className="pt-5">
                <form onSubmit={submitReflect} className="space-y-3">
                  <Textarea label="What triggered me?" rows={2} value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder="What happened? What set this off?" />
                  <Textarea label="What did I feel?" rows={2} value={feeling} onChange={(e) => setFeeling(e.target.value)} placeholder="Emotions, body sensations, thoughts..." />
                  <Textarea label="What did I need in that moment?" rows={2} value={need} onChange={(e) => setNeed(e.target.value)} placeholder="Safety, validation, rest, connection..." />
                  <Textarea label="What could I try differently?" rows={2} value={response} onChange={(e) => setResponse(e.target.value)} placeholder="A kinder response, a boundary, a pause..." />
                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowReflectForm(false)} className="flex-1">Cancel</Button>
                    <Button type="submit" variant="primary" className="flex-1">Save</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          {selfDevNotes.length === 0 && !showReflectForm ? (
            <EmptyState icon={Brain} title="Self-inquiry notes" description="Walk through emotional situations step by step - what triggered you, what you felt, and what you need." action={<Button variant="primary" onClick={() => setShowReflectForm(true)}><Plus className="h-4 w-4" /> Start a self-inquiry</Button>} />
          ) : selfDevNotes.map((n) => (
            <Card key={n.id}>
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-3">
                  <p className="text-xs text-stone">{formatDate(n.createdAt.split('T')[0])}</p>
                  <button onClick={() => deleteSelfDevNote(n.id)} className="p-1 text-stone hover:text-papaya transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
                <div className="space-y-2">
                  {n.trigger && <div><span className="text-xs font-semibold text-stone uppercase">Trigger</span><p className="text-sm text-graphite">{n.trigger}</p></div>}
                  {n.feeling && <div><span className="text-xs font-semibold text-stone uppercase">Feelings</span><p className="text-sm text-graphite">{n.feeling}</p></div>}
                  {n.need && <div><span className="text-xs font-semibold text-stone uppercase">What I needed</span><p className="text-sm text-graphite">{n.need}</p></div>}
                  {n.response && <div><span className="text-xs font-semibold text-stone uppercase">Try differently</span><p className="text-sm text-graphite">{n.response}</p></div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Affirmations */}
      {tab === 'affirmations' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input value={affText} onChange={(e) => setAffText(e.target.value)} placeholder="Write a personal affirmation..."
              onKeyDown={(e) => { if (e.key === 'Enter' && affText.trim()) { addAffirmation(affText.trim()); setAffText('') } }}
              className="flex-1 h-10 px-4 text-sm rounded-xl border border-ash bg-white text-ink placeholder:text-stone focus:outline-none focus:ring-1 focus:ring-ink/10/10 transition-all" />
            <Button variant="primary" onClick={() => { if (affText.trim()) { addAffirmation(affText.trim()); setAffText('') } }}>Add</Button>
          </div>
          {affirmations.length === 0 ? (
            <EmptyState icon={Sparkles} title="Your personal affirmations" description="Write affirmations that resonate with you - truths you want to come back to." />
          ) : (
            <div className="grid gap-3">
              {affirmations.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-4 bg-periwinkle/10 rounded-2xl border border-ash">
                  <span className="text-graphite shrink-0">-</span>
                  <p className="flex-1 text-graphite font-medium italic">{a.text}</p>
                  <button onClick={() => deleteAffirmation(a.id)} className="text-stone hover:text-papaya transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
