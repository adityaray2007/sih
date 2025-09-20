'use client'

interface Props {
  completed: number
  total: number
}

export default function CompletionBar({ completed, total }: Props) {
  const percent = (completed / total) * 100

  return (
    <div>
      <h3 className="text-black font-semibold mb-2">Modules Completed</h3>
      <div className="w-full bg-gray-300 h-4 rounded">
        <div
          className="h-4 bg-blue-600 rounded"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <p className="text-black mt-1">
        {completed} of {total} modules completed
      </p>
    </div>
  )
}
