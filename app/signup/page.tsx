'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const [accessibility, setAccessibility] = useState('none')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, accessibility })
    })
    const data = await res.json()
    if (res.ok) {
      router.push('/login')
    } else {
      setError(data.error || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Floating orbs for extra visual appeal */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-green-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 w-full max-w-sm mx-4">
        {/* Main signup card */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/10">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-light text-white mb-1">Create Account</h1>
            <p className="text-white/60 text-xs">Join our learning platform</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          )}

          {/* Signup form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-white/80 text-xs font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-white/80 text-xs font-medium mb-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300 text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-xs font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300 pr-10 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-xs font-medium mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300 text-sm"
              >
                <option value="student" className="bg-black text-white">Student</option>
                <option value="teacher" className="bg-black text-white">Teacher</option>
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-xs font-medium mb-1">
                Accessibility Needs
              </label>
              <select
                value={accessibility}
                onChange={(e) => setAccessibility(e.target.value)}
                className="w-full p-3 bg-black/30 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300 text-sm"
              >
                <option value="none" className="bg-black text-white">None</option>
                <option value="blind" className="bg-black text-white">Blind</option>
                <option value="deaf" className="bg-black text-white">Deaf</option>
                <option value="blind-deaf" className="bg-black text-white">Blind & Deaf</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              Create Account
            </button>
          </form>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-white/60 text-xs">
              Already have an account?{' '}
              <a href="/login" className="text-white hover:underline font-medium">
                Login here
              </a>
            </p>
          </div>
        </div>

        {/* App download buttons */}
        <div className="mt-4 flex space-x-4 justify-center">
          
          
          
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 400% 400%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  )
}