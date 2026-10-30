import { useState } from 'react'
import { format, subDays, startOfWeek, addDays, startOfMonth, getDaysInMonth, subMonths, getISOWeeksInYear, startOfYear, addWeeks } from 'date-fns'
import { CheckCircle2, Circle } from 'lucide-react'
import { useHabitsStore } from '@/stores/useHabitsStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/shared/PageHeader'
import { DEFAULT_LIFE_AREAS } from '@/lib/constants'
import { cn, todayISO } from '@/lib/utils'

type View = 'weekly' | 'monthly' | 'yearly'

const DAYS_SHORT = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function Tracker() {
  const { habits, logs, logHabit } = useHabitsStore()
  const [view, setView] = useState<View>('weekly')
  const today = new Date()
  const todayStr = todayISO()

  const activeHabits = habits.filter((h) => h.status === 'active')

  // Helpers
  const getLog = (habitId: string, dateStr: string) =>
    logs.find((l) => l.habitId === habitId && l.date === dateStr)

  const isDone = (habitId: string, dateStr: string) =>
    getLog(habitId, dateStr)?.status === 'completed'

  const toggle = (habitId: string, dateStr: string) => {
    const current = getLog(habitId, dateStr)?.status
    logHabit(habitId, dateStr, current === 'completed' ? 'not_done' : 'completed')
  }

  // ── Weekly view ─────────────────────────────────────────────────────────────
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(weekStart, i)
    return { date: d, str: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE'), day: format(d, 'd') }
  })

  // ── Monthly view ─────────────────────────────────────────────────────────────
  const [monthOffset, setMonthOffset] = useState(0)
  const currentMonth = subMonths(today, -monthOffset) // monthOffset <= 0
  const monthDays = getDaysInMonth(currentMonth)
  const monthStart = startOfMonth(currentMonth)
  const monthDayArr = Array.from({ length: monthDays }, (_, i) => {
    const d = addDays(monthStart, i)
    return { date: d, str: format(d, 'yyyy-MM-dd'), day: i + 1 }
  })

  // ── Yearly view (heatmap) ────────────────────────────────────────────────────
  const yearStart = startOfYear(today)
  const totalWeeks = 53

  function getHeatColor(count: number, total: number): string {
    if (total === 0) return '#f5f5f5'
    const ratio = count / total
    if (ratio === 0)   return '#efefef'
    if (ratio < 0.25)  return '#c8e8c8'
    if (ratio < 0.5)   return '#9bd8a9'
    if (ratio < 0.75)  return '#6bb87b'
    return '#3d8c4f'
  }

  // Completion rate per day for heatmap
  const yearDayCompletion: Record<string, { done: number; total: number }> = {}
  const totalHabits = activeHabits.length
  for (let w = 0; w < totalWeeks; w++) {
    for (let d = 0; d < 7; d++) {
      const date = addDays(addWeeks(yearStart, w), d)
      if (date > today) break
      const dateStr = format(date, 'yyyy-MM-dd')
      const done = activeHabits.filter((h) => isDone(h.id, dateStr)).length
      yearDayCompletion[dateStr] = { done, total: totalHabits }
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Tracker"
        description="All your habits in one place — weekly, monthly, and over the year."
        actions={
          <div className="flex gap-1 bg-linen rounded-xl p-1 border border-ash">
            {(['weekly', 'monthly', 'yearly'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-body-sm font-medium transition-all capitalize',
                  view === v ? 'bg-ink text-white shadow-craft-sm' : 'text-stone hover:text-graphite'
                )}
              >{v}</button>
            ))}
          </div>
        }
      />

      {activeHabits.length === 0 && (
        <div className="text-center py-20 text-stone text-body-sm">
          No active habits yet. Add habits in the Habits section.
        </div>
      )}

      {/* ── WEEKLY ─────────────────────────────────────────────────────────── */}
      {view === 'weekly' && activeHabits.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Week of {format(weekStart, 'MMM d, yyyy')}</CardTitle>
              <div className="flex gap-2">
                {weekDays.map((d) => (
                  <div key={d.str} className="text-center">
                    <div className="text-caption text-stone w-8">{d.label}</div>
                    <div className={cn('text-caption font-semibold w-8 text-center', d.str === todayStr ? 'text-ink' : 'text-stone')}>{d.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="divide-y divide-ash">
              {activeHabits.map((habit) => {
                const area = DEFAULT_LIFE_AREAS.find((a) => a.id === habit.lifeAreaId)
                const completedCount = weekDays.filter((d) => isDone(habit.id, d.str)).length
                return (
                  <div key={habit.id} className="flex items-center gap-3 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-body-sm font-medium text-ink truncate">{habit.name}</p>
                      {area && <p className="text-caption text-stone">{area.name}</p>}
                    </div>
                    <div className="flex gap-2 items-center">
                      {weekDays.map((d) => {
                        const done = isDone(habit.id, d.str)
                        const isFuture = d.str > todayStr
                        return (
                          <button
                            key={d.str}
                            disabled={isFuture}
                            onClick={() => !isFuture && toggle(habit.id, d.str)}
                            className={cn(
                              'w-8 h-8 rounded-xl flex items-center justify-center transition-all',
                              done ? 'shadow-craft-sm' : 'border border-ash hover:border-stone',
                              isFuture && 'opacity-30 cursor-default',
                              d.str === todayStr && !done && 'border-graphite',
                            )}
                            style={done ? { backgroundColor: area?.color || '#9bd8a9' } : {}}
                            title={d.str}
                          >
                            {done
                              ? <CheckCircle2 className="h-4 w-4 text-white" />
                              : <Circle className="h-3.5 w-3.5 text-ash" />
                            }
                          </button>
                        )
                      })}
                      <span className="text-caption text-stone w-10 text-right">{completedCount}/7</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Week summary */}
            <div className="mt-4 pt-4 border-t border-ash grid grid-cols-7 gap-2">
              {weekDays.map((d) => {
                const done = activeHabits.filter((h) => isDone(h.id, d.str)).length
                const pct = activeHabits.length ? done / activeHabits.length : 0
                return (
                  <div key={d.str} className="text-center">
                    <div className="h-12 w-full bg-linen rounded-xl overflow-hidden flex flex-col justify-end">
                      <div
                        className="w-full rounded-xl transition-all duration-500"
                        style={{ height: `${pct * 100}%`, backgroundColor: '#9bd8a9' }}
                      />
                    </div>
                    <div className="text-caption text-stone mt-1">{done}/{activeHabits.length}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── MONTHLY ────────────────────────────────────────────────────────── */}
      {view === 'monthly' && activeHabits.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
              <div className="flex gap-2">
                <button onClick={() => setMonthOffset((o) => o - 1)} className="px-3 py-1 rounded-xl text-body-sm border border-ash hover:bg-linen transition-colors text-graphite">Prev</button>
                <button onClick={() => setMonthOffset(0)} className="px-3 py-1 rounded-xl text-body-sm border border-ash hover:bg-linen transition-colors text-graphite">Today</button>
                <button onClick={() => setMonthOffset((o) => Math.min(0, o + 1))} className="px-3 py-1 rounded-xl text-body-sm border border-ash hover:bg-linen transition-colors text-graphite">Next</button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 overflow-x-auto">
            <table className="w-full text-caption border-collapse" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th className="text-left py-2 pr-4 text-stone font-medium w-36">Habit</th>
                  {monthDayArr.map((d) => (
                    <th key={d.day} className={cn('text-center py-2 px-0.5 text-stone font-medium w-6', d.str === todayStr && 'text-ink')}>
                      {d.day}
                    </th>
                  ))}
                  <th className="text-center py-2 px-2 text-stone font-medium">%</th>
                </tr>
              </thead>
              <tbody>
                {activeHabits.map((habit) => {
                  const area = DEFAULT_LIFE_AREAS.find((a) => a.id === habit.lifeAreaId)
                  const pastDays = monthDayArr.filter((d) => d.str <= todayStr)
                  const done = pastDays.filter((d) => isDone(habit.id, d.str)).length
                  const pct = pastDays.length ? Math.round((done / pastDays.length) * 100) : 0
                  return (
                    <tr key={habit.id} className="border-t border-ash/50">
                      <td className="py-2 pr-4 text-body-sm font-medium text-ink truncate max-w-36" title={habit.name}>
                        {habit.name}
                      </td>
                      {monthDayArr.map((d) => {
                        const done = isDone(habit.id, d.str)
                        const isFuture = d.str > todayStr
                        return (
                          <td key={d.str} className="text-center px-0.5 py-1">
                            <button
                              disabled={isFuture}
                              onClick={() => !isFuture && toggle(habit.id, d.str)}
                              className={cn(
                                'w-5 h-5 rounded-md mx-auto flex items-center justify-center transition-all',
                                isFuture ? 'bg-linen/50 cursor-default' : done ? '' : 'bg-linen hover:bg-ash cursor-pointer'
                              )}
                              style={done ? { backgroundColor: area?.color || '#9bd8a9' } : {}}
                            />
                          </td>
                        )
                      })}
                      <td className="text-center py-1 px-2">
                        <span className="text-caption font-semibold text-graphite">{pct}%</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* ── YEARLY heatmap ─────────────────────────────────────────────────── */}
      {view === 'yearly' && activeHabits.length > 0 && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Overall Completion - {today.getFullYear()}</CardTitle></CardHeader>
            <CardContent className="pt-2 overflow-x-auto">
              {/* Month labels */}
              <div className="flex gap-px mb-1 pl-0" style={{ minWidth: 728 }}>
                {MONTHS_SHORT.map((m) => (
                  <div key={m} className="text-caption text-stone" style={{ width: `${100/12}%` }}>{m}</div>
                ))}
              </div>
              {/* Heatmap grid: 7 rows (days) × weeks */}
              <div className="flex gap-px" style={{ minWidth: 728 }}>
                {Array.from({ length: totalWeeks }, (_, w) => (
                  <div key={w} className="flex flex-col gap-px">
                    {Array.from({ length: 7 }, (_, d) => {
                      const date = addDays(addWeeks(yearStart, w), d)
                      if (date > today || date < yearStart) return <div key={d} className="w-3 h-3" />
                      const dateStr = format(date, 'yyyy-MM-dd')
                      const comp = yearDayCompletion[dateStr] || { done: 0, total: totalHabits }
                      return (
                        <div
                          key={d}
                          className="w-3 h-3 rounded-sm transition-all"
                          style={{ backgroundColor: getHeatColor(comp.done, comp.total) }}
                          title={`${dateStr}: ${comp.done}/${comp.total}`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-caption text-stone">Less</span>
                {['#efefef', '#c8e8c8', '#9bd8a9', '#6bb87b', '#3d8c4f'].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
                ))}
                <span className="text-caption text-stone">More</span>
              </div>
            </CardContent>
          </Card>

          {/* Per-habit streaks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeHabits.map((habit) => {
              const area = DEFAULT_LIFE_AREAS.find((a) => a.id === habit.lifeAreaId)
              const yearTotal = Array.from({ length: 365 }, (_, i) => format(addDays(yearStart, i), 'yyyy-MM-dd'))
                .filter((d) => d <= todayStr)
              const completedCount = yearTotal.filter((d) => isDone(habit.id, d)).length
              const pct = yearTotal.length ? Math.round((completedCount / yearTotal.length) * 100) : 0
              // current streak
              let streak = 0
              let cursor = today
              while (isDone(habit.id, format(cursor, 'yyyy-MM-dd'))) {
                streak++
                cursor = subDays(cursor, 1)
              }
              return (
                <Card key={habit.id}>
                  <CardContent className="pt-5 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-body-sm font-semibold text-ink">{habit.name}</p>
                        {area && <p className="text-caption text-stone">{area.name}</p>}
                      </div>
                      <span className="text-subheading font-semibold text-ink font-sans">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-linen rounded-pill overflow-hidden mb-2">
                      <div className="h-full rounded-pill transition-all" style={{ width: `${pct}%`, backgroundColor: area?.color || '#9bd8a9' }} />
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <div className="text-body-sm font-semibold text-ink">{streak}</div>
                        <div className="text-caption text-stone">day streak</div>
                      </div>
                      <div>
                        <div className="text-body-sm font-semibold text-ink">{completedCount}</div>
                        <div className="text-caption text-stone">this year</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
