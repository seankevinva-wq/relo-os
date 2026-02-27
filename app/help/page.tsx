'use client'

import Image from 'next/image'
import { BookOpen, Zap, Briefcase, Activity, Shield, LayoutDashboard, Info, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

const ACCENT = '#ADFF47'

function Screenshot({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mt-5 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={900}
        className="w-full h-auto"
        style={{ display: 'block' }}
      />
    </div>
  )
}

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span style={{ color: ACCENT }}>{icon}</span>
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function StatusPill({ color, label, pulse }: { color: string; label: string; pulse?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: `${color}22`, border: `1px solid ${color}55`, color }}
    >
      {pulse && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />}
      {label}
    </span>
  )
}

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Help &amp; Guide</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Everything you need to know about Relo OS · Emma AI-powered platform
        </p>
      </div>

      {/* Section 1 — What Is Relo OS */}
      <SectionCard icon={<Info size={18} />} title="What Is Relo OS">
        <div className="space-y-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <p>
            Relo OS is RSG&apos;s AI-powered operations platform, built around <span className="font-semibold text-white">Emma</span> — the AI auto-attendant that manages the full job lifecycle on your behalf.
          </p>
          <p>
            Emma handles homeowner SMS, vendor coordination, service window collection, invoice chasing, and after-hours calls — <span className="font-semibold" style={{ color: ACCENT }}>with zero human involvement until escalation is needed</span>.
          </p>
          <p>
            This app gives you real-time visibility into every job Emma is managing across all RSG markets.
          </p>
        </div>
      </SectionCard>

      {/* Section 2 — Job Lifecycle */}
      <SectionCard icon={<Clock size={18} />} title="Job Lifecycle — Status Flow">
        {/* Status flow */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <StatusPill color="#fbbf24" label="Pending Info" />
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
          <StatusPill color="#60a5fa" label="Needs Dispatch" />
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
          <StatusPill color="#a78bfa" label="Dispatched" />
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
          <StatusPill color="#ADFF47" label="Window Confirmed" />
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
          <StatusPill color="#ADFF47" label="Active Today" pulse />
          <span style={{ color: 'rgba(255,255,255,0.3)' }}>→</span>
          <StatusPill color="rgba(255,255,255,0.4)" label="Complete" />
        </div>
        <div className="flex items-center gap-2 mb-5">
          <StatusPill color="#f87171" label="At Risk" />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>can appear at any stage when critical info is missing near the job date</span>
        </div>

        {/* Status table */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { color: '#fbbf24', label: 'Pending Info', desc: "Emma is collecting homeowner details. Job can't be dispatched yet." },
            { color: '#60a5fa', label: 'Needs Dispatch', desc: 'All info collected. AI is ready to match and assign a vendor.' },
            { color: '#a78bfa', label: 'Dispatched', desc: 'Vendor assigned and notified. Awaiting window confirmation.' },
            { color: '#ADFF47', label: 'Window Confirmed', desc: 'Vendor and homeowner both confirmed the service window.' },
            { color: '#ADFF47', label: 'Active Today', desc: 'Service is happening today. Vendor on-site or en route.' },
            { color: 'rgba(255,255,255,0.4)', label: 'Complete', desc: 'Job finished. Invoice generated, review requested.' },
            { color: '#f87171', label: 'At Risk', desc: 'Missing critical info with the job date approaching. Needs attention.' },
          ].map((row, i) => (
            <div
              key={row.label}
              className="flex items-start gap-4 px-4 py-3 text-sm"
              style={{
                background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined,
              }}
            >
              <div className="w-36 shrink-0 pt-0.5">
                <StatusPill color={row.color} label={row.label} />
              </div>
              <div style={{ color: 'rgba(255,255,255,0.65)' }}>{row.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Section 3 — Command Center */}
      <SectionCard icon={<LayoutDashboard size={18} />} title="Command Center (Dashboard)">
        <div className="space-y-3">
          {[
            {
              label: '4 KPI Cards',
              desc: 'Active Jobs, Needs Attention, Hours Saved This Week, and Vendor Compliance — live metrics across all markets.',
            },
            {
              label: 'Open Estimates Banner',
              desc: '1,437 open estimates tracked. Emma auto-follows up and monitors conversion without any manual effort.',
            },
            {
              label: 'Needs Attention List',
              desc: 'Jobs with status At Risk, Pending Info, or Needs Dispatch. Click any row to open the full job detail.',
            },
            {
              label: "Emma's Last 24hrs",
              desc: 'Live feed of the 4 most recent AI events. Amber tint = after-hours event. Click "View all activity" to open the full Emma AI timeline.',
            },
            {
              label: "Today's Service Windows",
              desc: 'Jobs active or window-confirmed for today. A pulsing green dot indicates the job is currently in progress.',
            },
            {
              label: 'Job Volume Chart',
              desc: 'Monthly bar chart showing RSG job volume trend across all markets.',
            },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 text-sm">
              <div
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{ background: ACCENT }}
              />
              <div>
                <span className="font-medium text-white">{item.label}</span>
                {' — '}
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <Screenshot src="/screenshots/dashboard.png" alt="Command Center dashboard screenshot" />
      </SectionCard>

      {/* Section 4 — Job Queue */}
      <SectionCard icon={<Briefcase size={18} />} title="Job Queue">
        <div className="space-y-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <p>
            Lists all jobs across all markets with inline filter tabs: <span className="text-white font-medium">All · Active · At Risk · Pending · Complete</span>.
          </p>

          <div>
            <div className="text-white font-medium mb-2">Table Columns</div>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              {['Job ID (lime monospace)', 'Homeowner', 'Service Type', 'Location', 'Date', 'Status', 'Info Progress', 'Vendor'].map((col, i) => (
                <div
                  key={col}
                  className="px-4 py-2.5 text-xs"
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                  }}
                >
                  {col}
                </div>
              ))}
            </div>
          </div>

          <p>Click any row to open the <span className="text-white font-medium">Job Detail</span> page, which has 3 tabs:</p>

          <div className="space-y-2 pl-3">
            {[
              { tab: 'Overview', desc: 'Job metadata, vendor assignment, service window, and info checklist with per-field reminder counts.' },
              { tab: 'Conversation', desc: 'Full SMS/email log between Emma, the homeowner, and client notifications. Rows prefixed with 📤 indicate the moving company client was notified.' },
              { tab: 'Homeowner Portal', desc: 'The public-facing view homeowners see when they visit their portal link.' },
            ].map((item) => (
              <div key={item.tab} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: ACCENT }} />
                <div>
                  <span className="font-medium text-white">{item.tab} tab</span>
                  {' — '}
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <Screenshot src="/screenshots/jobs.png" alt="Job Queue screenshot" />
        </div>
      </SectionCard>

      {/* Section 5 — Auto-Dispatch */}
      <SectionCard icon={<Zap size={18} />} title="Auto-Dispatch (AI Matching)">
        <div className="space-y-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <p>
            Select one of the dispatch-ready jobs to see Emma&apos;s ranked vendor matches. Each vendor receives a <span className="text-white font-medium">match score (0–100)</span> computed from 5 rules:
          </p>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { num: '1', rule: 'Market Coverage', desc: 'Vendor must cover the job\'s state. No coverage = excluded.' },
              { num: '2', rule: 'Service Type Match', desc: 'Vendor must offer the required service type. No match = excluded.' },
              { num: '3', rule: 'Tier Priority', desc: 'Tier 1 vendors receive a +10 score boost.' },
              { num: '4', rule: 'QA Score Weighting', desc: 'QA score (1–5) × 12 added to total. Vendors below 3.5 QA are excluded.' },
              { num: '5', rule: 'Availability Check', desc: '"Unavailable" vendors are excluded; "Busy" vendors receive a −15 penalty.' },
            ].map((item, i) => (
              <div
                key={item.num}
                className="flex gap-4 px-4 py-3"
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                }}
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: `${ACCENT}22`, color: ACCENT }}
                >
                  {item.num}
                </span>
                <div>
                  <span className="font-medium text-white">{item.rule}</span>
                  {' — '}
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <p>
            Click <span className="font-medium text-white">Auto-Dispatch</span> to assign the top-scoring vendor and move the job status to <StatusPill color="#a78bfa" label="Dispatched" />.
          </p>
          <Screenshot src="/screenshots/dispatch.png" alt="Auto-Dispatch AI matching screenshot" />
        </div>
      </SectionCard>

      {/* Section 6 — Emma AI Activity */}
      <SectionCard icon={<Activity size={18} />} title="Emma AI Activity">
        <div className="space-y-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <p>
            Full timeline of every action Emma took, sorted newest-first. Use the filter tabs to narrow by event type.
          </p>

          <div>
            <div className="text-white font-medium mb-2">Filter Tabs</div>
            <div className="flex flex-wrap gap-2">
              {['All', 'After Hours', 'Confirmations', 'Info Chase', 'Service Windows', 'Vendor Nudges', 'Client Updates', 'Auto-Invoices'].map(tab => (
                <span
                  key={tab}
                  className="px-2.5 py-1 rounded-full text-xs"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white font-medium mb-2">Row Tinting</div>
            <div className="space-y-2">
              {[
                { color: '#fbbf24', label: 'Amber tint', desc: 'After-hours event (occurred between 8 PM and 7 AM)' },
                { color: '#60a5fa', label: 'Blue tint', desc: 'Client notification — Emma contacted the moving company client' },
                { color: '#ADFF47', label: 'Lime tint', desc: 'Auto-invoice generated and sent to vendor' },
              ].map(item => (
                <div key={item.color} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded shrink-0" style={{ background: `${item.color}33`, border: `1px solid ${item.color}55` }} />
                  <span className="font-medium text-white">{item.label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>— {item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white font-medium mb-2">Badges</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(96,165,250,0.2)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)' }}>CLIENT</span>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Emma contacted the moving company client (e.g. Syracuse Moving)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>AFTER HOURS</span>
                <span style={{ color: 'rgba(255,255,255,0.6)' }}>Event occurred between 8 PM and 7 AM</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: ACCENT }} />
              <span><span className="text-white font-medium">Expand chevron</span> — opens full SMS/email transcript; invoice events also display the generated invoice with line items</span>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: ACCENT }} />
              <span><span className="text-white font-medium">Sidebar stats</span> — running counts for confirmations, after-hours, info items, vendor nudges, client updates, auto-invoices, and escalations</span>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: ACCENT }} />
              <span><span className="text-white font-medium">Resolution Rate</span> — percentage of events Emma resolved without human escalation</span>
            </div>
          </div>
          <Screenshot src="/screenshots/ai-activity.png" alt="Emma AI Activity timeline screenshot" />
        </div>
      </SectionCard>

      {/* Section 7 — Vendor Compliance */}
      <SectionCard icon={<Shield size={18} />} title="Vendor Compliance">
        <div className="space-y-4 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          <p>
            Tracks invoice submission for every completed job across all vendors. Emma auto-sends a 4-step nudge sequence per vendor after job completion:
          </p>

          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { day: 'Day 0', label: 'Auto thank-you + invoice due reminder', desc: 'Sent immediately after job completion.' },
              { day: 'Day 1', label: 'Friendly reminder', desc: '"Takes 2 minutes in the portal!" — light nudge to encourage quick submission.' },
              { day: 'Day 2', label: 'Second notice', desc: 'Due-today warning with a direct link to the invoice portal.' },
              { day: 'Day 3', label: 'Penalty warning', desc: 'Final warning + automatic escalation to Nick for manual follow-up.' },
            ].map((item, i) => (
              <div
                key={item.day}
                className="flex gap-4 px-4 py-3"
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                }}
              >
                <span
                  className="text-xs font-bold shrink-0 w-12"
                  style={{ color: ACCENT }}
                >
                  {item.day}
                </span>
                <div>
                  <span className="font-medium text-white">{item.label}</span>
                  {' — '}
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>

          <p>
            Click any vendor row to open a slide-out drawer with the full nudge history and timestamps.
          </p>

          <div>
            <div className="text-white font-medium mb-2">Status Badges</div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'On Track', color: '#ADFF47' },
                { label: 'Awaiting', color: '#60a5fa' },
                { label: 'Overdue 24h', color: '#fbbf24' },
                { label: 'Overdue 48h', color: '#f87171' },
                { label: 'Warning Issued', color: '#f87171' },
              ].map(b => (
                <StatusPill key={b.label} color={b.color} label={b.label} />
              ))}
            </div>
          </div>
          <Screenshot src="/screenshots/vendor-compliance.png" alt="Vendor Compliance tracker screenshot" />
        </div>
      </SectionCard>

      {/* Section 8 — Quick Reference */}
      <SectionCard icon={<BookOpen size={18} />} title="Quick Reference: Colors & Icons">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Color legend */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Color Tokens</div>
            <div className="space-y-2.5">
              {[
                { hex: '#ADFF47', label: 'Lime', desc: 'Emma AI, success, confirmed states' },
                { hex: '#fbbf24', label: 'Amber', desc: 'After-hours, warnings, partial info' },
                { hex: '#f87171', label: 'Red', desc: 'At-risk jobs, escalations, overdue invoices' },
                { hex: '#60a5fa', label: 'Blue', desc: 'Info collection, client notifications' },
                { hex: '#a78bfa', label: 'Purple', desc: 'Dispatched state, vendor nudges' },
                { hex: 'rgba(255,255,255,0.4)', label: 'Gray', desc: 'Completed / muted states' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-3 text-sm">
                  <span
                    className="w-4 h-4 rounded shrink-0"
                    style={{ background: c.hex, boxShadow: `0 0 8px ${c.hex}55` }}
                  />
                  <span className="font-medium text-white w-16 shrink-0">{c.label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>{c.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Icon legend */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Channel Icons</div>
            <div className="space-y-2.5">
              {[
                { icon: '💬', label: 'SMS', desc: 'Text message conversation' },
                { icon: '📞', label: 'Phone', desc: 'Voicemail or call' },
                { icon: '📧', label: 'Email', desc: 'Email thread' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-3 text-sm">
                  <span className="text-lg w-6 text-center shrink-0">{c.icon}</span>
                  <span className="font-medium text-white w-12 shrink-0">{c.label}</span>
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>{c.desc}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-xl text-xs" style={{ background: 'rgba(173,255,71,0.05)', border: '1px solid rgba(173,255,71,0.15)', color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: ACCENT }} className="font-semibold">Tip:</span> Hover over any badge or icon in the app for additional context. Clicking a job row anywhere in the app opens the full Job Detail page.
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
