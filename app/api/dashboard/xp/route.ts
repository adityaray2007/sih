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

    // Get user's total XP and time spent per module
    const user = await User.findById(userId)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const totalXp = user.xp || 0
    const timeSpentPerModule = user.completedModules?.map(module => module.timeSpent) || []

    return NextResponse.json({
      totalXp,
      timeSpentPerModule
    })
  } catch (error) {
    console.error('Error fetching XP data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
