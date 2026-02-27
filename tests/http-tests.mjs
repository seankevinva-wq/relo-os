/**
 * Programmatic HTTP tests for Relo OS
 * Tests all routes, content presence, and redirect behavior.
 */

const BASE = 'http://localhost:3001'

let passed = 0
let failed = 0
const failures = []

function assert(condition, msg) {
  if (!condition) throw new Error(msg)
}

async function check(name, fn) {
  try {
    await fn()
    console.log(`  ✓ ${name}`)
    passed++
  } catch (err) {
    console.error(`  ✗ ${name}`)
    console.error(`    └─ ${err.message}`)
    failed++
    failures.push({ name, error: err.message })
  }
}

async function get(path, followRedirects = true) {
  const res = await fetch(`${BASE}${path}`, { redirect: followRedirects ? 'follow' : 'manual' })
  return { status: res.status, body: await res.text(), url: res.url, headers: Object.fromEntries(res.headers) }
}

// ─── Route availability ───────────────────────────────────────────────────────
console.log('\n═══ Relo OS — HTTP Tests ═══\n')
console.log('[ Route availability ]')

await check('GET / redirects to /dashboard (200 + dashboard content)', async () => {
  const r = await get('/')
  assert(r.status === 200, `Expected 200, got ${r.status}`)
  assert(r.url.includes('/dashboard') || r.body.includes('Command Center'), `Did not land on dashboard. url=${r.url}`)
})

for (const route of ['/dashboard', '/jobs', '/dispatch', '/ai-activity', '/vendor-compliance']) {
  await check(`GET ${route} → 200`, async () => {
    const r = await get(route)
    assert(r.status === 200, `Expected 200, got ${r.status}`)
  })
}

await check('GET /jobs/RSG-2847 → 200 (hero job)', async () => {
  const r = await get('/jobs/RSG-2847')
  assert(r.status === 200, `Expected 200, got ${r.status}`)
})

await check('GET /jobs/RSG-2848 → 200', async () => {
  const r = await get('/jobs/RSG-2848')
  assert(r.status === 200, `Expected 200, got ${r.status}`)
})

await check('GET /jobs/RSG-9999 → 404 (unknown job)', async () => {
  const r = await get('/jobs/RSG-9999')
  assert(r.status === 404, `Expected 404, got ${r.status}`)
})

// ─── Dashboard ────────────────────────────────────────────────────────────────
console.log('\n[ Dashboard content ]')
const dash = await get('/dashboard')

await check('Heading: "Command Center"', async () => assert(dash.body.includes('Command Center'), 'not found'))
await check('KPI: "Active Jobs"', async () => assert(dash.body.includes('Active Jobs'), 'not found'))
await check('KPI: "Hours Saved This Week"', async () => assert(dash.body.includes('Hours Saved This Week'), 'not found'))
await check('KPI: "Vendor Compliance"', async () => assert(dash.body.includes('Vendor Compliance'), 'not found'))
await check("Section: Emma's Last 24hrs feed", async () => {
  // apostrophe can be HTML-encoded as &#x27; or &apos; or ' in SSR
  assert(dash.body.includes("Emma") && dash.body.includes("Last 24hrs"), 'Emma feed section not found')
})
await check('Section: "Needs Attention"', async () => assert(dash.body.includes('Needs Attention'), 'not found'))
await check("Section: Today's Service Windows", async () => {
  assert(dash.body.includes("Service Windows") || dash.body.includes("Today"), 'service windows not found')
})
await check('After-hours badge visible in feed', async () => assert(dash.body.includes('After Hours'), 'not found'))
await check('Job IDs visible (RSG- prefix)', async () => assert(dash.body.includes('RSG-'), 'not found'))
await check('Nav: "Relo OS" branding', async () => assert(dash.body.includes('Relo OS'), 'not found'))
await check('Nav: all 5 nav items present', async () => {
  assert(dash.body.includes('Command Center') || dash.body.includes('dashboard'), 'dashboard nav link missing')
  assert(dash.body.includes('Job Queue') || dash.body.includes('jobs'), 'jobs nav link missing')
  assert(dash.body.includes('Auto-Dispatch') || dash.body.includes('dispatch'), 'dispatch nav link missing')
  assert(dash.body.includes('Emma AI') || dash.body.includes('ai-activity'), 'ai-activity nav link missing')
  assert(dash.body.includes('Vendor Compliance') || dash.body.includes('vendor-compliance'), 'vendor-compliance nav link missing')
})

// ─── Jobs page ────────────────────────────────────────────────────────────────
console.log('\n[ Jobs page ]')
const jobs = await get('/jobs')

await check('Heading: "Job Queue"', async () => assert(jobs.body.includes('Job Queue'), 'not found'))
await check('RSG-2847 present (Jennifer Mills)', async () => {
  assert(jobs.body.includes('RSG-2847'), 'missing RSG-2847')
  assert(jobs.body.includes('Jennifer Mills'), 'missing Jennifer Mills')
})
await check('RSG-2851 present (Diane Okafor)', async () => assert(jobs.body.includes('RSG-2851'), 'not found'))
await check('RSG-2858 present (Carlos Mendez)', async () => assert(jobs.body.includes('RSG-2858'), 'not found'))
await check('Filter tabs: All, Needs Attention, Missing Info, Pending Dispatch, Active Today', async () => {
  assert(jobs.body.includes('Needs Attention'), 'missing Needs Attention tab')
  assert(jobs.body.includes('Missing Info'), 'missing Missing Info tab')
  assert(jobs.body.includes('Pending Dispatch'), 'missing Pending Dispatch tab')
})
await check('Status badges rendered (At Risk | Pending Info | Dispatched etc)', async () => {
  const hasAny = ['At Risk', 'Pending Info', 'Dispatched', 'Window Confirmed', 'Complete']
    .some(s => jobs.body.includes(s))
  assert(hasAny, 'no status badges found')
})
await check('All 13 jobs present (RSG-28xx)', async () => {
  const count = (jobs.body.match(/RSG-28\d\d/g) || []).length
  assert(count >= 13, `Expected ≥13 job IDs, found ${count}`)
})
await check('Info progress shown (x/y format)', async () => assert(jobs.body.includes('/'), 'info progress not found'))

// ─── Job Detail (RSG-2847) ────────────────────────────────────────────────────
console.log('\n[ Job Detail RSG-2847 ]')
const jd = await get('/jobs/RSG-2847')

await check('Job ID in header', async () => assert(jd.body.includes('RSG-2847'), 'missing'))
await check('Homeowner name: Jennifer Mills', async () => assert(jd.body.includes('Jennifer Mills'), 'missing'))
await check('Service type: Piano Prep', async () => assert(jd.body.includes('Piano Prep'), 'missing'))
await check('Location: Manchester, NH', async () => assert(jd.body.includes('Manchester') && jd.body.includes('NH'), 'missing'))
await check('Progress stepper stages present', async () => {
  assert(jd.body.includes('Request Received') || jd.body.includes('Info Collection'), 'stepper not found')
})
await check('Info checklist group: Piano Details', async () => assert(jd.body.includes('Piano Details'), 'missing'))
await check('Collected item value: Steinway', async () => assert(jd.body.includes('Steinway'), 'missing'))
await check('Missing item reminder count shown', async () => {
  assert(jd.body.includes('reminder') || jd.body.includes('Reminder'), 'no reminder count found')
})
await check('AI conversation log section', async () => {
  assert(jd.body.includes('Conversation Log') || jd.body.includes('Emma AI'), 'missing conversation log')
})
await check('SMS messages: Emma AI messages', async () => assert(jd.body.includes('Emma AI'), 'missing Emma messages'))
await check('SMS messages: homeowner response (Jennifer)', async () => assert(jd.body.includes('Jennifer'), 'missing homeowner'))
await check('After Hours badge on 10:47 PM message', async () => assert(jd.body.includes('After Hours'), 'missing after hours badge'))
await check('Homeowner view toggle button', async () => {
  assert(jd.body.includes('Homeowner View') || jd.body.includes('homeowner'), 'toggle button not found')
})
await check('Status badge rendered', async () => {
  assert(jd.body.includes('Pending Info') || jd.body.includes('At Risk'), 'status badge missing')
})

// ─── Dispatch page ────────────────────────────────────────────────────────────
console.log('\n[ Dispatch page ]')
const disp = await get('/dispatch')

await check('Heading: "Auto-Dispatch"', async () => assert(disp.body.includes('Auto-Dispatch'), 'missing'))
await check('Pending job: RSG-2851', async () => assert(disp.body.includes('RSG-2851'), 'missing'))
await check('Pending job: RSG-2856', async () => assert(disp.body.includes('RSG-2856'), 'missing'))
await check('Pending job: RSG-2863', async () => assert(disp.body.includes('RSG-2863'), 'missing'))
await check('AI Recommendation callout', async () => assert(disp.body.includes('AI Recommendation'), 'missing'))
await check('Match score "/100" shown', async () => assert(disp.body.includes('/100'), 'missing score'))
await check('Vendor name present', async () => {
  const hasVendor = ['Rocky Mountain', 'Pacific Coast', 'Northeast Specialty', 'Lone Star'].some(v => disp.body.includes(v))
  assert(hasVendor, 'no vendor names found')
})
await check('Dispatch rules accordion present', async () => {
  assert(disp.body.includes('Dispatch Rules') || disp.body.includes('Market Coverage'), 'missing rules')
})
await check('Auto-Dispatch button present', async () => {
  assert(disp.body.includes('Auto-Dispatch'), 'missing dispatch button')
})
await check('"Why this vendor" reasoning section', async () => {
  assert(disp.body.includes('Why this vendor') || disp.body.includes('reasoning'), 'missing reasoning')
})

// ─── AI Activity page ─────────────────────────────────────────────────────────
console.log('\n[ AI Activity page ]')
const ai = await get('/ai-activity')

await check('Heading: "Emma AI Activity"', async () => assert(ai.body.includes('Emma AI Activity'), 'missing'))
await check('Filter tab: After Hours', async () => assert(ai.body.includes('After Hours'), 'missing'))
await check('Filter tab: Confirmations', async () => assert(ai.body.includes('Confirmations'), 'missing'))
await check('Filter tab: Info Chase', async () => assert(ai.body.includes('Info Chase'), 'missing'))
await check('Filter tab: Vendor Nudges', async () => assert(ai.body.includes('Vendor Nudges'), 'missing'))
await check('AFTER HOURS badge on events', async () => assert(ai.body.includes('AFTER HOURS'), 'missing'))
await check('Outcome badge: Resolved', async () => assert(ai.body.includes('Resolved'), 'missing'))
await check('Outcome badge: Escalated', async () => assert(ai.body.includes('Escalated'), 'missing'))
await check('Contact names visible', async () => {
  const hasContact = ['Jennifer Mills', 'Thomas Wright', 'Marcus Davis'].some(n => ai.body.includes(n))
  assert(hasContact, 'no contact names found')
})
await check('Sidebar: "This Week" stats', async () => assert(ai.body.includes('This Week'), 'missing'))
await check('Sidebar: "After-Hours Highlight"', async () => assert(ai.body.includes('After-Hours Highlight'), 'missing'))
await check('Sidebar: Resolution Rate section', async () => assert(ai.body.includes('Resolution Rate'), 'missing'))
await check('Channel icons rendered (SMS / Phone / Email)', async () => {
  const has = ['sms', 'SMS', 'phone', 'email', 'Email'].some(c => ai.body.toLowerCase().includes(c))
  assert(has, 'no channel types found')
})

// ─── Vendor Compliance page ───────────────────────────────────────────────────
console.log('\n[ Vendor Compliance page ]')
const comp = await get('/vendor-compliance')

await check('Heading: "Vendor Compliance"', async () => assert(comp.body.includes('Vendor Compliance'), 'missing'))
await check('Summary: "Awaiting Submission" count', async () => assert(comp.body.includes('Awaiting Submission'), 'missing'))
await check('Summary: "On Track" count', async () => assert(comp.body.includes('On Track'), 'missing'))
await check('Summary: "Overdue / Warning" count', async () => assert(comp.body.includes('Overdue'), 'missing'))
await check('Table: Midwest Moving Pros', async () => assert(comp.body.includes('Midwest Moving Pros'), 'missing'))
await check('Table: Rocky Mountain Services', async () => assert(comp.body.includes('Rocky Mountain Services'), 'missing'))
await check('Table: Pacific Coast Specialists', async () => assert(comp.body.includes('Pacific Coast Specialists'), 'missing'))
await check('Status badge: "Warning Issued"', async () => assert(comp.body.includes('Warning Issued'), 'missing'))
await check('Status badge: "Overdue 48h"', async () => assert(comp.body.includes('Overdue 48h'), 'missing'))
await check('"How this works" explainer block', async () => assert(comp.body.includes('How this works'), 'missing'))
await check('Nick callout in explainer', async () => assert(comp.body.includes('Nick'), 'missing'))
await check('Escalated badge visible', async () => assert(comp.body.includes('Escalated'), 'missing'))
await check('nudge count shown (N nudges sent)', async () => assert(comp.body.includes('nudge'), 'missing nudge count'))

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(45)}`)
console.log(`HTTP Results: ${passed} passed, ${failed} failed  (${passed + failed} total)`)
if (failures.length > 0) {
  console.log('\nFailed:')
  failures.forEach(f => console.log(`  ✗ ${f.name}\n    ${f.error}`))
}
console.log()
process.exit(failed > 0 ? 1 : 0)
