import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Alert } from '@/models/Alert'

export async function POST(req: Request) {
  try {
    await connectToDatabase()

    // Call existing /disaleart API to get latest alerts
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/disaleart`)
    const data = await res.json()
    const alerts = data.alerts || []

    const inserted: any[] = []

    for (const a of alerts) {
      // avoid duplicates
      const exists = await Alert.findOne({ externalId: a.id })
      if (exists) continue

      const doc = await Alert.create({
        title: a.title,
        description: a.description,
        startTime: a.start || a.published || null,
        endTime: a.end || null,
        createdBy: 'external:' + a.source,
        createdAt: new Date(),
        externalId: a.id,
        source: a.source,
        link: a.link || null
      })

      inserted.push(doc)
    }

    return NextResponse.json({ insertedCount: inserted.length, inserted })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}