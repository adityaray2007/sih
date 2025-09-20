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
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('/api/alerts')
        const data = await res.json()
        setAlerts(data.alerts || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* TopBar */}
        <TopBar />

        {/* Main content */}
        <div className="p-6 max-w-4xl mx-auto space-y-4 flex-1 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">Notifications / Alerts</h2>

          {loading && <p>Loading alerts...</p>}
          {!loading && !alerts.length && <p>No alerts available.</p>}

          {alerts.map(alert => (
            <div key={alert._id} className="bg-white p-4 rounded shadow border border-gray-200">
              <h3 className="text-xl font-semibold">{alert.title}</h3>
              {alert.description && <p>{alert.description}</p>}
              <p className="text-gray-600">Start: {new Date(alert.startTime).toLocaleString()}</p>
              <p className="text-gray-600">End: {new Date(alert.endTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}