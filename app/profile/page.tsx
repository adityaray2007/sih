'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/app/dashboard/components/Sidebar'
import TopBar from '@/app/dashboard/components/Topbar'

interface User {
  id: string
  name: string
  email: string
  role: string
  xp: number
  completedModules: any[]
  timeSpentPerModule: { moduleId: string; timeSpent: number }[]
}

interface Module {
  _id: string
  title: string
  description: string
  content: any[]
}

interface Drill {
  title: string
  due: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [completedModules, setCompletedModules] = useState<Module[]>([])
  const [upcomingDrills, setUpcomingDrills] = useState<Drill[]>([])
  const [loading, setLoading] = useState(true)
  const activeTab = "profile"

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        
        // Get user data from localStorage
        const userFromStorage = localStorage.getItem('user')
        if (userFromStorage) {
          const userData = JSON.parse(userFromStorage)
          setUser(userData)
        }

        // Fetch completed modules
        const token = localStorage.getItem('token')
        if (token) {
          const modulesRes = await fetch('/api/modules')
          if (modulesRes.ok) {
            const modulesData = await modulesRes.json()
            setCompletedModules(modulesData.modules || [])
          }

          // Fetch upcoming drills
          const drillsRes = await fetch('/api/dashboard/drills', {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (drillsRes.ok) {
            const drillsData = await drillsRes.json()
            setUpcomingDrills(drillsData.drills || [])
          }
        }
      } catch (err) {
        console.error('Error fetching profile data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const getUserRoleDisplay = (role: string) => {
    switch (role) {
      case 'student': return 'Student'
      case 'teacher': return 'Teacher'
      case 'admin': return 'Admin'
      default: return 'User'
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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <Sidebar activeTab="Profile" />
        <div className="flex-1 flex flex-col">
          <TopBar currentPage={activeTab} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading profile...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <Sidebar activeTab="Profile" />
        <div className="flex-1 flex flex-col">
          <TopBar currentPage={activeTab} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
              <p className="text-gray-600 mb-6">Please log in to view your profile</p>
              <Link href="/login">
                <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all">
                  Go to Login
                </button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Sidebar activeTab="Profile" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentPage={activeTab} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <span className="text-red-600 text-4xl font-bold">{getUserInitials(user.name)}</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{user.name}</h1>
                    <p className="text-red-100 text-lg font-medium">{getUserRoleDisplay(user.role)}</p>
                    <p className="text-red-200 text-sm">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{user.xp}</p>
                    <p className="text-sm text-gray-500">Total XP</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl">⭐</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{user.completedModules.length}</p>
                    <p className="text-sm text-gray-500">Modules Completed</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{upcomingDrills.length}</p>
                    <p className="text-sm text-gray-500">Upcoming Drills</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-xl">📅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{getUserRoleDisplay(user.role)}</p>
                    <p className="text-sm text-gray-500">Role</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-xl">👤</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Completed Modules */}
              <div className="bg-white rounded-2xl shadow-lg border border-red-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">Completed Modules</h2>
                  <p className="text-gray-600 mt-1">Your learning achievements</p>
                </div>
                <div className="p-6">
                  {user.completedModules.length > 0 ? (
                    <div className="space-y-4">
                      {user.completedModules.slice(0, 5).map((module, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{module.title || `Module ${index + 1}`}</p>
                            <p className="text-sm text-gray-500">Completed</p>
                          </div>
                        </div>
                      ))}
                      {user.completedModules.length > 5 && (
                        <p className="text-sm text-gray-500 text-center">
                          +{user.completedModules.length - 5} more modules completed
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📚</div>
                      <p className="text-gray-500">No modules completed yet</p>
                      <Link href="/modules">
                        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                          Start Learning
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Upcoming Drills */}
              <div className="bg-white rounded-2xl shadow-lg border border-red-100">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800">Upcoming Drills</h2>
                  <p className="text-gray-600 mt-1">Scheduled emergency drills</p>
                </div>
                <div className="p-6">
                  {upcomingDrills.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingDrills.map((drill, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl">
                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">📅</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{drill.title}</p>
                            <p className="text-sm text-gray-500">
                              Due: {new Date(drill.due).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">📅</div>
                      <p className="text-gray-500">No upcoming drills scheduled</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white rounded-2xl shadow-lg border border-red-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Personal Details</h2>
                <p className="text-gray-600 mt-1">Your account information</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                    <p className="text-gray-800 font-medium">{user.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                    <p className="text-gray-800 font-medium">{user.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Role</label>
                    <p className="text-gray-800 font-medium">{getUserRoleDisplay(user.role)}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Total Experience Points</label>
                    <p className="text-gray-800 font-medium">{user.xp} XP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
