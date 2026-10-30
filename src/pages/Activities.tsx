import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, Pencil, Trash2, Clock, Star } from 'lucide-react'
import { useActivitiesStore } from '@/stores/useActivitiesStore'
import { useGoalsStore } from '@/stores/useGoalsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { DEFAULT_LIFE_AREAS, ACTIVITY_TYPES } from '@/lib/constants'
import { todayISO, formatDate, formatDuration, cn } from '@/lib/utils'
import { Activity, LifeAreaId } from '@/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const lifeAreaOptions = DEFAULT_LIFE_AREAS.map((a) => ({ value: a.id, label: `${a.icon} ${a.name}` }))

const activitySchema = z.object({
  title: z.string().min(1, 'Activity title is required'),
  lifeAreaId: z.string().min(1),
  activityType: z.string().min(1),
  date: z.string().min(1),
  durationMinutes: z.coerce.number().optional(),
  notes: z.string().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
})
type ActivityFormData = z.infer<typeof activitySchema>

function ActivityForm({ activity, onSave, onCancel }: { activity?: Activity; onSave: (d: ActivityFormData) => void; onCancel: () => void }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: activity?.title || '',
      lifeAreaId: activity?.lifeAreaId || 'personal',
      activityType: activity?.activityType || 'Other',
      date: activity?.date || todayISO(),
      durationMinutes: activity?.durationMinutes,
      notes: activity?.notes || '',
      rating: activity?.rating,
    },
  })

  const lifeAreaId = watch('lifeAreaId')
  const activityTypes = (ACTIVITY_TYPES[lifeAreaId] || ACTIVITY_TYPES.personal).map((t) => ({ value: t, label: t }))

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <Input label="Activity" placeholder="e.g. Morning run" error={errors.title?.message} {...register('title')} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Life area" options={lifeAreaOptions} {...register('lifeAreaId')} />
        <Select label="Type" options={activityTypes} {...register('activityType')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Date" type="date" {...register('date')} />
        <Input label="Duration (minutes, optional)" type="number" min={1} placeholder="e.g. 30" {...register('durationMinutes')} />
      </div>
      <Textarea label="Notes (optional)" placeholder="How did it go? What did you enjoy?" rows={2} {...register('notes')} />

      {/* Rating */}
      <div className="space-y-1.5">
        <label className="block text-body-sm font-medium text-graphite">Enjoyment rating (optional)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="cursor-pointer">
              <input type="radio" value={star} {...register('rating')} className="sr-only" />
              <Star className={cn('h-6 w-6 transition-colors', 'text-ash hover:text-graphite')} />
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1">{activity ? 'Update' : 'Log Activity'}</Button>
      </div>
    </form>
  )
}

export function Activities() {
  const { activities, addActivity, updateActivity, deleteActivity } = useActivitiesStore()
  const [showForm, setShowForm] = useState(false)
  const [editActivity, setEditActivity] = useState<Activity | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null)
  const [filterArea, setFilterArea] = useState('')

  const filtered = [...activities]
    .filter((a) => !filterArea || a.lifeAreaId === filterArea)
    .sort((a, b) => b.date.localeCompare(a.date))

  const handleSave = (data: ActivityFormData) => {
    if (editActivity) {
      updateActivity(editActivity.id, { ...data, lifeAreaId: data.lifeAreaId as LifeAreaId, notes: data.notes || '' })
      setEditActivity(null)
    } else {
      addActivity({ ...data, lifeAreaId: data.lifeAreaId as LifeAreaId, notes: data.notes || '' })
      setShowForm(false)
    }
  }

  // Group by date
  const grouped: Record<string, Activity[]> = {}
  filtered.forEach((a) => {
    if (!grouped[a.date]) grouped[a.date] = []
    grouped[a.date].push(a)
  })

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Activities"
        description="Record what you do and how you spend your time"
        actions={
          <Button variant="primary" size="sm" onClick={() => { setShowForm(true); setEditActivity(null) }}>
            <Plus className="h-4 w-4" /> Log Activity
          </Button>
        }
      />

      {/* Summary cards */}
      {activities.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {DEFAULT_LIFE_AREAS.slice(0, 4).map((area) => {
            const count = activities.filter((a) => a.lifeAreaId === area.id).length
            return (
              <div key={area.id} className="bg-white rounded-2xl border border-ash p-4 text-center shadow-craft-xl">
                <div className="text-2xl mb-1">{area.icon}</div>
                <div className="text-lg font-bold text-ink">{count}</div>
                <div className="text-xs text-stone">{area.name}</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Form */}
      {(showForm || editActivity) && (
        <Card>
          <CardHeader><CardTitle>{editActivity ? 'Edit Activity' : 'Log New Activity'}</CardTitle></CardHeader>
          <CardContent>
            <ActivityForm
              activity={editActivity || undefined}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditActivity(null) }}
            />
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      {activities.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterArea('')}
            className={cn('px-3 py-1.5 rounded-lg text-body-sm font-medium transition-all', !filterArea ? 'bg-ink text-white' : 'text-stone hover:bg-linen')}
          >All</button>
          {DEFAULT_LIFE_AREAS.map((area) => (
            <button
              key={area.id}
              onClick={() => setFilterArea(filterArea === area.id ? '' : area.id)}
              className={cn('px-3 py-1.5 rounded-lg text-body-sm font-medium transition-all', filterArea === area.id ? 'text-white' : 'text-stone hover:bg-linen')}
              style={filterArea === area.id ? { backgroundColor: area.color } : {}}
            >
              {area.icon} {area.name}
            </button>
          ))}
        </div>
      )}

      {/* Activity list grouped by date */}
      {Object.keys(grouped).length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No activities logged yet"
          description="Log what you do - workouts, learning sessions, hobbies, social time - to see how you spend your life."
          action={<Button variant="primary" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Log your first activity</Button>}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, acts]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-stone mb-3">{formatDate(date)}</h3>
              <div className="space-y-3">
                {acts.map((activity) => {
                  const area = DEFAULT_LIFE_AREAS.find((a) => a.id === activity.lifeAreaId)
                  return (
                    <Card key={activity.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                            style={{ backgroundColor: (area?.color || '#7D9B76') + '20' }}>
                            {area?.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="font-medium text-ink">{activity.title}</span>
                              <span className="text-xs text-stone">{activity.activityType}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-stone">
                              {activity.durationMinutes && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {formatDuration(activity.durationMinutes)}
                                </span>
                              )}
                              {activity.rating && (
                                <span className="flex items-center gap-1">
                                  {'⭐'.repeat(activity.rating)}
                                </span>
                              )}
                            </div>
                            {activity.notes && <p className="text-sm text-stone mt-1">{activity.notes}</p>}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => setEditActivity(activity)} className="p-1.5 rounded-lg text-stone hover:text-graphite hover:bg-linen transition-all">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => setDeleteTarget(activity)} className="p-1.5 rounded-lg text-stone hover:text-papaya hover:bg-papaya/10 transition-all">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>Delete Activity</DialogTitle></DialogHeader>
          <div className="px-6 py-3"><p className="text-sm text-graphite">Delete this activity log? This cannot be undone.</p></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { deleteTarget && deleteActivity(deleteTarget.id); setDeleteTarget(null) }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
