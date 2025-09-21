'use client'

import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/Topbar'
import CompletionBar from './components/CompletionBar'
import ModulesGraph from './components/ModulesGraph'
import UpcomingDrills from './components/UpcomingDrills'
import ProfileCard from './components/ProfileCard'
import dynamic from 'next/dynamic'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

const WeatherMap = dynamic(() => import('../weather/page'), { ssr: false })
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface User {
  id: string
  name: string
  email: string
  role: string
  xp: number
  completedModules: string[]
  timeSpentPerModule: { moduleId: string; timeSpent: number }[]
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedModules, setCompletedModules] = useState(0)
  const [totalModules, setTotalModules] = useState(0)
  const [drills, setDrills] = useState<{ title: string; due: string }[]>([])
  const [xp, setXp] = useState(0)
  const [timeSpentData, setTimeSpentData] = useState<number[]>([])
  const [topStudents, setTopStudents] = useState<{ name: string; xp: number }[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        
        // Check if user is logged in
        const userFromStorage = localStorage.getItem('user')
        if (!userFromStorage) {
          // For testing purposes, create a demo user
          const demoUser = {
            id: 'demo-user-123',
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'student',
            xp: 1500,
            completedModules: [],
            timeSpentPerModule: []
          }
          setUser(demoUser)
          setLoading(false)
          return
        }

        const userData = JSON.parse(userFromStorage)
        setUser(userData)

        // Fetch dashboard data
        const modulesRes = await fetch(`/api/dashboard/modules?userId=${userData.id}`)
        if (modulesRes.ok) {
          const modulesData = await modulesRes.json()
          setTotalModules(modulesData.total || 0)
          setCompletedModules(modulesData.completed || 0)
        }

        const drillsRes = await fetch(`/api/dashboard/drills?userId=${userData.id}`)
        if (drillsRes.ok) {
          const drillsData = await drillsRes.json()
          setDrills(drillsData || [])
        }

        const xpRes = await fetch(`/api/dashboard/xp?userId=${userData.id}`)
        if (xpRes.ok) {
          const xpData = await xpRes.json()
          setXp(xpData.totalXp || 0)
          setTimeSpentData(xpData.timeSpentPerModule || [])
        }

        const topRes = await fetch(`/api/dashboard/top-students`)
        if (topRes.ok) {
          const topData = await topRes.json()
          setTopStudents(topData || [])
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        const timeChartData = {
          labels: Array.from({ length: timeSpentData.length }, (_, i) => `Module ${i + 1}`),
          datasets: [
            {
              label: 'Time Spent (minutes)',
              data: timeSpentData,
              fill: false,
              borderColor: 'rgb(239, 68, 68)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              pointBackgroundColor: 'rgb(220, 38, 38)',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 6
            }
          ]
        }

        const chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                font: {
                  family: 'Inter, system-ui, sans-serif',
                  size: 14
                },
                color: '#374151'
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                font: {
                  family: 'Inter, system-ui, sans-serif'
                },
                color: '#6B7280'
              }
            },
            y: {
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                font: {
                  family: 'Inter, system-ui, sans-serif'
                },
                color: '#6B7280'
              }
            }
          }
        } as const

        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
            <div className="p-8 space-y-8">
              {/* Welcome Header */}
              <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 shadow-2xl">
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold text-white mb-2 font-['Inter']">
                    Welcome back, {user.name}! 👋
                  </h2>
                  <p className="text-red-100 text-lg font-medium">
                    Ready to continue your learning journey?
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Completion Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Progress</h3>
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-lg">📚</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <CompletionBar completed={completedModules} total={totalModules} />
                    <p className="text-2xl font-bold text-gray-800">
                      {completedModules}/{totalModules}
                    </p>
                    <p className="text-sm text-gray-500">Modules Completed</p>
                  </div>
                </div>

                {/* XP Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Experience</h3>
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">⭐</span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800 mb-2">{(xp || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total XP Earned</p>
                  <div className="mt-3 bg-red-50 rounded-full h-2">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full" style={{width: `${Math.min(((xp || 0) / 10000) * 100, 100)}%`}}></div>
                  </div>
                </div>

                {/* Next Alert Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Next Alert</h3>
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 text-lg">🚨</span>
                    </div>
                  </div>
                  {drills && drills.length > 0 ? (
                    <>
                      <p className="text-xl font-bold text-gray-800 mb-1">{drills[0].title}</p>
                      <p className="text-sm text-gray-500">Scheduled: {new Date(drills[0].due).toLocaleDateString()}</p>
                    </>
                  ) : (
                    <p className="text-gray-500">No upcoming alerts</p>
                  )}
                </div>

                {/* Rank Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-600 font-semibold text-sm uppercase tracking-wide">Your Rank</h3>
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-lg">🏆</span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-800 mb-2">#3</p>
                  <p className="text-sm text-gray-500">Class Ranking</p>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Time Chart */}
                <div className="xl:col-span-2">
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Time Spent on Modules</h3>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg font-medium">7D</button>
                        <button className="px-3 py-1 text-sm text-gray-500 rounded-lg font-medium">30D</button>
                        <button className="px-3 py-1 text-sm text-gray-500 rounded-lg font-medium">90D</button>
                      </div>
                    </div>
                    <div className="h-80">
                      {timeSpentData.length ? (
                        <Line data={timeChartData} options={chartOptions} />
                      ) : (
                        <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📊</div>
                            <p className="text-gray-500 font-medium">No time data available yet</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Students */}
                <div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Top Performers</h3>
                      <span className="text-sm text-red-600 font-medium cursor-pointer hover:text-red-700">View all</span>
                    </div>
                    <div className="space-y-4">
                      {topStudents && topStudents.length > 0 ? (
                        topStudents.map((student, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                idx === 0 ? 'bg-yellow-500 text-white' : 
                                idx === 1 ? 'bg-gray-400 text-white' : 
                                idx === 2 ? 'bg-orange-500 text-white' : 
                                'bg-red-100 text-red-600'
                              }`}>
                                {idx + 1}
                              </div>
                              <span className="font-medium text-gray-800">{student.name}</span>
                            </div>
                            <span className="font-bold text-red-600">{(student.xp || 0).toLocaleString()} XP</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-3xl mb-2">🎯</div>
                          <p className="text-gray-500">No leaderboard data yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Alerts Section */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Upcoming Alerts & Events</h3>
                  <span className="text-sm text-red-600 font-medium cursor-pointer hover:text-red-700">View all alerts</span>
                </div>
                <UpcomingDrills drills={drills} />
              </div>

              {/* Modules Graph */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Module Progress Overview</h3>
                <ModulesGraph completed={completedModules} total={totalModules} />
              </div>
            </div>
          </div>
        )
      case 'Modules':
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Learning Modules</h2>
              <p className="text-gray-600">Explore your available learning modules here.</p>
            </div>
          </div>
        )
      case 'Quizzes':
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Quiz Center</h2>
              <p className="text-gray-600">Test your knowledge with interactive quizzes.</p>
            </div>
          </div>
        )
      case 'Weather Map':
        return (
          <div className="w-full h-[80vh]">
            <WeatherMap />
          </div>
        )
      case 'Profile':
        return <ProfileCard user={user} />
      case 'Alerts':
        return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Notifications & Alerts</h2>
              <p className="text-gray-600">Stay updated with important announcements and alerts.</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <TopBar currentPage={activeTab} user={user} />
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}