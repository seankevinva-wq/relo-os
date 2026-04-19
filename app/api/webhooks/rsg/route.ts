import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 30

const RSG_BASE = 'https://app-dev.relosolutionsgroup.com/client/api/v1'
const RSG_TOKEN = process.env.RSG_BEARER_TOKEN!
const GROQ_API_KEY = process.env.GROQ_API_KEY!

const RSG_HEADERS = {
  Authorization: `Bearer ${RSG_TOKEN}`,
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

async function rsgGet(path: string) {
  const r = await fetch(`${RSG_BASE}${path}`, { headers: RSG_HEADERS })
  if (!r.ok) throw new Error(`RSG ${r.status} ${path}`)
  return r.json()
}

async function rsgPatch(path: string, body: object) {
  const r = await fetch(`${RSG_BASE}${path}`, {
    method: 'PATCH', headers: RSG_HEADERS, body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`RSG PATCH ${r.status} ${path}`)
  return r.json()
}

async function rsgPost(path: string, body: object) {
  const r = await fetch(`${RSG_BASE}${path}`, {
    method: 'POST', headers: RSG_HEADERS, body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(`RSG POST ${r.status} ${path}`)
  return r.json()
}

async function groqChat(messages: object[]): Promise<string> {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.3,
      max_tokens: 200,
    }),
  })
  const d = await r.json()
  return d.choices[0].message.content.trim()
}

async function handleJobCreated(data: Record<string, any>) {
  const jobId = data.id
  if (!jobId) return { skipped: 'no id' }

  // Skip if no phone — nothing to text
  const phone = data.phone || ''
  if (!phone) {
    console.log(`[emma] job ${jobId} has no phone — skipping SMS, patching status only`)
    await rsgPatch(`/jobs/warm-handoff/${jobId}`, { emmaStatus: 'flagged' })
    return { status: 'flagged', reason: 'no_phone', jobId }
  }

  // Fetch full job from RSG
  const job = (await rsgGet(`/jobs/warm-handoff/${jobId}`)).data

  const firstName = (data.transfereeName || job.transfereeName || '').split(' ')[0] || 'there'
  const serviceType = data.serviceType || job.serviceType || 'service'
  const origin = data.originDetail?.city
    ? `${data.originDetail.city}, ${data.originDetail.state}`
    : data.origin || job.origin || ''

  const openingMsg = await groqChat([
    {
      role: 'system',
      content: `You are Emma, an AI coordinator for RSG (Relo Solutions Group).
You reach out to homeowners about their upcoming specialty relocation service.
Tone: warm, professional, brief. Always SMS-length (under 160 chars if possible).
Disclose you're AI if asked. No emojis.`,
    },
    {
      role: 'user',
      content: `Write Emma's first SMS to ${firstName} about their upcoming ${serviceType} service from ${origin}.
Ask for their vehicle make and model — that's the first piece of info needed. 2-3 sentences max.`,
    },
  ])

  const ts = new Date().toISOString()

  await rsgPost(`/jobs/warm-handoff/${jobId}/messages`, {
    from: 'emma', text: openingMsg, timestamp: ts,
  })

  await rsgPatch(`/jobs/warm-handoff/${jobId}`, { emmaStatus: 'awaiting_response' })

  console.log(`[emma] job ${jobId} opened — SMS staged for ${phone}: ${openingMsg.slice(0, 60)}`)

  return {
    status: 'opened',
    jobId,
    phone,
    emmaStatus: 'awaiting_response',
    messageStagedFor: phone,
    preview: openingMsg,
  }
}

export async function POST(req: NextRequest) {
  let payload: Record<string, any>

  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid JSON' }, { status: 400 })
  }

  const event = payload.event
  const data = payload.data ?? {}

  console.log(`[emma] webhook: event=${event} id=${data.id}`)

  if (!event) {
    return NextResponse.json({ error: 'missing event' }, { status: 400 })
  }

  try {
    if (event === 'job.created') {
      const result = await handleJobCreated(data)
      return NextResponse.json({ ok: true, event, result })
    }

    if (event === 'job.scheduled') {
      // Module 05 — log for now, full implementation coming
      console.log(`[emma] job.scheduled received for job ${data.id} — nudge scheduling pending Twilio`)
      return NextResponse.json({ ok: true, event, status: 'logged', note: 'nudge scheduling requires Twilio' })
    }

    return NextResponse.json({ ok: true, event, status: 'unhandled' })
  } catch (err: any) {
    console.error(`[emma] error handling ${event}:`, err.message)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
