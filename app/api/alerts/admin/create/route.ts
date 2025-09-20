import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Alert } from '@/models/Alert'
import { User } from '@/models/User'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const token = authHeader.split(' ')[1]
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    const user = await User.findById(decoded.userId)
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, description, startTime, endTime } = await req.json()
    const alert = await Alert.create({
      title,
      description,
      startTime,
      endTime,
      createdBy: user._id,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, id: alert._id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}