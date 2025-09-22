import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Module } from '@/models/Module'

export async function POST(req: Request) {
  try {
    await connectToDatabase()
    const body = await req.json()
    const { title, description, content } = body
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 })

    const module = new Module({
      title,
      description,
      content,
      createdBy: 'teacher1', // replace with logged-in user
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const result = await module.save()

    return NextResponse.json({ success: true, id: result._id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}