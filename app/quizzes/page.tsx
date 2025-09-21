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
  const [submittedQuizzes, setSubmittedQuizzes] = useState<{ [quizId: string]: boolean }>({})
  const [quizResults, setQuizResults] = useState<{ [quizId: string]: { correct: boolean, selectedOption: number } }>({})
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
    if (!submittedQuizzes[quizId]) {
      setSelectedOptions({ ...selectedOptions, [quizId]: optionIndex })
    }
  }

  const handleSubmit = async (quiz: Quiz) => {
    const selected = selectedOptions[quiz._id]
    if (selected === undefined) {
      alert('Please select an option')
      return
    }
    
    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please log in to submit quiz answers')
        return
      }

      // Send answer to API for XP awarding
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId: quiz._id,
          selectedOption: selected
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        const correct = result.correct
        const xpAwarded = result.xp
        const wasXpAwarded = result.xpAwarded
        const alreadyCompleted = result.alreadyCompleted
        
        setSubmittedQuizzes({ ...submittedQuizzes, [quiz._id]: true })
        setQuizResults({ 
          ...quizResults, 
          [quiz._id]: { correct, selectedOption: selected } 
        })
        
        if (correct) {
          if (wasXpAwarded) {
            alert(`Correct! 🎉 You earned 10 XP! Total XP: ${xpAwarded}`)
          } else if (alreadyCompleted) {
            alert(`Correct! ✅ (You already completed this quiz, no XP awarded)`)
          } else {
            alert(`Correct! 🎉 Total XP: ${xpAwarded}`)
          }
        } else {
          alert(`Incorrect! The correct answer is Option ${quiz.correctAnswer + 1}`)
        }
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Error submitting quiz. Please try again.')
    }
  }

  const resetQuiz = (quizId: string) => {
    const newSelectedOptions = { ...selectedOptions }
    const newSubmittedQuizzes = { ...submittedQuizzes }
    const newQuizResults = { ...quizResults }
    
    delete newSelectedOptions[quizId]
    delete newSubmittedQuizzes[quizId]
    delete newQuizResults[quizId]
    
    setSelectedOptions(newSelectedOptions)
    setSubmittedQuizzes(newSubmittedQuizzes)
    setQuizResults(newQuizResults)
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar activeTab="Quizzes" />
      
      <div className="flex-1 flex flex-col">
        {/* TopBar */}
        <TopBar currentPage={activeTab} />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Available Quizzes</h1>
              <p className="text-slate-600">Test your knowledge with our interactive quizzes</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Total Quizzes</p>
                    <p className="text-2xl font-bold text-slate-900">{quizzes.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-3 bg-rose-100 rounded-xl">
                    <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Completed</p>
                    <p className="text-2xl font-bold text-slate-900">{Object.keys(submittedQuizzes).length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="p-3 bg-pink-100 rounded-xl">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">Success Rate</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {Object.keys(quizResults).length > 0 
                        ? Math.round((Object.values(quizResults).filter(r => r.correct).length / Object.keys(quizResults).length) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                <p className="ml-4 text-slate-600">Loading quizzes...</p>
              </div>
            )}

            {/* No Quizzes State */}
            {!loading && !quizzes.length && (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No quizzes available</h3>
                <p className="text-slate-500">Check back later for new quizzes!</p>
              </div>
            )}

            {/* Quizzes Grid */}
            <div className="space-y-6">
              {quizzes.map((quiz, index) => {
                const isSubmitted = submittedQuizzes[quiz._id]
                const result = quizResults[quiz._id]
                
                return (
                  <div key={quiz._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {/* Quiz Header */}
                    <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
                          <div className="flex items-center text-red-100">
                            <span className="text-sm">Quiz #{index + 1}</span>
                            {isSubmitted && (
                              <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium ${
                                result?.correct 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : 'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {result?.correct ? '✓ Correct' : '✗ Incorrect'}
                              </span>
                            )}
                          </div>
                        </div>
                        {isSubmitted && (
                          <button
                            onClick={() => resetQuiz(quiz._id)}
                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            Try Again
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Quiz Content */}
                    <div className="p-6">
                      {/* Quiz Image */}
                      {quiz.image && (
                        <div className="mb-6">
                          <img 
                            src={quiz.image} 
                            alt={quiz.title} 
                            className="w-full max-h-64 object-cover rounded-xl shadow-sm"
                          />
                        </div>
                      )}

                      {/* Question */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-slate-800 mb-3">Question:</h4>
                        <p className="text-slate-700 leading-relaxed">{quiz.question}</p>
                      </div>

                      {/* Options */}
                      <div className="space-y-3 mb-6">
                        <h4 className="text-lg font-semibold text-slate-800">Options:</h4>
                        {quiz.options.map((option, optionIndex) => {
                          const isSelected = selectedOptions[quiz._id] === optionIndex
                          const isCorrectAnswer = optionIndex === quiz.correctAnswer
                          const showResult = isSubmitted && result
                          
                          let optionClasses = "flex items-center p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer "
                          
                          if (showResult) {
                            if (isCorrectAnswer) {
                              optionClasses += "border-green-200 bg-green-50 "
                            } else if (isSelected && !isCorrectAnswer) {
                              optionClasses += "border-red-200 bg-red-50 "
                            } else {
                              optionClasses += "border-slate-200 bg-slate-50 cursor-not-allowed "
                            }
                          } else if (isSelected) {
                            optionClasses += "border-red-500 bg-red-50 "
                          } else {
                            optionClasses += "border-slate-200 bg-white hover:border-red-300 hover:bg-red-50 "
                          }
                          
                          return (
                            <label key={optionIndex} className={optionClasses}>
                              <input
                                type="radio"
                                name={`quiz-${quiz._id}`}
                                checked={isSelected}
                                onChange={() => handleSelect(quiz._id, optionIndex)}
                                disabled={isSubmitted}
                                className="w-4 h-4 text-red-600 border-slate-300 focus:ring-red-500 mr-4"
                              />
                              <span className="flex-1 text-slate-800 font-medium">
                                <span className="text-sm text-slate-500 mr-2">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                {option}
                              </span>
                              {showResult && isCorrectAnswer && (
                                <svg className="w-5 h-5 text-green-600 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              {showResult && isSelected && !isCorrectAnswer && (
                                <svg className="w-5 h-5 text-red-600 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              )}
                            </label>
                          )
                        })}
                      </div>

                      {/* Submit Button */}
                      {!isSubmitted && (
                        <button
                          onClick={() => handleSubmit(quiz)}
                          disabled={selectedOptions[quiz._id] === undefined}
                          className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
                        >
                          Submit Answer
                        </button>
                      )}

                      {/* Result Display */}
                      {isSubmitted && result && (
                        <div className={`p-4 rounded-xl border-2 ${
                          result.correct 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        }`}>
                          <div className="flex items-center">
                            {result.correct ? (
                              <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                            )}
                            <div>
                              <p className={`font-semibold ${result.correct ? 'text-green-800' : 'text-red-800'}`}>
                                {result.correct ? 'Correct Answer! 🎉' : 'Incorrect Answer'}
                              </p>
                              {!result.correct && (
                                <p className="text-red-700 text-sm mt-1">
                                  The correct answer is: <strong>Option {quiz.correctAnswer + 1}</strong>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
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