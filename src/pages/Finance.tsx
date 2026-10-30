import { useState } from 'react'
import { Plus, DollarSign, TrendingUp, TrendingDown, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { EXPENSE_CATEGORIES } from '@/lib/constants'
import { todayISO, generateId, nowISO, cn } from '@/lib/utils'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Expense { id: string; amount: number; date: string; category: string; description: string; notes?: string; createdAt: string }
interface FinanceStore {
  expenses: Expense[]
  monthlyBudget: number
  currency: string
  savings: number
  addExpense: (e: Omit<Expense, 'id' | 'createdAt'>) => void
  deleteExpense: (id: string) => void
  setMonthlyBudget: (b: number) => void
  setSavings: (s: number) => void
}

const useFinanceStore = create<FinanceStore>()(persist((set) => ({
  expenses: [], monthlyBudget: 0, currency: '₹', savings: 0,
  addExpense: (e) => set((s) => ({ expenses: [{ ...e, id: generateId(), createdAt: nowISO() }, ...s.expenses] })),
  deleteExpense: (id) => set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) })),
  setMonthlyBudget: (b) => set({ monthlyBudget: b }),
  setSavings: (sv) => set({ savings: sv }),
}), { name: 'bloom-finance' }))

const catOptions = EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }))
const catColors: Record<string, string> = {
  'Food & Dining': '#7D9B76', Transport: '#9B87B0', Education: '#A5C3A3', Shopping: '#D9A894',
  Health: '#C8DAC7', Entertainment: '#B8A9C9', Travel: '#E8C4B8', Savings: '#D5CCE8', Other: '#9E9E9E',
}

export function Finance() {
  const { expenses, monthlyBudget, currency, savings, addExpense, deleteExpense, setMonthlyBudget, setSavings } = useFinanceStore()
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayISO())
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7))

  const thisMonthExpenses = expenses.filter((e) => e.date.startsWith(filterMonth))
  const totalSpent = thisMonthExpenses.reduce((s, e) => s + e.amount, 0)
  const remaining = monthlyBudget > 0 ? monthlyBudget - totalSpent : null
  const percentUsed = monthlyBudget > 0 ? Math.min((totalSpent / monthlyBudget) * 100, 100) : 0

  // By category
  const byCat: Record<string, number> = {}
  thisMonthExpenses.forEach((e) => { byCat[e.category] = (byCat[e.category] || 0) + e.amount })
  const catEntries = Object.entries(byCat).sort((a, b) => b[1] - a[1])

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const num = parseFloat(amount)
    if (!num || !description.trim()) return
    addExpense({ amount: num, date, category, description: description.trim() })
    setAmount(''); setDescription(''); setShowForm(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader title="Finance" description="Track spending, set budgets, and build financial awareness"
        actions={<Button variant="primary" size="sm" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Add expense</Button>} />

      {/* Budget setup */}
      <Card>
        <CardHeader><CardTitle>Monthly Budget</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3 items-end mb-4">
            <Input label={`Monthly budget (${currency})`} type="number" value={monthlyBudget || ''} onChange={(e) => setMonthlyBudget(Number(e.target.value))} placeholder="e.g. 30000" className="max-w-xs" />
            <Input label="Savings goal (optional)" type="number" value={savings || ''} onChange={(e) => setSavings(Number(e.target.value))} placeholder="e.g. 5000" className="max-w-xs" />
          </div>

          {monthlyBudget > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-graphite">Spent this month</span>
                <span className="font-semibold text-ink">{currency}{totalSpent.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-linen rounded-pill overflow-hidden">
                <div className="h-full rounded-pill transition-all duration-700" style={{ width: `${percentUsed}%`, backgroundColor: percentUsed > 90 ? '#D9A894' : '#7D9B76' }} />
              </div>
              <div className="flex items-center justify-between text-xs text-stone">
                <span>{currency}0</span>
                <span className={remaining !== null && remaining < 0 ? 'text-papaya font-medium' : 'text-graphite font-medium'}>
                  {remaining !== null ? (remaining >= 0 ? `${currency}${remaining.toLocaleString()} remaining` : `${currency}${Math.abs(remaining).toLocaleString()} over budget`) : ''}
                </span>
                <span>{currency}{monthlyBudget.toLocaleString()}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add expense form */}
      {showForm && (
        <Card>
          <CardHeader><CardTitle>Add Expense</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input label={`Amount (${currency})`} type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
                <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-body-sm font-medium text-graphite">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-10 px-3 text-sm rounded-xl border border-ash bg-white text-ink focus:outline-none focus:ring-1 focus:ring-ink/10/10">
                  {EXPENSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Lunch with Priya, Uber to office..." />
              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1">Add Expense</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Month filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-stone">Viewing:</label>
        <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="h-9 px-3 text-sm rounded-xl border border-ash bg-white text-graphite focus:outline-none focus:ring-1 focus:ring-ink/10/10" />
      </div>

      {/* Category breakdown */}
      {catEntries.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Spending by Category</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {catEntries.map(([cat, total]) => (
                <div key={cat} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-pill shrink-0" style={{ backgroundColor: catColors[cat] || '#9E9E9E' }} />
                  <span className="text-sm text-graphite flex-1">{cat}</span>
                  <div className="w-24 h-1.5 bg-linen rounded-pill overflow-hidden">
                    <div className="h-full rounded-pill" style={{ width: `${(total / totalSpent) * 100}%`, backgroundColor: catColors[cat] || '#9E9E9E' }} />
                  </div>
                  <span className="text-body-sm font-medium text-ink w-20 text-right">{currency}{total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expense list */}
      {thisMonthExpenses.length === 0 ? (
        <EmptyState icon={DollarSign} title="No expenses logged" description="Track your spending to understand where your money goes. No judgment - just awareness." action={<Button variant="primary" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Log first expense</Button>} />
      ) : (
        <Card>
          <CardHeader><CardTitle>All Expenses - {filterMonth}</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {thisMonthExpenses.map((e) => (
                <div key={e.id} className="flex items-center gap-3 py-2 border-b border-ash last:border-0">
                  <div className="w-2 h-2 rounded-pill shrink-0" style={{ backgroundColor: catColors[e.category] || '#9E9E9E' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-medium text-graphite truncate">{e.description}</p>
                    <p className="text-xs text-stone">{e.date} · {e.category}</p>
                  </div>
                  <span className="font-semibold text-ink shrink-0">{currency}{e.amount.toLocaleString()}</span>
                  <button onClick={() => deleteExpense(e.id)} className="p-1 text-stone hover:text-papaya transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 font-semibold text-ink">
                <span>Total</span>
                <span>{currency}{totalSpent.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
