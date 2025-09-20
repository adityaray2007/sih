'use client'

interface Drill {
  title: string
  due: string
}

interface Props {
  drills: Drill[]
}

export default function UpcomingDrills({ drills }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-black font-semibold mb-4">Upcoming Drills</h3>
      <ul className="space-y-2">
        {drills.map((drill, idx) => (
          <li
            key={idx}
            className="p-3 border border-gray-200 rounded flex justify-between items-center hover:bg-gray-50"
          >
            <span>{drill.title}</span>
            <span className="text-gray-500 text-sm">{drill.due}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}