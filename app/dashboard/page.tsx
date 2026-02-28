'use client'

import Link from 'next/link'
import { JOBS, JOB_VOLUME_BY_MONTH, AI_EVENTS, getJobVendor } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { fmtDate } from '@/lib/utils'
import { AlertTriangle, Clock, TrendingUp, CheckCircle, Zap, MessageSquare, Phone, Mail, FileText } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const CHANNEL_ICON: Record<string, React.ReactNode> = {
  sms: <MessageSquare size={12} />,
  phone: <Phone size={12} />,
  email: <Mail size={12} />,
}

export default function DashboardPage() {
  const activeJobs = JOBS.filter(j => j.status !== 'complete')
  const needsAttention = JOBS.filter(j => ['at_risk', 'pending_info', 'needs_dispatch'].includes(j.status))
  const todayActive = JOBS.filter(j => j.status === 'active' || j.status === 'window_confirmed')
  const recentEvents = AI_EVENTS.slice(0, 4)

  const kpis = [
    { label: 'Active Jobs', value: '47', icon: <Briefcase />, color: '#ADFF47', sub: 'across 9 markets' },
    { label: 'Needs Attention', value: needsAttention.length.toString(), icon: <AlertTriangle />, color: '#f87171', sub: 'jobs require action', urgent: true },
    { label: 'Hours Saved This Week', value: '23', icon: <Clock />, color: '#60a5fa', sub: 'vs. manual process' },
    { label: 'Vendor Compliance', value: '91%', icon: <CheckCircle />, color: '#ADFF47', sub: 'invoices on track' },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Command Center</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Thu Feb 27, 2026 · Emma AI is active
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="glass rounded-2xl p-5"
            style={kpi.urgent ? { borderColor: 'rgba(248,113,113,0.3)', boxShadow: '0 0 20px rgba(248,113,113,0.08)' } : {}}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{kpi.label}</div>
              <div style={{ color: kpi.color, opacity: 0.7 }}>{kpi.icon}</div>
            </div>
            <div className="text-3xl font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Open Estimates Banner */}
      <div className="rounded-2xl p-5" style={{ background: 'rgba(173,255,71,0.04)', border: '1px solid rgba(173,255,71,0.18)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <FileText size={20} style={{ color: '#ADFF47' }} />
            <div>
              <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Open Estimates</div>
              <div className="text-3xl font-bold" style={{ color: '#ADFF47' }}>1,437</div>
            </div>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span className="text-white font-medium">31</span> followed up this week · Emma chased estimates automatically
            </div>
            <div className="w-px h-8 hidden sm:block" style={{ background: 'rgba(255,255,255,0.12)' }} />
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <span className="font-medium" style={{ color: '#ADFF47' }}>8 converted to orders</span> · ~26% follow-up conversion rate
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Needs Attention */}
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} style={{ color: '#f87171' }} />
            <h2 className="text-sm font-semibold text-white">Needs Attention</h2>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
              {needsAttention.length} jobs
            </span>
          </div>
          <div className="space-y-2">
            {needsAttention.slice(0, 5).map(job => {
              const collected = job.infoItems.filter(i => i.collected).length
              const total = job.infoItems.length
              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all glass-hover"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono font-bold" style={{ color: '#ADFF47' }}>{job.id}</span>
                      <StatusBadge status={job.status} />
                    </div>
                    <div className="text-sm font-medium text-white truncate">{job.homeowner}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{job.serviceType} · {job.city}, {job.state}</div>
                  </div>
                  <div className="text-right shrink-0" title={`${collected} of ${total} homeowner info items collected`}>
                    <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Info</div>
                    <div className="text-xs font-semibold" style={{ color: collected === total ? '#ADFF47' : '#fbbf24' }}>{collected}/{total}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Emma's Last 24 Hours */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} style={{ color: '#ADFF47' }} />
            <h2 className="text-sm font-semibold text-white">Emma's Last 24hrs</h2>
          </div>
          <div className="space-y-3">
            {recentEvents.map(ev => (
              <div key={ev.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: ev.isAfterHours ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.06)', color: ev.isAfterHours ? '#fbbf24' : 'rgba(255,255,255,0.4)' }}>
                    {CHANNEL_ICON[ev.channel]}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {ev.isAfterHours && (
                      <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                        After Hours
                      </span>
                    )}
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {new Date(ev.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                  <div className="text-xs text-white leading-relaxed">{ev.summary}</div>
                  <div className="text-xs mt-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{ev.jobId}</div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/ai-activity" className="mt-4 flex items-center justify-center text-xs py-2 rounded-lg transition-all"
            style={{ color: '#ADFF47', background: 'rgba(173,255,71,0.06)', border: '1px solid rgba(173,255,71,0.15)' }}>
            View all activity →
          </Link>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Today's Service Windows */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} style={{ color: '#60a5fa' }} />
            <h2 className="text-sm font-semibold text-white">Today's Service Windows</h2>
          </div>
          <div className="space-y-2">
            {todayActive.length === 0 && (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>No jobs active today.</p>
            )}
            {todayActive.map(job => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="flex items-center gap-3 p-3 rounded-xl glass-hover"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{job.homeowner}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{job.serviceType} · {job.city}, {job.state}</div>
                </div>
                <div className="text-right shrink-0">
                  {job.techName && <div className="text-xs font-medium text-white">{job.techName}</div>}
                  {job.windowConfirmed && <div className="text-xs" style={{ color: '#ADFF47' }}>{job.windowConfirmed}</div>}
                </div>
              </Link>
            ))}
            {JOBS.filter(j => j.status === 'active').map(job => (
              <Link
                key={job.id + 'active'}
                href={`/jobs/${job.id}`}
                className="flex items-center gap-3 p-3 rounded-xl glass-hover"
                style={{ background: 'rgba(173,255,71,0.06)', border: '1px solid rgba(173,255,71,0.15)' }}
              >
                <div className="w-2 h-2 rounded-full bg-[#ADFF47] animate-pulse shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white">{job.homeowner} — <span style={{ color: '#ADFF47' }}>In Progress</span></div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{job.techName} · {job.windowConfirmed}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Job Volume Chart */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} style={{ color: '#ADFF47' }} />
            <h2 className="text-sm font-semibold text-white">Job Volume</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={JOB_VOLUME_BY_MONTH} barSize={28}>
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={28}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15,15,25,0.95)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '12px',
                }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="jobs" fill="#ADFF47" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function Briefcase() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  )
}
