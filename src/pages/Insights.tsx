import { format, subDays } from 'date-fns'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CheckSquare, BookOpen, Activity, Target } from 'lucide-react'
import { useHabitsStore } from '@/stores/useHabitsStore'
import { useJournalStore } from '@/stores/useJournalStore'
import { useActivitiesStore } from '@/stores/useActivitiesStore'
import { useMoodStore } from '@/stores/useMoodStore'
import { useGoalsStore } from '@/stores/useGoalsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/shared/PageHeader'
import { DEFAULT_LIFE_AREAS, MOOD_LABELS } from '@/lib/constants'

export function Insights() {
  const { habits, logs } = useHabitsStore()
  const { entries } = useJournalStore()
  const { activities } = useActivitiesStore()
  const { logs: moodLogs } = useMoodStore()
  const { goals } = useGoalsStore()

  // Last 7 days habit completion
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = format(subDays(new Date(), 6 - i), 'yyyy-MM-dd')
    const completed = logs.filter((l) => l.date === date && l.status === 'completed').length
    return { date: format(subDays(new Date(), 6 - i), 'EEE'), completed }
  })

  // Activities by area
  const actsByArea = DEFAULT_LIFE_AREAS.map((area) => ({
    name: area.name,
    value: activities.filter((a) => a.lifeAreaId === area.id).length,
    color: area.color,
  })).filter((a) => a.value > 0)

  // Goals by status
  const goalsByStatus = [
    { name: 'Not started', value: goals.filter((g) => g.status === 'not_started').length, color: '#bebbba' },
    { name: 'In progress', value: goals.filter((g) => g.status === 'in_progress').length, color: '#9bd8a9' },
    { name: 'Completed',   value: goals.filter((g) => g.status === 'completed').length,   color: '#41413f' },
    { name: 'Paused',      value: goals.filter((g) => g.status === 'paused').length,      color: '#fde99b' },
  ].filter((s) => s.value > 0)

  // Mood frequency (last 30 days)
  const recentMoods = moodLogs.slice(0, 30)
  const moodCounts: Record<string, number> = {}
  recentMoods.forEach((log) => log.moodLabels.forEach((m) => { moodCounts[m] = (moodCounts[m] || 0) + 1 }))
  const moodData = Object.entries(moodCounts).map(([key, count]) => ({
    name: MOOD_LABELS.find((m) => m.value === key)?.label || key,
    count,
    color: MOOD_LABELS.find((m) => m.value === key)?.color || '#bebbba',
  })).sort((a, b) => b.count - a.count)

  const totalActivities = activities.length
  const totalJournalEntries = entries.length
  const totalHabitsCompleted = logs.filter((l) => l.status === 'completed').length
  const activeGoals = goals.filter((g) => g.status === 'in_progress').length

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <PageHeader title="Insights" description="Notice patterns, celebrate consistency, stay curious" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Habits completed', value: totalHabitsCompleted, cardClass: 'card-mint'       },
          { label: 'Journal entries',  value: totalJournalEntries,  cardClass: 'card-marigold'   },
          { label: 'Activities logged',value: totalActivities,      cardClass: 'card-periwinkle' },
          { label: 'Active goals',     value: activeGoals,          cardClass: 'card-sky'        },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.cardClass} rounded-3xl p-5 relative overflow-hidden`}>
            <div className="absolute -top-3 -right-3 w-14 h-14 rounded-pill bg-white/30 pointer-events-none" />
            <div className="text-2xl font-bold text-ink font-sans leading-none mb-1">{stat.value}</div>
            <div className="text-body-sm font-medium text-graphite">{stat.label}</div>
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit completion last 7 days */}
        <Card>
          <CardHeader>
            <CardTitle>Habits - Last 7 Days</CardTitle>
            <p className="text-xs text-stone mt-0.5">Daily habit completions</p>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <p className="text-sm text-stone text-center py-8">No habit data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={last7Days} barSize={28}>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #E8E6DF', borderRadius: '12px', fontSize: '12px' }}
                    cursor={{ fill: '#F5F4EE' }}
                  />
                  <Bar dataKey="completed" fill="#7D9B76" radius={[6, 6, 0, 0]} name="Habits done" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Activities by life area */}
        <Card>
          <CardHeader>
            <CardTitle>Activities by Area</CardTitle>
            <p className="text-xs text-stone mt-0.5">All time</p>
          </CardHeader>
          <CardContent>
            {actsByArea.length === 0 ? (
              <p className="text-sm text-stone text-center py-8">No activities logged yet</p>
            ) : (
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={actsByArea} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65}>
                      {actsByArea.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {actsByArea.map((area) => (
                    <div key={area.name} className="flex items-center gap-2 text-sm">
                      <div className="w-2.5 h-2.5 rounded-pill shrink-0" style={{ backgroundColor: area.color }} />
                      <span className="text-graphite flex-1 truncate">{area.name}</span>
                      <span className="font-medium text-ink">{area.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood frequency */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Patterns</CardTitle>
            <p className="text-xs text-stone mt-0.5">Last 30 days</p>
          </CardHeader>
          <CardContent>
            {moodData.length === 0 ? (
              <p className="text-sm text-stone text-center py-8">No mood data yet. Log your mood from the dashboard.</p>
            ) : (
              <div className="space-y-2">
                {moodData.slice(0, 6).map((mood) => (
                  <div key={mood.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-pill shrink-0" style={{ backgroundColor: mood.color }} />
                    <div className="flex-1 h-2 bg-linen rounded-pill overflow-hidden">
                      <div
                        className="h-full rounded-pill transition-all duration-700"
                        style={{ width: `${(mood.count / (moodData[0]?.count || 1)) * 100}%`, backgroundColor: mood.color }}
                      />
                    </div>
                    <span className="text-xs text-stone w-16 text-right">{mood.name} ({mood.count})</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals overview */}
        <Card>
          <CardHeader>
            <CardTitle>Goals Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {goals.length === 0 ? (
              <p className="text-sm text-stone text-center py-8">No goals created yet</p>
            ) : (
              <div className="space-y-4">
                {goalsByStatus.length > 0 && (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={120} height={120}>
                      <PieChart>
                        <Pie data={goalsByStatus} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55}>
                          {goalsByStatus.map((entry, idx) => (
                            <Cell key={idx} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5">
                      {goalsByStatus.map((s) => (
                        <div key={s.name} className="flex items-center gap-2 text-sm">
                          <div className="w-2.5 h-2.5 rounded-pill" style={{ backgroundColor: s.color }} />
                          <span className="text-graphite">{s.name}</span>
                          <span className="font-medium text-ink ml-auto">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-stone">Total: {goals.length} goals across all life areas</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-center text-stone pb-4">
        These insights are here to help you reflect, not to judge you. Every pattern you notice is valuable.
      </p>
    </div>
  )
}
