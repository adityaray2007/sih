import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'
import { Module } from '@/models/Module'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's completed modules
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all modules
    const allModules = await Module.find({})
      .select('title')
      .lean()

    // Get user's completed module IDs
    const completedModuleIds = user.completedModules?.map(module => module.moduleId) || []

    // Create progress data for each module
    const moduleProgress = allModules.map(module => ({
      name: module.title || 'Untitled Module',
      completed: completedModuleIds.includes(module._id.toString()) ? 1 : 0,
      moduleId: module._id.toString()
    }))

    // Sort by completion status (completed first) then by name
    moduleProgress.sort((a, b) => {
      if (a.completed !== b.completed) {
        return b.completed - a.completed // Completed modules first
      }
      return a.name.localeCompare(b.name)
    })

    // Limit to recent modules (last 10)
    const recentModules = moduleProgress.slice(0, 10)

    return NextResponse.json(recentModules)
  } catch (error) {
    console.error('Error fetching module progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
