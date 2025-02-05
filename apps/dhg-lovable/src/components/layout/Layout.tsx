import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { EnvironmentBanner } from '@/components/EnvironmentBanner'
import { DebugPanel } from '@/components/DebugPanel'

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
      <EnvironmentBanner />
      <DebugPanel />
    </div>
  )
} 