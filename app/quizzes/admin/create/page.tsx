'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/dashboard/components/Sidebar'
import TopBar from '@/app/dashboard/components/Topbar'

export default function CreateQuizPage() {
  const [title, setTitle] = useState('')
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState<number>(0)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const activeTab = "create quiz"

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    // Reset file input
    const fileInput = document.getElementById('image-input') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const handleSubmit = async () => {
    if (!title.trim() || !question.trim() || options.some(o => !o.trim())) {
      alert('Please fill all fields and options')
      return
    }

    setIsSubmitting(true)

    try {
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
        alert('Quiz created successfully! 🎉')
        router.push('/quizzes')
      } else {
        alert('Failed to create quiz')
      }
    } catch (error) {
      alert('An error occurred while creating the quiz')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
      // Adjust correct answer if necessary
      if (correctAnswer >= newOptions.length) {
        setCorrectAnswer(0)
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <Sidebar activeTab="Quizzes" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TopBar */}
        <TopBar currentPage={activeTab} />

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Create New Quiz</h1>
              <p className="text-slate-600">Design an engaging quiz to test knowledge and skills</p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Quiz Creation Progress</h3>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-rose-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(
                            (title ? 20 : 0) + 
                            (question ? 20 : 0) + 
                            (options.filter(o => o.trim()).length * 10) + 
                            (correctAnswer !== undefined ? 20 : 0)
                          )}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="text-2xl font-bold text-slate-800">
                      {Math.round((
                        (title ? 20 : 0) + 
                        (question ? 20 : 0) + 
                        (options.filter(o => o.trim()).length * 10) + 
                        (correctAnswer !== undefined ? 20 : 0)
                      ))}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Quiz Title */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-red-100 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">Quiz Title</h3>
                    <p className="text-slate-600 text-sm">Give your quiz an engaging title</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter quiz title..."
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-0 outline-none transition-colors duration-200 text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Quiz Question */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-rose-100 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">Question</h3>
                    <p className="text-slate-600 text-sm">Write a clear and concise question</p>
                  </div>
                </div>
                <textarea
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="Enter your question here..."
                  rows={4}
                  className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-0 outline-none transition-colors duration-200 text-slate-800 placeholder-slate-400 resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-pink-100 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">Image (Optional)</h3>
                    <p className="text-slate-600 text-sm">Add a visual element to your quiz</p>
                  </div>
                </div>
                
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors duration-200">
                    <input
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="image-input" className="cursor-pointer">
                      <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-slate-600 font-medium mb-2">Click to upload an image</p>
                      <p className="text-slate-400 text-sm">PNG, JPG, GIF up to 10MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover rounded-xl" />
                    <button
                      onClick={removeImage}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Answer Options */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-red-100 rounded-xl mr-4">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">Answer Options</h3>
                      <p className="text-slate-600 text-sm">Provide multiple choice options</p>
                    </div>
                  </div>
                  {options.length < 6 && (
                    <button
                      onClick={addOption}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Option
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-medium text-sm">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={e => handleOptionChange(index, e.target.value)}
                        placeholder={`Enter option ${index + 1}...`}
                        className="flex-1 p-3 border-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-0 outline-none transition-colors duration-200 text-slate-800 placeholder-slate-400"
                      />
                      {options.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-600 p-2 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Correct Answer Selection */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-rose-100 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">Correct Answer</h3>
                    <p className="text-slate-600 text-sm">Select which option is the correct answer</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setCorrectAnswer(index)}
                      disabled={!option.trim()}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        correctAnswer === index
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : option.trim()
                          ? 'border-slate-200 bg-white hover:border-red-300 hover:bg-red-50 text-slate-700'
                          : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          Option {String.fromCharCode(65 + index)}
                        </span>
                        {correctAnswer === index && (
                          <svg className="w-5 h-5 text-red-600 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs mt-1 truncate">
                        {option.trim() || 'Empty option'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Ready to Create?</h3>
                    <p className="text-slate-600 text-sm">Review your quiz and click create when ready</p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !title.trim() || !question.trim() || options.some(o => !o.trim())}
                    className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Creating Quiz...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Quiz
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}