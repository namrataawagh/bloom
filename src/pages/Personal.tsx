import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react'
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns'
import { useSidequestStore, SIDEQUEST_CATEGORIES, SIDEQUEST_CATEGORY_COLORS, SidequestCategory } from '@/stores/useSidequestStore'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { cn } from '@/lib/utils'
import { Leaf } from 'lucide-react'

const WEEK_TABS = 4 // show past 4 weeks + current

function weekKey(date: Date): string {
  return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-ww')
}

function weekLabel(date: Date): string {
  const start = startOfWeek(date, { weekStartsOn: 1 })
  return format(start, 'MMM d')
}

const CARD_COLORS: Record<SidequestCategory, string> = {
  'hobbies':      'card-mint',
  'just-for-me':  'card-periwinkle',
  'sidequesting': 'card-marigold',
  'to-dos':       '',
  'to-explore':   'card-sky',
  'to-eat':       'card-marigold',
}

export function Personal() {
  const { sidequests, addSidequest, deleteSidequest, toggleWeek, isCompletedThisWeek } = useSidequestStore()


  const [activeSection, setActiveSection] = useState<SidequestCategory>('hobbies')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [newCategory, setNewCategory] = useState<SidequestCategory>('hobbies')
  const [weekOffset, setWeekOffset] = useState(0) // 0 = current week

  const currentWeekDate = addWeeks(new Date(), weekOffset)
  const currentKey = weekKey(currentWeekDate)
  const isCurrentWeek = weekOffset === 0

  const saveItem = () => {
    if (!newTitle.trim()) return
    addSidequest({ category: activeSection, title: newTitle.trim(), notes: newNotes.trim() || undefined })
    setNewTitle(''); setNewNotes(''); setShowAddForm(false)
  }

  const filteredItems = sidequests.filter((s) => s.category === activeSection)

  const weeks = Array.from({ length: WEEK_TABS }, (_, i) => {
    const d = subWeeks(new Date(), WEEK_TABS - 1 - i)
    return { date: d, key: weekKey(d), label: weekLabel(d) }
  })

  const catColorClass = CARD_COLORS[activeSection] || ''

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Cloud strip decoration */}
      <div className="relative overflow-hidden h-4 rounded-3xl opacity-50"
        style={{ background: 'linear-gradient(90deg, #9bd8a9, #b8caf5, #9ed4ef, #fde99b)', backgroundSize: '400% 100%' }} />

      <PageHeader
        title="Personal"
        description="Hobbies, adventures, self-care, and all the things that make you, you."
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4" /> Add sidequest
          </Button>
        }
      />

      {/* ── Sidequests section ──────────────────────────────────────────── */}
      <div>
        <h2 className="font-serif text-2xl text-ink font-normal mb-1">Sidequests</h2>
        <p className="text-body-sm text-stone mb-4">Your personal list of things to do, explore, try, and enjoy.</p>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {SIDEQUEST_CATEGORIES.map(({ value, label }) => {
            const color = SIDEQUEST_CATEGORY_COLORS[value]
            const isActive = activeSection === value
            const doneCount = sidequests.filter((s) => s.category === value && s.completedWeeks.includes(currentKey)).length
            const totalCount = sidequests.filter((s) => s.category === value).length
            return (
              <button
                key={value}
                onClick={() => { setActiveSection(value); setShowAddForm(false) }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl text-body-sm font-medium border transition-all',
                  isActive ? 'border-transparent shadow-craft-sm text-ink' : 'bg-white border-ash text-stone hover:border-stone'
                )}
                style={isActive ? { backgroundColor: color + 'cc', borderColor: color } : {}}
              >
                {label}
                {totalCount > 0 && (
                  <span className="text-caption bg-white/60 px-1.5 rounded-pill">{doneCount}/{totalCount}</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Week selector */}
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => setWeekOffset((o) => o - 1)} className="p-1.5 rounded-xl border border-ash text-stone hover:bg-linen transition-colors text-caption">Prev</button>
          <div className="flex gap-1.5 flex-wrap">
            {weeks.map((w) => (
              <button
                key={w.key}
                onClick={() => setWeekOffset(weeks.findIndex((wk) => wk.key === w.key) - (WEEK_TABS - 1))}
                className={cn(
                  'px-3 py-1 rounded-pill text-caption font-medium border transition-all',
                  w.key === currentKey ? 'bg-ink text-white border-ink' : 'bg-white border-ash text-stone hover:border-stone'
                )}
              >{w.key === weekKey(new Date()) ? 'This week' : w.label}</button>
            ))}
          </div>
          {weekOffset < 0 && <button onClick={() => setWeekOffset(0)} className="p-1.5 rounded-xl border border-ash text-stone hover:bg-linen transition-colors text-caption">Today</button>}
        </div>

        {/* Add form */}
        {showAddForm && (
          <div className={cn('rounded-3xl p-5 mb-4 relative overflow-hidden animate-scale-in', catColorClass || 'bg-white border border-ash')}
            style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div className="relative z-10 space-y-3">
              <div className="flex gap-2 flex-wrap mb-1">
                {SIDEQUEST_CATEGORIES.map(({ value, label }) => (
                  <button key={value} onClick={() => setNewCategory(value)}
                    className={cn('px-3 py-1 rounded-pill text-caption border font-medium transition-all',
                      newCategory === value ? 'bg-ink text-white border-ink' : 'glass-sm text-graphite border-white/60 hover:bg-white/60'
                    )}>{label}</button>
                ))}
              </div>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveItem()}
                placeholder="What's the sidequest?" autoFocus
                className="w-full h-10 px-4 rounded-xl glass border border-white/70 text-ink text-body-sm placeholder:text-stone focus:outline-none focus:ring-1 focus:ring-ink/10" />
              <input value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="w-full h-9 px-4 rounded-xl glass-sm border border-white/60 text-ink text-body-sm placeholder:text-stone focus:outline-none focus:ring-1 focus:ring-ink/10" />
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={() => { setActiveSection(newCategory); saveItem() }} disabled={!newTitle.trim()}>Save</Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {/* Items */}
        {filteredItems.length === 0 ? (
          <div className={cn('rounded-3xl p-8 text-center relative overflow-hidden', catColorClass || 'bg-linen')}
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-pill glass opacity-30 pointer-events-none" />
            <p className="font-serif text-xl text-ink font-normal mb-2">Nothing here yet</p>
            <p className="text-body-sm text-graphite mb-4">
              {activeSection === 'hobbies'      && 'Add hobbies you want to pursue or are currently exploring.'}
              {activeSection === 'just-for-me'  && 'Things just for you — self-care, treats, rituals.'}
              {activeSection === 'sidequesting' && 'Fun adventures and spontaneous things to try.'}
              {activeSection === 'to-dos'       && 'Personal to-dos that do not fit anywhere else.'}
              {activeSection === 'to-explore'   && 'Places, ideas, and experiences to explore.'}
              {activeSection === 'to-eat'       && 'Restaurants, recipes, and foods to try.'}
            </p>
            <Button variant="ghost" size="sm" onClick={() => setShowAddForm(true)}><Plus className="h-3.5 w-3.5" /> Add first item</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const doneThisWeek = item.completedWeeks.includes(currentKey)
              const totalDone = item.completedWeeks.length
              const color = SIDEQUEST_CATEGORY_COLORS[item.category]
              return (
                <div
                  key={item.id}
                  className={cn('rounded-2xl p-4 relative overflow-hidden border transition-all group',
                    doneThisWeek ? 'border-transparent' : 'border-ash bg-white'
                  )}
                  style={doneThisWeek ? { backgroundColor: color + 'bb', boxShadow: `0 4px 20px ${color}55` } : {}}
                >
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggleWeek(item.id, currentKey)} className="mt-0.5 shrink-0">
                      {doneThisWeek
                        ? <CheckCircle2 style={{ width:20,height:20 }} className="text-graphite" />
                        : <Circle style={{ width:20,height:20 }} className="text-ash" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-body-sm font-medium text-ink', doneThisWeek && 'line-through opacity-70')}>{item.title}</p>
                      {item.notes && <p className="text-caption text-stone mt-0.5">{item.notes}</p>}
                      {totalDone > 0 && (
                        <p className="text-caption text-graphite/60 mt-1">{totalDone} week{totalDone !== 1 ? 's' : ''} done</p>
                      )}
                    </div>
                    <button onClick={() => deleteSidequest(item.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-stone hover:text-papaya transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
            {/* Add more button */}
            <button onClick={() => setShowAddForm(true)}
              className="rounded-2xl p-4 border-2 border-dashed border-ash text-stone hover:border-graphite hover:text-graphite transition-colors flex items-center justify-center gap-2 text-body-sm">
              <Plus className="h-4 w-4" /> Add item
            </button>
          </div>
        )}
      </div>


      <div className="pb-6" />
    </div>
  )
}
