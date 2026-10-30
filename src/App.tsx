import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { useAuthStore } from '@/stores/useAuthStore'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { Habits } from '@/pages/Habits'
import { Journal } from '@/pages/Journal'
import { Goals } from '@/pages/Goals'
import { Activities } from '@/pages/Activities'
import { CalendarPage } from '@/pages/Calendar'
import { Insights } from '@/pages/Insights'
import { Settings } from '@/pages/Settings'
import { Personal } from '@/pages/Personal'
import { Career } from '@/pages/Career'
import { Friendships } from '@/pages/Friendships'
import { Health } from '@/pages/Health'
import { MindEmotions } from '@/pages/MindEmotions'
import { Finance } from '@/pages/Finance'
import { Memories } from '@/pages/Memories'
import { Tracker } from '@/pages/Tracker'

export default function App() {
  const { currentUser } = useAuthStore()

  if (!currentUser) return <Login />

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/"            element={<Dashboard />} />
          <Route path="/habits"      element={<Habits />} />
          <Route path="/journal"     element={<Journal />} />
          <Route path="/goals"       element={<Goals />} />
          <Route path="/activities"  element={<Activities />} />
          <Route path="/calendar"    element={<CalendarPage />} />
          <Route path="/insights"    element={<Insights />} />
          <Route path="/tracker"     element={<Tracker />} />
          <Route path="/settings"    element={<Settings />} />
          <Route path="/personal"    element={<Personal />} />
          <Route path="/career"      element={<Career />} />
          <Route path="/friendships" element={<Friendships />} />
          <Route path="/health"      element={<Health />} />
          <Route path="/mind"        element={<MindEmotions />} />
          <Route path="/finance"     element={<Finance />} />
          <Route path="/memories"    element={<Memories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
