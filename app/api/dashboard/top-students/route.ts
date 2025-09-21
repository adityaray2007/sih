import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'

export async function GET() {
  try {
    await connectToDatabase()

    // Get top 5 students by XP
    const topStudents = await User.find({})
      .sort({ xp: -1 })
      .limit(5)
      .select('name xp')
      .lean()

    // Ensure all students have xp property
    const safeTopStudents = topStudents.map(student => ({
      name: student.name || 'Unknown',
      xp: student.xp || 0
    }))

    return NextResponse.json(safeTopStudents)
  } catch (error) {
    console.error('Error fetching top students:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
