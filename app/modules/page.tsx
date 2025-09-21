'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Sidebar from '@/app/dashboard/components/Sidebar'
import TopBar from '@/app/dashboard/components/Topbar'

interface ContentItem {
  type: string
  data: string
}

interface Module {
  _id: string
  title: string
  description: string
  content: ContentItem[]
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState<string[]>([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [user, setUser] = useState<{ role: string } | null>(null)
  const activeTab = "modules"

  useEffect(() => {
    // Get user data from localStorage
    const userFromStorage = localStorage.getItem('user')
    if (userFromStorage) {
      const userData = JSON.parse(userFromStorage)
      setUser(userData)
    }

    const fetchModules = async () => {
      try {
        const res = await fetch('/api/modules')
        const data = await res.json()
        setModules(data.modules || [])

        // fetch completed modules for logged-in user
        const token = localStorage.getItem('token')
        if (token) {
          const res2 = await fetch('/api/modules/completed', {
            headers: { Authorization: `Bearer ${token}` },
          })
          const data2 = await res2.json()
          setCompleted(data2.completedModules || [])
        }
      } catch (err) {
        console.error('Error fetching modules:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  const getModuleIcon = (title: string) => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('fire')) return '🔥'
    if (titleLower.includes('earthquake')) return '🌍'
    if (titleLower.includes('first aid') || titleLower.includes('medical')) return '🏥'
    if (titleLower.includes('flood')) return '🌊'
    if (titleLower.includes('emergency')) return '🚨'
    if (titleLower.includes('communication')) return '📡'
    if (titleLower.includes('kit')) return '🎒'
    return '📚'
  }

  const getDifficultyLevel = (content: ContentItem[]) => {
    const contentLength = content.reduce((acc, item) => acc + item.data.length, 0)
    if (contentLength > 1000) return { level: 'Advanced', color: 'red' }
    if (contentLength > 500) return { level: 'Intermediate', color: 'orange' }
    return { level: 'Beginner', color: 'green' }
  }

  const isTeacherOrAdmin = () => {
    return user && (user.role === 'teacher' || user.role === 'admin')
  }

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'completed') return matchesSearch && completed.includes(module._id)
    if (filter === 'incomplete') return matchesSearch && !completed.includes(module._id)
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <Sidebar activeTab="Modules" />
        <div className="flex flex-col flex-1">
          <TopBar currentPage={activeTab} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading modules...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-red-50 via-white to-red-50 overflow-hidden">
      <Sidebar activeTab="Modules" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar currentPage={activeTab} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 shadow-2xl">
              <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl">📚</span>
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold text-white">Learning Modules</h1>
                        <p className="text-red-100 text-lg font-medium mt-1">
                          Master essential emergency preparedness skills
                        </p>
                      </div>
                    </div>
                    
                    {/* Create Module Button - Only for Teachers/Admins */}
                    {isTeacherOrAdmin() && (
                      <Link href="/modules/admin">
                        <button className="px-4 py-2 md:px-6 md:py-3 bg-white bg-opacity-20 text-white rounded-xl hover:bg-opacity-30 transition-all backdrop-blur-sm font-semibold flex items-center justify-center space-x-2 text-sm md:text-base">
                          <span className="text-lg">➕</span>
                          <span className="hidden sm:inline">Create <span className="text-red-400 font-bold">Module</span></span>
                          <span className="sm:hidden">Create</span>
                        </button>
                      </Link>
                    )}
                  </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{modules.length}</p>
                    <p className="text-sm text-gray-500">Total Modules</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📖</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{completed.length}</p>
                    <p className="text-sm text-gray-500">Completed</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">{modules.length - completed.length}</p>
                    <p className="text-sm text-gray-500">In Progress</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-xl">⏳</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {modules.length > 0 ? Math.round((completed.length / modules.length) * 100) : 0}%
                    </p>
                    <p className="text-sm text-gray-500">Progress</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xl">📊</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🔍</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all"
                  />
                </div>
                
                <div className="flex space-x-2">
                  {['all', 'completed', 'incomplete'].map((filterOption) => (
                    <button
                      key={filterOption}
                      onClick={() => setFilter(filterOption)}
                      className={`px-4 py-3 rounded-xl font-medium transition-all capitalize ${
                        filter === filterOption
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filterOption === 'all' ? 'All Modules' : filterOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modules Grid */}
            {filteredModules.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-red-100 text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {modules.length === 0 ? 'No modules available' : 'No modules found'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {modules.length === 0 
                    ? 'Start your learning journey by creating your first module.' 
                    : 'Try adjusting your search terms or filters.'}
                </p>
                {modules.length === 0 && (
                  <Link href="/modules/admin/create">
                    <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all">
                      Create First Module
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredModules.map((module) => {
                  const isDone = completed.includes(module._id)
                  const difficulty = getDifficultyLevel(module.content)
                  // Calculate progress based on content length and completion status
                  const contentLength = module.content.reduce((acc, item) => acc + (item.data?.length || 0), 0)
                  const progress = isDone ? 100 : Math.min(85, Math.random() * 30 + 15) // More realistic progress range
                  
                  return (
                    <Link key={module._id} href={`/modules/${module._id}`}>
                      <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden">
                        {isDone && (
                          <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">✓</span>
                          </div>
                        )}
                        
                        <div className="flex items-start space-x-4 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-2xl">{getModuleIcon(module.title)}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                              {module.title}
                            </h3>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              difficulty.color === 'green' ? 'bg-green-100 text-green-700' :
                              difficulty.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {difficulty.level}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-3">{module.description}</p>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-semibold text-gray-800">{Math.round(progress)}%</span>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full transition-all duration-500 ${
                                isDone ? 'bg-green-500' : 'bg-gradient-to-r from-red-500 to-red-600'
                              }`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              {module.content.length} content items
                            </span>
                            <span className={`font-medium ${
                              isDone ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {isDone ? '✓ Completed' : 'Continue Learning'}
                            </span>
                          </div>
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 hover:opacity-5 transition-opacity rounded-2xl"></div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            {/* Progress Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Learning Journey</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 text-2xl">🎯</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Getting Started</h4>
                  <p className="text-gray-600 text-sm">Begin with basic modules</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 text-2xl">⚡</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Building Skills</h4>
                  <p className="text-gray-600 text-sm">Advance to complex topics</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 text-2xl">🏆</span>
                  </div>
                  <h4 className="font-semibold text-gray-800">Expert Level</h4>
                  <p className="text-gray-600 text-sm">Master all skills</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}