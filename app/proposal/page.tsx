'use client'

import Link from 'next/link'
import {
  FileText, AlertTriangle, Zap, Activity, TrendingUp, Bot,
  CheckCircle, ArrowRight, Mail, Phone, Star, DollarSign,
  Briefcase, Shield, Users, LayoutDashboard, MessageSquare, Flame, Clock,
} from 'lucide-react'

const ACCENT = '#ADFF47'
const AMBER = '#fbbf24'
const RED = '#f87171'
const BLUE = '#60a5fa'

function SectionCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <span style={{ color: ACCENT }}>{icon}</span>
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function PhasePill({ phase }: { phase: 1 | 2 }) {
  const color = phase === 1 ? ACCENT : BLUE
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
      style={{ background: `${color}22`, border: `1px solid ${color}55`, color }}
    >
      Phase {phase}
    </span>
  )
}

function BulletRow({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-sm">
      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: ACCENT }} />
      <div style={{ color: 'rgba(255,255,255,0.7)' }}>
        {label && <span className="font-medium text-white">{label} — </span>}
        {children}
      </div>
    </div>
  )
}

export default function ProposalPage() {
  return (
    <div className="space-y-8 max-w-4xl">

      {/* ── 1. Hero Header ── */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Lime accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ background: ACCENT }}
        />
        <div className="pl-2">
          <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: ACCENT }}>
            Confidential · February 2026
          </div>
          <h1 className="text-3xl font-black text-white leading-tight mb-2">
            AI Blueprint for<br />Relo Solutions Group
          </h1>
          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Prepared by Jam AI · February 2026
          </p>
          <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.75)' }}>
            What we heard. What we built. What we&apos;re proposing.
          </p>
          <p className="text-sm font-medium mt-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
            RSG at 25,000 jobs/year. Same team. Same quality. That&apos;s the goal.
          </p>
        </div>
      </div>

      {/* ── 2. Executive Summary ── */}
      <SectionCard icon={<FileText size={18} />} title="Executive Summary">
        <div className="space-y-4 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
          <p>
            RSG is already doing something most relocation companies can&apos;t touch —{' '}
            <span className="font-semibold text-white">10,000 specialty jobs a year, real relationships with vendors, a reputation for quality.</span>{' '}
            This proposal is about turning that operational foundation into a system that scales without scaling headcount.
          </p>
          <p>
            None of the friction in your current operation is a failure of effort.{' '}
            <span className="font-semibold text-white">Your team manually handles ~700 calls a month, chases every vendor, assembles Monday reports by hand</span>{' '}
            — because no one built the right tools for a specialty operator at your scale. Enterprise relocation software was made for $500M companies. You&apos;ve been performing at a high level with the wrong instruments.
          </p>
          <p>
            This isn&apos;t a rip-and-replace.{' '}
            <span className="font-semibold text-white">We&apos;re proposing to start with the three highest-priority automations from your call — 3 targeted automations, proven to deliver the fastest ROI.</span>{' '}
            Everything Emma does is logged, reviewable, and interruptible. Nick stays in the loop on anything that matters — Emma handles everything routine so he doesn&apos;t have to.
          </p>
          <p>
            You already know automation is the answer. You&apos;ve seen what the larger players do with it.{' '}
            <span className="font-semibold text-white">This MVP is proof that it&apos;s now within reach for RSG</span>{' '}
            — not in a year, not with a 6-month procurement process — now.
          </p>
          <p style={{ color: ACCENT }} className="font-medium">
            Phase 1 below targets the three workflows you described on the call with the clearest, fastest payback. Additional modules are available as we grow together.
          </p>
        </div>
      </SectionCard>

      {/* ── 3. Pain Points ── */}
      <SectionCard icon={<AlertTriangle size={18} />} title="Where You Are Today">
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
          These are the problems you described — in your words — during our discovery call on February 27.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Manual Warm Handoffs',
              quote: '"4 people in customer service manually calling each transferee"',
              number: '~700 calls/month in February alone',
              color: AMBER,
            },
            {
              title: 'Morning Service Window Calls',
              quote: '"Every morning I\'m calling for service windows" — Nick',
              number: 'Daily routine, for every active job',
              color: AMBER,
            },
            {
              title: 'Paperwork Chasing',
              quote: '"They drag their feet sending invoices" — Nick',
              number: 'Delays billing; hours of staff time per week',
              color: RED,
            },
            {
              title: 'Open Estimates Pile-Up',
              quote: 'Monday PDF report, assembled manually each week',
              number: '1,437 open estimates sitting idle',
              color: RED,
            },
            {
              title: 'After-Hours Gap',
              quote: '"We keep getting called at 9–10pm on a Saturday" — Nick',
              number: '0 coverage after hours today',
              color: RED,
            },
            {
              title: 'Low Review Response Rate',
              quote: 'QA requests sent by email only',
              number: '~5% response rate; Google reviews lost',
              color: AMBER,
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl p-4"
              style={{
                background: `${card.color}0d`,
                border: `1px solid ${card.color}33`,
              }}
            >
              <div className="text-sm font-semibold text-white mb-1.5">{card.title}</div>
              <p className="text-xs mb-2 italic" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {card.quote}
              </p>
              <div
                className="text-xs font-bold"
                style={{ color: card.color }}
              >
                {card.number}
              </div>
            </div>
          ))}
        </div>

        {/* Justify-failures callout */}
        <div
          className="mt-5 rounded-xl p-4 flex gap-4"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div
            className="w-0.5 shrink-0 rounded-full self-stretch"
            style={{ background: 'rgba(255,255,255,0.25)' }}
          />
          <div>
            <p className="text-sm font-semibold text-white mb-1">This isn&apos;t a people problem.</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Your team is performing at an extraordinary level with manual tools. These gaps exist because no software was built for specialty operators at your scale — until now.
            </p>
          </div>
        </div>

        {/* COI Block */}
        <div className="glass rounded-xl overflow-hidden mt-5">
          <div
            className="px-4 py-3"
            style={{ background: `${AMBER}12`, borderBottom: `1px solid ${AMBER}30` }}
          >
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: AMBER }}
            >
              What this costs today
            </span>
          </div>
          {[
            {
              label: 'CS team — 700 warm handoff calls',
              monthly: '$2,400/mo',
              source: '~116 hrs × $25/hr labor',
            },
            {
              label: "Nick's morning service windows",
              monthly: '$1,650/mo',
              source: '45 min/day × 22 days × owner time',
            },
            {
              label: 'Billing team paperwork chasing',
              monthly: '$500/mo',
              source: '~5 hrs/week manual follow-up',
            },
            {
              label: '1,437 open estimates sitting idle',
              monthly: '$10,800/mo',
              source: '~0.5% better close × $1,500 avg job',
            },
          ].map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 items-baseline"
              style={{
                background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                borderTop: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{row.label}</div>
                <div className="text-xs italic mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{row.source}</div>
              </div>
              <div className="text-sm font-bold shrink-0" style={{ color: AMBER }}>{row.monthly}</div>
            </div>
          ))}
          {/* Total row */}
          <div
            className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 items-center"
            style={{
              background: `${ACCENT}0d`,
              borderTop: `1px solid ${ACCENT}30`,
            }}
          >
            <div>
              <div className="text-sm font-bold text-white">Total recoverable value</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>$184,000+ per year if recovered</div>
            </div>
            <div className="text-xl font-black shrink-0" style={{ color: ACCENT }}>$15,350/mo</div>
          </div>
        </div>
      </SectionCard>

      {/* ── 4. The Opportunity ── */}
      <SectionCard icon={<TrendingUp size={18} />} title="The Opportunity">
        <div className="flex flex-col sm:flex-row gap-6 mb-5">
          <div
            className="flex-1 rounded-xl p-5 text-center"
            style={{ background: `${ACCENT}0d`, border: `1px solid ${ACCENT}33` }}
          >
            <div className="text-4xl font-black" style={{ color: ACCENT }}>~10,000</div>
            <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              service requests / year and growing
            </div>
          </div>
          <div
            className="flex-1 rounded-xl p-5 text-center"
            style={{ background: `${BLUE}0d`, border: `1px solid ${BLUE}33` }}
          >
            <div className="text-4xl font-black" style={{ color: BLUE }}>$100M+</div>
            <div className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
              competitor in your space (noted on call)
            </div>
          </div>
        </div>
        <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
          The gap between you and that competitor isn&apos;t the services —{' '}
          <span className="font-semibold text-white">it&apos;s automation at scale.</span>
        </p>
      </SectionCard>

      {/* ── 4b. Why Now ── */}
      <SectionCard icon={<Flame size={18} />} title="Why This. Why Now.">
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            {
              symbol: '★',
              label: 'The dream',
              copy: 'RSG at 25,000 jobs/year. Same 8-person team. Emma handles the volume you can\'t.',
            },
            {
              symbol: '✦',
              label: 'The real problem',
              copy: 'You haven\'t been falling short — the tooling has. No one built this for operators your size until now.',
            },
            {
              symbol: '⬡',
              label: 'What keeps it safe',
              copy: 'Phased. Logged. Interruptible. Every message Emma sends is templated and reviewed. Nick can override anything.',
            },
            {
              symbol: '✓',
              label: 'What you already know',
              copy: 'The competitor winning on volume isn\'t out-servicing you. They\'re out-systematizing you. You\'ve known this.',
            },
            {
              symbol: '→',
              label: 'What Emma gives you',
              copy: 'The nudge sequence that makes vendors submit. The 9pm phone call Nick doesn\'t take. The follow-up working all 1,437 estimates at once.',
            },
          ].map((row, i) => (
            <div
              key={row.label}
              className="flex gap-4 px-5 py-4"
              style={{
                background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined,
              }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                style={{ background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}35` }}
              >
                {row.symbol}
              </div>
              <div>
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-1"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                >
                  {row.label}
                </div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {row.copy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── 5. Meet Emma ── */}
      <SectionCard icon={<Bot size={18} />} title="Meet Emma">
        <div className="space-y-4">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Emma is the AI agent persona at the center of Relo OS. She handles all routine communication — SMS, email, and phone — so your team only touches edge cases.
          </p>
          <div className="space-y-2.5">
            <BulletRow label="Works 24/7">including after hours and weekends — no missed calls on Saturday nights</BulletRow>
            <BulletRow label="Full transparency">every action Emma takes is logged with timestamps and transcripts —{' '}
              <Link href="/ai-activity" className="underline" style={{ color: ACCENT }}>see the Emma AI timeline</Link>
            </BulletRow>
            <BulletRow label="Human-in-the-loop">escalates to Nick only when human judgment is genuinely needed</BulletRow>
            <BulletRow label="Adaptive messaging">tone and channel (SMS vs email vs phone) selected based on context</BulletRow>
          </div>

          {/* Stat callout */}
          <div
            className="mt-5 rounded-xl p-4 flex items-center gap-4"
            style={{ background: `${ACCENT}0a`, border: `1px solid ${ACCENT}25` }}
          >
            <div className="text-3xl font-black" style={{ color: ACCENT }}>87%</div>
            <div>
              <div className="text-sm font-semibold text-white">Conversations resolved without human involvement</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Based on this MVP&apos;s simulated activity dataset
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 6. Phase 1 Modules ── */}
      <SectionCard icon={<Zap size={18} />} title="Phase 1: The Three Highest-Impact Automations">
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
          These three modules address the workflows you described on the call and deliver the fastest, clearest ROI. No mobile app required.
        </p>
        <div className="space-y-4">
          {[
            {
              num: '01',
              name: 'Emma Warm Handoff',
              problem: 'A 4-person customer service team manually calls every new transferee to confirm details, collect images, vehicle make/model, and gate codes.',
              solution: 'Emma reaches out automatically on every new order — confirms details, collects missing info via SMS, marks job confirmed.',
              impact: 'CS team can handle 5× volume without additional hires.',
              payback: '~$2,400/mo',
            },
            {
              num: '02',
              name: 'After-Hours AI Phone',
              problem: 'Nick and the team receive calls at 9–10 PM on weekends from homeowners with questions about their job.',
              solution: 'Emma recognizes caller ID, pulls the active job, answers questions and collects info between 8 PM and 7 AM without human involvement.',
              impact: 'Zero missed calls after hours. Weekend interruptions for Nick eliminated.',
            },
            {
              num: '05',
              name: 'Service Window Collection',
              problem: '"Every morning I\'m calling vendors for service windows" — Nick\'s daily routine adds 30–60 min to every workday.',
              solution: 'Emma sends a morning text blast to all vendors with active upcoming jobs: "Select your window for [job] on [date]." Window auto-populates back into the system.',
              impact: 'Nick\'s daily morning call routine eliminated entirely.',
              payback: '~$1,650/mo',
            },
          ].map((mod) => (
            <div
              key={mod.num}
              className="rounded-xl p-5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span
                    className="text-lg font-black tabular-nums shrink-0"
                    style={{ color: ACCENT, fontVariantNumeric: 'tabular-nums' }}
                  >
                    {mod.num}
                  </span>
                  <span className="font-semibold text-white">{mod.name}</span>
                </div>
                <PhasePill phase={1} />
              </div>
              <div className="space-y-2 text-xs pl-8">
                <div>
                  <span className="font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>The problem — </span>
                  <span style={{ color: 'rgba(255,255,255,0.65)' }}>{mod.problem}</span>
                </div>
                <div>
                  <span className="font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Emma&apos;s solution — </span>
                  <span style={{ color: 'rgba(255,255,255,0.65)' }}>{mod.solution}</span>
                </div>
                <div
                  className="mt-2 pt-2"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="font-semibold" style={{ color: ACCENT }}>Impact: </span>
                  <span style={{ color: 'rgba(255,255,255,0.75)' }}>{mod.impact}</span>
                  {'payback' in mod && (
                    <div className="inline-flex items-center gap-1.5 ml-3">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: ACCENT }}
                      />
                      <span className="text-xs font-medium" style={{ color: 'rgba(173,255,71,0.7)' }}>
                        Payback contribution: {(mod as { payback: string }).payback}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Phase 2 — available when ready */}
          <div className="mt-2">
            <div className="flex items-center gap-3 mb-3 mt-6">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: BLUE }}>Phase 2: Available When You&apos;re Ready</span>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
            <p className="text-xs mb-3 text-center" style={{ color: 'rgba(255,255,255,0.4)' }}>
              These modules are ready to scope after Phase 1. Pricing determined collaboratively based on results and priorities.
            </p>
            <div className="rounded-xl overflow-hidden opacity-60" style={{ border: `1px solid ${BLUE}30` }}>
              {[
                { num: '03', name: 'Missing Info Chasing', desc: 'Auto-follow up on incomplete job fields via SMS until collected.' },
                { num: '04', name: 'Smart Auto-Dispatch', desc: 'Rules-based vendor scoring and assignment for jobs 7+ days out.' },
                { num: '06', name: 'Vendor Compliance & Paperwork', desc: '4-stage nudge sequence to collect invoices and close-out docs.' },
                { num: '07', name: 'QA → Google Review Funnel', desc: 'SMS-based QA scoring with automatic Google review routing for happy customers.' },
                { num: '08', name: 'Open Estimate Follow-Up', desc: 'Replaces the Monday PDF with automated Day 3/7/21 follow-up sequences.' },
              ].map((mod, i) => (
                <div
                  key={mod.num}
                  className="flex items-start gap-3 px-4 py-3"
                  style={{
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderTop: i > 0 ? `1px solid ${BLUE}15` : undefined,
                  }}
                >
                  <span className="text-xs font-black tabular-nums shrink-0 mt-0.5" style={{ color: BLUE }}>{mod.num}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{mod.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{mod.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fear reducer: Q&A block */}
          <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div
              className="px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span className="text-xs font-semibold text-white">Common questions before you commit</span>
            </div>
            {[
              {
                q: 'What if Emma says something wrong?',
                a: 'Every message is templated and human-reviewed before launch. Nick can intervene at any point via the dashboard.',
              },
              {
                q: 'Will vendors actually use it?',
                a: 'Try the Vendor Portal now. It\'s intentionally simple — one screen, same flow Gary\'s team already knows.',
              },
              {
                q: 'What if something breaks on a critical job?',
                a: 'Escalation logic is built in. Emma handles routine. Anything unusual routes to Nick immediately.',
              },
              {
                q: 'What does this cost to maintain?',
                a: 'The monthly retainer covers it. We own the uptime and iteration — you own the outcomes.',
              },
            ].map((row, i) => (
              <div
                key={row.q}
                className="px-4 py-3"
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderTop: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div className="text-xs font-medium text-white mb-1">{row.q}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{row.a}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* ── 7. The Platform We've Already Built ── */}
      <SectionCard icon={<LayoutDashboard size={18} />} title="The Platform We've Already Built">
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
          We&apos;ve already built the full platform. Phase 1 gives you the three highest-impact automations. Everything else you see below becomes available as we grow together.
        </p>

        {/* Phase 1 group */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Phase 1: See It In Action</span>
            <div className="h-px flex-1" style={{ background: `${ACCENT}30` }} />
          </div>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${ACCENT}30` }}>
            {[
              { icon: <MessageSquare size={14} />, href: '/jobs/J-1001',  page: 'Job Detail',       what: 'Shows the warm handoff SMS conversation live — Emma collecting info from the homeowner' },
              { icon: <Activity size={14} />,      href: '/ai-activity',  page: 'Emma AI Activity', what: 'Every automated action Emma takes, with timestamps, transcripts, and outcomes' },
              { icon: <LayoutDashboard size={14} />, href: '/dashboard',  page: 'Command Center',   what: 'Real-time KPIs, needs-attention list, and Emma\'s recent activity at a glance' },
            ].map((row, i) => (
              <div
                key={row.page}
                className="flex items-start gap-4 px-4 py-3"
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderTop: i > 0 ? `1px solid ${ACCENT}15` : undefined,
                }}
              >
                <span className="shrink-0 mt-0.5" style={{ color: ACCENT }}>{row.icon}</span>
                <div className="w-36 shrink-0">
                  <Link
                    href={row.href}
                    className="text-sm font-medium text-white hover:underline"
                    style={{ textDecorationColor: ACCENT }}
                  >
                    {row.page}
                  </Link>
                </div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{row.what}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Phase 2 group */}
        <div className="opacity-70">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: BLUE }}>Phase 2: A Glimpse of What&apos;s Next</span>
            <div className="h-px flex-1" style={{ background: `${BLUE}30` }} />
          </div>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${BLUE}25` }}>
            {[
              { icon: <Briefcase size={14} />,    href: '/jobs',              page: 'Job Queue',         what: 'All jobs with status, info completion progress, and at-risk indicators' },
              { icon: <Zap size={14} />,          href: '/dispatch',          page: 'Auto-Dispatch',     what: 'Vendor scoring, matching rules, dispatch simulation' },
              { icon: <Shield size={14} />,       href: '/vendor-compliance', page: 'Vendor Compliance', what: 'Nudge sequence timeline, escalation tracking' },
              { icon: <FileText size={14} />,     href: '/estimates',         page: 'Open Estimates',    what: 'Pipeline view + Monday report replacement preview' },
              { icon: <Star size={14} />,         href: '/qa-reviews',        page: 'QA & Reviews',      what: 'Score distribution, vendor leaderboard, Google review funnel' },
              { icon: <DollarSign size={14} />,   href: '/billing',           page: 'Billing',           what: 'Invoice status tracker, auto-invoice preview' },
              { icon: <Users size={14} />,        href: '/vendor-portal',     page: 'Vendor Portal',     what: 'What your service partners see — stateful job workflow simulation' },
            ].map((row, i) => (
              <div
                key={row.page}
                className="flex items-start gap-4 px-4 py-3"
                style={{
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderTop: i > 0 ? `1px solid ${BLUE}15` : undefined,
                }}
              >
                <span className="shrink-0 mt-0.5" style={{ color: BLUE }}>{row.icon}</span>
                <div className="w-36 shrink-0 relative">
                  <Link
                    href={row.href}
                    className="text-sm font-medium text-white hover:underline"
                    style={{ textDecorationColor: BLUE }}
                  >
                    {row.page}
                  </Link>
                </div>
                <div className="flex-1 flex items-start justify-between gap-3">
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{row.what}</div>
                  <span
                    className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold"
                    style={{ background: `${BLUE}18`, border: `1px solid ${BLUE}35`, color: BLUE }}
                  >
                    Phase 2
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* ── 8. 3-Month Roadmap ── */}
      <SectionCard icon={<CheckCircle size={18} />} title="Your 3-Month Roadmap">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              monthLabel: 'Month 1',
              phase: 'Phase 1',
              label: 'The Foundation',
              accentColor: ACCENT,
              badge: 'Included — sign today',
              modules: [
                '01 Emma Warm Handoff',
                '02 After-Hours Phone',
                '05 Service Windows',
              ],
              note: 'First automation live in 2 weeks',
            },
            {
              monthLabel: 'Months 2–3',
              phase: 'Phase 2',
              label: 'Expand',
              accentColor: BLUE,
              badge: 'Scope TBD',
              modules: [
                '03 Missing Info Chasing',
                '06 Vendor Compliance',
                '07 QA Review Funnel',
                '08 Open Estimate Follow-Up',
              ],
              note: 'Scoped after Phase 1 results',
            },
            {
              monthLabel: 'Month 3+',
              phase: 'Phase 3',
              label: 'Full Platform',
              accentColor: 'rgba(167,139,250,1)',
              badge: 'Scope TBD',
              modules: [
                '04 Smart Auto-Dispatch',
                'Mobile App',
                'GPS Tracking',
                'Auto-Invoice',
              ],
              note: 'Prioritized collaboratively',
            },
          ].map((col) => (
            <div
              key={col.phase}
              className="rounded-xl p-4"
              style={{ background: `${col.accentColor}08`, border: `1px solid ${col.accentColor}28` }}
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                    style={{ background: `${col.accentColor}20`, color: col.accentColor, border: `1px solid ${col.accentColor}40` }}
                  >
                    {col.phase.replace('Phase ', '')}
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{col.monthLabel}</div>
                    <div className="text-sm font-semibold text-white">{col.label}</div>
                  </div>
                </div>
                <span
                  className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold"
                  style={{ background: `${col.accentColor}18`, border: `1px solid ${col.accentColor}35`, color: col.accentColor }}
                >
                  {col.badge}
                </span>
              </div>
              <div className="space-y-2 mb-3">
                {col.modules.map((m) => (
                  <div key={m} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    <CheckCircle size={11} style={{ color: col.accentColor }} className="shrink-0" />
                    {m}
                  </div>
                ))}
              </div>
              <div className="text-xs italic" style={{ color: 'rgba(255,255,255,0.35)' }}>{col.note}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── 8b. Investment ── */}
      <SectionCard icon={<DollarSign size={18} />} title="Investment">
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Phase 1 is the right start. Focused, fast, and fully de-risked.
        </p>

        {/* Single Phase 1 card */}
        <div
          className="rounded-xl p-6"
          style={{ background: `${ACCENT}09`, border: `2px solid ${ACCENT}50` }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white text-lg">Phase 1: The Right Start</span>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: ACCENT, color: '#000' }}
            >
              Sign today
            </span>
          </div>
          <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Modules 01, 02, 05 — Warm Handoff, After-Hours Phone, Service Windows
          </p>
          <div className="mb-5">
            {[
              { label: 'One-time build',            value: '$9,500',       type: 'cost' },
              { label: 'Monthly support & hosting', value: '$750/mo',      type: 'cost' },
              { label: 'Monthly value unlocked',    value: '~$4,050/mo',   type: 'value' },
              { label: 'Payback',                   value: '~2.5 months',  type: 'value' },
              { label: 'First automation live',     value: '2 weeks',      type: 'value' },
            ].map((row, i) => (
              <div
                key={row.label}
                className="flex justify-between items-baseline gap-4 text-sm py-2"
                style={i === 2 ? { borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', paddingTop: '10px' } : undefined}
              >
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
                <span className="font-bold shrink-0" style={{ color: ACCENT }}>{row.value}</span>
              </div>
            ))}
          </div>
          {/* Payback callout */}
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold mb-4"
            style={{ background: `${ACCENT}18`, border: `1px solid ${ACCENT}45`, color: ACCENT }}
          >
            <Clock size={14} className="shrink-0" />
            Investment back in ~2.5 months · $2,400/mo warm handoff + $1,650/mo service windows
          </div>
          <div
            className="pt-4 text-xs space-y-1"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
          >
            <div>Includes: 3 modules + Emma templates + testing + handoff + ongoing support & hosting</div>
          </div>
        </div>

        {/* Phase 2 & 3 note */}
        <div
          className="mt-4 rounded-lg px-4 py-3 text-xs"
          style={{ background: `${BLUE}0d`, border: `1px solid ${BLUE}25`, color: 'rgba(96,165,250,0.7)' }}
        >
          Pricing for Phase 2 & 3 determined collaboratively after Phase 1 — scoped based on results and priorities.
        </div>
      </SectionCard>

      {/* ── 9. Next Steps ── */}
      <SectionCard icon={<ArrowRight size={18} />} title="Next Steps">
        <div className="space-y-4 mb-8">
          {[
            {
              num: '1',
              label: 'Sign the engagement letter',
              desc: 'Choose Phase 1 above. We\'ll send the letter and invoice within 24 hours.',
              accent: false,
            },
            {
              num: '2',
              label: 'Book your onboarding call',
              desc: 'Within 48 hours of signing, we schedule a 60-minute kickoff to lock in templates, credentials, and message tone.',
              accent: false,
            },
            {
              num: '3',
              label: 'First automation live in 2 weeks',
              desc: 'Module 01 (Emma Warm Handoff) or Module 02 (After-Hours) deploys first — you\'ll see Emma in action within 14 days of signing.',
              accent: true,
            },
          ].map((step) => (
            <div key={step.num} className="flex gap-4">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0 mt-0.5"
                style={{ background: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }}
              >
                {step.num}
              </span>
              <div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: step.accent ? ACCENT : 'white' }}
                >
                  {step.label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact block */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Your team at Jam AI
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Jam Anderson', role: 'Jam AI', email: 'jam@jamout.ai' },
              { name: 'Kevin Farrugia', role: 'Technical Lead', email: 'kevinfar@gmail.com' },
            ].map((person) => (
              <div key={person.name}>
                <div className="text-sm font-semibold text-white">{person.name}</div>
                <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{person.role}</div>
                <a
                  href={`mailto:${person.email}`}
                  className="inline-flex items-center gap-1.5 text-xs"
                  style={{ color: ACCENT }}
                >
                  <Mail size={12} />
                  {person.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

    </div>
  )
}
