'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/app/dashboard/components/Sidebar'
import TopBar from '@/app/dashboard/components/Topbar'

interface Quiz {
  _id: string
  title: string
  question: string
  options: string[]
  correctAnswer: number
  image?: string
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOptions, setSelectedOptions] = useState<{ [quizId: string]: number }>({})
  const activeTab = "Quizzes"
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch('/api/quizzes')
        const data = await res.json()
        setQuizzes(data.quizzes || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  const handleSelect = (quizId: string, optionIndex: number) => {
    setSelectedOptions({ ...selectedOptions, [quizId]: optionIndex })
  }

  const handleSubmit = (quiz: Quiz) => {
    const selected = selectedOptions[quiz._id]
    if (selected === undefined) {
      alert('Please select an option')
      return
    }
    const correct = selected === quiz.correctAnswer
    alert(correct ? 'Correct!' : `Incorrect! Correct answer is Option ${quiz.correctAnswer + 1}`)
  }

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <Sidebar activeTab="Quizzes" />

      <div className="flex-1 flex flex-col">
        {/* TopBar */}
        <TopBar currentPage={activeTab} />

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6 max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold mb-4">Available Quizzes</h2>

          {loading && <p>Loading quizzes...</p>}
          {!loading && !quizzes.length && <p>No quizzes available.</p>}

          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white p-4 rounded shadow border border-gray-200">
              <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
              {quiz.image && (
                <img src={quiz.image} alt={quiz.title} className="max-w-full max-h-64 rounded mb-2" />
              )}
              <p className="mb-2">{quiz.question}</p>
              <div className="space-y-1">
                {quiz.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`quiz-${quiz._id}`}
                      checked={selectedOptions[quiz._id] === index}
                      onChange={() => handleSelect(quiz._id, index)}
                      className="cursor-pointer"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => handleSubmit(quiz)}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Submit Answer
              </button>
            </div>
          ))}
        </main>
      </div>
    </div>
  )
}