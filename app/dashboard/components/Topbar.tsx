'use client'

import Link from 'next/link'
import { useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: string
  xp: number
  completedModules: string[]
  timeSpentPerModule: { moduleId: string; timeSpent: number }[]
}

interface TopBarProps {
  currentPage: string
  user?: User | null
}

export default function TopBar({ currentPage, user }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const getUserRoleDisplay = (role: string) => {
    switch (role) {
      case 'student':
        return 'Student'
      case 'teacher':
        return 'Teacher'
      case 'admin':
        return 'Admin'
      default:
        return 'User'
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const notifications = [
    { id: 1, title: 'New drill scheduled', time: '2 min ago', type: 'info' },
    { id: 2, title: 'Weather alert updated', time: '5 min ago', type: 'warning' },
    { id: 3, title: 'Quiz completed', time: '1 hour ago', type: 'success' }
  ]

  const getPageIcon = (page: string) => {
    const icons: { [key: string]: string } = {
      'Dashboard': '📊',
      'Modules': '📚',
      'Quizzes': '❓',
      'Weather Map': '🌤️',
      'Profile': '👤',
      'Alerts': '🔔',
      'alerts': '🔔'
    }
    return icons[page] || '📄'
  }

  return (
    <div className="w-full bg-white border-b border-red-100 shadow-sm">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Page Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">{getPageIcon(currentPage)}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 capitalize">{currentPage}</h1>
            <p className="text-sm text-gray-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all w-64 text-sm"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-red-100 z-50">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                  <p className="text-sm text-gray-500">You have {notifications.length} new notifications</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-all">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notif.type === 'warning' ? 'bg-orange-500' :
                          notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{notif.title}</p>
                          <p className="text-xs text-gray-500">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <Link href="/alerts">
                    <button className="text-red-600 font-medium text-sm hover:text-red-700">
                      View all notifications →
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <Link href="/alerts">
            <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
              <span className="text-xl">🚨</span>
            </button>
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 hover:bg-red-50 rounded-xl transition-all"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user ? getUserInitials(user.name) : 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="font-semibold text-gray-800 text-sm">
                  {user?.name || 'Loading...'}
                </p>
                <p className="text-xs text-gray-500">
                  {user ? getUserRoleDisplay(user.role) : 'Loading...'}
                </p>
              </div>
              <span className="text-gray-400 text-sm">⌄</span>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-red-100 z-50">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {user ? getUserInitials(user.name) : 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {user?.name || 'Loading...'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {user?.email || 'Loading...'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <Link href="/profile">
                    <button className="w-full text-left p-3 hover:bg-red-50 rounded-xl transition-all flex items-center space-x-3">
                      <span className="text-gray-600">👤</span>
                      <span className="font-medium text-gray-700">Profile Settings</span>
                    </button>
                  </Link>
                  
                  <Link href="/alerts">
                    <button className="w-full text-left p-3 hover:bg-red-50 rounded-xl transition-all flex items-center space-x-3">
                      <span className="text-gray-600">🔔</span>
                      <span className="font-medium text-gray-700">Notifications</span>
                    </button>
                  </Link>
                  
                  <button className="w-full text-left p-3 hover:bg-red-50 rounded-xl transition-all flex items-center space-x-3">
                    <span className="text-gray-600">⚙️</span>
                    <span className="font-medium text-gray-700">Settings</span>
                  </button>
                </div>

                <div className="p-2 border-t border-gray-100">
                  <button 
                    onClick={async () => {
                      try {
                        await fetch('/api/auth/logout', { method: 'POST' })
                      } catch (error) {
                        console.error('Logout error:', error)
                      } finally {
                        localStorage.removeItem('user')
                        window.location.href = '/login'
                      }
                    }}
                    className="w-full text-left p-3 hover:bg-red-50 rounded-xl transition-all flex items-center space-x-3 text-red-600"
                  >
                    <span>🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false)
            setShowUserMenu(false)
          }}
        ></div>
      )}
    </div>
  )
}