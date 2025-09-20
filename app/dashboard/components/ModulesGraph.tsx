'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  completed: number
  total: number
}

export default function ModulesGraph({ completed, total }: Props) {
  const data = [
    { name: 'Module 1', completed: 1 },
    { name: 'Module 2', completed: 0 },
    { name: 'Module 3', completed: 1 },
    { name: 'Module 4', completed: 0 },
    { name: 'Module 5', completed: 1 },
  ]

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-black font-semibold mb-4">Modules Progress</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completed" fill="#1D4ED8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}