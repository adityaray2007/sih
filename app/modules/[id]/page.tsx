'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type ContentItem = {
  type: string
  data: string
}

type ModuleData = {
  title: string
  description: string
  content: ContentItem[]
}

export default function ModulePage() {
  const params = useParams()
  const { id } = params
  const [moduleData, setModuleData] = useState<ModuleData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchModule() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/modules/${id}`)
        if (res.status === 404) {
          setError('Module not found')
          setModuleData(null)
        } else if (!res.ok) {
          setError('Failed to fetch module')
          setModuleData(null)
        } else {
          const data = await res.json()
          setModuleData(data)
        }
      } catch {
        setError('Failed to fetch module')
        setModuleData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchModule()
  }, [id])

  if (loading) return <div className="p-6 max-w-4xl mx-auto">Loading...</div>
  if (error) return <div className="p-6 max-w-4xl mx-auto text-red-600 font-bold">{error}</div>
  if (!moduleData) return null

  return (
    <div className="bg-white min-h-screen p-6 max-w-4xl mx-auto text-black">
      <h1 className="text-3xl font-bold mb-4">{moduleData.title}</h1>
      <p className="mb-6">{moduleData.description}</p>

      <div className="space-y-6">
        {moduleData.content.map((item, index) => {
          if (item.type === 'image') {
            return <img key={index} src={item.data} alt={`content-${index}`} className="max-w-full max-h-96 rounded" />
          } else if (item.type === 'text') {
            return <p key={index} className="text-base">{item.data}</p>
          } else if (item.type === 'graph') {
            return (
              <div
                key={index}
                className="w-full h-48 bg-gray-200 flex items-center justify-center rounded text-gray-600"
              >
                Graph Placeholder
              </div>
            )
          } else {
            return null
          }
        })}
      </div>
    </div>
  )
}