import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { q, source, target, format = 'text' } = await req.json()
    if (!q || !source || !target) {
      return NextResponse.json({ error: 'Missing q/source/target' }, { status: 400 })
    }

    const endpoints = [
      'https://translate.astian.org/translate',
      'https://libretranslate.de/translate',
      'https://translate.argosopentech.com/translate'
    ]

    let lastError: any = null
    for (const url of endpoints) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 12000)
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q, source, target, format }),
          signal: controller.signal,
        })
        const data = await res.json().catch(() => ({}))
        clearTimeout(timeout)
        if (res.ok && data?.translatedText) {
          return NextResponse.json(data)
        }
        lastError = data?.error || `Failed at ${url}`
      } catch (e: any) {
        clearTimeout(timeout)
        lastError = e?.message || `Network error at ${url}`
      }
    }
    // Final fallback: MyMemory free API (GET)
    try {
      const lp = `${source}|${target}`
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${encodeURIComponent(lp)}`
      const res = await fetch(url, { method: 'GET' })
      const data: any = await res.json().catch(() => ({}))
      const text = data?.responseData?.translatedText
      if (res.ok && text) {
        return NextResponse.json({ translatedText: text })
      }
    } catch (e: any) {
      // ignore and fall through to error
    }
    return NextResponse.json({ error: 'Upstream translation service unavailable', details: lastError }, { status: 502 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Bad request' }, { status: 400 })
  }
}


