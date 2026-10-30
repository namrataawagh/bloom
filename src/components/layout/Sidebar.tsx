import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, CheckSquare, BookOpen, Target, Activity,
  Calendar, BarChart2, Settings, Leaf, Briefcase, Users,
  Heart, Brain, DollarSign, Camera, ChevronLeft, ChevronRight,
  LayoutGrid, LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const mainNav = [
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/habits',     icon: CheckSquare,     label: 'Habits'     },
  { to: '/journal',    icon: BookOpen,        label: 'Journal'    },
  { to: '/goals',      icon: Target,          label: 'Goals'      },
  { to: '/tracker',    icon: LayoutGrid,      label: 'Tracker'    },
  { to: '/activities', icon: Activity,        label: 'Activities' },
  { to: '/calendar',   icon: Calendar,        label: 'Calendar'   },
  { to: '/insights',   icon: BarChart2,       label: 'Insights'   },
]

const lifeAreaNav = [
  { to: '/personal',    icon: Leaf,       label: 'Personal'    },
  { to: '/career',      icon: Briefcase,  label: 'Career'      },
  { to: '/friendships', icon: Users,      label: 'Friendships' },
  { to: '/health',      icon: Heart,      label: 'Health'      },
  { to: '/mind',        icon: Brain,      label: 'Mind'        },
  { to: '/finance',     icon: DollarSign, label: 'Finance'     },
  { to: '/memories',    icon: Camera,     label: 'Memories'    },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { currentUser, logout } = useAuthStore()
  const navigate = useNavigate()

  const linkClass = ({ isActive }: { isActive: boolean }) => cn(
    'flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13.5px] font-medium transition-all duration-150',
    isActive
      ? 'bg-ink text-white'
      : 'text-graphite hover:bg-black/5 hover:text-ink'
  )

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col h-screen sticky top-0 bg-white/90 backdrop-blur-sm border-r border-black/8 shrink-0 transition-all duration-300 z-20',
        collapsed ? 'w-14' : 'w-56'
      )}
      style={{ boxShadow: '2px 0 12px rgba(0,40,80,0.06)' }}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-2 px-4 pt-5 pb-4 border-b border-black/8', collapsed && 'justify-center px-3')}>
        {!collapsed && <span className="font-serif text-[22px] text-ink tracking-tight">Bloom</span>}
        {collapsed  && <span className="font-serif text-[20px] text-ink">B</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5">
        {mainNav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
            <Icon className="h-[15px] w-[15px] shrink-0 opacity-80" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {!collapsed && (
          <p className="text-[11px] font-semibold text-stone/70 uppercase tracking-[0.08em] px-3 pt-5 pb-1.5">
            Life Areas
          </p>
        )}
        {collapsed && <div className="my-3 border-t border-black/8" />}

        {lifeAreaNav.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="h-[15px] w-[15px] shrink-0 opacity-80" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2.5 pb-4 border-t border-black/8 pt-3 space-y-0.5">
        {!collapsed && currentUser && (
          <p className="text-[12px] text-stone px-3 pb-1.5 truncate font-medium">{currentUser}</p>
        )}
        <NavLink to="/settings" className={linkClass}>
          <Settings className="h-[15px] w-[15px] shrink-0 opacity-80" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 px-3 py-2 rounded-[10px] text-stone hover:text-red-500 hover:bg-red-50 transition-colors text-[13.5px] font-medium"
        >
          <LogOut className="h-[15px] w-[15px] shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center gap-2.5 px-3 py-2 rounded-[10px] text-stone hover:text-graphite hover:bg-black/5 transition-colors text-[13.5px] font-medium"
        >
          {collapsed ? <ChevronRight className="h-[15px] w-[15px] shrink-0" /> : <ChevronLeft className="h-[15px] w-[15px] shrink-0" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
