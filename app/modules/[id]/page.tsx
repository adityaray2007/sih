'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/app/dashboard/components/Sidebar'
import TopBar from '@/app/dashboard/components/Topbar'

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
  const router = useRouter()
  const { id } = params
  const [moduleData, setModuleData] = useState<ModuleData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [markingComplete, setMarkingComplete] = useState(false)
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechRate, setSpeechRate] = useState(1)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [isTranslating, setIsTranslating] = useState(false)
  const activeTab = "modules"

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

  // Initialize a random reading progress when module loads (until completed)
  useEffect(() => {
    if (moduleData && !completed) {
      const randomProgress = Math.floor(10 + Math.random() * 80) // 10% - 90%
      setReadingProgress(randomProgress)
    }
  }, [moduleData])

  // Cleanup speech when component unmounts or content changes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Load available voices for language selection
  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      if (v && v.length) setVoices(v)
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  // Stop speech when content changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [currentContentIndex])



  async function handleMarkComplete() {
    setMarkingComplete(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('User not authenticated')
        setMarkingComplete(false)
        return
      }
      const res = await fetch(`/api/modules/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: true }),
      })
      if (!res.ok) {
        setError('Failed to mark module as complete')
      } else {
        setCompleted(true)
        try {
          const key = 'recentlyCompletedModules'
          const list = JSON.parse(localStorage.getItem(key) || '[]')
          if (Array.isArray(list)) {
            if (!list.includes(String(id))) {
              localStorage.setItem(key, JSON.stringify([...list, String(id)]))
            }
          } else {
            localStorage.setItem(key, JSON.stringify([String(id)]))
          }
        } catch {}
      }
    } catch {
      setError('Failed to mark module as complete')
    } finally {
      setMarkingComplete(false)
    }
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'image': return '🖼️'
      case 'text': return '📝'
      case 'graph': return '📊'
      default: return '📄'
    }
  }

  const nextContent = () => {
    if (moduleData && currentContentIndex < moduleData.content.length - 1) {
      setCurrentContentIndex(currentContentIndex + 1)
    }
  }

  const prevContent = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1)
    }
  }

  // Text-to-Speech Functions
  const detectLang = (text: string) => {
    // If contains Devanagari, use Hindi; else English
    return /[\u0900-\u097F]/.test(text) ? 'hi-IN' : 'en-US'
  }

  const pickVoiceForLang = (lang: string) => {
    if (!voices || voices.length === 0) return undefined
    // Exact match first
    let voice = voices.find(v => v.lang === lang)
    if (voice) return voice
    // Fallback by prefix
    voice = voices.find(v => v.lang?.startsWith(lang.split('-')[0]))
    if (voice) return voice
    // final fallback undefined
    return undefined
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = speechRate
      utterance.pitch = 1
      utterance.volume = 1
      const lang = detectLang(text)
      utterance.lang = lang
      const v = pickVoiceForLang(lang)
      if (v) utterance.voice = v
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    }
  }

  // Translate current text content between English and Hindi (free public LibreTranslate instance)
  const translateCurrent = async () => {
    if (!moduleData) return
    const current = moduleData.content[currentContentIndex]
    if (!current || current.type !== 'text') return
    const rawHtml = current.data || ''
    const plain = rawHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    if (!plain) return
    // Decide direction: if Hindi -> English, else English -> Hindi
    const lang = detectLang(plain)
    const source = lang === 'hi-IN' ? 'hi' : 'en'
    const target = lang === 'hi-IN' ? 'en' : 'hi'

    setIsTranslating(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: plain, source, target, format: 'text' })
      })
      const data = await res.json()
      if (!res.ok || !data?.translatedText) {
        alert(data?.error || 'Translation failed')
        return
      }
      const translated = String(data.translatedText)
      const updated = { ...moduleData }
      updated.content = [...moduleData.content]
      updated.content[currentContentIndex] = { ...updated.content[currentContentIndex], data: `<p>${translated}</p>` }
      setModuleData(updated)
    } catch (e) {
      alert('Network error during translation')
    } finally {
      setIsTranslating(false)
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking()
    } else {
      const textContent = currentContent?.data || ''
      // Remove HTML tags for clean text
      const cleanText = textContent.replace(/<[^>]*>/g, '')
      if (cleanText.trim()) {
        speakText(cleanText)
      }
    }
  }

  // Force progress bar to 100% when completed
  useEffect(() => {
    if (completed) {
      setReadingProgress(100)
    }
  }, [completed])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <Sidebar activeTab="Modules" />
        <div className="flex-1 flex flex-col">
          <TopBar currentPage={activeTab} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading module...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <Sidebar activeTab="Modules" />
        <div className="flex-1 flex flex-col">
          <TopBar currentPage={activeTab} />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Module Not Found</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => router.push('/modules')}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all"
              >
                Back to Modules
              </button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (!moduleData) return null

  const currentContent = moduleData.content[currentContentIndex]
  const isLastContent = currentContentIndex === moduleData.content.length - 1

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Sidebar activeTab="Modules" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar currentPage={activeTab} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{moduleData.title}</h1>
                    <p className="text-red-100 text-lg font-medium">{moduleData.description}</p>
                  </div>
                  <button
                    onClick={() => router.push('/modules')}
                    className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-xl hover:bg-opacity-30 transition-all backdrop-blur-sm"
                  >
                    ← Back to Modules
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Reading Progress</h3>
                <span className="text-red-600 font-semibold">{completed ? 100 : Math.round(readingProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completed ? 100 : readingProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Content {currentContentIndex + 1} of {moduleData.content.length}</span>
                <span>{isLastContent ? 'Almost done!' : 'Keep reading'}</span>
              </div>
            </div>

            {/* Content Navigation */}
            {moduleData.content.length > 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Content Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {moduleData.content.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentContentIndex(index)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        index === currentContentIndex
                          ? 'bg-red-500 text-white shadow-lg'
                          : index <= currentContentIndex
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-lg mb-1">{getContentIcon(item.type)}</div>
                      <div className="text-xs font-medium">
                        {index + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-red-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-lg">{getContentIcon(currentContent.type)}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 capitalize">{currentContent.type} Content</h2>
                      <p className="text-gray-500 text-sm">Item {currentContentIndex + 1} of {moduleData.content.length}</p>
                    </div>
                  </div>
                </div>
              </div>

        <div className="p-8">
          {currentContent.type === 'image' ? (
            <div className="text-center">
              <img
                src={currentContent.data}
                alt={`Module content ${currentContentIndex + 1}`}
                className="max-w-full h-auto rounded-xl shadow-lg mx-auto"
                style={{ maxHeight: '500px' }}
              />
            </div>
          ) : currentContent.type === 'text' ? (
            <div>
              {/* TTS Controls */}
              <div className="mb-4 flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleSpeaking}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isSpeaking 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <span className="text-lg">
                      {isSpeaking ? '⏸️' : '🔊'}
                    </span>
                    <span>{isSpeaking ? 'Pause' : 'Listen'}</span>
                  </button>
                  
                  {isSpeaking && (
                    <button
                      onClick={stopSpeaking}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                    >
                      <span className="text-lg">⏹️</span>
                      <span>Stop</span>
                    </button>
                  )}
                  <button
                    onClick={translateCurrent}
                    disabled={isTranslating}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${isTranslating ? 'bg-gray-200 text-gray-500' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    <span className="text-lg">🌐</span>
                    <span>{(() => {
                      const txt = (currentContent?.data || '').replace(/<[^>]*>/g, ' ').trim()
                      const lang = /[\u0900-\u097F]/.test(txt) ? 'hi' : 'en'
                      return isTranslating ? 'Translating…' : lang === 'hi' ? 'Translate to English' : 'Translate to Hindi'
                    })()}</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">Speed:</label>
                  <select
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value={0.5}>Slow</option>
                    <option value={1}>Normal</option>
                    <option value={1.5}>Fast</option>
                  </select>
                </div>
              </div>
              
              {/* Text Content */}
              <div 
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: currentContent.data }}
              />
            </div>
          ) : currentContent.type === 'graph' ? (
            <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-600 font-medium">Graph Visualization</p>
                <p className="text-gray-500 text-sm mt-1">Interactive chart will be displayed here</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">❓</div>
              <p className="text-gray-500">Unknown content type</p>
            </div>
          )}
        </div>

              {/* Navigation Controls */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevContent}
                    disabled={currentContentIndex === 0}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span>←</span>
                    <span>Previous</span>
                  </button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      {currentContentIndex + 1} / {moduleData.content.length}
                    </p>
                  </div>

                  <button
                    onClick={nextContent}
                    disabled={isLastContent}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <span>Next</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Completion Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-red-100">
              <div className="p-6">
                {completed ? (
                  <div className="text-center py-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-green-600 text-3xl">✓</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Module Completed!</h3>
                    <p className="text-gray-600 mb-6">Congratulations! You've successfully completed this learning module.</p>
                    <div className="flex items-center justify-center space-x-4">
                      <div className="w-full max-w-md h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-semibold whitespace-nowrap">100% Complete</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Ready to Complete?</h3>
                    <p className="text-gray-600 mb-6">
                      You've made it through {currentContentIndex + 1} of {moduleData.content.length} content items. 
                      {isLastContent ? ' Mark this module as complete!' : ' Continue reading to finish the module.'}
                    </p>
                    <button
                      onClick={handleMarkComplete}
                      disabled={markingComplete}
                      className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      {markingComplete ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Marking Complete...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>✓</span>
                          <span>Mark as Complete</span>
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-600 font-medium text-center">{error}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}