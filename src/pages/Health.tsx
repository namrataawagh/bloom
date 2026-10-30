import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, CheckCircle2, Circle, Trash2, Pencil, Moon, Sun, Utensils, Dumbbell, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useHabitsStore } from '@/stores/useHabitsStore'
import { useActivitiesStore } from '@/stores/useActivitiesStore'
import { useHealthExtStore, MealType } from '@/stores/useHealthExtStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { todayISO, formatDate, formatDuration, cn } from '@/lib/utils'
import { format as fmt } from 'date-fns'

type Tab = 'habits' | 'food' | 'exercise' | 'sleep'

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch',     label: 'Lunch'     },
  { value: 'dinner',    label: 'Dinner'    },
  { value: 'snack',     label: 'Snack'     },
]

const SLEEP_QUALITY = [1, 2, 3, 4, 5] as const

export function Health() {
  const [tab, setTab] = useState<Tab>('habits')
  const today = todayISO()

  // Habits tab
  const { habits, logs, logHabit, getLogForDate } = useHabitsStore()
  const healthHabits = habits.filter((h) => h.lifeAreaId === 'health' && h.status === 'active')
  const completedToday = healthHabits.filter((h) => getLogForDate(h.id, today)?.status === 'completed').length
  const { activities } = useActivitiesStore()
  const healthActs = activities.filter((a) => a.lifeAreaId === 'health').slice(0, 5)

  // Food tab
  const {
    foodLogs, addFoodLog, deleteFoodLog,
    exercises, addExercise, deleteExercise,
    routines, addRoutine, deleteRoutine,
    workoutLogs, addWorkoutLog, deleteWorkoutLog,
    sleepLogs, addSleepLog, deleteSleepLog,
  } = useHealthExtStore()

  // Food form
  const [foodDate, setFoodDate] = useState(today)
  const [mealType, setMealType] = useState<MealType>('breakfast')
  const [foodDesc, setFoodDesc] = useState('')
  const [foodNotes, setFoodNotes] = useState('')

  const submitFood = () => {
    if (!foodDesc.trim()) return
    addFoodLog({ date: foodDate, mealType, description: foodDesc.trim(), notes: foodNotes.trim() || undefined })
    setFoodDesc('')
    setFoodNotes('')
  }

  // Exercise tab — routine builder
  const [showRoutineForm, setShowRoutineForm] = useState(false)
  const [routineName, setRoutineName] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<string[]>([])
  const [newExName, setNewExName] = useState('')
  const [newExCat, setNewExCat] = useState('Strength')

  const saveRoutine = () => {
    if (!routineName.trim() || selectedExercises.length === 0) return
    addRoutine(routineName.trim(), selectedExercises.map((id) => ({ exerciseId: id })))
    setRoutineName('')
    setSelectedExercises([])
    setShowRoutineForm(false)
  }

  // Log workout form
  const [showWorkoutForm, setShowWorkoutForm] = useState(false)
  const [workoutDate, setWorkoutDate] = useState(today)
  const [workoutRoutineId, setWorkoutRoutineId] = useState('')
  const [workoutDuration, setWorkoutDuration] = useState('')
  const [workoutNotes, setWorkoutNotes] = useState('')
  const [workoutRating, setWorkoutRating] = useState(3)

  const submitWorkout = () => {
    const routine = routines.find((r) => r.id === workoutRoutineId)
    addWorkoutLog({
      date: workoutDate,
      routineId: workoutRoutineId || undefined,
      routineName: routine?.name,
      durationMinutes: workoutDuration ? Number(workoutDuration) : undefined,
      notes: workoutNotes.trim() || undefined,
      rating: workoutRating,
    })
    setWorkoutRoutineId('')
    setWorkoutDuration('')
    setWorkoutNotes('')
    setShowWorkoutForm(false)
  }

  // Sleep form
  const [showSleepForm, setShowSleepForm] = useState(false)
  const [sleepDate, setSleepDate] = useState(today)
  const [sleepTime, setSleepTime] = useState('22:30')
  const [wakeTime, setWakeTime] = useState('07:00')
  const [sleepQuality, setSleepQuality] = useState<1|2|3|4|5>(3)
  const [sleepNotes, setSleepNotes] = useState('')

  const submitSleep = () => {
    addSleepLog({ date: sleepDate, sleepTime, wakeTime, quality: sleepQuality, notes: sleepNotes || undefined })
    setShowSleepForm(false)
    setSleepNotes('')
  }

  const todayFoodLogs = foodLogs.filter((l) => l.date === today)
  const todaySleep = sleepLogs.find((l) => l.date === today)
  const recentWorkouts = workoutLogs.slice(0, 8)
  const recentSleep = sleepLogs.slice(0, 10)

  const tabs: { id: Tab; label: string; icon: typeof Heart }[] = [
    { id: 'habits',   label: 'Habits',   icon: Heart    },
    { id: 'food',     label: 'Food',     icon: Utensils },
    { id: 'exercise', label: 'Exercise', icon: Dumbbell },
    { id: 'sleep',    label: 'Sleep',    icon: Moon     },
  ]

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Health"
        description="Physical fitness, nutrition, sleep, and self-care."
        actions={
          <Link to="/habits">
            <Button variant="outline" size="sm"><Plus className="h-4 w-4" /> Add habit</Button>
          </Link>
        }
      />

      {/* Tab bar */}
      <div className="flex gap-1 bg-linen rounded-xl p-1 border border-ash w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-medium transition-all',
              tab === id ? 'bg-ink text-white shadow-craft-sm' : 'text-stone hover:text-graphite'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ── HABITS TAB ─────────────────────────────────────────────────────── */}
      {tab === 'habits' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Today's habits", value: `${completedToday}/${healthHabits.length}`, Icon: CheckCircle2 },
              { label: 'Activities',     value: healthActs.length,                          Icon: Dumbbell     },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-3xl border border-ash p-4 text-center shadow-craft-xl">
                <div className="w-9 h-9 rounded-xl bg-linen border border-ash flex items-center justify-center mx-auto mb-3">
                  <s.Icon className="h-4 w-4 text-graphite" />
                </div>
                <div className="text-subheading font-semibold text-ink font-sans leading-none">{s.value}</div>
                <div className="text-caption text-stone mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Health Habits Today</CardTitle>
                <Link to="/habits" className="text-caption text-stone hover:text-graphite font-medium transition-colors">Manage</Link>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {healthHabits.length === 0 ? (
                <EmptyState icon={Heart} title="No health habits yet" description="Create habits like workout, hydration, or meditation in the Habits section."
                  action={<Link to="/habits"><Button variant="outline" size="sm"><Plus className="h-3.5 w-3.5" /> Create habit</Button></Link>} />
              ) : (
                <div className="space-y-1.5">
                  {healthHabits.map((habit) => {
                    const log  = getLogForDate(habit.id, today)
                    const done = log?.status === 'completed'
                    return (
                      <button key={habit.id} onClick={() => logHabit(habit.id, today, done ? 'not_done' : 'completed')}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-linen transition-colors text-left">
                        {done ? <CheckCircle2 style={{ width:18,height:18 }} className="text-graphite shrink-0" />
                               : <Circle      style={{ width:18,height:18 }} className="text-ash shrink-0" />}
                        <span className={cn('text-body-sm font-medium flex-1', done ? 'line-through text-stone' : 'text-ink')}>{habit.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {healthActs.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {healthActs.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 py-1.5 border-b border-ash last:border-0">
                      <div className="w-8 h-8 rounded-xl bg-mint/20 flex items-center justify-center shrink-0">
                        <Dumbbell className="h-4 w-4 text-graphite" />
                      </div>
                      <div className="flex-1">
                        <p className="text-body-sm font-medium text-graphite">{a.title}</p>
                        <p className="text-caption text-stone">{a.date}{a.durationMinutes ? ` - ${formatDuration(a.durationMinutes)}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── FOOD TAB ──────────────────────────────────────────────────────── */}
      {tab === 'food' && (
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Log a Meal</CardTitle></CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-32">
                  <label className="text-caption font-medium text-stone block mb-1">Date</label>
                  <input type="date" value={foodDate} onChange={(e) => setFoodDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-ash bg-white text-ink text-body-sm focus:outline-none focus:ring-1 focus:ring-ink/10" />
                </div>
                <div className="flex-1 min-w-40">
                  <label className="text-caption font-medium text-stone block mb-1">Meal type</label>
                  <div className="flex gap-2 flex-wrap">
                    {MEAL_TYPES.map((m) => (
                      <button key={m.value} onClick={() => setMealType(m.value)}
                        className={cn('px-3 py-1.5 rounded-pill text-body-sm font-medium border transition-all',
                          mealType === m.value ? 'bg-ink text-white border-ink' : 'bg-white border-ash text-stone hover:border-stone'
                        )}>{m.label}</button>
                    ))}
                  </div>
                </div>
              </div>
              <Input label="What did you eat?" value={foodDesc} onChange={(e) => setFoodDesc(e.target.value)}
                placeholder="e.g. Oats with banana and almond milk" onKeyDown={(e) => e.key === 'Enter' && submitFood()} />
              <Input label="Notes (optional)" value={foodNotes} onChange={(e) => setFoodNotes(e.target.value)} placeholder="How did it make you feel?" />
              <Button variant="primary" onClick={submitFood} disabled={!foodDesc.trim()}>Log meal</Button>
            </CardContent>
          </Card>

          {/* Today's food */}
          {todayFoodLogs.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Today</CardTitle></CardHeader>
              <CardContent className="pt-4 space-y-2">
                {MEAL_TYPES.map((m) => {
                  const entries = todayFoodLogs.filter((l) => l.mealType === m.value)
                  if (entries.length === 0) return null
                  return (
                    <div key={m.value}>
                      <p className="text-caption font-semibold text-stone uppercase tracking-wider mb-1.5">{m.label}</p>
                      {entries.map((e) => (
                        <div key={e.id} className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-linen group">
                          <div className="flex-1">
                            <p className="text-body-sm font-medium text-ink">{e.description}</p>
                            {e.notes && <p className="text-caption text-stone">{e.notes}</p>}
                          </div>
                          <button onClick={() => deleteFoodLog(e.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-stone hover:text-papaya transition-all">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}

          {/* History */}
          {foodLogs.filter((l) => l.date !== today).length > 0 && (
            <Card>
              <CardHeader><CardTitle>History</CardTitle></CardHeader>
              <CardContent className="pt-4 space-y-1">
                {foodLogs.filter((l) => l.date !== today).slice(0, 12).map((e) => (
                  <div key={e.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-linen group">
                    <div className="flex-1">
                      <span className="text-caption text-stone mr-2">{formatDate(e.date)} - {MEAL_TYPES.find((m) => m.value === e.mealType)?.label}</span>
                      <span className="text-body-sm text-ink">{e.description}</span>
                    </div>
                    <button onClick={() => deleteFoodLog(e.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-stone hover:text-papaya transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── EXERCISE TAB ──────────────────────────────────────────────────── */}
      {tab === 'exercise' && (
        <div className="space-y-6">

          {/* Log workout */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Log Workout</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowWorkoutForm(!showWorkoutForm)}>
                  <Plus className="h-3.5 w-3.5" /> Log workout
                </Button>
              </div>
            </CardHeader>
            {showWorkoutForm && (
              <CardContent className="pt-0 space-y-3 border-t border-ash mt-4">
                <div className="pt-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-caption font-medium text-stone block mb-1">Date</label>
                      <input type="date" value={workoutDate} onChange={(e) => setWorkoutDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-ash bg-white text-ink text-body-sm focus:outline-none focus:ring-1 focus:ring-ink/10" />
                    </div>
                    <div className="flex-1">
                      <label className="text-caption font-medium text-stone block mb-1">Duration (min)</label>
                      <input type="number" value={workoutDuration} onChange={(e) => setWorkoutDuration(e.target.value)} placeholder="30"
                        className="w-full h-10 px-3 rounded-xl border border-ash bg-white text-ink text-body-sm focus:outline-none focus:ring-1 focus:ring-ink/10" />
                    </div>
                  </div>
                  <div>
                    <label className="text-caption font-medium text-stone block mb-1">Routine (optional)</label>
                    <select value={workoutRoutineId} onChange={(e) => setWorkoutRoutineId(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-ash bg-white text-ink text-body-sm focus:outline-none focus:ring-1 focus:ring-ink/10">
                      <option value="">No routine - free workout</option>
                      {routines.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-caption font-medium text-stone block mb-1">How was it? ({workoutRating}/5)</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map((n) => (
                        <button key={n} onClick={() => setWorkoutRating(n)}
                          className={cn('w-8 h-8 rounded-xl text-body-sm font-medium border transition-all',
                            workoutRating >= n ? 'bg-mint border-mint text-graphite' : 'bg-white border-ash text-stone')}>{n}</button>
                      ))}
                    </div>
                  </div>
                  <Input label="Notes" value={workoutNotes} onChange={(e) => setWorkoutNotes(e.target.value)} placeholder="How did the workout go?" />
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={submitWorkout}>Save workout</Button>
                    <Button variant="ghost" onClick={() => setShowWorkoutForm(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            )}
            {recentWorkouts.length > 0 && (
              <CardContent className="pt-4 space-y-2">
                {recentWorkouts.map((w) => (
                  <div key={w.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-linen group">
                    <div className="w-8 h-8 rounded-xl bg-periwinkle/20 flex items-center justify-center shrink-0">
                      <Dumbbell className="h-4 w-4 text-graphite" />
                    </div>
                    <div className="flex-1">
                      <p className="text-body-sm font-medium text-ink">{w.routineName || 'Free workout'}</p>
                      <p className="text-caption text-stone">{formatDate(w.date)}{w.durationMinutes ? ` - ${w.durationMinutes}min` : ''}</p>
                    </div>
                    {w.rating && <span className="text-caption text-stone">{w.rating}/5</span>}
                    <button onClick={() => deleteWorkoutLog(w.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-stone hover:text-papaya transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* Routines */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Routines</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowRoutineForm(!showRoutineForm)}>
                  <Plus className="h-3.5 w-3.5" /> New routine
                </Button>
              </div>
            </CardHeader>
            {showRoutineForm && (
              <CardContent className="pt-0 space-y-4 border-t border-ash mt-0">
                <div className="pt-4 space-y-3">
                  <Input label="Routine name" value={routineName} onChange={(e) => setRoutineName(e.target.value)} placeholder="e.g. Morning strength" />
                  <div>
                    <label className="text-caption font-medium text-stone block mb-2">Select exercises</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exercises.map((ex) => (
                        <button key={ex.id} onClick={() => setSelectedExercises((prev) => prev.includes(ex.id) ? prev.filter((id) => id !== ex.id) : [...prev, ex.id])}
                          className={cn('px-3 py-1.5 rounded-pill text-body-sm border transition-all',
                            selectedExercises.includes(ex.id) ? 'bg-ink text-white border-ink' : 'bg-white border-ash text-stone hover:border-stone'
                          )}>{ex.name}</button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={newExName} onChange={(e) => setNewExName(e.target.value)} placeholder="Add exercise..."
                        className="flex-1 h-9 px-3 rounded-xl border border-ash bg-white text-ink text-body-sm focus:outline-none focus:ring-1 focus:ring-ink/10" />
                      <select value={newExCat} onChange={(e) => setNewExCat(e.target.value)}
                        className="h-9 px-3 rounded-xl border border-ash bg-white text-ink text-body-sm focus:outline-none focus:ring-1 focus:ring-ink/10">
                        {['Strength','Cardio','Core','Flexibility','Other'].map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <Button variant="outline" size="sm" onClick={() => { if (newExName.trim()) { addExercise(newExName.trim(), newExCat); setNewExName('') } }}>Add</Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={saveRoutine} disabled={!routineName.trim() || selectedExercises.length === 0}>Save routine</Button>
                    <Button variant="ghost" onClick={() => setShowRoutineForm(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            )}
            <CardContent className="pt-4">
              {routines.length === 0 ? (
                <EmptyState icon={Dumbbell} title="No routines yet" description="Build a routine by selecting exercises, then log workouts against it." />
              ) : (
                <div className="space-y-3">
                  {routines.map((r) => (
                    <div key={r.id} className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-linen group">
                      <div className="flex-1">
                        <p className="text-body-sm font-semibold text-ink">{r.name}</p>
                        <p className="text-caption text-stone">{r.exercises.map((re) => exercises.find((e) => e.id === re.exerciseId)?.name).filter(Boolean).join(', ')}</p>
                      </div>
                      <button onClick={() => deleteRoutine(r.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-stone hover:text-papaya transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── SLEEP TAB ─────────────────────────────────────────────────────── */}
      {tab === 'sleep' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Log Sleep</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setShowSleepForm(!showSleepForm)}>
                  <Plus className="h-3.5 w-3.5" /> Log sleep
                </Button>
              </div>
            </CardHeader>
            {showSleepForm && (
              <CardContent className="pt-0 border-t border-ash mt-0">
                <div className="pt-4 space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-caption font-medium text-stone block mb-1">Date (night of)</label>
                      <input type="date" value={sleepDate} onChange={(e) => setSleepDate(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-ash bg-white text-ink text-body-sm focus:outline-none focus:ring-1 focus:ring-ink/10" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-caption font-medium text-stone block mb-1 flex items-center gap-1.5"><Moon className="h-3 w-3" /> Sleep time</label>
                      <input type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-ash bg-white text-ink text-body-sm focus:outline-none focus:ring-1 focus:ring-ink/10" />
                    </div>
                    <div className="flex-1">
                      <label className="text-caption font-medium text-stone block mb-1 flex items-center gap-1.5"><Sun className="h-3 w-3" /> Wake time</label>
                      <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-ash bg-white text-ink text-body-sm focus:outline-none focus:ring-1 focus:ring-ink/10" />
                    </div>
                  </div>
                  <div>
                    <label className="text-caption font-medium text-stone block mb-2">Sleep quality</label>
                    <div className="flex gap-2">
                      {SLEEP_QUALITY.map((q) => (
                        <button key={q} onClick={() => setSleepQuality(q)}
                          className={cn('w-8 h-8 rounded-xl text-body-sm font-medium border transition-all',
                            sleepQuality === q ? 'bg-periwinkle/60 border-periwinkle text-ink' : 'bg-white border-ash text-stone')}>{q}</button>
                      ))}
                    </div>
                    <p className="text-caption text-stone mt-1">1 = poor, 5 = great</p>
                  </div>
                  <Input label="Notes (optional)" value={sleepNotes} onChange={(e) => setSleepNotes(e.target.value)} placeholder="Anything affecting sleep tonight?" />
                  <div className="flex gap-2">
                    <Button variant="primary" onClick={submitSleep}>Save</Button>
                    <Button variant="ghost" onClick={() => setShowSleepForm(false)}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Sleep history */}
          {recentSleep.length === 0 ? (
            <EmptyState icon={Moon} title="No sleep logs yet" description="Start tracking when you sleep and wake to understand your patterns." />
          ) : (
            <Card>
              <CardHeader><CardTitle>Sleep Log</CardTitle></CardHeader>
              <CardContent className="pt-4">
                {/* Average */}
                <div className="flex gap-6 mb-5 pb-4 border-b border-ash">
                  <div>
                    <div className="text-subheading font-semibold text-ink font-sans">
                      {(recentSleep.slice(0,7).reduce((s, l) => s + (l.hoursSlept ?? 0), 0) / Math.max(recentSleep.slice(0,7).length, 1)).toFixed(1)}h
                    </div>
                    <div className="text-caption text-stone">avg last week</div>
                  </div>
                  <div>
                    <div className="text-subheading font-semibold text-ink font-sans">
                      {recentSleep[0]?.hoursSlept?.toFixed(1) ?? '-'}h
                    </div>
                    <div className="text-caption text-stone">last night</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {recentSleep.map((log) => (
                    <div key={log.id} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-linen group">
                      <div className="w-9 h-9 rounded-xl bg-periwinkle/20 flex items-center justify-center shrink-0">
                        <Moon className="h-4 w-4 text-graphite" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="text-body-sm font-medium text-ink">{formatDate(log.date)}</span>
                          <span className="text-body-sm font-semibold text-graphite">{log.hoursSlept}h</span>
                        </div>
                        <p className="text-caption text-stone">
                          {log.sleepTime} to {log.wakeTime}
                          {log.quality && ` - quality ${log.quality}/5`}
                        </p>
                        {log.notes && <p className="text-caption text-stone italic">{log.notes}</p>}
                      </div>
                      {/* Sleep bar */}
                      <div className="hidden sm:block w-20 h-1.5 bg-linen rounded-pill overflow-hidden">
                        <div className="h-full bg-periwinkle rounded-pill" style={{ width: `${Math.min(((log.hoursSlept ?? 0) / 9) * 100, 100)}%` }} />
                      </div>
                      <button onClick={() => deleteSleepLog(log.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-stone hover:text-papaya transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
