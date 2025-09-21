'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/app/dashboard/components/Sidebar'
import TopBar from '@/app/dashboard/components/Topbar'

export default function DisAleartPage() {
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/disaleart?lat=28.7041&lon=77.1025')
        const json = await res.json()
        setAlerts(json.alerts || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="flex min-h-screen bg-white text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="p-6 max-w-4xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold">Live Disaster & Weather Alerts</h2>
          {loading && <p>Loading...</p>}
          {!loading && !alerts.length && <p>No current alerts.</p>}
          {alerts.map((a, i) => (
            <div key={i} className="border rounded p-4 bg-red-50">
              <div className="flex justify-between">
                <h3 className="font-semibold">{a.title}</h3>
                <small className="text-gray-600">{a.source?.toUpperCase()}</small>
              </div>
              <p className="mt-2">{a.description}</p>
              {a.published && <p className="text-sm text-gray-600">Published: {new Date(a.published).toLocaleString()}</p>}
              {a.link && <a className="text-blue-600 underline" href={a.link} target="_blank">More info</a>}
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}