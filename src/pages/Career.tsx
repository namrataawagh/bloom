import { useState } from 'react'
import { Plus, CheckCircle2, Circle, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useProjectStore, ProjectStatus } from '@/stores/useProjectStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils'
import { Briefcase } from 'lucide-react'

const STATUS_META: Record<ProjectStatus, { label: string; color: string; bg: string }> = {
  planning:  { label: 'Planning',   color: '#bebbba', bg: 'bg-linen'          },
  active:    { label: 'Active',     color: '#9bd8a9', bg: 'bg-mint/20'        },
  paused:    { label: 'Paused',     color: '#fde99b', bg: 'bg-marigold/30'    },
  completed: { label: 'Completed',  color: '#41413f', bg: 'bg-graphite/10'    },
}

const CARD_COLORS = ['card-mint', 'card-periwinkle', 'card-sky', 'card-marigold']

export function Career() {
  const { projects, addProject, updateProject, deleteProject, toggleTask, addTask, deleteTask, setProgress } = useProjectStore()
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newTaskText, setNewTaskText] = useState<Record<string, string>>({})

  // New project form
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('active')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [targetDate, setTargetDate] = useState('')

  const submit = () => {
    if (!title.trim()) return
    addProject({ title: title.trim(), description: desc.trim(), status, progress: 0, startDate, targetDate: targetDate || undefined, tasks: [] })
    setTitle(''); setDesc(''); setStatus('active'); setTargetDate(''); setShowForm(false)
  }

  const activeProjects    = projects.filter((p) => p.status === 'active')
  const planningProjects  = projects.filter((p) => p.status === 'planning')
  const pausedProjects    = projects.filter((p) => p.status === 'paused')
  const completedProjects = projects.filter((p) => p.status === 'completed')

  const renderProject = (project: typeof projects[0], idx: number) => {
    const meta = STATUS_META[project.status]
    const colorClass = CARD_COLORS[idx % CARD_COLORS.length]
    const isExpanded = expandedId === project.id
    const completedTasks = project.tasks.filter((t) => t.isCompleted).length

    return (
      <div key={project.id} className={cn('rounded-3xl p-6 relative overflow-hidden transition-all', colorClass)} style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        {/* Decorative glass circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-pill glass opacity-30 pointer-events-none" />
        <div className="absolute -bottom-4 right-16 w-14 h-14 rounded-pill glass opacity-25 pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <span className={cn('text-caption font-semibold px-2 py-0.5 rounded-pill inline-block mb-2', meta.bg)} style={{ color: '#41413f' }}>
                {meta.label}
              </span>
              <h3 className="font-serif text-xl text-ink font-normal leading-tight">{project.title}</h3>
              {project.description && <p className="text-body-sm text-graphite mt-1">{project.description}</p>}
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => setExpandedId(isExpanded ? null : project.id)}
                className="glass-sm p-1.5 rounded-lg hover:bg-white/60 transition-colors text-graphite">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <button onClick={() => deleteProject(project.id)} className="glass-sm p-1.5 rounded-lg hover:bg-white/60 transition-colors text-graphite">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="glass rounded-xl px-4 py-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-caption font-medium text-graphite">Progress</span>
              <span className="text-body-sm font-bold text-ink">{project.progress}%</span>
            </div>
            <div className="h-2 bg-white/40 rounded-pill overflow-hidden mb-2">
              <div className="h-full bg-ink/30 rounded-pill transition-all duration-700" style={{ width: `${project.progress}%` }} />
            </div>
            <input type="range" min={0} max={100} value={project.progress}
              onChange={(e) => setProgress(project.id, Number(e.target.value))}
              className="w-full accent-ink h-1" />
          </div>

          {/* Status selector */}
          <div className="flex gap-2 flex-wrap mb-3">
            {(Object.keys(STATUS_META) as ProjectStatus[]).map((s) => (
              <button key={s} onClick={() => updateProject(project.id, { status: s })}
                className={cn('text-caption px-2.5 py-1 rounded-pill border transition-all font-medium',
                  project.status === s ? 'bg-ink text-white border-ink' : 'glass-sm text-graphite border-white/60 hover:bg-white/60'
                )}>{STATUS_META[s].label}</button>
            ))}
          </div>

          {/* Tasks (expandable) */}
          {isExpanded && (
            <div className="glass rounded-xl p-4 space-y-2 animate-scale-in">
              <div className="flex items-center justify-between mb-3">
                <p className="text-caption font-semibold text-graphite uppercase tracking-wider">Tasks</p>
                <span className="text-caption text-graphite">{completedTasks}/{project.tasks.length}</span>
              </div>
              {project.tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2 group">
                  <button onClick={() => toggleTask(project.id, task.id)} className="shrink-0">
                    {task.isCompleted
                      ? <CheckCircle2 style={{ width:16,height:16 }} className="text-graphite" />
                      : <Circle style={{ width:16,height:16 }} className="text-graphite/40" />}
                  </button>
                  <span className={cn('text-body-sm flex-1 text-ink', task.isCompleted && 'line-through opacity-50')}>{task.title}</span>
                  <button onClick={() => deleteTask(project.id, task.id)} className="opacity-0 group-hover:opacity-100 p-0.5 text-graphite/50 hover:text-papaya transition-all">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 mt-3 pt-2 border-t border-white/40">
                <input
                  value={newTaskText[project.id] || ''}
                  onChange={(e) => setNewTaskText((prev) => ({ ...prev, [project.id]: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTaskText[project.id]?.trim()) {
                      addTask(project.id, newTaskText[project.id].trim())
                      setNewTaskText((prev) => ({ ...prev, [project.id]: '' }))
                    }
                  }}
                  placeholder="Add a task... (Enter to save)"
                  className="flex-1 h-8 px-3 rounded-lg bg-white/60 border border-white/70 text-body-sm text-ink placeholder:text-stone focus:outline-none focus:ring-1 focus:ring-ink/10"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Sky cloud decoration strip */}
      <div className="relative overflow-hidden rounded-3xl h-3 card-sky-clouds opacity-60" />

      <PageHeader
        title="Career"
        description="Your projects, growth, and professional ambitions."
        actions={<Button variant="primary" size="sm" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> New project</Button>}
      />

      {/* New project form */}
      {showForm && (
        <Card className="animate-scale-in">
          <CardHeader><CardTitle>New Project</CardTitle></CardHeader>
          <CardContent className="pt-4 space-y-3">
            <Input label="Project title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Build portfolio" autoFocus />
            <Input label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What is this project about?" />
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-caption font-medium text-stone block mb-1">Start date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-ash bg-white text-ink text-body-sm focus:outline-none focus:ring-1 focus:ring-ink/10" />
              </div>
              <div className="flex-1">
                <label className="text-caption font-medium text-stone block mb-1">Target date</label>
                <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-ash bg-white text-ink text-body-sm focus:outline-none focus:ring-1 focus:ring-ink/10" />
              </div>
            </div>
            <div>
              <label className="text-caption font-medium text-stone block mb-2">Status</label>
              <div className="flex gap-2">
                {(Object.keys(STATUS_META) as ProjectStatus[]).map((s) => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={cn('px-3 py-1.5 rounded-pill text-body-sm border transition-all',
                      status === s ? 'bg-ink text-white border-ink' : 'bg-white border-ash text-stone hover:border-stone'
                    )}>{STATUS_META[s].label}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="primary" onClick={submit} disabled={!title.trim()}>Create project</Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {projects.length === 0 && (
        <EmptyState icon={Briefcase} title="No projects yet" description="Track your current work, side projects, and professional goals here."
          action={<Button variant="primary" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Create first project</Button>} />
      )}

      {/* Active */}
      {activeProjects.length > 0 && (
        <div>
          <p className="text-caption font-semibold text-stone uppercase tracking-widest mb-3">Active</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeProjects.map((p, i) => renderProject(p, i))}
          </div>
        </div>
      )}

      {/* Planning */}
      {planningProjects.length > 0 && (
        <div>
          <p className="text-caption font-semibold text-stone uppercase tracking-widest mb-3">Planning</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {planningProjects.map((p, i) => renderProject(p, i + activeProjects.length))}
          </div>
        </div>
      )}

      {/* Paused */}
      {pausedProjects.length > 0 && (
        <div>
          <p className="text-caption font-semibold text-stone uppercase tracking-widest mb-3">Paused</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pausedProjects.map((p, i) => renderProject(p, i + 2))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedProjects.length > 0 && (
        <div>
          <p className="text-caption font-semibold text-stone uppercase tracking-widest mb-3">Completed</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {completedProjects.map((p, i) => renderProject(p, i + 3))}
          </div>
        </div>
      )}
      <div className="pb-6" />
    </div>
  )
}
