import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Sparkles, BookOpen, Target, Activity, CheckCircle2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useHabitsStore } from '@/stores/useHabitsStore'
import { useJournalStore } from '@/stores/useJournalStore'
import { useGoalsStore } from '@/stores/useGoalsStore'
import { useActivitiesStore } from '@/stores/useActivitiesStore'
import { useTasksStore } from '@/stores/useTasksStore'
import { DEFAULT_LIFE_AREAS } from '@/lib/constants'
import { todayISO } from '@/lib/utils'
import { LifeAreaId } from '@/types'

type QuickAddType = 'habit' | 'journal' | 'goal' | 'activity' | 'task'

interface QuickAddModalProps {
  open: boolean
  onClose: () => void
  defaultType?: QuickAddType
}

const lifeAreaOptions = DEFAULT_LIFE_AREAS.map((a) => ({ value: a.id, label: `${a.icon} ${a.name}` }))

export function QuickAddModal({ open, onClose, defaultType = 'habit' }: QuickAddModalProps) {
  const [activeType, setActiveType] = useState<QuickAddType>(defaultType)
  const { addHabit } = useHabitsStore()
  const { addEntry } = useJournalStore()
  const { addGoal } = useGoalsStore()
  const { addActivity } = useActivitiesStore()
  const { addTask } = useTasksStore()

  const tabs: { type: QuickAddType; label: string; icon: typeof Sparkles }[] = [
    { type: 'habit', label: 'Habit', icon: Sparkles },
    { type: 'journal', label: 'Journal', icon: BookOpen },
    { type: 'goal', label: 'Goal', icon: Target },
    { type: 'activity', label: 'Activity', icon: Activity },
    { type: 'task', label: 'Task', icon: CheckCircle2 },
  ]

  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Quick Add</DialogTitle>
        </DialogHeader>

        {/* Type tabs */}
        <div className="px-6 pb-1">
          <div className="flex gap-1 bg-linen rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.type}
                onClick={() => setActiveType(tab.type)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  activeType === tab.type
                    ? 'bg-white text-ink shadow-craft-xl'
                    : 'text-stone hover:text-graphite'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          {activeType === 'habit' && <QuickHabitForm onDone={handleClose} addHabit={addHabit} />}
          {activeType === 'journal' && <QuickJournalForm onDone={handleClose} addEntry={addEntry} />}
          {activeType === 'goal' && <QuickGoalForm onDone={handleClose} addGoal={addGoal} />}
          {activeType === 'activity' && <QuickActivityForm onDone={handleClose} addActivity={addActivity} />}
          {activeType === 'task' && <QuickTaskForm onDone={handleClose} addTask={addTask} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Habit form
const habitSchema = z.object({ name: z.string().min(1, 'Name required'), lifeAreaId: z.string().min(1) })
type HabitFormData = z.infer<typeof habitSchema>

function QuickHabitForm({ onDone, addHabit }: { onDone: () => void; addHabit: any }) {
  const { register, handleSubmit, formState: { errors } } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: { lifeAreaId: 'personal' },
  })
  const onSubmit = (data: HabitFormData) => {
    addHabit({ ...data, lifeAreaId: data.lifeAreaId as LifeAreaId, description: '', frequency: 'daily', selectedDays: [0,1,2,3,4,5,6], startDate: todayISO(), status: 'active' })
    onDone()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <Input label="Habit name" placeholder="e.g. Morning walk" error={errors.name?.message} {...register('name')} />
      <Select label="Life area" options={lifeAreaOptions} {...register('lifeAreaId')} />
      <Button type="submit" variant="primary" className="w-full">Create Habit</Button>
    </form>
  )
}

// ── Journal form
const journalSchema = z.object({ content: z.string().min(1, 'Write something'), entryType: z.string() })
type JournalFormData = z.infer<typeof journalSchema>

function QuickJournalForm({ onDone, addEntry }: { onDone: () => void; addEntry: any }) {
  const { register, handleSubmit, formState: { errors } } = useForm<JournalFormData>({
    defaultValues: { entryType: 'free_writing' },
  })
  const onSubmit = (data: JournalFormData) => {
    addEntry({ content: `<p>${data.content}</p>`, entryType: data.entryType as any, entryDate: todayISO(), tags: [], isDraft: false })
    onDone()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <Select label="Entry type" options={[
        { value: 'free_writing', label: 'Free Writing' },
        { value: 'daily_reflection', label: 'Daily Reflection' },
        { value: 'gratitude', label: 'Gratitude' },
      ]} {...register('entryType')} />
      <Textarea label="Write something..." rows={5} placeholder="What's on your mind?" error={errors.content?.message} {...register('content')} />
      <Button type="submit" variant="primary" className="w-full">Save Entry</Button>
    </form>
  )
}

// ── Goal form
const goalSchema = z.object({ title: z.string().min(1, 'Title required'), lifeAreaId: z.string().min(1) })
type GoalFormData = z.infer<typeof goalSchema>

function QuickGoalForm({ onDone, addGoal }: { onDone: () => void; addGoal: any }) {
  const { register, handleSubmit, formState: { errors } } = useForm<GoalFormData>({
    defaultValues: { lifeAreaId: 'personal' },
  })
  const onSubmit = (data: GoalFormData) => {
    addGoal({ ...data, lifeAreaId: data.lifeAreaId as LifeAreaId, description: '', whyItMatters: '', startDate: todayISO(), status: 'not_started', progress: 0, notes: '', isPinned: false })
    onDone()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <Input label="Goal title" placeholder="e.g. Learn to play guitar" error={errors.title?.message} {...register('title')} />
      <Select label="Life area" options={lifeAreaOptions} {...register('lifeAreaId')} />
      <Button type="submit" variant="primary" className="w-full">Create Goal</Button>
    </form>
  )
}

// ── Activity form
const activitySchema = z.object({ title: z.string().min(1, 'Title required'), lifeAreaId: z.string().min(1), activityType: z.string().min(1) })
type ActivityFormData = z.infer<typeof activitySchema>

function QuickActivityForm({ onDone, addActivity }: { onDone: () => void; addActivity: any }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ActivityFormData>({
    defaultValues: { lifeAreaId: 'personal', activityType: 'Other' },
  })
  const onSubmit = (data: ActivityFormData) => {
    addActivity({ ...data, lifeAreaId: data.lifeAreaId as LifeAreaId, date: todayISO(), notes: '' })
    onDone()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <Input label="Activity" placeholder="e.g. Morning run" error={errors.title?.message} {...register('title')} />
      <Select label="Life area" options={lifeAreaOptions} {...register('lifeAreaId')} />
      <Button type="submit" variant="primary" className="w-full">Log Activity</Button>
    </form>
  )
}

// ── Task form
const taskSchema = z.object({ title: z.string().min(1, 'Title required') })
type TaskFormData = z.infer<typeof taskSchema>

function QuickTaskForm({ onDone, addTask }: { onDone: () => void; addTask: any }) {
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>()
  const onSubmit = (data: TaskFormData) => {
    addTask({ title: data.title, description: '', status: 'todo', dueDate: todayISO() })
    onDone()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <Input label="Task" placeholder="e.g. Email professor" error={errors.title?.message} {...register('title')} />
      <Button type="submit" variant="primary" className="w-full">Add Task</Button>
    </form>
  )
}
