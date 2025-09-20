import { NextResponse } from 'next/server'
import { Module } from '@/models/Module'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const module = await Module.findById(params.id)
    if (!module) return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    return NextResponse.json(module)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}