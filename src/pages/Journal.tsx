import { useState, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { format, parseISO } from 'date-fns'
import { Plus, Search, Trash2, Tag, X, BookOpen, Bold, Italic, List, Quote, Heading2 } from 'lucide-react'
import { useJournalStore } from '@/stores/useJournalStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog'
import { PageHeader } from '@/components/shared/PageHeader'
import { EmptyState } from '@/components/shared/EmptyState'
import { JOURNAL_ENTRY_TYPES, MOOD_LABELS, JOURNAL_PROMPTS } from '@/lib/constants'
import { todayISO, formatDate, truncate, stripHtml, cn } from '@/lib/utils'
import { JournalEntry, JournalEntryType, MoodLabel, LifeAreaId } from '@/types'

const entryTypeOptions = JOURNAL_ENTRY_TYPES.map((t) => ({ value: t.value, label: t.label }))

function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) return null
  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-ash bg-linen rounded-t-xl">
      {[
        { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'Bold' },
        { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'Italic' },
        { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }), label: 'Heading' },
        { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), label: 'List' },
        { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), label: 'Quote' },
      ].map((tool) => (
        <button
          key={tool.label}
          type="button"
          onClick={tool.action}
          aria-label={tool.label}
          className={cn(
            'p-1.5 rounded-lg transition-all text-stone hover:text-ink hover:bg-white',
            tool.active && 'bg-white text-graphite shadow-craft-xl'
          )}
        >
          <tool.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}

function JournalEditor({ initialContent, onSave, onCancel, entryToEdit }: {
  initialContent?: string
  onSave: (data: { title?: string; content: string; entryType: JournalEntryType; mood: MoodLabel[]; tags: string[] }) => void
  onCancel: () => void
  entryToEdit?: JournalEntry
}) {
  const [title, setTitle] = useState(entryToEdit?.title || '')
  const [entryType, setEntryType] = useState<JournalEntryType>(entryToEdit?.entryType || 'free_writing')
  const [selectedMoods, setSelectedMoods] = useState<MoodLabel[]>(entryToEdit?.mood || [])
  const [tags, setTags] = useState<string[]>(entryToEdit?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [showPrompts, setShowPrompts] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write freely here. This is your space..." }),
    ],
    content: entryToEdit?.content || initialContent || '',
  })

  const prompts = JOURNAL_PROMPTS[entryType] || []

  const insertPrompt = (prompt: string) => {
    if (!editor) return
    editor.chain().focus().insertContent(`<p><strong>${prompt}</strong></p><p></p>`).run()
    setShowPrompts(false)
  }

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      setTags((prev) => [...new Set([...prev, tagInput.trim()])])
      setTagInput('')
    }
  }

  const handleSave = () => {
    const content = editor?.getHTML() || ''
    if (!content || content === '<p></p>') return
    onSave({ title: title || undefined, content, entryType, mood: selectedMoods, tags })
  }

  return (
    <div className="space-y-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Entry title (optional)"
        className="w-full text-lg font-semibold text-ink placeholder:text-stone border-none outline-none bg-transparent"
      />

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-40">
          <Select
            options={entryTypeOptions}
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as JournalEntryType)}
          />
        </div>
        {prompts.length > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={() => setShowPrompts(!showPrompts)}>
            Prompts
          </Button>
        )}
      </div>

      {showPrompts && prompts.length > 0 && (
        <div className="bg-mint/10 rounded-xl p-3 space-y-2">
          <p className="text-xs font-medium text-graphite mb-2">Click a prompt to add it:</p>
          {prompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => insertPrompt(p)}
              className="block w-full text-left text-sm text-graphite hover:text-ink hover:bg-mint/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Mood selection */}
      <div>
        <p className="text-xs font-medium text-stone mb-2">How are you feeling? (optional)</p>
        <div className="flex flex-wrap gap-1.5">
          {MOOD_LABELS.map((mood) => {
            const isSelected = selectedMoods.includes(mood.value as MoodLabel)
            return (
              <button
                key={mood.value}
                type="button"
                onClick={() => setSelectedMoods((prev) =>
                  prev.includes(mood.value as MoodLabel) ? prev.filter((m) => m !== mood.value) : [...prev, mood.value as MoodLabel]
                )}
                className={cn(
                  'px-2.5 py-1 rounded-pill text-xs font-medium border transition-all',
                  isSelected ? 'border-transparent text-white' : 'border-ash text-stone hover:border-stone bg-white'
                )}
                style={isSelected ? { backgroundColor: mood.color } : {}}
              >
                {mood.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Editor */}
      <div className="border border-ash rounded-xl overflow-hidden">
        <EditorToolbar editor={editor} />
        <div className="p-4 min-h-48">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-periwinkle/20 text-graphite rounded-pill text-xs font-medium">
              #{tag}
              <button type="button" onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-stone" />
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="Add tag and press Enter"
            className="text-sm text-graphite placeholder:text-stone border-none outline-none bg-transparent flex-1"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="button" variant="primary" onClick={handleSave} className="flex-1">
          {entryToEdit ? 'Update Entry' : 'Save Entry'}
        </Button>
      </div>
    </div>
  )
}

export function Journal() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournalStore()
  const [showEditor, setShowEditor] = useState(false)
  const [editEntry, setEditEntry] = useState<JournalEntry | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<JournalEntry | null>(null)

  const filtered = entries.filter((e) => {
    if (!e.isDraft) {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return e.title?.toLowerCase().includes(q) || e.content.toLowerCase().includes(q) || e.tags.some((t) => t.toLowerCase().includes(q))
      }
      if (filterType) return e.entryType === filterType
    }
    return !searchQuery && !filterType
  }).sort((a, b) => b.entryDate.localeCompare(a.entryDate))

  const handleSave = ({ title, content, entryType, mood, tags }: any) => {
    if (editEntry) {
      updateEntry(editEntry.id, { title, content, entryType, mood, tags, isDraft: false })
      setEditEntry(null)
    } else {
      addEntry({ title, content, entryType, entryDate: todayISO(), mood, tags, isDraft: false })
      setShowEditor(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Journal"
        description="A calm space to write, reflect, and remember"
        actions={
          <Button variant="primary" size="sm" onClick={() => { setShowEditor(true); setEditEntry(null) }}>
            <Plus className="h-4 w-4" /> New Entry
          </Button>
        }
      />

      {/* Editor */}
      {(showEditor || editEntry) && (
        <Card>
          <CardContent className="pt-6">
            <JournalEditor
              entryToEdit={editEntry || undefined}
              onSave={handleSave}
              onCancel={() => { setShowEditor(false); setEditEntry(null) }}
            />
          </CardContent>
        </Card>
      )}

      {/* Search + filter */}
      {entries.length > 0 && (
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search entries..."
              className="w-full h-10 pl-9 pr-4 text-sm rounded-xl border border-ash bg-white text-ink placeholder:text-stone focus:outline-none focus:ring-1 focus:ring-ink/10/10 focus:border-transparent transition-all"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 px-3 text-sm rounded-xl border border-ash bg-white text-graphite focus:outline-none focus:ring-1 focus:ring-ink/10/10 transition-all"
          >
            <option value="">All types</option>
            {JOURNAL_ENTRY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Entries list */}
      {filtered.length === 0 && !showEditor && !editEntry ? (
        <EmptyState
          icon={BookOpen}
          title="Your journal awaits"
          description="Write freely - this is your private space to reflect, dream, and remember. No judgment here."
          action={
            <Button variant="primary" onClick={() => setShowEditor(true)}>
              <Plus className="h-4 w-4" /> Write your first entry
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((entry) => {
            const typeLabel = JOURNAL_ENTRY_TYPES.find((t) => t.value === entry.entryType)?.label
            const preview = truncate(stripHtml(entry.content), 180)
            return (
              <Card key={entry.id} hover className="cursor-pointer" onClick={() => setEditEntry(entry)}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      {entry.title && (
                        <h3 className="font-semibold text-ink mb-0.5 truncate">{entry.title}</h3>
                      )}
                      <div className="flex items-center gap-2 text-xs text-stone">
                        <span>{formatDate(entry.entryDate)}</span>
                        {typeLabel && <Badge variant="stone" size="sm">{typeLabel}</Badge>}
                        {entry.mood && entry.mood.length > 0 && (
                          <div className="flex gap-1">{entry.mood.map((m) => { const ml = MOOD_LABELS.find((ml) => ml.value === m); return <span key={m} className="text-caption px-2 py-0.5 rounded-pill" style={{ backgroundColor: (ml?.color || '#bebbba') + '30', color: '#41413f' }}>{ml?.label}</span> })}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteTarget(entry) }}
                      className="p-1.5 rounded-lg text-stone hover:text-papaya hover:bg-papaya/10 transition-all shrink-0"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {preview && <p className="text-sm text-graphite leading-relaxed">{preview}</p>}
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-periwinkle/10 text-graphite rounded-pill">#{tag}</span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent size="sm">
          <DialogHeader><DialogTitle>Delete Entry</DialogTitle></DialogHeader>
          <div className="px-6 py-3">
            <p className="text-sm text-graphite">Are you sure you want to delete this journal entry? This cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => { deleteTarget && deleteEntry(deleteTarget.id); setDeleteTarget(null) }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
