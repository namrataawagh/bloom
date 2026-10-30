import { useState } from 'react'
import { format, subDays, parseISO } from 'date-fns'
import { Plus, CheckCircle2, Circle, Pause, Archive, Pencil, Trash2, Flame, MoreVertical } from 'lucide-react'
import { useHabitsStore } from '@/stores/useHabitsStore'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { DEFAULT_LIFE_AREAS, DAYS_OF_WEEK } from '@/lib/constants'
import { todayISO, cn } from '@/lib/utils'
import { Habit, HabitStatus, LifeAreaId } from '@/types'

const habitSchema = z.object({
  name: z.string().min(1, 'Habit name is required'),
  description: z.string().optional(),
  lifeAreaId: z.string().min(1),
  frequency: z.enum(['daily', 'custom']),
  selectedDays: z.array(z.number()),
  icon: z.string().optional(),
})
type HabitFormData = z.infer<typeof habitSchema>

const lifeAreaOptions = DEFAULT_LIFE_AREAS.map((a) => ({ value: a.id, label: `${a.icon} ${a.name}` }))
const frequencyOptions = [
  { value: 'daily', label: 'Every day' },
  { value: 'custom', label: 'Selected days' },
]

function HabitForm({ habit, onSave, onCancel }: { habit?: Habit; onSave: (data: HabitFormData) => void; onCancel: () => void }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit?.name || '',
      description: habit?.description || '',
      lifeAreaId: habit?.lifeAreaId || 'personal',
      frequency: habit?.frequency === 'weekly' ? 'daily' : (habit?.frequency || 'daily'),
      selectedDays: habit?.selectedDays || [0, 1, 2, 3, 4, 5, 6],
      icon: habit?.icon || '',
    },
  })

  const frequency = watch('frequency')
  const selectedDays = watch('selectedDays')

  const toggleDay = (day: number) => {
    const current = selectedDays || []
    if (current.includes(day)) {
      setValue('selectedDays', current.filter((d) => d !== day))
    } else {
      setValue('selectedDays', [...current, day])
    }
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input label="Habit name" placeholder="e.g. Morning stretch" error={errors.name?.message} {...register('name')} />
        </div>
        <div className="w-24">
          <Input label="Icon (optional)" placeholder="e.g. leaf, sun" {...register('icon')} />
        </div>
      </div>
      <Textarea label="Description (optional)" placeholder="Why this habit matters to you..." rows={2} {...register('description')} />
      <Select label="Life area" options={lifeAreaOptions} {...register('lifeAreaId')} />
      <Select label="Frequency" options={frequencyOptions} {...register('frequency')} />

      {frequency === 'custom' && (
        <div className="space-y-2">
          <label className="block text-body-sm font-medium text-graphite">Days of the week</label>
          <div className="flex gap-2 flex-wrap">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={cn(
                  'w-10 h-10 rounded-xl text-xs font-medium transition-all duration-150',
                  selectedDays?.includes(day.value)
                    ? 'bg-mint text-white'
                    : 'bg-linen text-graphite hover:bg-cloud'
                )}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1">{habit ? 'Update Habit' : 'Create Habit'}</Button>
      </div>
    </form>
  )
}

export function Habits() {
  const { habits, logs, addHabit, updateHabit, deleteHabit, logHabit, getLogForDate, getStreakCount, getHabitsForDate } = useHabitsStore()
  const [showForm, setShowForm] = useState(false)
  const [editHabit, setEditHabit] = useState<Habit | null>(null)
  const [filter, setFilter] = useState<HabitStatus | 'all'>('active')
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null)

  const today = todayISO()
  const last7Days = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'))

  const filtered = habits.filter((h) => filter === 'all' || h.status === filter)

  const handleSave = (data: HabitFormData) => {
    if (editHabit) {
      updateHabit(editHabit.id, { ...data, lifeAreaId: data.lifeAreaId as LifeAreaId })
      setEditHabit(null)
    } else {
      addHabit({ ...data, description: data.description || '', lifeAreaId: data.lifeAreaId as LifeAreaId, startDate: today, status: 'active' })
      setShowForm(false)
    }
  }

  const todayHabits = getHabitsForDate(today)
  const completedToday = todayHabits.filter((h) => getLogForDate(h.id, today)?.status === 'completed').length

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Habits"
        description="Build consistency gently, one day at a time"
        actions={
          <Button variant="primary" size="sm" onClick={() => { setShowForm(true); setEditHabit(null) }}>
            <Plus className="h-4 w-4" /> New Habit
          </Button>
        }
      />

      {/* Summary */}
      {habits.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card variant="default">
            <CardContent className="pt-5 text-center">
              <div className="text-2xl font-bold text-graphite">{completedToday}/{todayHabits.length}</div>
              <div className="text-xs text-graphite mt-1">Done today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <div className="text-2xl font-bold text-ink">{habits.filter((h) => h.status === 'active').length}</div>
              <div className="text-xs text-stone mt-1">Active habits</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 text-center">
              <div className="text-2xl font-bold text-ink">
                {logs.filter((l) => {
                  const weekStart = format(subDays(new Date(), 6), 'yyyy-MM-dd')
                  return l.date >= weekStart && l.status === 'completed'
                }).length}
              </div>
              <div className="text-xs text-stone mt-1">This week</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create/Edit form */}
      {(showForm || editHabit) && (
        <Card>
          <CardHeader>
            <CardTitle>{editHabit ? 'Edit Habit' : 'New Habit'}</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitForm
              habit={editHabit || undefined}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditHabit(null) }}
            />
          </CardContent>
        </Card>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['active', 'paused', 'archived', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-body-sm font-medium transition-all',
              filter === f ? 'bg-ink text-white' : 'text-stone hover:text-graphite hover:bg-linen'
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Habits list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Flame}
          title={filter === 'active' ? "No active habits yet" : `No ${filter} habits`}
          description={filter === 'active' ? "Create your first habit to start building consistency gently." : `You have no ${filter} habits.`}
          action={filter === 'active' ? (
            <Button variant="primary" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4" /> Create your first habit
            </Button>
          ) : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((habit) => {
            const log = getLogForDate(habit.id, today)
            const done = log?.status === 'completed'
            const streak = getStreakCount(habit.id)
            const area = DEFAULT_LIFE_AREAS.find((a) => a.id === habit.lifeAreaId)

            return (
              <Card key={habit.id} className={cn(habit.status !== 'active' && 'opacity-60')}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    {/* Check button */}
                    <button
                      onClick={() => habit.status === 'active' && logHabit(habit.id, today, done ? 'not_done' : 'completed')}
                      disabled={habit.status !== 'active'}
                      className="mt-0.5 shrink-0"
                      aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {done ? (
                        <CheckCircle2 className="h-6 w-6 text-graphite" />
                      ) : (
                        <Circle className="h-6 w-6 text-stone hover:text-stone transition-colors" />
                      )}
                    </button>

                    {/* Habit info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {habit.icon && <span className="text-lg">{habit.icon}</span>}
                        <span className={cn('font-medium text-ink', done && 'line-through text-stone')}>
                          {habit.name}
                        </span>
                        {area && (
                          <span className="text-xs px-2 py-0.5 rounded-pill" style={{ backgroundColor: area.color + '20', color: area.color }}>
                            {area.name}
                          </span>
                        )}
                        {habit.status === 'paused' && <Badge variant="stone">Paused</Badge>}
                        {habit.status === 'archived' && <Badge variant="stone">Archived</Badge>}
                      </div>
                      {habit.description && (
                        <p className="text-sm text-stone mb-2">{habit.description}</p>
                      )}

                      {/* 7-day log */}
                      <div className="flex gap-1.5 mt-2">
                        {last7Days.map((date) => {
                          const dayLog = getLogForDate(habit.id, date)
                          const isCompleted = dayLog?.status === 'completed'
                          const isSkipped = dayLog?.status === 'skipped'
                          const isToday = date === today
                          return (
                            <div
                              key={date}
                              title={`${format(parseISO(date), 'EEE, MMM d')} · ${dayLog?.status || 'not logged'}`}
                              className={cn(
                                'w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-medium transition-all',
                                isCompleted ? 'bg-mint text-white' : isSkipped ? 'bg-marigold/30 text-graphite' : 'bg-linen text-stone',
                                isToday && 'ring-2 ring-ink ring-offset-1'
                              )}
                            >
                              {format(parseISO(date), 'd')}
                            </div>
                          )
                        })}
                        {streak > 1 && (
                          <div className="flex items-center gap-1 ml-1 text-xs text-graphite font-medium">
                            <Flame className="h-3 w-3" /> {streak}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setEditHabit(habit)}
                        className="p-1.5 rounded-lg text-stone hover:text-graphite hover:bg-linen transition-all"
                        aria-label="Edit habit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => updateHabit(habit.id, { status: habit.status === 'active' ? 'paused' : 'active' })}
                        className="p-1.5 rounded-lg text-stone hover:text-graphite hover:bg-linen transition-all"
                        aria-label={habit.status === 'active' ? 'Pause' : 'Resume'}
                      >
                        <Pause className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(habit)}
                        className="p-1.5 rounded-lg text-stone hover:text-papaya hover:bg-papaya/10 transition-all"
                        aria-label="Delete habit"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete Habit</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-3">
            <p className="text-sm text-graphite">
              Are you sure you want to delete <strong>"{deleteTarget?.name}"</strong>? All logs will also be removed. This cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { deleteTarget && deleteHabit(deleteTarget.id); setDeleteTarget(null) }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
