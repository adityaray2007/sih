'use client'

export default function ProfileCard() {
  // Dummy user data; replace with real user later
  const user = {
    name: 'Aditya Ray',
    email: 'aditya@example.com',
    role: 'Student',
    accessibility: 'Blind',
  }

  return (
    <div className="p-6 bg-white rounded shadow max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-bold text-black mb-2">{user.name}</h2>
      <p className="text-black mb-1">Email: {user.email}</p>
      <p className="text-black mb-1">Role: {user.role}</p>
      <p className="text-black mb-1">Accessibility: {user.accessibility}</p>
    </div>
  )
}