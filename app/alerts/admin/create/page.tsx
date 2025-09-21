'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/app/dashboard/components/Sidebar'
import TopBar from '@/app/dashboard/components/Topbar'

export default function SendAlertPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [alertType, setAlertType] = useState('system')
  const [priority, setPriority] = useState('medium')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const activeTab = "alerts"

  const handleSubmit = async () => {
    if (!title || !startTime || !endTime) {
      alert('Please fill all required fields')
      return
    }

    if (new Date(startTime) >= new Date(endTime)) {
      alert('End time must be after start time')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/alerts/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ 
          title, 
          description, 
          startTime, 
          endTime,
          alertType,
          priority 
        }),
      })

      if (res.ok) {
        alert('Alert sent to all students!')
        router.push('/alerts')
      } else {
        alert('Failed to send alert')
      }
    } catch (error) {
      alert('Error sending alert')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return '🚨'
      case 'drill': return '🎯'
      case 'maintenance': return '🔧'
      case 'system': return '📢'
      default: return '📢'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-orange-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-blue-500'
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Sidebar activeTab="Alerts" />

      <div className="flex-1 flex flex-col">
        <TopBar currentPage={activeTab} />

        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-4xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-8 shadow-2xl">
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📨</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white font-['Inter']">Create Alert</h1>
                    <p className="text-red-100 text-lg font-medium mt-1">
                      Send important notifications to all students
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
            </div>

            {/* Alert Type Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Alert Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: 'emergency', label: 'Emergency', icon: '🚨', color: 'red' },
                  { value: 'drill', label: 'Drill', icon: '🎯', color: 'orange' },
                  { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'blue' },
                  { value: 'system', label: 'System', icon: '📢', color: 'gray' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setAlertType(type.value)}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                      alertType === type.value
                        ? `border-${type.color}-500 bg-${type.color}-50 shadow-lg`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <p className="font-semibold text-gray-800">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-red-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Alert Details</h3>
                <p className="text-gray-600 mt-1">Fill in the information for your alert</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Title Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <span className="text-lg mr-2">{getAlertTypeIcon(alertType)}</span>
                    Alert Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter a clear, descriptive title for your alert"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all font-medium text-gray-800 placeholder-gray-400"
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <span className="text-lg mr-2">📝</span>
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide additional details about this alert..."
                    rows={4}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all font-medium text-gray-800 placeholder-gray-400 resize-none"
                  />
                </div>

                {/* Priority Selection */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700">
                    <span className="text-lg mr-2">⚡</span>
                    Priority Level
                  </label>
                  <div className="flex space-x-3">
                    {[
                      { value: 'high', label: 'High Priority', color: 'red' },
                      { value: 'medium', label: 'Medium Priority', color: 'orange' },
                      { value: 'low', label: 'Low Priority', color: 'green' }
                    ].map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPriority(p.value)}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                          priority === p.value
                            ? `border-${p.color}-500 bg-${p.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(p.value)}`}></div>
                          <span className="font-semibold text-gray-800">{p.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <span className="text-lg mr-2">⏰</span>
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all font-medium text-gray-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-semibold text-gray-700">
                      <span className="text-lg mr-2">⏰</span>
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-0 transition-all font-medium text-gray-800"
                    />
                  </div>
                </div>

                {/* Preview Section */}
                {title && (
                  <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300">
                    <h4 className="text-lg font-bold text-gray-800 mb-3">Preview</h4>
                    <div className={`p-4 rounded-xl border-2 ${
                      priority === 'high' ? 'border-red-200 bg-red-50' :
                      priority === 'medium' ? 'border-orange-200 bg-orange-50' :
                      'border-green-200 bg-green-50'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          priority === 'high' ? 'bg-red-100 text-red-600' :
                          priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          <span className="text-lg">{getAlertTypeIcon(alertType)}</span>
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-gray-800">{title}</h5>
                          {description && <p className="text-gray-600 mt-1">{description}</p>}
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Type: {alertType}</span>
                            <span>Priority: {priority}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => router.push('/alerts')}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !title || !startTime || !endTime}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>📤</span>
                        <span>Send Alert to All Students</span>
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
                  <h4 className="font-bold text-blue-800 mb-2">Alert Guidelines</h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Use clear, actionable titles that immediately convey the message</li>
                    <li>• Set appropriate priority levels based on urgency and importance</li>
                    <li>• Emergency alerts should be reserved for critical safety situations</li>
                    <li>• Include relevant details in the description to provide context</li>
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