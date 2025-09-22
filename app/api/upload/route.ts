import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    const ext = path.extname(file.name) || '.bin'
    const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9-_]/g, '') || 'upload'
    const filename = `${base}-${Date.now()}${ext}`
    const filepath = path.join(uploadsDir, filename)

    await fs.writeFile(filepath, buffer)

    const urlPath = `/uploads/${filename}`
    return NextResponse.json({ success: true, url: urlPath })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}


