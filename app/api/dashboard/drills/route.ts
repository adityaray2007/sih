import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Alert } from '@/models/Alert'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    await connectToDatabase()

    // Get upcoming alerts as drills (alerts that haven't ended yet)
    const currentDate = new Date()
    const upcomingAlerts = await Alert.find({
      endTime: { $gte: currentDate } // Only get alerts that haven't ended
    })
    .sort({ startTime: 1 }) // Sort by start time, earliest first
    .limit(5)
    .select('title startTime endTime')
    .lean()

    const drills = upcomingAlerts.map(alert => ({
      title: alert.title,
      due: alert.startTime.toISOString().split('T')[0] // Use start time as due date
    }))

    return NextResponse.json(drills)
  } catch (error) {
    console.error('Error fetching drills data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
