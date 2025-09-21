'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/app/dashboard/components/Sidebar'
import TopBar from '@/app/dashboard/components/Topbar'

interface Alert {
  _id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  createdBy: string
  source?: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const activeTab = "alerts"
    
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/alerts')
        const data = await res.json()
        setAlerts(data.alerts || [])
      } catch (err) {
        console.error('Failed to fetch alerts:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true
    if (filter === 'external') return alert.createdBy.startsWith('external:')
    if (filter === 'internal') return !alert.createdBy.startsWith('external:')
    return true
  })

  const getAlertIcon = (isExternal: boolean) => {
    return isExternal ? '🚨' : '📢'
  }

  const getAlertTypeLabel = (isExternal: boolean) => {
    return isExternal ? 'Emergency Alert' : 'System Notification'
  }

  const getAlertPriority = (alert: Alert) => {
    const isExternal = alert.createdBy.startsWith('external:')
    const now = new Date()
    const startTime = new Date(alert.startTime)
    const endTime = new Date(alert.endTime)
    
    if (isExternal) return 'high'
    if (now >= startTime && now <= endTime) return 'medium'
    return 'low'
  }

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          border: 'border-red-200',
          bg: 'bg-gradient-to-r from-red-50 to-red-100',
          badge: 'bg-red-500 text-white',
          icon: 'bg-red-100 text-red-600'
        }
      case 'medium':
        return {
          border: 'border-orange-200',
          bg: 'bg-gradient-to-r from-orange-50 to-orange-100',
          badge: 'bg-orange-500 text-white',
          icon: 'bg-orange-100 text-orange-600'
        }
      default:
        return {
          border: 'border-blue-200',
          bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
          badge: 'bg-blue-500 text-white',
          icon: 'bg-blue-100 text-blue-600'
        }
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Sidebar activeTab="Alerts" />

      <div className="flex-1 flex flex-col">
        <TopBar currentPage={activeTab} />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🔔</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white font-['Inter']">Notifications & Alerts</h1>
                    <p className="text-red-100 text-lg font-medium mt-1">
                      Stay informed with the latest updates and emergency notifications
                    </p>
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
                    <p className="text-2xl font-bold text-gray-800">{alerts.length}</p>
                    <p className="text-sm text-gray-500">Total Alerts</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-xl">📊</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {alerts.filter(a => a.createdBy.startsWith('external:')).length}
                    </p>
                    <p className="text-sm text-gray-500">Emergency</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🚨</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {alerts.filter(a => !a.createdBy.startsWith('external:')).length}
                    </p>
                    <p className="text-sm text-gray-500">System</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl">📢</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {alerts.filter(a => {
                        const now = new Date()
                        const start = new Date(a.startTime)
                        const end = new Date(a.endTime)
                        return now >= start && now <= end
                      }).length}
                    </p>
                    <p className="text-sm text-gray-500">Active Now</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">🟢</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Filter Alerts</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filter === 'all' 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Alerts
                  </button>
                  <button
                    onClick={() => setFilter('external')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filter === 'external' 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Emergency
                  </button>
                  <button
                    onClick={() => setFilter('internal')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      filter === 'internal' 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    System
                  </button>
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-6">
              {loading && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mb-4"></div>
                  <p className="text-gray-500 font-medium">Loading alerts...</p>
                </div>
              )}

              {!loading && filteredAlerts.length === 0 && (
                <div className="bg-white rounded-2xl p-12 shadow-lg border border-red-100 text-center">
                  <div className="text-6xl mb-4">🔕</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No alerts available</h3>
                  <p className="text-gray-500">You're all caught up! Check back later for new notifications.</p>
                </div>
              )}

              {filteredAlerts.map(alert => {
                const isExternal = alert.createdBy.startsWith('external:')
                const priority = getAlertPriority(alert)
                const styles = getPriorityStyles(priority)
                const isActive = new Date() >= new Date(alert.startTime) && new Date() <= new Date(alert.endTime)

                return (
                  <div
                    key={alert._id}
                    className={`relative overflow-hidden bg-white rounded-2xl shadow-lg border-2 ${styles.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className={`absolute top-0 left-0 w-full h-1 ${styles.bg}`}></div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${styles.icon}`}>
                            <span className="text-2xl">{getAlertIcon(isExternal)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-800">{alert.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles.badge}`}>
                                {getAlertTypeLabel(isExternal)}
                              </span>
                              {isActive && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white animate-pulse">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            
                            {alert.description && (
                              <p className="text-gray-600 mb-4 leading-relaxed">{alert.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800 mb-1">
                            Priority: <span className="capitalize">{priority}</span>
                          </p>
                          {isExternal && alert.source && (
                            <p className="text-xs text-gray-500">
                              Source: {alert.source.toUpperCase()}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Start Time</p>
                          <p className="text-gray-800 font-medium">
                            {new Date(alert.startTime).toLocaleString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-semibold text-gray-700 mb-1">End Time</p>
                          <p className="text-gray-800 font-medium">
                            {new Date(alert.endTime).toLocaleString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Duration indicator */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Duration</span>
                          <span className="font-medium text-gray-700">
                            {Math.ceil((new Date(alert.endTime).getTime() - new Date(alert.startTime).getTime()) / (1000 * 60 * 60 * 24))} days
                          </span>
                        </div>
                        <div className="mt-2 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`} 
                            style={{
                              width: isActive ? '100%' : '0%'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}