'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateModulePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState<{ type: string; data: string }[]>([])
  const [newContentType, setNewContentType] = useState('text')
  const [newContentData, setNewContentData] = useState('')
  const [newContentFile, setNewContentFile] = useState<File | null>(null)
  const router = useRouter()

  const addContentItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (newContentType === 'image') {
      if (!newContentFile) return
      const reader = new FileReader()
      reader.onload = () => {
        const base64String = reader.result as string
        setContent([...content, { type: 'image', data: base64String }])
        setNewContentFile(null)
      }
      reader.readAsDataURL(newContentFile)
    } else {
      if (!newContentData.trim()) return
      setContent([...content, { type: newContentType, data: newContentData.trim() }])
      setNewContentData('')
    }
  }

  const handleSubmit = async () => {
    if (!title) return alert('Title is required')

    const res = await fetch('/api/modules/admin/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, content }),
    })

    if (res.ok) {
      alert('Module created successfully')
      router.push('/modules')
    } else {
      alert('Error creating module')
    }
  }

  return (
    <div className="bg-white min-h-screen p-6 max-w-4xl mx-auto text-black">
      <h2 className="text-2xl font-bold mb-4 text-black">Create New Module</h2>

      <div className="mb-4">
        <label className="block text-black mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white text-black"
        />
      </div>

      <div className="mb-4">
        <label className="block text-black mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white text-black"
        ></textarea>
      </div>

      <div className="mb-4 border-t border-gray-300 pt-4">
        <h3 className="text-black font-semibold mb-2">Add Content Items</h3>
        <div className="flex space-x-2 items-center mb-2">
          <select
            value={newContentType}
            onChange={(e) => {
              setNewContentType(e.target.value)
              setNewContentData('')
              setNewContentFile(null)
            }}
            className="p-2 border border-gray-300 rounded bg-white text-black"
          >
            <option value="text">Text</option>
            <option value="image">Image URL</option>
            <option value="graph">Graph Data (JSON)</option>
          </select>
          {newContentType === 'image' ? (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewContentFile(e.target.files[0])
                } else {
                  setNewContentFile(null)
                }
              }}
              className="flex-1 p-2 border border-gray-300 rounded bg-white text-black"
            />
          ) : (
            <input
              type="text"
              placeholder="Enter content"
              value={newContentData}
              onChange={(e) => setNewContentData(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded bg-white text-black"
            />
          )}
          <button
            onClick={addContentItem}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2 mt-2">
          {content.map((c, i) => (
            <li key={i} className="p-2 border border-gray-300 rounded bg-white text-black">
              <strong>{c.type}</strong>: {c.type === 'image' ? <img src={c.data} alt={`content-${i}`} className="max-h-24" /> : c.data}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mt-4"
      >
        Create Module
      </button>
    </div>
  )
}