import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'

export async function GET() {
  try {
    await connectToDatabase()

    // Find top 5 students by XP
    const topStudents = await User.find({ role: 'student' })
      .sort({ xp: -1 })
      .limit(5)
      .select({ name: 1, xp: 1, _id: 0 })
      .lean()

    return NextResponse.json(topStudents)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}