'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/dashboard/components/Sidebar'
import TopBar from '@/app/dashboard/components/Topbar'
import RichTextEditor from './components/RichTextEditor'

export default function CreateModulePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState<Array<{ type: string; data: string }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const activeTab = "modules"

  const addContentItem = (type: string) => {
    setContent([...content, { type, data: '' }])
  }

  const removeContentItem = (index: number) => {
    setContent(content.filter((_, i) => i !== index))
  }

  const updateContentItem = (index: number, data: string) => {
    const newContent = [...content]
    newContent[index].data = data
    setContent(newContent)
  }

  const handleSubmit = async () => {
    if (!title) return alert('Title is required')
    if (!description) return alert('Description is required')
    if (content.length === 0) return alert('Please add content to your module')

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/modules/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description, 
          content
        }),
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

                {/* Rich Text Editor */}
                <div className="bg-white rounded-2xl shadow-lg border border-red-100">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-800">Content Builder</h2>
                    <p className="text-gray-600 mt-1">Add different types of content to your module</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <button
                        onClick={() => addContentItem('text')}
                        className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all text-center"
                      >
                        <div className="text-2xl mb-2">📝</div>
                        <div className="text-sm font-medium text-gray-700">Text</div>
                      </button>
                      <button
                        onClick={() => addContentItem('image')}
                        className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all text-center"
                      >
                        <div className="text-2xl mb-2">🖼️</div>
                        <div className="text-sm font-medium text-gray-700">Image</div>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {content.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{getContentTypeIcon(item.type)}</span>
                              <span className="font-medium text-gray-700 capitalize">{item.type}</span>
                            </div>
                            <button
                              onClick={() => removeContentItem(index)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                          
                          {item.type === 'text' ? (
                            <RichTextEditor
                              value={item.data}
                              onChange={(value) => updateContentItem(index, value)}
                              placeholder="Enter text content..."
                              className="w-full"
                            />
                          ) : item.type === 'image' ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    const formData = new FormData()
                                    formData.append('file', file)
                                    try {
                                      const res = await fetch('/api/upload', { method: 'POST', body: formData })
                                      const data = await res.json()
                                      if (res.ok && data.url) {
                                        updateContentItem(index, data.url)
                                      } else {
                                        alert(data.error || 'Upload failed')
                                      }
                                    } catch (err) {
                                      alert('Network error during upload')
                                    }
                                  }}
                                  className="block w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                />
                              </div>
                              <input
                                type="url"
                                value={item.data}
                                onChange={(e) => updateContentItem(index, e.target.value)}
                                placeholder="Or paste image URL..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                              />
                            </div>
                          ) : null}
                        </div>
                      ))}
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
                        {content.length > 0 && (
                          <div className="space-y-3">
                            {content.map((item, index) => (
                              <div key={index} className="border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-sm">{getContentTypeIcon(item.type)}</span>
                                  <span className="text-xs font-medium text-gray-600 capitalize">{item.type}</span>
                                </div>
                                {item.type === 'text' ? (
                                  <div 
                                    className="text-sm text-gray-700 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: item.data || 'No content' }}
                                  />
                                ) : item.type === 'image' ? (
                                  <div className="text-xs text-gray-500">
                                    {item.data ? (
                                      <div className="space-y-1">
                                        <img 
                                          src={item.data} 
                                          alt="Preview" 
                                          className="w-full h-20 object-cover rounded border"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                          }}
                                        />
                                        <p className="text-gray-400">Image: {item.data}</p>
                                      </div>
                                    ) : (
                                      'No image URL provided'
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">📚</div>
                        <p className="text-gray-500 text-sm">Fill in the details to see preview</p>
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
                    <li>• Mix different content types (text and images) for better engagement</li>
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