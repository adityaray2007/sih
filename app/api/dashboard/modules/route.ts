import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'
import { Module } from '@/models/Module'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    await connectToDatabase()

    // Get total modules
    const totalModules = await Module.countDocuments()

    // Get completed modules for user
    const user = await User.findById(userId)
    const completedModules = user?.completedModules?.length || 0

    return NextResponse.json({
      total: totalModules,
      completed: completedModules
    })
  } catch (error) {
    console.error('Error fetching modules data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
