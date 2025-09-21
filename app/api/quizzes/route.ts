import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Quiz } from '@/models/Quiz'
import { User } from '@/models/User'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    await connectToDatabase()
    const quizzes = await Quiz.find({}).sort({ createdAt: -1 })
    return NextResponse.json({ quizzes })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    // Parse body
    const body = await req.json()
    const { quizId, selectedOption, questionIndex } = body
    if (!quizId || typeof questionIndex !== 'number' || typeof selectedOption === 'undefined') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get JWT from header
    const auth = req.headers.get('authorization') || req.headers.get('Authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 })
    }
    const token = auth.replace('Bearer ', '')
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || '')
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    const userId = decoded.id
    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    // Find quiz
    const quiz = await Quiz.findById(quizId)
    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }
    // Check answer
    const question = quiz.questions?.[questionIndex]
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }
    const isCorrect = question.correctOption === selectedOption
    let updatedXp = user.xp
    if (isCorrect) {
      user.xp += 10
      await user.save()
      updatedXp = user.xp
    }
    return NextResponse.json({ correct: isCorrect, xp: isCorrect ? updatedXp : undefined })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}