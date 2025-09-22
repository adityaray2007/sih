import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Alert } from '@/models/Alert'
import { User } from '@/models/User'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    await connectToDatabase()
    const alerts = await Alert.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ alerts })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase()
    
    // Get JWT from header
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    
    // Check if user is teacher or admin
    const user = await User.findById(decoded.userId || decoded.id)
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Only teachers and admins can delete alerts' }, { status: 403 })
    }
    
    // Get alert ID from query parameters
    const url = new URL(req.url)
    const alertId = url.searchParams.get('alertId')
    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 })
    }
    
    // Delete the alert
    const result = await Alert.findByIdAndDelete(alertId)
    if (!result) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, message: 'Alert deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}