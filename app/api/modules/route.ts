import { NextResponse } from 'next/server'
import { Module } from '@/models/Module'
import { User } from '@/models/User'
import jwt from 'jsonwebtoken'

// ---------------- CREATE MODULE (teacher/admin only) ----------------
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
      createdBy: user._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await module.save()

    return NextResponse.json({ success: true, id: result._id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ---------------- GET ALL MODULES ----------------
export async function GET(req: Request) {
  try {
    const modules = await Module.find().sort({ createdAt: -1 })
    return NextResponse.json({ modules })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ---------------- PATCH: MARK MODULE AS COMPLETE ----------------
export async function PATCH(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized: No token' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!)
    const { moduleId } = await req.json()
    if (!moduleId) return NextResponse.json({ error: 'Module ID required' }, { status: 400 })

    const user = await User.findById(decoded.userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    if (!user.completedModules) user.completedModules = []

    if (!user.completedModules.includes(moduleId)) {
      user.completedModules.push(moduleId)
      await user.save()
    }

    return NextResponse.json({ success: true, completedModules: user.completedModules })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}