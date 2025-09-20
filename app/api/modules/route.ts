import { NextResponse } from 'next/server'
import { Module } from '@/models/Module'
import { User } from '@/models/User'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })
    }

    // Decode JWT
    let decoded: any
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!)
    } catch (err) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })
    }

    // Check user role from DB
    const user = await User.findById(decoded.userId)
    if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Forbidden: Only teachers/admins can create modules' }, { status: 403 })
    }

    // Parse request body
    const { title, description, content } = await req.json()
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })

    // Create new module
    const module = new Module({
      title,
      description,
      content,
      createdBy: user._id, // logged-in teacher/admin
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await module.save()

    return NextResponse.json({ success: true, id: result._id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    // Fetch all modules, sorted by creation date (descending: newest first)
    const modules = await Module.find().sort({ createdAt: -1 });
    return NextResponse.json({ modules });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}