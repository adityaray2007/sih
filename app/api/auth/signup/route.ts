import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const { name, email, password, role, accessibility } = await req.json()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash, role, accessibility })

    return NextResponse.json({ user: { name: user.name, email: user.email, role: user.role } })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 })
  }
}