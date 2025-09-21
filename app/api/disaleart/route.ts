import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

const OPENWEATHER_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY || ''

declare global {
  var __externalAlertsCache: { ts: number; data: any[] } | undefined
}
if (!global.__externalAlertsCache) global.__externalAlertsCache = undefined

const CACHE_TTL_MS = 1000 * 60 * 5 // 5 minutes

async function fetchGDACS() {
  const parser = new Parser()
  const feed = await parser.parseURL('https://www.gdacs.org/xml/rss.xml')
  return (feed.items || []).map((it: any) => ({
    id: `gdacs:${it.link || it.guid || it.title}`,
    source: 'gdacs',
    type: 'disaster',
    title: it.title,
    description: it.contentSnippet || it.content || '',
    link: it.link,
    published: it.pubDate ? new Date(it.pubDate).toISOString() : null,
  }))
}

async function fetchUSGSEarthquakes(minMag = 4) {
  const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
  const res = await fetch(url)
  if (!res.ok) return []
  const json = await res.json()
  const features = json.features || []
  return features
    .filter((f: any) => (f.properties?.mag ?? 0) >= minMag)
    .map((f: any) => ({
      id: `usgs:${f.id}`,
      source: 'usgs',
      type: 'earthquake',
      title: `M${f.properties?.mag} - ${f.properties?.place}`,
      description: f.properties?.title || f.properties?.detail || '',
      link: f.properties?.url,
      magnitude: f.properties?.mag,
      coords: f.geometry?.coordinates,
      published: f.properties?.time ? new Date(f.properties.time).toISOString() : null,
    }))
}

async function fetchReliefWeb(limit = 10) {
  const url = `https://api.reliefweb.int/v1/disasters?sort[]=date:desc&limit=${limit}`
  const res = await fetch(url)
  if (!res.ok) return []
  const json = await res.json()
  const data = json.data || []
  return data.map((d: any) => ({
    id: `reliefweb:${d.id}`,
    source: 'reliefweb',
    type: 'report',
    title: d.fields?.name || d.fields?.title || 'ReliefWeb item',
    description: d.fields?.description || '',
    link: d.fields?.url || (`https://reliefweb.int/disaster/${d.id}`),
    published: d.fields?.date ? new Date(d.fields.date).toISOString() : null,
  }))
}

async function fetchOpenWeatherAlerts(lat: string, lon: string) {
  if (!OPENWEATHER_KEY) return []
  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${OPENWEATHER_KEY}`
  const res = await fetch(url)
  if (!res.ok) return []
  const json = await res.json()
  const alerts = json.alerts || []
  return alerts.map((a: any, idx: number) => ({
    id: `openweather:${lat}:${lon}:${idx}:${a.event}`,
    source: 'openweather',
    type: 'weather',
    title: a.event,
    description: a.description || a.tags?.join(', ') || '',
    start: a.start || null,
    end: a.end || null,
    sender: a.sender_name || null,
  }))
}

export async function GET(req: Request) {
  try {
    const now = Date.now()
    if (global.__externalAlertsCache && (now - global.__externalAlertsCache.ts < CACHE_TTL_MS)) {
      return NextResponse.json({ alerts: global.__externalAlertsCache.data, cached: true })
    }

    const url = new URL(req.url)
    const lat = url.searchParams.get('lat') || '28.7041'
    const lon = url.searchParams.get('lon') || '77.1025'
    const minMag = Number(url.searchParams.get('minMag') || '4')

    const [gdacs, usgs, reliefweb, openweather] = await Promise.all([
      fetchGDACS().catch(() => []),
      fetchUSGSEarthquakes(minMag).catch(() => []),
      fetchReliefWeb(10).catch(() => []),
      fetchOpenWeatherAlerts(lat, lon).catch(() => []),
    ])

    const combined = [
      ...gdacs,
      ...usgs,
      ...reliefweb,
      ...openweather,
    ].sort((a, b) => {
      const ta = a.published ? Date.parse(a.published) : 0
      const tb = b.published ? Date.parse(b.published) : 0
      return tb - ta
    })

    global.__externalAlertsCache = { ts: Date.now(), data: combined }

    return NextResponse.json({ alerts: combined, cached: false })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}