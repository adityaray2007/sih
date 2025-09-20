'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateQuizPage() {
  const [title, setTitle] = useState('')
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState<number>(0)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const router = useRouter()

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!title || !question || options.some(o => !o)) {
      alert('Please fill all fields and options')
      return
    }

    let imageBase64 = ''
    if (imageFile) {
      const reader = new FileReader()
      reader.readAsDataURL(imageFile)
      await new Promise<void>((resolve) => {
        reader.onload = () => {
          imageBase64 = reader.result as string
          resolve()
        }
      })
    }

    const res = await fetch('/api/quizzes/admin/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title, question, options, correctAnswer, image: imageBase64 }),
    })

    if (res.ok) {
      alert('Quiz created successfully')
      router.push('/quizzes')
    } else {
      alert('Failed to create quiz')
    }
  }

  return (
    <div className="min-h-screen bg-white p-6 text-black max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Quiz</h2>

      <div className="mb-4">
        <label className="block mb-1">Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          className="w-full p-2 border rounded" />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Question</label>
        <textarea value={question} onChange={e => setQuestion(e.target.value)}
          className="w-full p-2 border rounded"></textarea>
      </div>

      <div className="mb-4 space-y-2">
        <label className="block mb-1">Options</label>
        {options.map((o, i) => (
          <input key={i} type="text" value={o} onChange={e => handleOptionChange(i, e.target.value)}
            placeholder={`Option ${i + 1}`} className="w-full p-2 border rounded" />
        ))}
      </div>

      <div className="mb-4">
        <label className="block mb-1">Correct Answer</label>
        <select value={correctAnswer} onChange={e => setCorrectAnswer(Number(e.target.value))}
          className="p-2 border rounded">
          {options.map((_, i) => <option key={i} value={i}>Option {i + 1}</option>)}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Image (optional)</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Create Quiz
      </button>
    </div>
  )
}