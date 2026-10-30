import { useState } from 'react'
import { useUserStore } from '@/stores/useUserStore'
import { useHabitsStore } from '@/stores/useHabitsStore'
import { useJournalStore } from '@/stores/useJournalStore'
import { useGoalsStore } from '@/stores/useGoalsStore'
import { useActivitiesStore } from '@/stores/useActivitiesStore'
import { useMoodStore } from '@/stores/useMoodStore'
import { useTasksStore } from '@/stores/useTasksStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/shared/PageHeader'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { DEFAULT_LIFE_AREAS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Settings() {
  const { preferences, updatePreferences } = useUserStore()
  const [name, setName] = useState(preferences.displayName)
  const [greeting, setGreeting] = useState(preferences.greeting || '')
  const [saved, setSaved] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)

  const save = () => {
    updatePreferences({ displayName: name || 'Friend', greeting })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const clearAllData = () => {
    localStorage.clear()
    window.location.reload()
  }

  const toggleArea = (id: string) => {
    const updated = preferences.lifeAreas.map((a) =>
      a.id === id ? { ...a, isVisible: !a.isVisible } : a
    )
    updatePreferences({ lifeAreas: updated })
  }

  // Stats
  const { habits, logs } = useHabitsStore()
  const { entries } = useJournalStore()
  const { goals } = useGoalsStore()
  const { activities } = useActivitiesStore()
  const { logs: moodLogs } = useMoodStore()
  const { tasks } = useTasksStore()

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <PageHeader title="Settings" description="Personalise your Bloom experience" />

      {/* Profile */}
      <Card>
        <CardHeader><CardTitle>Your Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should we call you?"
          />
          <Textarea
            label="Personal greeting (optional)"
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            placeholder="e.g. Welcome back, let's make today count!"
            rows={2}
          />
          <Button variant="primary" onClick={save} disabled={saved}>
            {saved ? 'Saved' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Life areas visibility */}
      <Card>
        <CardHeader>
          <CardTitle>Life Areas</CardTitle>
          <p className="text-sm text-stone mt-0.5">Choose which areas appear in your sidebar</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(preferences.lifeAreas || DEFAULT_LIFE_AREAS).map((area) => (
              <div key={area.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-linen transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{area.icon}</span>
                  <div>
                    <p className="text-body-sm font-medium text-graphite">{area.name}</p>
                    <p className="text-xs text-stone">{area.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleArea(area.id)}
                  className={cn(
                    'relative w-10 h-5.5 rounded-pill transition-all duration-200 shrink-0',
                    area.isVisible ? 'bg-mint' : 'bg-ash'
                  )}
                  aria-label={`${area.isVisible ? 'Hide' : 'Show'} ${area.name}`}
                  style={{ height: '22px' }}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 w-4 h-4 rounded-pill bg-white shadow transition-all duration-200',
                      area.isVisible ? 'translate-x-[18px]' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Life Outside My Relationship card */}
      <Card>
        <CardHeader>
          <CardTitle>"My Life Outside My Relationship" Card</CardTitle>
          <p className="text-sm text-stone mt-0.5">Show an optional dashboard card reminding you of your independent identity</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-graphite">Show card on dashboard</span>
            <button
              onClick={() => updatePreferences({ showMyLifeCard: !preferences.showMyLifeCard })}
              className={cn(
                'relative w-10 rounded-pill transition-all duration-200 shrink-0',
                preferences.showMyLifeCard ? 'bg-mint' : 'bg-ash'
              )}
              style={{ height: '22px' }}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 w-4 h-4 rounded-pill bg-white shadow transition-all duration-200',
                  preferences.showMyLifeCard ? 'translate-x-[18px]' : 'translate-x-0'
                )}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Your data stats */}
      <Card>
        <CardHeader><CardTitle>Your Data</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            {[
              { label: 'Habits', value: habits.length },
              { label: 'Habit logs', value: logs.length },
              { label: 'Journal entries', value: entries.length },
              { label: 'Goals', value: goals.length },
              { label: 'Activities', value: activities.length },
              { label: 'Mood logs', value: moodLogs.length },
            ].map((stat) => (
              <div key={stat.label} className="bg-linen rounded-xl p-3">
                <div className="text-xl font-bold text-ink">{stat.value}</div>
                <div className="text-xs text-stone">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const data = {
                  habits: useHabitsStore.getState(),
                  journal: useJournalStore.getState(),
                  goals: useGoalsStore.getState(),
                  activities: useActivitiesStore.getState(),
                  mood: useMoodStore.getState(),
                  tasks: useTasksStore.getState(),
                  user: useUserStore.getState(),
                  exportedAt: new Date().toISOString(),
                }
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url; a.download = `bloom-export-${new Date().toISOString().split('T')[0]}.json`
                a.click(); URL.revokeObjectURL(url)
              }}
            >
              Export my data (JSON)
            </Button>
            <Button variant="danger" className="w-full" onClick={() => setClearOpen(true)}>
              Clear all data
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-stone pb-4">
        <p>Bloom v0.1 · Your data is stored locally in your browser.</p>
        <p className="mt-1">Built with care for your wellbeing.</p>
      </div>

      <Dialog open={clearOpen} onOpenChange={(o) => !o && setClearOpen(false)}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>Clear All Data</DialogTitle></DialogHeader>
          <div className="px-6 py-3">
            <p className="text-sm text-graphite">This will permanently delete all your habits, journal entries, goals, activities, and settings. <strong>This cannot be undone.</strong></p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={clearAllData}>Clear Everything</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
