import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'  // ✅ named import
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectToDatabase()

    // Get email and password from request
    const { email, password } = await req.json()

    // Find user
    const user = await User.findOne({ email })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Return JSON
    return NextResponse.json({
      token,
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email, 
        role: user.role,
        xp: user.xp,
        completedModules: user.completedModules,
        timeSpentPerModule: user.completedModules.map(m => ({ moduleId: m.moduleId, timeSpent: m.timeSpent }))
      }
    })

  } catch (err: any) {
    // Always return JSON on error
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 })
  }
}