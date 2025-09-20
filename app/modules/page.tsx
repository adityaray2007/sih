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

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await fetch('/api/modules')
        const data = await res.json()
        setModules(data.modules || [])
      } catch (err) {
        console.error('Error fetching modules:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

  if (loading) return <p className="text-black p-6">Loading modules...</p>
  if (!modules.length) return <p className="text-black p-6">No modules available.</p>

  return (
    <div className="flex h-screen bg-white text-black overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-6 max-w-5xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold mb-4">Available Modules</h2>
          {modules.map((module) => (
            <div
              key={module._id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition cursor-pointer border border-gray-200"
            >
              <Link href={`/modules/${module._id}`}>
                <h3 className="text-xl font-semibold">{module.title}</h3>
                <p>{module.description}</p>
              </Link>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}