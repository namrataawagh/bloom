import { useState } from 'react'
import { Plus, Target, CheckCircle2, Circle, Pencil, Trash2, Pin, ChevronDown, ChevronUp } from 'lucide-react'
import { useGoalsStore } from '@/stores/useGoalsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { DEFAULT_LIFE_AREAS, GOAL_STATUSES } from '@/lib/constants'
import { todayISO, formatDate, cn } from '@/lib/utils'
import { Goal, GoalStatus, LifeAreaId, GoalMilestone } from '@/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const lifeAreaOptions = DEFAULT_LIFE_AREAS.map((a) => ({ value: a.id, label: `${a.icon} ${a.name}` }))
const statusOptions = GOAL_STATUSES.map((s) => ({ value: s.value, label: s.label }))

const goalSchema = z.object({
  title: z.string().min(1, 'Goal title is required'),
  description: z.string().optional(),
  whyItMatters: z.string().optional(),
  lifeAreaId: z.string().min(1),
  status: z.string(),
  targetDate: z.string().optional(),
  progress: z.coerce.number().min(0).max(100),
  notes: z.string().optional(),
})
type GoalFormData = z.infer<typeof goalSchema>

function GoalForm({ goal, onSave, onCancel }: { goal?: Goal; onSave: (d: GoalFormData) => void; onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: goal?.title || '',
      description: goal?.description || '',
      whyItMatters: goal?.whyItMatters || '',
      lifeAreaId: goal?.lifeAreaId || 'personal',
      status: goal?.status || 'not_started',
      targetDate: goal?.targetDate || '',
      progress: goal?.progress || 0,
      notes: goal?.notes || '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <Input label="Goal title" placeholder="e.g. Learn Python" error={errors.title?.message} {...register('title')} />
      <Textarea label="Description" placeholder="What does this goal involve?" rows={2} {...register('description')} />
      <Textarea label="Why this matters to me" placeholder="This goal matters because..." rows={2} {...register('whyItMatters')} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Life area" options={lifeAreaOptions} {...register('lifeAreaId')} />
        <Select label="Status" options={statusOptions} {...register('status')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Target date (optional)" type="date" {...register('targetDate')} />
        <Input label="Progress (%)" type="number" min={0} max={100} {...register('progress')} />
      </div>
      <Textarea label="Notes" placeholder="Progress notes, reflections..." rows={2} {...register('notes')} />
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" variant="primary" className="flex-1">{goal ? 'Update Goal' : 'Create Goal'}</Button>
      </div>
    </form>
  )
}

function MilestoneList({ goal }: { goal: Goal }) {
  const { addMilestone, updateMilestone, deleteMilestone } = useGoalsStore()
  const [newTitle, setNewTitle] = useState('')

  const addMs = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    addMilestone(goal.id, { title: newTitle.trim(), isCompleted: false })
    setNewTitle('')
  }

  return (
    <div className="space-y-2 mt-3">
      <p className="text-xs font-semibold text-stone uppercase tracking-wider">Milestones</p>
      {goal.milestones.map((ms) => (
        <div key={ms.id} className="flex items-center gap-2 group">
          <button
            onClick={() => updateMilestone(goal.id, ms.id, { isCompleted: !ms.isCompleted })}
            aria-label={ms.isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {ms.isCompleted
              ? <CheckCircle2 className="h-4 w-4 text-graphite shrink-0" />
              : <Circle className="h-4 w-4 text-stone hover:text-stone shrink-0 transition-colors" />
            }
          </button>
          <span className={cn('text-sm flex-1', ms.isCompleted && 'line-through text-stone')}>{ms.title}</span>
          <button
            onClick={() => deleteMilestone(goal.id, ms.id)}
            className="p-1 opacity-0 group-hover:opacity-100 text-stone hover:text-papaya transition-all"
            aria-label="Delete milestone"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      ))}
      <form onSubmit={addMs} className="flex items-center gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a milestone..."
          className="flex-1 text-sm text-graphite placeholder:text-stone border-b border-dashed border-ash focus:border-ink outline-none py-1 bg-transparent transition-colors"
        />
        {newTitle && (
          <button type="submit" className="text-xs text-graphite font-medium hover:text-graphite">Add</button>
        )}
      </form>
    </div>
  )
}

function GoalCard({ goal }: { goal: Goal }) {
  const { updateGoal, deleteGoal } = useGoalsStore()
  const [editing, setEditing] = useState(false)
  const [showMilestones, setShowMilestones] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const area = DEFAULT_LIFE_AREAS.find((a) => a.id === goal.lifeAreaId)
  const statusInfo = GOAL_STATUSES.find((s) => s.value === goal.status)
  const completedMs = goal.milestones.filter((m) => m.isCompleted).length

  if (editing) {
    return (
      <Card>
        <CardContent className="pt-5">
          <GoalForm
            goal={goal}
            onSave={(data) => {
              updateGoal(goal.id, { ...data, lifeAreaId: data.lifeAreaId as LifeAreaId, status: data.status as GoalStatus })
              setEditing(false)
            }}
            onCancel={() => setEditing(false)}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {goal.isPinned && <Pin className="h-3.5 w-3.5 text-graphite" />}
              <h3 className="font-semibold text-ink">{goal.title}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs">
              {area && (
                <span className="px-2 py-0.5 rounded-pill font-medium" style={{ backgroundColor: area.color + '25', color: area.color }}>
                  {area.icon} {area.name}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-pill font-medium text-white text-xs" style={{ backgroundColor: statusInfo?.color || '#9E9E9E' }}>
                {statusInfo?.label}
              </span>
              {goal.targetDate && (
                <span className="text-stone">by {formatDate(goal.targetDate)}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => updateGoal(goal.id, { isPinned: !goal.isPinned })} className="p-1.5 rounded-lg text-stone hover:text-graphite transition-all" aria-label="Toggle pin">
              <Pin className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-stone hover:text-graphite hover:bg-linen transition-all" aria-label="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button onClick={() => setDeleteOpen(true)} className="p-1.5 rounded-lg text-stone hover:text-papaya hover:bg-papaya/10 transition-all" aria-label="Delete">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {goal.description && <p className="text-sm text-graphite mb-3">{goal.description}</p>}

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-stone mb-1.5">
            <span>Progress</span>
            <span className="font-medium">{goal.progress}%</span>
          </div>
          <div className="h-2 bg-linen rounded-pill overflow-hidden">
            <div
              className="h-full rounded-pill transition-all duration-700"
              style={{ width: `${goal.progress}%`, backgroundColor: area?.color || '#7D9B76' }}
            />
          </div>
          {goal.milestones.length > 0 && (
            <p className="text-xs text-stone mt-1">{completedMs}/{goal.milestones.length} milestones complete</p>
          )}
        </div>

        {/* Milestones toggle */}
        <button
          onClick={() => setShowMilestones(!showMilestones)}
          className="flex items-center gap-1.5 text-xs text-stone hover:text-graphite transition-colors"
        >
          {showMilestones ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {showMilestones ? 'Hide' : 'Show'} milestones
        </button>

        {showMilestones && <MilestoneList goal={goal} />}

        {/* Delete dialog */}
        <Dialog open={deleteOpen} onOpenChange={(o) => !o && setDeleteOpen(false)}>
          <DialogContent size="sm">
            <DialogHeader><DialogTitle>Delete Goal</DialogTitle></DialogHeader>
            <div className="px-6 py-3">
              <p className="text-sm text-graphite">Delete <strong>"{goal.title}"</strong>? This cannot be undone.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => deleteGoal(goal.id)}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export function Goals() {
  const { goals, addGoal } = useGoalsStore()
  const [showForm, setShowForm] = useState(false)
  const [filterArea, setFilterArea] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = goals.filter((g) => {
    if (filterArea && g.lifeAreaId !== filterArea) return false
    if (filterStatus && g.status !== filterStatus) return false
    return true
  })

  const pinned = filtered.filter((g) => g.isPinned)
  const rest = filtered.filter((g) => !g.isPinned)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Goals & Planning"
        description="Set intentions, track progress, celebrate growth"
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" /> New Goal
          </Button>
        }
      />

      {showForm && (
        <Card>
          <CardHeader><CardTitle>New Goal</CardTitle></CardHeader>
          <CardContent>
            <GoalForm
              onSave={(data) => {
                addGoal({ ...data, lifeAreaId: data.lifeAreaId as LifeAreaId, status: data.status as GoalStatus, progress: Number(data.progress), notes: data.notes || '', whyItMatters: data.whyItMatters || '', description: data.description || '', startDate: todayISO(), isPinned: false })
                setShowForm(false)
              }}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      {goals.length > 0 && (
        <div className="flex gap-3">
          <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)}
            className="h-9 px-3 text-sm rounded-xl border border-ash bg-white text-graphite focus:outline-none focus:ring-1 focus:ring-ink/10/10 transition-all">
            <option value="">All areas</option>
            {DEFAULT_LIFE_AREAS.map((a) => <option key={a.id} value={a.id}>{a.icon} {a.name}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 text-sm rounded-xl border border-ash bg-white text-graphite focus:outline-none focus:ring-1 focus:ring-ink/10/10 transition-all">
            <option value="">All statuses</option>
            {GOAL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals yet"
          description="Set your first goal and work towards it at your own pace. Every step counts."
          action={<Button variant="primary" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Create your first goal</Button>}
        />
      ) : (
        <div className="space-y-4">
          {pinned.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-stone uppercase tracking-wider flex items-center gap-1.5"><Pin className="h-3 w-3" /> Pinned</p>
              {pinned.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
            </div>
          )}
          {rest.length > 0 && (
            <div className="space-y-3">
              {pinned.length > 0 && <p className="text-xs font-semibold text-stone uppercase tracking-wider">All Goals</p>}
              {rest.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
