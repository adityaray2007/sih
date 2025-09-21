import { NextResponse } from 'next/server'
import { Module } from '@/models/Module'
import { User } from '@/models/User'
import jwt from 'jsonwebtoken'

// ---------------- GET MODULE BY ID ----------------
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const module = await Module.findById(params.id)
    if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    return NextResponse.json(module)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ---------------- PATCH: MARK MODULE AS COMPLETE + AWARD XP ----------------
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    let userId: string
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }
      userId = decoded.userId
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.completedModules) user.completedModules = []

    // ✅ Award XP only if module is not already completed
    if (!user.completedModules.includes(params.id)) {
      user.completedModules.push(params.id)
      user.xp += 100 // 🎉 Give 100 XP for completing a module
      await user.save()
    }

    return NextResponse.json({ 
      success: true, 
      completedModules: user.completedModules,
      xp: user.xp  // also return updated XP
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}