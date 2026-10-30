import { useState } from 'react'
import { useMoodStore } from '@/stores/useMoodStore'
import { MOOD_LABELS } from '@/lib/constants'
import { todayISO } from '@/lib/utils'
import { MoodLabel } from '@/types'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function MoodCheckIn() {
  const { logMood, getLogForDate } = useMoodStore()
  const today = todayISO()
  const existing = getLogForDate(today)
  const [selected, setSelected] = useState<MoodLabel[]>(existing?.moodLabels || [])
  const [saved, setSaved] = useState(!!existing)

  const toggle = (mood: MoodLabel) => {
    setSelected((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    )
    setSaved(false)
  }

  const save = () => {
    if (selected.length === 0) return
    logMood({ moodLabels: selected, date: today })
    setSaved(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {MOOD_LABELS.map(({ value, label, color }) => (
          <button
            key={value}
            onClick={() => toggle(value as MoodLabel)}
            className={cn(
              'px-3 py-1.5 rounded-pill text-body-sm font-medium border transition-all duration-150',
              selected.includes(value as MoodLabel)
                ? 'border-transparent text-ink shadow-craft-sm'
                : 'bg-white border-ash text-stone hover:text-graphite hover:border-stone'
            )}
            style={selected.includes(value as MoodLabel) ? { backgroundColor: color, borderColor: color } : {}}
          >
            {label}
          </button>
        ))}
      </div>
      {selected.length > 0 && !saved && (
        <Button variant="outline" size="sm" onClick={save}>
          Save mood
        </Button>
      )}
      {saved && (
        <p className="text-body-sm text-stone">Mood logged for today.</p>
      )}
    </div>
  )
}
