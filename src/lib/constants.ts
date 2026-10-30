import { LifeArea } from '@/types'

export const DEFAULT_LIFE_AREAS: LifeArea[] = [
  {
    id: 'personal',
    name: 'Personal',
    icon: 'personal',
    color: '#9bd8a9',
    description: 'Discover interests, explore hobbies, build your personal identity',
    isVisible: true,
    sortOrder: 0,
  },
  {
    id: 'career',
    name: 'Career',
    icon: 'career',
    color: '#b8caf5',
    description: 'Professional development, learning, and long-term ambition',
    isVisible: true,
    sortOrder: 1,
  },
  {
    id: 'friendships',
    name: 'Friendships',
    icon: 'friendships',
    color: '#fde99b',
    description: 'Nurture connections and meaningful social experiences',
    isVisible: true,
    sortOrder: 2,
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'health',
    color: '#9bd8a9',
    description: 'Physical fitness, nutrition, self-care, and well-being',
    isVisible: true,
    sortOrder: 3,
  },
  {
    id: 'mind',
    name: 'Mind',
    icon: 'mind',
    color: '#b8caf5',
    description: 'Self-awareness, emotional regulation, and reflection',
    isVisible: true,
    sortOrder: 4,
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: 'finance',
    color: '#fde99b',
    description: 'Personal finance, budgeting, and independence',
    isVisible: true,
    sortOrder: 5,
  },
  {
    id: 'memories',
    name: 'Memories',
    icon: 'memories',
    color: '#9ed4ef',
    description: 'Experiences, travel, and favourite moments',
    isVisible: true,
    sortOrder: 6,
  },
  {
    id: 'goals',
    name: 'Goals',
    icon: 'goals',
    color: '#b8caf5',
    description: 'Goals, planning, and progress tracking',
    isVisible: true,
    sortOrder: 7,
  },
]

export const MOOD_LABELS = [
  { value: 'happy',       label: 'Happy',       color: '#9bd8a9' },
  { value: 'calm',        label: 'Calm',         color: '#b8caf5' },
  { value: 'excited',     label: 'Excited',      color: '#fde99b' },
  { value: 'grateful',    label: 'Grateful',     color: '#9bd8a9' },
  { value: 'content',     label: 'Content',      color: '#9ed4ef' },
  { value: 'hopeful',     label: 'Hopeful',      color: '#b8caf5' },
  { value: 'tired',       label: 'Tired',        color: '#e1e1e1' },
  { value: 'anxious',     label: 'Anxious',      color: '#fde99b' },
  { value: 'sad',         label: 'Sad',          color: '#b8caf5' },
  { value: 'lonely',      label: 'Lonely',       color: '#9ed4ef' },
  { value: 'irritated',   label: 'Irritated',    color: '#fde99b' },
  { value: 'overwhelmed', label: 'Overwhelmed',  color: '#b8caf5' },
] as const

export const JOURNAL_ENTRY_TYPES = [
  { value: 'free_writing',        label: 'Free Writing'         },
  { value: 'daily_reflection',    label: 'Daily Reflection'     },
  { value: 'gratitude',           label: 'Gratitude'            },
  { value: 'emotional_reflection',label: 'Emotional Reflection' },
  { value: 'weekly_review',       label: 'Weekly Review'        },
  { value: 'monthly_review',      label: 'Monthly Review'       },
  { value: 'memory',              label: 'Memory'               },
] as const

export const JOURNAL_PROMPTS: Record<string, string[]> = {
  daily_reflection: [
    'What happened today?',
    'What made me happy?',
    'What bothered me?',
    'What am I grateful for?',
    'What did I learn about myself?',
    'What could I have handled differently?',
  ],
  gratitude: [
    'Three things I am grateful for today:',
    'Something that made me smile:',
    'A person I am grateful for:',
    'A challenge that helped me grow:',
  ],
  emotional_reflection: [
    'What triggered me?',
    'What did I feel?',
    'What story did I tell myself?',
    'How did I react?',
    'What did I need in that moment?',
    'What could I try differently next time?',
  ],
  weekly_review: [
    'What did I accomplish this week?',
    'What new things did I try?',
    'How did I nurture my friendships?',
    'What did I learn?',
    'What made me genuinely happy?',
    'What do I want to focus on next week?',
  ],
  monthly_review: [
    'What did I accomplish?',
    'What new things did I try?',
    'How did I nurture my friendships?',
    'What did I learn?',
    'What did I neglect?',
    'What made me genuinely happy?',
    'What do I want to change next month?',
  ],
}

export const GOAL_STATUSES = [
  { value: 'not_started', label: 'Not started', color: '#bebbba' },
  { value: 'in_progress', label: 'In progress', color: '#9bd8a9' },
  { value: 'paused',      label: 'Paused',      color: '#fde99b' },
  { value: 'completed',   label: 'Completed',   color: '#41413f' },
  { value: 'archived',    label: 'Archived',    color: '#e1e1e1' },
] as const

export const TASK_PRIORITIES = [
  { value: 'low',    label: 'Low',    color: '#9bd8a9' },
  { value: 'medium', label: 'Medium', color: '#fde99b' },
  { value: 'high',   label: 'High',   color: '#b8caf5' },
] as const

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Education',
  'Shopping',
  'Health',
  'Entertainment',
  'Travel',
  'Savings',
  'Other',
] as const

export const ACTIVITY_TYPES: Record<string, string[]> = {
  personal:    ['Hobby', 'Learning', 'Reading', 'Creative', 'Outdoor', 'Other'],
  career:      ['Study', 'Work', 'Networking', 'Side Project', 'Mentoring', 'Other'],
  friendships: ['Catch-up', 'Event', 'Call', 'Dinner', 'Travel', 'Other'],
  health:      ['Workout', 'Run', 'Walk', 'Yoga', 'Meditation', 'Meal Prep', 'Rest', 'Other'],
  mind:        ['Meditation', 'Therapy', 'Reading', 'Journaling', 'Rest', 'Other'],
  finance:     ['Budgeting', 'Saving', 'Investing', 'Planning', 'Other'],
  memories:    ['Travel', 'Experience', 'Event', 'Milestone', 'Other'],
  goals:       ['Planning', 'Review', 'Research', 'Action Step', 'Other'],
}

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Sun', fullLabel: 'Sunday'    },
  { value: 1, label: 'Mon', fullLabel: 'Monday'    },
  { value: 2, label: 'Tue', fullLabel: 'Tuesday'   },
  { value: 3, label: 'Wed', fullLabel: 'Wednesday' },
  { value: 4, label: 'Thu', fullLabel: 'Thursday'  },
  { value: 5, label: 'Fri', fullLabel: 'Friday'    },
  { value: 6, label: 'Sat', fullLabel: 'Saturday'  },
]

export const AFFIRMATIONS = [
  'You are doing better than you think.',
  'Progress, not perfection.',
  'Your growth is happening, even when you cannot see it.',
  'You deserve to take up space.',
  'Rest is productive. You are enough.',
  'Small steps still move you forward.',
  'You are allowed to enjoy the journey.',
  'Be gentle with yourself today.',
  'Your feelings are valid and real.',
  'You have come further than you know.',
  'Every good day you create matters.',
  'You are building something beautiful, one day at a time.',
]
