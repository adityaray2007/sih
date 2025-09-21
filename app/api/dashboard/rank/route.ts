import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    await connectToDatabase()

    // Get the user's XP
    const user = await User.findById(userId)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userXp = user.xp || 0

    // Count how many users have more XP than this user
    const usersWithHigherXp = await User.countDocuments({ 
      xp: { $gt: userXp },
      role: 'student' // Only count students in ranking
    })

    // The rank is the number of users with higher XP + 1
    const rank = usersWithHigherXp + 1

    // Get total number of students for context
    const totalStudents = await User.countDocuments({ role: 'student' })

    return NextResponse.json({
      rank,
      totalStudents,
      userXp
    })
  } catch (error) {
    console.error('Error calculating user rank:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
