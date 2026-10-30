import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { CheckSquare, BookOpen, Plus, Circle, CheckCircle2, ArrowRight } from 'lucide-react'
import { useUserStore } from '@/stores/useUserStore'
import { useHabitsStore } from '@/stores/useHabitsStore'
import { useTasksStore } from '@/stores/useTasksStore'
import { useJournalStore } from '@/stores/useJournalStore'
import { useGoalsStore } from '@/stores/useGoalsStore'
import { useActivitiesStore } from '@/stores/useActivitiesStore'
import { useMoodStore } from '@/stores/useMoodStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { MoodCheckIn } from '@/components/dashboard/MoodCheckIn'
import { DEFAULT_LIFE_AREAS } from '@/lib/constants'
import { todayISO, cn } from '@/lib/utils'

export function Dashboard() {
  const { preferences, todayAffirmation } = useUserStore()
  const { getHabitsForDate, getLogForDate, logHabit, logs: habitLogs } = useHabitsStore()
  const { getTodayTasks, completeTask } = useTasksStore()
  const { entries } = useJournalStore()
  const { getActiveGoals } = useGoalsStore()
  const { getThisWeekActivities } = useActivitiesStore()
  const { getLogForDate: getMoodForDate } = useMoodStore()
  const { currentUser } = useAuthStore()

  const today     = todayISO()
  const weekStart = (() => {
    const now = new Date(); const s = new Date(now)
    s.setDate(now.getDate() - now.getDay()); s.setHours(0,0,0,0)
    return s.toISOString().split('T')[0]
  })()

  const todayHabits         = getHabitsForDate(today)
  const todayTasks          = getTodayTasks().slice(0, 5)
  const activeGoals         = getActiveGoals().slice(0, 3)
  const weekActivities      = getThisWeekActivities()
  const weekHabitsCompleted = habitLogs.filter((l) => l.date >= weekStart && l.status === 'completed').length
  const weekJournalCount    = entries.filter((e) => e.entryDate >= weekStart).length
  const todayMood           = getMoodForDate(today)
  const todayJournalCount   = entries.filter((e) => e.entryDate === today).length
  const completedToday      = todayHabits.filter((h) => getLogForDate(h.id, today)?.status === 'completed').length

  const name      = currentUser || preferences.displayName || 'Friend'
  const hour      = new Date().getHours()
  const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 20 ? 'Good evening' : 'Good night'
  const dayLabel  = format(new Date(), 'EEEE, MMMM d')

  const areaActivity = DEFAULT_LIFE_AREAS.map((area) => ({
    area, count: weekActivities.filter((a) => a.lifeAreaId === area.id).length,
  }))
  const maxCount = Math.max(...areaActivity.map((a) => a.count), 1)

  return (
    <div className="animate-fade-in">

      {/* ── Hero — sky with clouds + glass greeting card ──────────────────── */}
      <div className="sky-hero relative px-8 md:px-10 pt-14 pb-16">


        {/* Glass greeting card — like Craft.do hero white card */}
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="glass rounded-[22px] px-8 py-7 max-w-lg"
            style={{ boxShadow: '0 8px 40px rgba(0,40,80,0.10), 0 2px 8px rgba(0,40,80,0.06)' }}>
            <p className="text-[13px] font-medium text-stone mb-1">{dayLabel}</p>
            <h1 className="font-serif text-[34px] text-ink font-normal leading-[1.1] tracking-[-1px] mb-2">
              {timeGreet}, {name}.
            </h1>
            {todayAffirmation && (
              <p className="text-[14px] text-graphite italic leading-relaxed mb-5">{todayAffirmation}</p>
            )}
            <div className="flex gap-2.5 flex-wrap">
              <Link to="/journal">
                <button className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-ink text-white text-[13px] font-medium hover:bg-graphite transition-colors">
                  <BookOpen className="h-3.5 w-3.5" /> Write today
                </button>
              </Link>
              <Link to="/habits">
                <button className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-white/80 text-ink text-[13px] font-medium border border-white/60 hover:bg-white transition-colors">
                  <CheckSquare className="h-3.5 w-3.5" /> Check habits
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div className="px-6 md:px-8 py-8 max-w-5xl mx-auto space-y-6">

        {/* Stat row — like Craft.do pricing cards: clean white, accent accent top border */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Habits today',    value: `${completedToday}/${todayHabits.length}`, accent: '#9bd8a9' },
            { label: 'Tasks pending',   value: todayTasks.filter((t) => t.status !== 'completed').length, accent: '#fde99b' },
            { label: 'Journal entries', value: todayJournalCount, accent: '#b8caf5' },
            { label: 'Active goals',    value: activeGoals.length, accent: '#9ed4ef' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-[18px] overflow-hidden"
              style={{ boxShadow: '0 2px 8px rgba(0,40,80,0.06), 0 8px 20px rgba(0,40,80,0.07)' }}>
              <div className="h-1" style={{ backgroundColor: stat.accent }} />
              <div className="px-5 py-4">
                <div className="text-[26px] font-bold text-ink leading-none mb-1">{stat.value}</div>
                <div className="text-[12px] text-stone font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Habits — mint card */}
          <div className="card-mint rounded-[22px] p-6 relative overflow-hidden">
            <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/25 pointer-events-none" />
            <div className="absolute bottom-3 left-5 w-10 h-10 rounded-full bg-white/20 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-[20px] text-ink font-normal">Habits Today</h2>
                <Link to="/habits">
                  <button className="flex items-center gap-1 text-[12px] font-medium text-graphite bg-white/50 hover:bg-white/70 px-2.5 py-1 rounded-[8px] transition-colors">
                    All <ArrowRight className="h-3 w-3" />
                  </button>
                </Link>
              </div>
              {todayHabits.length === 0 ? (
                <div className="bg-white/60 rounded-[14px] p-5 text-center">
                  <p className="text-[13px] text-graphite mb-3">No habits scheduled today.</p>
                  <Link to="/habits"><Button variant="ghost" size="sm"><Plus className="h-3.5 w-3.5" />Add habit</Button></Link>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {todayHabits.slice(0, 5).map((habit) => {
                    const done = getLogForDate(habit.id, today)?.status === 'completed'
                    return (
                      <button key={habit.id} onClick={() => logHabit(habit.id, today, done ? 'not_done' : 'completed')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] bg-white/50 hover:bg-white/70 transition-colors text-left">
                        {done ? <CheckCircle2 className="h-4 w-4 text-graphite shrink-0" /> : <Circle className="h-4 w-4 text-white/60 shrink-0" />}
                        <span className={cn('text-[13.5px] font-medium text-ink flex-1', done && 'line-through opacity-60')}>{habit.name}</span>
                      </button>
                    )
                  })}
                  <div className="mt-3 pt-2.5 border-t border-white/40">
                    <div className="h-1.5 bg-white/40 rounded-pill overflow-hidden">
                      <div className="h-full bg-white rounded-pill transition-all duration-700"
                        style={{ width: todayHabits.length ? `${(completedToday / todayHabits.length) * 100}%` : '0%' }} />
                    </div>
                    <p className="text-[12px] text-graphite mt-1.5">{completedToday} of {todayHabits.length} complete</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mood — marigold card */}
          <div className="card-marigold rounded-[22px] p-6 relative overflow-hidden">
            <div className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full bg-white/25 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-serif text-[20px] text-ink font-normal mb-1">How are you feeling?</h2>
              {todayMood && <p className="text-[12px] text-graphite mb-4">Logged today</p>}
              <div className="bg-white/60 rounded-[14px] p-4">
                <MoodCheckIn />
              </div>
            </div>
          </div>

          {/* Goals — periwinkle card */}
          <div className="card-periwinkle rounded-[22px] p-6 relative overflow-hidden">
            <div className="absolute -top-8 right-5 w-28 h-28 rounded-full bg-white/20 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-[20px] text-ink font-normal">Active Goals</h2>
                <Link to="/goals">
                  <button className="flex items-center gap-1 text-[12px] font-medium text-graphite bg-white/50 hover:bg-white/70 px-2.5 py-1 rounded-[8px] transition-colors">
                    All <ArrowRight className="h-3 w-3" />
                  </button>
                </Link>
              </div>
              {activeGoals.length === 0 ? (
                <div className="bg-white/60 rounded-[14px] p-5 text-center">
                  <p className="text-[13px] text-graphite mb-3">No active goals yet.</p>
                  <Link to="/goals"><Button variant="ghost" size="sm"><Plus className="h-3.5 w-3.5" />Create goal</Button></Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeGoals.map((goal) => {
                    const area = DEFAULT_LIFE_AREAS.find((a) => a.id === goal.lifeAreaId)
                    return (
                      <div key={goal.id} className="bg-white/60 rounded-[12px] px-4 py-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[13.5px] font-medium text-ink">{goal.title}</p>
                          <span className="text-[12px] font-bold text-graphite">{goal.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/50 rounded-pill overflow-hidden">
                          <div className="h-full bg-ink/25 rounded-pill" style={{ width: `${goal.progress}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Week — sky cloud card */}
          <div className="card-sky-clouds rounded-[22px] p-6 relative overflow-hidden">
            <div className="absolute -bottom-4 left-5 w-20 h-20 rounded-full bg-white/25 pointer-events-none" />
            <div className="relative z-10">
              <h2 className="font-serif text-[20px] text-ink font-normal mb-5">This Week</h2>
              <div className="bg-white/65 rounded-[14px] p-4 space-y-3 mb-4">
                {[
                  { label: 'Habits completed',  value: weekHabitsCompleted },
                  { label: 'Activities logged',  value: weekActivities.length },
                  { label: 'Journal entries',    value: weekJournalCount },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-[13px] text-graphite">{s.label}</span>
                    <span className="text-[14px] font-bold text-ink">{s.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-semibold text-graphite/70 uppercase tracking-[0.08em] mb-2.5">Life balance</p>
              <div className="space-y-2">
                {areaActivity.filter((a) => a.area.isVisible).slice(0, 5).map(({ area, count }) => (
                  <div key={area.id} className="flex items-center gap-2.5">
                    <span className="text-[12px] text-graphite w-20 truncate">{area.name}</span>
                    <div className="flex-1 h-1.5 bg-white/40 rounded-pill overflow-hidden">
                      <div className="h-full bg-white/80 rounded-pill" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                    <span className="text-[12px] text-graphite w-4 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks due — white card */}
        {todayTasks.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tasks Due Today</CardTitle>
                <Link to="/goals" className="text-[12px] text-stone hover:text-graphite transition-colors flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="space-y-1">
                {todayTasks.map((task) => {
                  const done = task.status === 'completed'
                  return (
                    <button key={task.id} onClick={() => !done && completeTask(task.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] hover:bg-linen transition-colors text-left">
                      {done ? <CheckCircle2 className="h-4 w-4 text-graphite shrink-0" /> : <Circle className="h-4 w-4 text-ash shrink-0" />}
                      <span className={cn('text-[13.5px] font-medium flex-1', done ? 'line-through text-stone' : 'text-ink')}>{task.title}</span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
        <div className="pb-8" />
      </div>
    </div>
  )
}
