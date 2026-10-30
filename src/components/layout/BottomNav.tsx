import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, BookOpen, Target, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { to: '/',        icon: LayoutDashboard, label: 'Home'    },
  { to: '/habits',  icon: CheckSquare,     label: 'Habits'  },
  { to: '/journal', icon: BookOpen,        label: 'Journal' },
  { to: '/goals',   icon: Target,          label: 'Goals'   },
  { to: '/tracker', icon: LayoutGrid,      label: 'Tracker' },
]

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 px-3 pb-3">
      <div
        className="flex items-center justify-around h-16 px-2 rounded-[20px]"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 4px 24px rgba(0,40,80,0.12), 0 1px 4px rgba(0,40,80,0.08)',
          border: '1px solid rgba(255,255,255,0.9)',
        }}
      >
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
              'flex flex-col items-center gap-1 px-3 py-2 rounded-[12px] transition-all text-[11px] font-medium',
              isActive ? 'text-ink' : 'text-stone'
            )}
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-[10px] transition-all',
                  isActive ? 'bg-ink' : 'bg-transparent'
                )}>
                  <Icon className={cn('h-4 w-4 transition-all', isActive ? 'text-white' : 'text-stone')} />
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
