import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Quiz } from '@/models/Quiz'
import { User } from '@/models/User'
import jwt from 'jsonwebtoken'

export async function GET() {
  try {
    await connectToDatabase()
    const quizzes = await Quiz.find({}).sort({ _id: -1 }).limit(50)
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
    const { quizId, selectedOption } = body
    if (!quizId || typeof selectedOption === 'undefined') {
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
    const userId = decoded.userId || decoded.id
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
    // Check answer - using the correct field from the Quiz model
    const isCorrect = quiz.correctAnswer === selectedOption
    let updatedXp = user.xp
    let xpAwarded = false
    
    if (isCorrect) {
      // Check if user has already completed this quiz
      if (!user.completedQuizzes) {
        user.completedQuizzes = []
      }
      
      if (!user.completedQuizzes.includes(quiz._id)) {
        user.xp += 10
        user.completedQuizzes.push(quiz._id)
        await user.save()
        updatedXp = user.xp
        xpAwarded = true
      } else {
        // User already completed this quiz, no XP awarded
        updatedXp = user.xp
      }
    }
    
    return NextResponse.json({ 
      correct: isCorrect, 
      xp: isCorrect ? updatedXp : undefined,
      xpAwarded: xpAwarded,
      alreadyCompleted: isCorrect && !xpAwarded
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}