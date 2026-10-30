export type LifeAreaId =
  | 'personal'
  | 'career'
  | 'friendships'
  | 'health'
  | 'mind'
  | 'finance'
  | 'memories'
  | 'goals'

export interface LifeArea {
  id: LifeAreaId
  name: string
  icon: string
  color: string
  description: string
  isVisible: boolean
  sortOrder: number
}

export type HabitFrequency = 'daily' | 'weekly' | 'custom'
export type HabitStatus = 'active' | 'paused' | 'archived'
export type HabitLogStatus = 'completed' | 'skipped' | 'not_done'

export interface Habit {
  id: string
  lifeAreaId: LifeAreaId
  name: string
  description: string
  frequency: HabitFrequency
  selectedDays: number[] // 0=Sunday..6=Saturday
  startDate: string // ISO date
  endDate?: string
  reminderTime?: string
  status: HabitStatus
  createdAt: string
  color?: string
  icon?: string
}

export interface HabitLog {
  id: string
  habitId: string
  date: string // ISO date YYYY-MM-DD
  status: HabitLogStatus
  note?: string
  createdAt: string
}

export type JournalEntryType =
  | 'free_writing'
  | 'daily_reflection'
  | 'gratitude'
  | 'emotional_reflection'
  | 'weekly_review'
  | 'monthly_review'
  | 'memory'

export type MoodLabel =
  | 'happy'
  | 'calm'
  | 'anxious'
  | 'sad'
  | 'irritated'
  | 'lonely'
  | 'overwhelmed'
  | 'excited'
  | 'grateful'
  | 'content'
  | 'hopeful'
  | 'tired'

export interface JournalEntry {
  id: string
  title?: string
  content: string
  entryType: JournalEntryType
  entryDate: string
  mood?: MoodLabel[]
  lifeAreaId?: LifeAreaId
  tags: string[]
  isDraft: boolean
  createdAt: string
  updatedAt: string
}

export type GoalStatus = 'not_started' | 'in_progress' | 'paused' | 'completed' | 'archived'

export interface GoalMilestone {
  id: string
  goalId: string
  title: string
  dueDate?: string
  isCompleted: boolean
  completedAt?: string
  createdAt: string
}

export interface Goal {
  id: string
  lifeAreaId: LifeAreaId
  title: string
  description: string
  whyItMatters: string
  startDate: string
  targetDate?: string
  status: GoalStatus
  progress: number // 0-100
  milestones: GoalMilestone[]
  notes: string
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  lifeAreaId?: LifeAreaId
  goalId?: string
  title: string
  description: string
  dueDate?: string
  priority?: TaskPriority
  status: TaskStatus
  recurrence?: string
  createdAt: string
  completedAt?: string
}

export interface Activity {
  id: string
  lifeAreaId: LifeAreaId
  activityType: string
  title: string
  date: string
  durationMinutes?: number
  notes: string
  rating?: number // 1-5
  relatedGoalId?: string
  createdAt: string
}

export interface MoodLog {
  id: string
  date: string
  moodLabels: MoodLabel[]
  intensity?: number // 1-5
  energyLevel?: number // 1-5
  note?: string
  createdAt: string
}

export interface Memory {
  id: string
  title: string
  description: string
  date: string
  location?: string
  tags: string[]
  isFavourite: boolean
  lifeAreaId?: LifeAreaId
  createdAt: string
}

export interface Expense {
  id: string
  amount: number
  date: string
  category: string
  description: string
  notes?: string
  paymentMethod?: string
  createdAt: string
}

export interface UserPreferences {
  displayName: string
  greeting?: string
  affirmation?: string
  showMyLifeCard: boolean
  dashboardLayout: 'compact' | 'expanded'
  lifeAreas: LifeArea[]
  monthlyBudget?: number
  currency: string
  createdAt: string
}

export interface Hobby {
  id: string
  name: string
  category: string
  reasonToExplore: string
  status: 'interested' | 'exploring' | 'regular' | 'paused' | 'completed'
  startedAt?: string
  personalRating?: number
  notes: string
  timeSpent?: number
  dateAdded: string
}

export interface BucketListItem {
  id: string
  lifeAreaId?: LifeAreaId
  title: string
  category: string
  status: 'to_try' | 'planned' | 'tried' | 'not_for_me'
  plannedDate?: string
  completedDate?: string
  notes: string
  createdAt: string
}

export interface ContactNote {
  id: string
  displayName: string
  relationshipCategory: string
  birthday?: string
  interests: string
  notes: string
  lastCatchUp?: string
  upcomingPlan?: string
  createdAt: string
  updatedAt: string
}
