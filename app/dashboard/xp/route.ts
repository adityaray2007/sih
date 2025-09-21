import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'

export async function GET(req: Request) {
  try {
    await connectToDatabase()

    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 })

    // Fetch user
    const user = await User.findById(userId)

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Calculate total XP
    const totalXp = user.xp || 0

    // Example: Time spent per module
    // Assuming user.completedModules = [{ moduleId, timeSpent: number }]
    const timeSpentPerModule =
      user.completedModules?.map((m: any) => m.timeSpent || 0) || []

    return NextResponse.json({ totalXp, timeSpentPerModule })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}