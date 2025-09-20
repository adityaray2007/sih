'use client'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = ['Dashboard', 'Modules', 'Quizzes', 'Weather Map', 'Profile']

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 text-xl font-bold border-b border-gray-700">PrepED</div>
      <nav className="flex-1 mt-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-6 py-3 hover:bg-gray-800 ${
              activeTab === tab ? 'bg-gray-800' : ''
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  )
}