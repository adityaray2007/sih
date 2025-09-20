'use client'

import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/Topbar'
import CompletionBar from './components/CompletionBar'
import ModulesGraph from './components/ModulesGraph'
import UpcomingDrills from './components/UpcomingDrills'
import ProfileCard from './components/ProfileCard'
import dynamic from 'next/dynamic'

// Dynamically load weather map to avoid SSR issues
const WeatherMap = dynamic(() => import('../weather/page'), { ssr: false })

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [userId, setUserId] = useState('')
  const [completedModules, setCompletedModules] = useState(0)
  const [totalModules, setTotalModules] = useState(0)
  const [drills, setDrills] = useState<{ title: string; due: string }[]>([])

  useEffect(() => {
    // Fetch user data (replace with your authentication/session logic)
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setUserId(user.id || 'user1')

    // Fetch dashboard data from backend APIs
    const fetchDashboardData = async () => {
      try {
        const modulesRes = await fetch(`/api/dashboard/modules?userId=${user.id || 'user1'}`)
        const modulesData = await modulesRes.json()
        setTotalModules(modulesData.total || 5)
        setCompletedModules(modulesData.completed || 3)

        const drillsRes = await fetch(`/api/dashboard/drills?userId=${user.id || 'user1'}`)
        const drillsData = await drillsRes.json()
        setDrills(
          drillsData.length
            ? drillsData
            : [
                { title: 'Safety Drill', due: '2025-09-25' },
                { title: 'Fire Drill', due: '2025-09-28' },
              ]
        )
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      }
    }

    fetchDashboardData()
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-6 p-6">
            <CompletionBar completed={completedModules} total={totalModules} />
            <ModulesGraph completed={completedModules} total={totalModules} />
            <UpcomingDrills drills={drills} />
          </div>
        )
      case 'Modules':
        return <div className="p-6">List of Modules Here</div>
      case 'Quizzes':
        return <div className="p-6">List of Quizzes Here</div>
      case 'Weather Map':
        return (
          <div className="w-full h-[80vh]">
            <WeatherMap />
          </div>
        )
      case 'Profile':
        return <ProfileCard />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}