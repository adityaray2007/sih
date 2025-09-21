'use client'

import React from 'react'
import { UserIcon, AcademicCapIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/outline'

interface ProfileCardProps {
  user?: {
    id: string
    name: string
    email: string
    role: string
    xp: number
    completedModules: string[]
    timeSpentPerModule: { moduleId: string; timeSpent: number }[]
  } | null
}

export default function ProfileCard({ user }: ProfileCardProps) {
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

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

  const totalTimeSpent = (user.timeSpentPerModule || []).reduce((sum, module) => sum + (module.timeSpent || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-red-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
              <p className="text-lg text-gray-600 mb-1">{user.email}</p>
              <span className="inline-block px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                {getUserRoleDisplay(user.role)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{(user.xp || 0).toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total XP</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <AcademicCapIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{(user.completedModules || []).length}</p>
                <p className="text-sm text-gray-500">Modules Completed</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{Math.round(totalTimeSpent)}</p>
                <p className="text-sm text-gray-500">Minutes Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">✓</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Completed Safety Module</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <span className="text-green-600 font-medium">+100 XP</span>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">📊</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Took Fire Safety Quiz</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
              <span className="text-blue-600 font-medium">+50 XP</span>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-lg">🎯</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Achieved Safety Expert Badge</p>
                <p className="text-sm text-gray-500">3 days ago</p>
              </div>
              <span className="text-purple-600 font-medium">+200 XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}