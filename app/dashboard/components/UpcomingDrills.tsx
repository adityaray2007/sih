'use client'

interface Alert {
  title: string
  due: string
}

interface Props {
  drills: Alert[]
}

export default function UpcomingDrills({ drills }: Props) {
  if (!drills || drills.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">📅</div>
        <p className="text-gray-500 font-medium">No upcoming alerts</p>
        <p className="text-gray-400 text-sm">Check back later for new alerts and events</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {drills.map((alert, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-lg">🚨</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800">{alert.title}</p>
              <p className="text-sm text-gray-500">Scheduled Alert</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-red-600">
              {new Date(alert.due).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(alert.due).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-xs text-gray-400">
              {(() => {
                const now = new Date()
                const dueDate = new Date(alert.due)
                const diffTime = dueDate.getTime() - now.getTime()
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                
                if (diffDays === 0) return 'Today'
                if (diffDays === 1) return 'Tomorrow'
                if (diffDays > 1) return `In ${diffDays} days`
                return 'Overdue'
              })()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}