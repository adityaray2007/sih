'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SendAlertPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    if (!title || !startTime || !endTime) {
      alert('Please fill all required fields')
      return
    }

    const res = await fetch('/api/alerts/admin/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title, description, startTime, endTime }),
    })

    if (res.ok) {
      alert('Alert sent to all students!')
      router.push('/alerts')
    } else {
      alert('Failed to send alert')
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 text-black max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Send Alert / Drill</h2>

      <div className="mb-4">
        <label className="block mb-1">Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          className="w-full p-2 border rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          className="w-full p-2 border rounded"></textarea>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Start Time</label>
        <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)}
          className="w-full p-2 border rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1">End Time</label>
        <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)}
          className="w-full p-2 border rounded" />
      </div>

      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Send Alert
      </button>
    </div>
  )
}