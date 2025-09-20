'use client'

export default function TopBar() {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-end px-6">
      <img
        src="/profile-logo.png"
        alt="Profile"
        className="w-10 h-10 rounded-full border border-gray-300"
      />
    </div>
  )
}
