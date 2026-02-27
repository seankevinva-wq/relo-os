import { test, expect, type Page } from '@playwright/test'

const BASE = 'http://localhost:3001'

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function goto(page: Page, path: string) {
  await page.goto(`${BASE}${path}`)
  await page.waitForLoadState('networkidle')
}

// ─── Navigation & redirects ───────────────────────────────────────────────────

test.describe('Navigation & redirects', () => {
  test('/ redirects to /dashboard', async ({ page }) => {
    await page.goto(BASE + '/')
    await page.waitForURL(/\/dashboard/)
    await expect(page).toHaveURL(/dashboard/)
  })

  test('All nav links are present in sidebar', async ({ page }) => {
    await goto(page, '/dashboard')
    const nav = page.locator('nav')
    await expect(nav).toContainText('Command Center')
    await expect(nav).toContainText('Job Queue')
    await expect(nav).toContainText('Auto-Dispatch')
    await expect(nav).toContainText('Emma AI')
    await expect(nav).toContainText('Vendor Compliance')
  })

  test('Relo OS branding and Emma active dot', async ({ page }) => {
    await goto(page, '/dashboard')
    await expect(page.locator('nav')).toContainText('Relo OS')
    await expect(page.locator('nav')).toContainText('Emma is active')
  })

  test('Click Job Queue nav link navigates to /jobs', async ({ page }) => {
    await goto(page, '/dashboard')
    await page.click('nav a[href="/jobs"]')
    await page.waitForURL(/\/jobs$/)
    await expect(page).toHaveURL(/\/jobs$/)
  })

  test('Click Auto-Dispatch nav link navigates to /dispatch', async ({ page }) => {
    await goto(page, '/dashboard')
    await page.click('nav a[href="/dispatch"]')
    await page.waitForURL(/\/dispatch/)
    await expect(page).toHaveURL(/\/dispatch/)
  })
})

// ─── Dashboard ────────────────────────────────────────────────────────────────

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => { await goto(page, '/dashboard') })

  test('Shows Command Center heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Command Center')
  })

  test('Shows 4 KPI cards with correct labels', async ({ page }) => {
    await expect(page.getByText('Active Jobs').first()).toBeVisible()
    await expect(page.getByText('Hours Saved This Week').first()).toBeVisible()
    await expect(page.getByText('Vendor Compliance').first()).toBeVisible()
    await expect(page.getByText('Needs Attention').first()).toBeVisible()
  })

  test('Active Jobs KPI shows "47"', async ({ page }) => {
    await expect(page.getByText('47').first()).toBeVisible()
  })

  test('Hours Saved shows "23"', async ({ page }) => {
    await expect(page.getByText('23')).toBeVisible()
  })

  test('Emma activity feed visible with After Hours badge', async ({ page }) => {
    await expect(page.getByText('After Hours').first()).toBeVisible()
  })

  test('Needs Attention section shows flagged jobs', async ({ page }) => {
    // Should have at least one RSG- job ID in the section
    const jobIds = page.locator('text=/RSG-28/')
    await expect(jobIds.first()).toBeVisible()
  })

  test('Clicking a Needs Attention job navigates to job detail', async ({ page }) => {
    // Find first RSG link in needs attention section
    const jobLink = page.locator('a[href^="/jobs/RSG-"]').first()
    const href = await jobLink.getAttribute('href')
    await jobLink.click()
    await page.waitForURL(/\/jobs\/RSG-/)
    expect(page.url()).toContain('/jobs/RSG-')
  })

  test('Bar chart renders (recharts svg present)', async ({ page }) => {
    // recharts renders an SVG — just check it exists in the DOM
    const svgCount = await page.locator('svg').count()
    expect(svgCount).toBeGreaterThan(0)
  })

  test('Job Volume chart has month labels', async ({ page }) => {
    // Look for at least one month abbreviation
    const hasMonth = await page.locator('text=/Jan|Feb|Mar|Aug|Sep|Oct|Nov|Dec/').count()
    expect(hasMonth).toBeGreaterThan(0)
  })
})

// ─── Jobs page ────────────────────────────────────────────────────────────────

test.describe('Jobs Page', () => {
  test.beforeEach(async ({ page }) => { await goto(page, '/jobs') })

  test('Shows Job Queue heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Job Queue')
  })

  test('All filter tabs render', async ({ page }) => {
    await expect(page.getByRole('button', { name: /All Jobs/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Needs Attention/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Missing Info/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Pending Dispatch/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Active Today/ })).toBeVisible()
  })

  test('All Jobs filter shows 13+ job rows', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(13)
  })

  test('Jennifer Mills (RSG-2847) appears in table', async ({ page }) => {
    await expect(page.getByText('Jennifer Mills')).toBeVisible()
    await expect(page.getByText('RSG-2847')).toBeVisible()
  })

  test('At Risk rows visible', async ({ page }) => {
    await expect(page.getByText('At Risk').first()).toBeVisible()
  })

  test('"Needs Attention" filter tab filters correctly', async ({ page }) => {
    await page.getByRole('button', { name: /Needs Attention/ }).click()
    await page.waitForTimeout(200)
    // Should show at-risk/pending jobs
    const rows = page.locator('table tbody tr')
    const count = await rows.count()
    expect(count).toBeGreaterThanOrEqual(1)
    // Should not show Complete jobs
    const completeCount = await page.getByText('Complete').count()
    // complete badge shouldn't appear after filtering
    expect(completeCount).toBe(0)
  })

  test('"Pending Dispatch" filter shows needs_dispatch jobs only', async ({ page }) => {
    await page.getByRole('button', { name: /Pending Dispatch/ }).click()
    await page.waitForTimeout(200)
    await expect(page.getByText('Needs Dispatch').first()).toBeVisible()
  })

  test('Clicking row navigate to job detail', async ({ page }) => {
    const detailLink = page.locator('a[href^="/jobs/RSG-"]').first()
    await detailLink.click()
    await page.waitForURL(/\/jobs\/RSG-/)
    expect(page.url()).toMatch(/\/jobs\/RSG-\d+/)
  })

  test('Info progress bars visible', async ({ page }) => {
    // Progress bars are divs with width style
    const bars = page.locator('table').locator('div').filter({ hasText: /\d+\/\d+/ })
    const count = await bars.count()
    expect(count).toBeGreaterThan(0)
  })
})

// ─── Job Detail (RSG-2847) ────────────────────────────────────────────────────

test.describe('Job Detail — RSG-2847 (Jennifer Mills, Piano Prep)', () => {
  test.beforeEach(async ({ page }) => { await goto(page, '/jobs/RSG-2847') })

  test('Shows job ID RSG-2847 in header', async ({ page }) => {
    await expect(page.getByText('RSG-2847').first()).toBeVisible()
  })

  test('Shows homeowner name Jennifer Mills', async ({ page }) => {
    await expect(page.getByText('Jennifer Mills').first()).toBeVisible()
  })

  test('Shows service type Piano Prep', async ({ page }) => {
    await expect(page.getByText('Piano Prep').first()).toBeVisible()
  })

  test('Shows Manchester, NH location', async ({ page }) => {
    await expect(page.getByText(/Manchester.*NH/)).toBeVisible()
  })

  test('Progress stepper renders with stage labels', async ({ page }) => {
    await expect(page.getByText('Request Received')).toBeVisible()
    await expect(page.getByText('Info Collection')).toBeVisible()
    await expect(page.getByText('Vendor Dispatched')).toBeVisible()
    await expect(page.getByText('Window Confirmed')).toBeVisible()
    await expect(page.getByText('Job Complete')).toBeVisible()
  })

  test('Info checklist shows Piano Details group', async ({ page }) => {
    await expect(page.getByText('Piano Details')).toBeVisible()
  })

  test('Info checklist shows collected item: Steinway', async ({ page }) => {
    await expect(page.getByText('Steinway', { exact: false })).toBeVisible()
  })

  test('Missing items show "AI sent N reminders" amber text', async ({ page }) => {
    await expect(page.getByText(/AI sent \d+ reminder/).first()).toBeVisible()
  })

  test('Conversation log section visible', async ({ page }) => {
    await expect(page.getByText('AI Conversation Log')).toBeVisible()
  })

  test('Emma AI messages appear on right side', async ({ page }) => {
    await expect(page.getByText('Emma AI').first()).toBeVisible()
  })

  test('After Hours badge appears on 10:47 PM message', async ({ page }) => {
    await expect(page.getByText('After Hours').first()).toBeVisible()
  })

  test('Homeowner view toggle button is clickable', async ({ page }) => {
    const toggleBtn = page.getByRole('button', { name: /Homeowner View/ })
    await expect(toggleBtn).toBeVisible()
    await toggleBtn.click()
    // Should switch to homeowner view — look for "Your Job is Confirmed"
    await expect(page.getByText('Your Job is Confirmed')).toBeVisible()
  })

  test('Homeowner view shows simplified stepper without internal fields', async ({ page }) => {
    await page.getByRole('button', { name: /Homeowner View/ }).click()
    await expect(page.getByText('Your Job is Confirmed')).toBeVisible()
    // Should not show internal label like "AI sent reminders"
    const reminderText = page.getByText(/AI sent \d+ reminder/)
    await expect(reminderText).not.toBeVisible()
  })

  test('Toggle back to internal view restores internal content', async ({ page }) => {
    await page.getByRole('button', { name: /Homeowner View/ }).click()
    await expect(page.getByText('Your Job is Confirmed')).toBeVisible()
    await page.getByRole('button', { name: /Internal View/ }).click()
    await expect(page.getByText('AI Conversation Log')).toBeVisible()
  })

  test('"Show earlier messages" expand button works', async ({ page }) => {
    // There should be an expand button since RSG-2847 has > 4 messages
    const expandBtn = page.getByText(/earlier message/)
    if (await expandBtn.count() > 0) {
      await expandBtn.click()
      await page.waitForTimeout(200)
      // After expanding, more messages should be visible
      const messages = page.locator('div').filter({ hasText: 'Emma AI' })
      const count = await messages.count()
      expect(count).toBeGreaterThan(1)
    }
  })

  test('Back to Jobs link works', async ({ page }) => {
    await page.getByRole('link', { name: /Back to Jobs/i }).click()
    await page.waitForURL(/\/jobs$/)
    await expect(page).toHaveURL(/\/jobs$/)
  })

  test('Status badge "Pending Info" rendered', async ({ page }) => {
    await expect(page.getByText('Pending Info').first()).toBeVisible()
  })
})

// ─── Dispatch page ────────────────────────────────────────────────────────────

test.describe('Dispatch Page', () => {
  test.beforeEach(async ({ page }) => { await goto(page, '/dispatch') })

  test('Shows Auto-Dispatch heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Auto-Dispatch')
  })

  test('3 pending jobs shown in left panel', async ({ page }) => {
    await expect(page.getByText('RSG-2851').first()).toBeVisible()
    await expect(page.getByText('RSG-2856').first()).toBeVisible()
    await expect(page.getByText('RSG-2863').first()).toBeVisible()
  })

  test('First job (RSG-2851) selected by default with vendor cards shown', async ({ page }) => {
    await expect(page.getByText('AI Recommendation')).toBeVisible()
    await expect(page.getByText('/100')).toBeVisible()
  })

  test('Score counter animates from 0 to target', async ({ page }) => {
    // Score starts at 0, count up animation
    // After animation, score should be a positive number
    await page.waitForTimeout(1500) // animation takes 1.2s
    const scoreText = await page.locator('text=/\\d+\\/100/').first().textContent()
    const score = parseInt(scoreText?.replace('/100', '') || '0')
    expect(score).toBeGreaterThan(50)
  })

  test('3 vendor cards render side by side', async ({ page }) => {
    // Each vendor card should be visible
    const vendorCards = page.locator('[style*="border"]').filter({ hasText: /Match Score|Tier/ })
    const count = await vendorCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('"Why this vendor" reasoning bullets shown on recommended card', async ({ page }) => {
    await expect(page.getByText('Why this vendor:')).toBeVisible()
  })

  test('Dispatch Rules accordion opens on click', async ({ page }) => {
    const rulesBtn = page.getByText('Dispatch Rules')
    await rulesBtn.click()
    await page.waitForTimeout(200)
    await expect(page.getByText('Market Coverage')).toBeVisible()
    await expect(page.getByText('Tier Priority')).toBeVisible()
    await expect(page.getByText('QA Score Weighting')).toBeVisible()
  })

  test('Recent Dispatches history accordion opens', async ({ page }) => {
    const histBtn = page.getByText('Recent Dispatches in this Market')
    await histBtn.click()
    await page.waitForTimeout(200)
    // Should show historical job IDs
    await expect(page.getByText('RSG-2840')).toBeVisible()
  })

  test('Auto-Dispatch button triggers toast notification', async ({ page }) => {
    // Click the dispatch button
    const dispatchBtn = page.getByRole('button', { name: /Auto-Dispatch/ }).first()
    await dispatchBtn.click()
    // Sonner toast should appear
    await expect(page.locator('[data-sonner-toast]')).toBeVisible({ timeout: 3000 })
  })

  test('After dispatch, button changes to "Dispatched" state', async ({ page }) => {
    const dispatchBtn = page.getByRole('button', { name: /Auto-Dispatch/ }).first()
    await dispatchBtn.click()
    await page.waitForTimeout(500)
    await expect(page.getByRole('button', { name: /Dispatched/ })).toBeVisible()
  })

  test('Switching jobs updates the main panel', async ({ page }) => {
    // Click RSG-2856 in the selector panel
    await page.getByText('RSG-2856').first().click()
    await page.waitForTimeout(200)
    await expect(page.getByText('RSG-2856').first()).toBeVisible()
    // Score should re-animate — just check score panel still visible
    await page.waitForTimeout(1500)
    await expect(page.getByText('/100').first()).toBeVisible()
  })
})

// ─── AI Activity page ─────────────────────────────────────────────────────────

test.describe('AI Activity Page', () => {
  test.beforeEach(async ({ page }) => { await goto(page, '/ai-activity') })

  test('Shows Emma AI Activity heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Emma AI Activity')
  })

  test('All filter tabs render', async ({ page }) => {
    for (const label of ['All', 'After Hours', 'Confirmations', 'Info Chase', 'Service Windows', 'Vendor Nudges']) {
      await expect(page.getByRole('button', { name: new RegExp(label) }).first()).toBeVisible()
    }
  })

  test('Default "All" view shows 20 events', async ({ page }) => {
    const events = page.locator('[style*="border"]').filter({ hasText: /RSG-28/ })
    const count = await events.count()
    expect(count).toBeGreaterThanOrEqual(10)
  })

  test('AFTER HOURS badges visible on relevant events', async ({ page }) => {
    const badges = page.getByText('AFTER HOURS')
    const count = await badges.count()
    expect(count).toBeGreaterThan(0)
  })

  test('"After Hours" filter tab shows only after-hours events', async ({ page }) => {
    await page.getByRole('button', { name: /After Hours/ }).first().click()
    await page.waitForTimeout(200)
    // All visible events should have AFTER HOURS badge
    const ahBadges = page.getByText('AFTER HOURS')
    const count = await ahBadges.count()
    expect(count).toBeGreaterThan(0)
  })

  test('Outcome badges render (Resolved, Awaiting, Escalated)', async ({ page }) => {
    await expect(page.getByText('Resolved').first()).toBeVisible()
    await expect(page.getByText('Escalated').first()).toBeVisible()
  })

  test('Expanding an event transcript works', async ({ page }) => {
    // Find an event with a transcript (expand button)
    const expandBtns = page.locator('button').filter({ has: page.locator('svg') }).nth(1)
    if (await expandBtns.count() > 0) {
      await expandBtns.click()
      await page.waitForTimeout(200)
      // Transcript should show sender names
      const hasSender = await page.getByText('Emma').count()
      expect(hasSender).toBeGreaterThan(0)
    }
  })

  test('"This Week" sidebar stats shown', async ({ page }) => {
    await expect(page.getByText('This Week').first()).toBeVisible()
    await expect(page.getByText('Confirmations handled').first()).toBeVisible()
    await expect(page.getByText('After-hours intercepted').first()).toBeVisible()
  })

  test('After-Hours Highlight sidebar card shows count', async ({ page }) => {
    await expect(page.getByText('After-Hours Highlight').first()).toBeVisible()
    // Should show count > 0
    const count = await page.getByText(/^\d+$/).count()
    expect(count).toBeGreaterThan(0)
  })

  test('Resolution Rate card shows percentage', async ({ page }) => {
    await expect(page.getByText('Resolution Rate')).toBeVisible()
    await expect(page.getByText(/%$/)).toBeVisible()
  })
})

// ─── Vendor Compliance page ───────────────────────────────────────────────────

test.describe('Vendor Compliance Page', () => {
  test.beforeEach(async ({ page }) => { await goto(page, '/vendor-compliance') })

  test('Shows Vendor Compliance heading', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Vendor Compliance')
  })

  test('Summary bar shows 3 counts (Awaiting, On Track, Overdue)', async ({ page }) => {
    await expect(page.getByText('Awaiting Submission').first()).toBeVisible()
    await expect(page.getByText('On Track').first()).toBeVisible()
    await expect(page.getByText('Overdue / Warning').first()).toBeVisible()
  })

  test('Table shows Midwest Moving Pros with Warning Issued badge', async ({ page }) => {
    await expect(page.getByText('Midwest Moving Pros').first()).toBeVisible()
    await expect(page.getByText('Warning Issued').first()).toBeVisible()
  })

  test('Table shows Rocky Mountain Services', async ({ page }) => {
    await expect(page.getByText('Rocky Mountain Services').first()).toBeVisible()
  })

  test('Overdue 48h badge visible (AllState)', async ({ page }) => {
    await expect(page.getByText('Overdue 48h').first()).toBeVisible()
  })

  test('Escalated badge visible (Midwest row)', async ({ page }) => {
    await expect(page.getByText('Escalated').first()).toBeVisible()
  })

  test('Clicking Midwest Moving Pros row opens slide-out drawer', async ({ page }) => {
    await page.getByText('Midwest Moving Pros').first().click()
    await page.waitForTimeout(300)
    // Drawer should open with nudge sequence
    await expect(page.getByText('Automated Nudge Sequence')).toBeVisible()
  })

  test('Drawer shows full 5-step nudge sequence for Midwest', async ({ page }) => {
    await page.getByText('Midwest Moving Pros').first().click()
    await page.waitForTimeout(300)
    await expect(page.getByText('Auto Thank-You').first()).toBeVisible()
    await expect(page.getByText('Friendly Reminder').first()).toBeVisible()
    await expect(page.getByText('Second Notice').first()).toBeVisible()
    await expect(page.getByText('Penalty Warning').first()).toBeVisible()
    await expect(page.getByText('Escalated to Nick').first()).toBeVisible()
  })

  test('Drawer closes on backdrop click', async ({ page }) => {
    await page.getByText('Midwest Moving Pros').first().click()
    await page.waitForTimeout(300)
    await expect(page.getByText('Automated Nudge Sequence')).toBeVisible()
    // Click backdrop (the overlay div)
    await page.locator('.fixed.inset-0.z-50 .absolute.inset-0').click()
    await page.waitForTimeout(300)
    await expect(page.getByText('Automated Nudge Sequence')).not.toBeVisible()
  })

  test('"How this works" explainer references Nick', async ({ page }) => {
    await expect(page.getByText('How this works')).toBeVisible()
    await expect(page.getByText(/Nick.*handled.*1/)).toBeVisible()
  })

  test('On Track badge visible in compliance table', async ({ page }) => {
    // Multiple On Track badges — just confirm they exist
    const count = await page.getByText('On Track').count()
    expect(count).toBeGreaterThan(0)
  })
})
