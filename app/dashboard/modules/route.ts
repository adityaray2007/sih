import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { User } from '@/models/User'
import { Module } from '@/models/Module'

export async function GET(req: Request) {
  try {
    await connectToDatabase()

    const url = new URL(req.url)
    const userId = url.searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const totalModules = await Module.countDocuments({})
    const completedModules = user.completedModules?.length || 0

    return NextResponse.json({ total: totalModules, completed: completedModules })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}