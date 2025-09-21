'use client'

import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: string
  xp: number
  completedModules: string[]
  timeSpentPerModule: { moduleId: string; timeSpent: number }[]
}

interface SidebarProps {
  activeTab?: string
  setActiveTab?: (tab: string) => void
  user?: User | null
  completedModules?: number
  totalModules?: number
}

export default function Sidebar({ activeTab, setActiveTab, user }: SidebarProps) {
  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Modules', href: '/modules', icon: '📚' },
    { name: 'Quizzes', href: '/quizzes', icon: '❓' },
    { name: 'Weather Map', href: '/weather', icon: '🌤️' },
    { name: 'Profile', href: '/profile', icon: '👤' },
    { name: 'Alerts', href: '/alerts', icon: '🔔' },
  ]

  return (
    <div className="w-72 bg-white border-r border-red-100 min-h-screen flex flex-col justify-between shadow-lg">
      {/* Logo and Brand */}
      <div className="p-6 space-y-6">
        <div className="text-center border-b border-red-100 pb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl text-white">🛡️</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
            DisasterPrep
          </h1>
          <p className="text-sm text-gray-500 font-medium">Emergency Learning Platform</p>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = activeTab === link.name
            return (
              <Link key={link.name} href={link.href}>
                <button
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center space-x-3 group ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200 transform scale-[1.02]' 
                      : 'hover:bg-red-50 hover:text-red-700 text-gray-700'
                  }`}
                  onClick={() => setActiveTab && setActiveTab(link.name)}
                >
                  <span className={`text-xl ${isActive ? 'text-white' : 'group-hover:scale-110'} transition-transform`}>
                    {link.icon}
                  </span>
                  <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-red-700'}`}>
                    {link.name}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              </Link>
            )
          })}
        </nav>

      </div>

      {/* Teacher Alert Button - Only for teachers and admins */}
      <div className="p-6 border-t border-red-100">
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Link href="/alerts/admin/create">
            <button className="w-full p-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold flex items-center justify-center space-x-2">
              <span className="text-lg">📤</span>
              <span>Send Alert</span>
            </button>
          </Link>
        )}
        
      </div>
    </div>
  )
}