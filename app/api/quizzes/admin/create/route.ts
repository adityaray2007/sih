import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Quiz } from '@/models/Quiz'
import { User } from '@/models/User'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    // Ensure database is connected
    await connectToDatabase()

    // 1️⃣ Get Authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const token = authHeader.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })

    // 2️⃣ Decode JWT token
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })
    }

    // 3️⃣ Get user from DB and check role
    const user = await User.findById(decoded.userId)
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden: Only teachers/admins can create quizzes' }, { status: 403 })
    }

    // 4️⃣ Parse quiz data from request body
    const { title, question, options, correctAnswer, image } = await req.json()

    if (!title || !question || !options || options.length !== 4 || correctAnswer === undefined) {
      return NextResponse.json({ error: 'Invalid quiz data' }, { status: 400 })
    }

    // 5️⃣ Create new quiz in MongoDB
    const quiz = await Quiz.create({
      title,
      question,
      options,
      correctAnswer,
      image,
      createdBy: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // 6️⃣ Return success
    return NextResponse.json({ success: true, id: quiz._id })
  } catch (err: any) {
    // Catch any other errors
    return NextResponse.json({ error: err.message || 'Something went wrong' }, { status: 500 })
  }
}