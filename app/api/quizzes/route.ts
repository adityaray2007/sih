import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Quiz } from '@/models/Quiz'

export async function GET() {
  try {
    await connectToDatabase()
    const quizzes = await Quiz.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ quizzes })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}