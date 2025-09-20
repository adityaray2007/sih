import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Alert } from '@/models/Alert'

export async function GET() {
  try {
    await connectToDatabase()
    const alerts = await Alert.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ alerts })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}