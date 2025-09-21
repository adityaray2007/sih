'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/dashboard/components/Sidebar'
import TopBar from '@/app/dashboard/components/Topbar'

export default function CreateModulePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState<{ type: string; data: string }[]>([])
  const [newContentType, setNewContentType] = useState('text')
  const [newContentData, setNewContentData] = useState('')
  const [newContentFile, setNewContentFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const activeTab = "modules"

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

  const removeContentItem = (index: number) => {
    setContent(content.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!title) return alert('Title is required')
    if (!description) return alert('Description is required')
    if (content.length === 0) return alert('Please add at least one content item')

    setIsSubmitting(true)

    try {
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
    } catch (error) {
      alert('Network error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return '📝'
      case 'image': return '🖼️'
      case 'graph': return '📊'
      default: return '📄'
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Sidebar activeTab="Modules" />

      <div className="flex-1 flex flex-col">
        <TopBar currentPage={activeTab} />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-5xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">📚</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Create Learning Module</h1>
                    <p className="text-red-100 text-lg font-medium mt-1">
                      Build engaging educational content for emergency preparedness
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            </div>

            {/* Progress Indicator */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    title ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <span className={`font-medium ${title ? 'text-green-600' : 'text-gray-500'}`}>
                    Basic Info
                  </span>
                </div>
                
                <div className={`flex-1 h-1 rounded-full ${
                  title && description ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
                
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    content.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <span className={`font-medium ${content.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                    Content
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="xl:col-span-2 space-y-8">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl shadow-lg border border-red-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">Module Details</h2>
                    <p className="text-gray-600 mt-1">Provide basic information about your module</p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-gray-700">
                        <span className="text-lg mr-2">📝</span>
                        Module Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a clear, descriptive title for your module"
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all font-medium text-gray-800 placeholder-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center text-sm font-semibold text-gray-700">
                        <span className="text-lg mr-2">📄</span>
                        Description *
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what students will learn from this module..."
                        rows={4}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all font-medium text-gray-800 placeholder-gray-400 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Builder */}
                <div className="bg-white rounded-2xl shadow-lg border border-red-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">Content Builder</h2>
                    <p className="text-gray-600 mt-1">Add various types of content to your module</p>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Content Type Selector */}
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'text', label: 'Text Content', icon: '📝', desc: 'Add paragraphs, explanations' },
                        { value: 'image', label: 'Image', icon: '🖼️', desc: 'Upload visual content' },
                        { value: 'graph', label: 'Graph Data', icon: '📊', desc: 'Add charts and graphs' }
                      ].map((type) => (
                        <button
                          key={type.value}
                          onClick={() => {
                            setNewContentType(type.value)
                            setNewContentData('')
                            setNewContentFile(null)
                          }}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            newContentType === type.value
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <h4 className="font-semibold text-gray-800">{type.label}</h4>
                          <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
                        </button>
                      ))}
                    </div>

                    {/* Content Input */}
                    <div className="space-y-4">
                      {newContentType === 'image' ? (
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            Upload Image
                          </label>
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
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 transition-all"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                            {newContentType === 'text' ? 'Text Content' : 'Graph Data (JSON)'}
                          </label>
                          <textarea
                            placeholder={
                              newContentType === 'text' 
                                ? "Enter your text content here..."
                                : '{"type": "bar", "data": {...}}'
                            }
                            value={newContentData}
                            onChange={(e) => setNewContentData(e.target.value)}
                            rows={4}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all resize-none"
                          />
                        </div>
                      )}

                      <button
                        onClick={addContentItem}
                        disabled={
                          newContentType === 'image' 
                            ? !newContentFile 
                            : !newContentData.trim()
                        }
                        className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Add Content Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="space-y-6">
                {/* Module Preview */}
                <div className="bg-white rounded-2xl shadow-lg border border-red-100 sticky top-4">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">Module Preview</h3>
                    <p className="text-gray-600 text-sm mt-1">See how your module will look</p>
                  </div>
                  
                  <div className="p-6">
                    {title || description || content.length > 0 ? (
                      <div className="space-y-4">
                        {title && (
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{title}</h4>
                          </div>
                        )}
                        {description && (
                          <p className="text-gray-600 text-sm">{description}</p>
                        )}
                        <div className="text-sm text-gray-500">
                          {content.length} content item{content.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">📚</div>
                        <p className="text-gray-500 text-sm">Fill in the details to see preview</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Items List */}
                <div className="bg-white rounded-2xl shadow-lg border border-red-100">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">Content Items</h3>
                    <p className="text-gray-600 text-sm mt-1">{content.length} items added</p>
                  </div>

                  <div className="p-6">
                    {content.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">📄</div>
                        <p className="text-gray-500 text-sm">No content items yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {content.map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-red-600 text-sm">{getContentTypeIcon(item.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-800 capitalize text-sm">
                                  {item.type}
                                </span>
                                <button
                                  onClick={() => removeContentItem(index)}
                                  className="text-red-500 hover:text-red-700 text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="text-xs text-gray-500 mt-1 truncate">
                                {item.type === 'image' ? 'Image uploaded' : item.data.substring(0, 50) + '...'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !title || !description || content.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Module...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>✨</span>
                        <span>Create Module</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">💡</span>
                </div>
                <div>
                  <h4 className="font-bold text-blue-800 mb-2">Module Creation Tips</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Start with a clear, descriptive title that tells students what they'll learn</li>
                    <li>• Write a comprehensive description explaining the module's objectives</li>
                    <li>• Mix different content types (text, images, graphs) for better engagement</li>
                    <li>• Structure content logically from basic concepts to advanced topics</li>
                    <li>• Use images to illustrate key concepts and make content more visual</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}