import { NextRequest, NextResponse } from 'next/server'

const RSG_BASE = 'https://app-dev.relosolutionsgroup.com/client/api/v1'
const TOKEN = process.env.RSG_BEARER_TOKEN

export async function GET(req: NextRequest) {
  if (!TOKEN) {
    return NextResponse.json({ error: 'RSG_BEARER_TOKEN not configured' }, { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page') ?? '1'
  const perPage = searchParams.get('perPage') ?? '50'

  const res = await fetch(`${RSG_BASE}/jobs/warm-handoff?page=${page}&perPage=${perPage}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/json',
    },
    next: { revalidate: 30 },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'RSG API error', status: res.status }, { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
