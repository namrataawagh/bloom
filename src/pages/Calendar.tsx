import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, parseISO, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react'
import { useHabitsStore } from '@/stores/useHabitsStore'
import { useJournalStore } from '@/stores/useJournalStore'
import { useActivitiesStore } from '@/stores/useActivitiesStore'
import { useTasksStore } from '@/stores/useTasksStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/shared/PageHeader'
import { DEFAULT_LIFE_AREAS, MOOD_LABELS } from '@/lib/constants'
import { todayISO, cn } from '@/lib/utils'

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const { getHabitsForDate, getLogForDate } = useHabitsStore()
  const { entries } = useJournalStore()
  const { activities } = useActivitiesStore()
  const { tasks } = useTasksStore()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Pad to start on Monday
  const startPad = (monthStart.getDay() + 6) % 7
  const paddedDays: (Date | null)[] = [...Array(startPad).fill(null), ...calDays]

  const getDateActivity = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const habits = getHabitsForDate(dateStr)
    const completedHabits = habits.filter((h) => getLogForDate(h.id, dateStr)?.status === 'completed').length
    const journalCount = entries.filter((e) => e.entryDate === dateStr).length
    const activityCount = activities.filter((a) => a.date === dateStr).length
    const taskCount = tasks.filter((t) => t.dueDate === dateStr && t.status !== 'completed').length
    return { completedHabits, totalHabits: habits.length, journalCount, activityCount, taskCount }
  }

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
  const selectedDayData = getDateActivity(selectedDate)
  const selectedJournals = entries.filter((e) => e.entryDate === selectedDateStr)
  const selectedActivities = activities.filter((a) => a.date === selectedDateStr)
  const selectedTasks = tasks.filter((t) => t.dueDate === selectedDateStr)

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <PageHeader title="Calendar" description="See your life at a glance" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-5">
              {/* Month navigation */}
              <div className="flex items-center justify-between mb-5">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-xl hover:bg-linen transition-colors">
                  <ChevronLeft className="h-4 w-4 text-graphite" />
                </button>
                <h2 className="font-semibold text-ink">{format(currentMonth, 'MMMM yyyy')}</h2>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-xl hover:bg-linen transition-colors">
                  <ChevronRight className="h-4 w-4 text-graphite" />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d} className="text-center text-xs font-medium text-stone py-1">{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {paddedDays.map((day, idx) => {
                  if (!day) return <div key={`pad-${idx}`} />
                  const { completedHabits, totalHabits, journalCount, activityCount, taskCount } = getDateActivity(day)
                  const isSelected = isSameDay(day, selectedDate)
                  const isTodayDate = isToday(day)
                  const hasContent = completedHabits > 0 || journalCount > 0 || activityCount > 0

                  return (
                    <button
                      key={format(day, 'yyyy-MM-dd')}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        'aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm transition-all duration-150 p-1',
                        isSelected ? 'bg-mint text-white' : isTodayDate ? 'bg-mint/10 text-graphite ring-2 ring-ink' : 'hover:bg-linen text-graphite',
                        !isSameMonth(day, currentMonth) && 'opacity-30'
                      )}
                    >
                      <span className="font-medium text-sm">{format(day, 'd')}</span>
                      {hasContent && (
                        <div className="flex gap-0.5">
                          {completedHabits > 0 && <div className={cn('w-1 h-1 rounded-pill', isSelected ? 'bg-white' : 'bg-mint')} />}
                          {journalCount > 0 && <div className={cn('w-1 h-1 rounded-pill', isSelected ? 'bg-white' : 'bg-periwinkle')} />}
                          {activityCount > 0 && <div className={cn('w-1 h-1 rounded-pill', isSelected ? 'bg-white' : 'bg-marigold')} />}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-xs text-stone">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-pill bg-mint inline-block" />Habits</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-pill bg-periwinkle inline-block" />Journal</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-pill bg-marigold inline-block" />Activity</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected day detail */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{format(selectedDate, 'EEEE, MMMM d')}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Habits */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Habits</p>
                  {selectedDayData.totalHabits === 0 ? (
                    <p className="text-xs text-stone">No habits scheduled</p>
                  ) : (
                    <p className="text-sm text-graphite">
                      {selectedDayData.completedHabits} / {selectedDayData.totalHabits} completed
                    </p>
                  )}
                </div>

                {selectedJournals.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Journal</p>
                    {selectedJournals.map((entry) => (
                      <div key={entry.id} className="text-sm text-graphite py-1">
                        {entry.title || 'Journal entry'}
                      </div>
                    ))}
                  </div>
                )}

                {selectedActivities.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Activities</p>
                    {selectedActivities.map((a) => {
                      const area = DEFAULT_LIFE_AREAS.find((la) => la.id === a.lifeAreaId)
                      return (
                        <div key={a.id} className="flex items-center gap-2 text-sm text-graphite py-1">
                          <span>{area?.icon}</span> {a.title}
                        </div>
                      )
                    })}
                  </div>
                )}

                {selectedTasks.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-stone uppercase tracking-wider mb-2">Tasks Due</p>
                    {selectedTasks.map((t) => (
                      <div key={t.id} className="text-sm text-graphite py-1">{t.title}</div>
                    ))}
                  </div>
                )}

                {selectedDayData.totalHabits === 0 && selectedJournals.length === 0 && selectedActivities.length === 0 && selectedTasks.length === 0 && (
                  <p className="text-sm text-stone text-center py-4">Nothing recorded for this day yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
