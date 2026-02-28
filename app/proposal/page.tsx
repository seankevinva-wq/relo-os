'use client'

import Link from 'next/link'
import {
  FileText, AlertTriangle, Zap, Activity, TrendingUp, Bot,
  CheckCircle, ArrowRight, Mail, Phone, Star, DollarSign,
  Briefcase, Shield, Users, LayoutDashboard, MessageSquare, Flame,
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
            Prepared by JMAI · February 2026
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
            <span className="font-semibold text-white">Phase 1 is 7 focused automations, no mobile app required.</span>{' '}
            Everything Emma does is logged, reviewable, and interruptible. Nick stays in the loop on anything that matters — Emma handles everything routine so he doesn&apos;t have to.
          </p>
          <p>
            You already know automation is the answer. You&apos;ve seen what the larger players do with it.{' '}
            <span className="font-semibold text-white">This MVP is proof that it&apos;s now within reach for RSG</span>{' '}
            — not in a year, not with a 6-month procurement process — now.
          </p>
          <p style={{ color: ACCENT }} className="font-medium">
            The 8 modules below are the specific interventions. Each one targets a workflow you described on the call, with a quantified outcome attached.
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

      {/* ── 6. The 8 Automation Modules ── */}
      <SectionCard icon={<Zap size={18} />} title="The 8 Automation Modules">
        <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Ordered by priority. Phase 1 modules have no mobile app dependency and can ship first.
        </p>
        <div className="space-y-4">
          {[
            {
              num: '01',
              name: 'Emma Warm Handoff',
              phase: 1 as const,
              problem: 'A 4-person customer service team manually calls every new transferee to confirm details, collect images, vehicle make/model, and gate codes.',
              solution: 'Emma reaches out automatically on every new order — confirms details, collects missing info via SMS, marks job confirmed.',
              impact: 'CS team can handle 5× volume without additional hires.',
            },
            {
              num: '02',
              name: 'After-Hours AI Phone',
              phase: 1 as const,
              problem: 'Nick and the team receive calls at 9–10 PM on weekends from homeowners with questions about their job.',
              solution: 'Emma recognizes caller ID, pulls the active job, answers questions and collects info between 8 PM and 7 AM without human involvement.',
              impact: 'Zero missed calls after hours. Weekend interruptions for Nick eliminated.',
            },
            {
              num: '03',
              name: 'Missing Info Chasing',
              phase: 1 as const,
              problem: 'Jobs arrive with incomplete information — 6 of 10 required fields collected. Staff manually follow up to close the gap.',
              solution: 'When a job has incomplete info, Emma automatically follows up on each missing field via SMS — daily until collected.',
              impact: 'Eliminates manual follow-up calls. Jobs move to dispatch faster.',
            },
            {
              num: '04',
              name: 'Smart Auto-Dispatch',
              phase: 1 as const,
              problem: 'Vendor assignment requires manual matching by rules: territory, service type, QA score, tier, and availability.',
              solution: 'Rules-based engine scores every vendor per job (territory, service type, tier, QA score, availability). Jobs 7+ days out auto-assign preferred vendor and await confirmation.',
              impact: 'Nick only touches same-day or conflict jobs. Everything else is handled.',
            },
            {
              num: '05',
              name: 'Service Window Collection',
              phase: 1 as const,
              problem: '"Every morning I\'m calling vendors for service windows" — Nick\'s daily routine adds 30–60 min to every workday.',
              solution: 'Emma sends a morning text blast to all vendors with active upcoming jobs: "Select your window for [job] on [date]." Window auto-populates back into the system.',
              impact: 'Nick\'s daily morning call routine eliminated entirely.',
            },
            {
              num: '06',
              name: 'Vendor Compliance & Paperwork',
              phase: 1 as const,
              problem: '"They drag their feet sending invoices." Billing staff manually chase every vendor for close-out docs after each job.',
              solution: '4-stage automated nudge sequence: Day 0 thank-you, Day 1 reminder, Day 2 warning, Day 3 escalation to Nick.',
              impact: 'Billing team only touches non-compliant vendors. Routine follow-up is fully automated.',
            },
            {
              num: '07',
              name: 'QA → Google Review Funnel',
              phase: 1 as const,
              problem: 'QA requests are sent by email only — ~5% response rate. Google review asks go to everyone, including unhappy customers.',
              solution: 'At job close, Emma texts transferee for a 1–5 score. Score ≥ 4 → Google link sent automatically. Score ≤ 3 → suppressed, Nick alerted.',
              impact: 'Estimated 5% → 25%+ response rate via SMS. More Google reviews. Negative reviews intercepted before they go public.',
            },
            {
              num: '08',
              name: 'Open Estimate Follow-Up',
              phase: 1 as const,
              problem: 'Monday morning PDF report: 1,437 open estimates sitting idle. No automated follow-up sequence in place.',
              solution: 'Emma replaces the PDF report with personalized automated follow-ups at Day 3, Day 7, and Day 21 — with a direct link to place the order.',
              impact: '1,437 open estimates actively worked, not just reported. Monday report generated automatically.',
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
                <PhasePill phase={mod.phase} />
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
                </div>
              </div>
            </div>
          ))}

          {/* Phase 2 teaser */}
          <div
            className="rounded-xl p-4"
            style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}25` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <PhasePill phase={2} />
              <span className="text-sm font-semibold text-white">Auto-Invoice Generation</span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Triggered by mobile app close-out — creates a branded invoice + payable automatically. Requires Phase 2 mobile app.
            </p>
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

      {/* ── 7. This MVP ── */}
      <SectionCard icon={<LayoutDashboard size={18} />} title="This MVP — What You&apos;re Looking At">
        <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Every page in this dashboard demonstrates a real automation module. This is not a mockup — it&apos;s a working prototype with real logic, real data shapes, and real interaction flows.
        </p>
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          {[
            { icon: <LayoutDashboard size={14} />, href: '/dashboard',         page: 'Command Center',      what: 'Real-time KPIs, needs-attention list, and Emma\'s recent actions' },
            { icon: <Briefcase size={14} />,       href: '/jobs',              page: 'Job Queue',           what: 'All jobs with status, info completion progress, and at-risk indicators' },
            { icon: <MessageSquare size={14} />,   href: '/jobs/J-1001',       page: 'Job Detail',          what: 'Info checklist, Emma\'s SMS conversation, homeowner confirmation view' },
            { icon: <Zap size={14} />,             href: '/dispatch',          page: 'Auto-Dispatch',       what: 'Vendor scoring, matching rules, dispatch simulation' },
            { icon: <Activity size={14} />,        href: '/ai-activity',       page: 'Emma AI Activity',    what: 'Full log of every automated action with transcripts and outcomes' },
            { icon: <Shield size={14} />,          href: '/vendor-compliance', page: 'Vendor Compliance',   what: 'Nudge sequence timeline, escalation tracking' },
            { icon: <FileText size={14} />,        href: '/estimates',         page: 'Open Estimates',      what: 'Pipeline view + Monday report replacement preview' },
            { icon: <Star size={14} />,            href: '/qa-reviews',        page: 'QA & Reviews',        what: 'Score distribution, vendor leaderboard, Google review funnel' },
            { icon: <DollarSign size={14} />,      href: '/billing',           page: 'Billing',             what: 'Invoice status tracker, auto-invoice preview' },
            { icon: <Users size={14} />,           href: '/vendor-portal',     page: 'Vendor Portal',       what: 'What your service partners see — stateful job workflow simulation' },
          ].map((row, i) => (
            <div
              key={row.page}
              className="flex items-start gap-4 px-4 py-3"
              style={{
                background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                borderTop: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined,
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
      </SectionCard>

      {/* ── 8. Phasing ── */}
      <SectionCard icon={<CheckCircle size={18} />} title="Engagement & Phasing">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Phase 1 */}
          <div
            className="rounded-xl p-5"
            style={{ background: `${ACCENT}08`, border: `1px solid ${ACCENT}30` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <PhasePill phase={1} />
              <span className="font-semibold text-white">Core Automation</span>
            </div>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
              No mobile app dependency. Delivers immediate impact on your highest-pain workflows.
            </p>
            <div className="space-y-2">
              {[
                'Emma Warm Handoff',
                'After-Hours AI Phone',
                'Missing Info Chasing',
                'Service Window Collection',
                'Vendor Compliance Nudges',
                'Open Estimate Follow-Up',
                'QA + Google Review Funnel',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <CheckCircle size={12} style={{ color: ACCENT }} className="shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2 */}
          <div
            className="rounded-xl p-5"
            style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}30` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <PhasePill phase={2} />
              <span className="font-semibold text-white">Full Platform</span>
            </div>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Builds on Phase 1. Requires mobile app coordination with service partners.
            </p>
            <div className="space-y-2">
              {[
                'Auto-Dispatch (full rules engine)',
                'Auto-Invoice Generation',
                'Shared Visibility Panel (RSG + vendor + moving co + homeowner)',
                'GPS "I\'m on my way" tracking',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <CheckCircle size={12} style={{ color: BLUE }} className="shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 8b. Investment ── */}
      <SectionCard icon={<DollarSign size={18} />} title="Investment">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Phase 1 pricing */}
          <div
            className="rounded-xl p-5"
            style={{ background: `${ACCENT}06`, border: `1px solid ${ACCENT}25` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <PhasePill phase={1} />
              <span className="font-semibold text-white">Core Automation</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'One-time build',               value: '$22,500' },
                { label: 'Monthly retainer (maintenance + iteration)', value: '$1,800/mo' },
                { label: 'Timeline',                     value: '8 weeks' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-baseline gap-4 text-sm">
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
                  <span className="font-bold shrink-0" style={{ color: ACCENT }}>
                    {row.value}
                  </span>
                </div>
              ))}
              <div
                className="pt-3 mt-1 text-xs space-y-1"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
              >
                <div>Includes: 7 modules above</div>
                <div>API integration with existing Relo platform</div>
                <div>Emma persona + messaging templates</div>
                <div>Testing + handoff</div>
              </div>
            </div>
          </div>

          {/* Phase 2 pricing */}
          <div
            className="rounded-xl p-5"
            style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}25` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <PhasePill phase={2} />
              <span className="font-semibold text-white">Full Platform</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'One-time build (on top of Phase 1)', value: '$47,500' },
                { label: 'Timeline',                           value: '12–14 weeks' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-baseline gap-4 text-sm">
                  <span style={{ color: 'rgba(255,255,255,0.55)' }}>{row.label}</span>
                  <span className="font-bold shrink-0" style={{ color: BLUE }}>
                    {row.value}
                  </span>
                </div>
              ))}
              <div
                className="pt-3 mt-1 text-xs space-y-1"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)' }}
              >
                <div>Includes: Auto-dispatch rules engine</div>
                <div>Auto-invoice generation</div>
                <div>Shared visibility panel</div>
                <div>Mobile app coordination</div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── 9. Next Steps ── */}
      <SectionCard icon={<ArrowRight size={18} />} title="Next Steps">
        <div className="space-y-4 mb-8">
          {[
            { num: '1', label: 'Review this MVP and share feedback', desc: 'Explore every page. Click everything. Tell us what resonates and what needs adjustment.' },
            { num: '2', label: 'Schedule a follow-up', desc: 'We\'ll walk through Phase 1 scope in detail, confirm priorities, and finalize the engagement.' },
            { num: '3', label: 'Begin Phase 1 build', desc: 'Start with the 7 modules that deliver immediate impact — no mobile app required.' },
          ].map((step) => (
            <div key={step.num} className="flex gap-4">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black shrink-0 mt-0.5"
                style={{ background: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }}
              >
                {step.num}
              </span>
              <div>
                <div className="text-sm font-semibold text-white">{step.label}</div>
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
            Your team at JMAI
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'Jam Anderson', role: 'JMAI', email: 'jam@jamout.ai' },
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
