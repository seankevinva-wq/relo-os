'use client'

import { useState } from 'react'
import { AI_EVENTS, type AIEvent } from '@/lib/mock-data'
import { MessageSquare, Phone, Mail, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'

type Filter = 'all' | 'after_hours' | 'confirmation' | 'info_chase' | 'service_window' | 'vendor_nudge'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'after_hours', label: 'After Hours' },
  { id: 'confirmation', label: 'Confirmations' },
  { id: 'info_chase', label: 'Info Chase' },
  { id: 'service_window', label: 'Service Windows' },
  { id: 'vendor_nudge', label: 'Vendor Nudges' },
]

const CHANNEL_ICON: Record<string, React.ReactNode> = {
  sms: <MessageSquare size={14} />,
  phone: <Phone size={14} />,
  email: <Mail size={14} />,
}

const OUTCOME_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  resolved: { label: 'Resolved', color: '#ADFF47', bg: 'rgba(173,255,71,0.1)', icon: <CheckCircle size={10} /> },
  awaiting: { label: 'Awaiting', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', icon: <Clock size={10} /> },
  escalated: { label: 'Escalated', color: '#f87171', bg: 'rgba(248,113,113,0.1)', icon: <AlertCircle size={10} /> },
}

function AIEventRow({ event }: { event: AIEvent }) {
  const [expanded, setExpanded] = useState(false)
  const outcome = OUTCOME_CONFIG[event.outcome]
  const time = new Date(event.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  const date = new Date(event.timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div
      className="rounded-2xl transition-all"
      style={{
        background: event.isAfterHours ? 'rgba(251,191,36,0.04)' : 'rgba(255,255,255,0.03)',
        border: event.isAfterHours ? '1px solid rgba(251,191,36,0.15)' : '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="p-4 flex items-start gap-4">
        {/* Channel icon */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{
            background: event.isAfterHours ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.06)',
            color: event.isAfterHours ? '#fbbf24' : 'rgba(255,255,255,0.5)',
          }}
        >
          {CHANNEL_ICON[event.channel]}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{date} · {time}</span>
            {event.isAfterHours && (
              <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                AFTER HOURS
              </span>
            )}
            <span className="text-xs capitalize px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
              {event.channel.toUpperCase()}
            </span>
          </div>
          <div className="flex items-start gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold text-white">{event.contactName}</span>
            <span className="text-xs font-mono" style={{ color: '#ADFF47' }}>{event.jobId}</span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{event.summary}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
            style={{ background: outcome.bg, color: outcome.color }}
          >
            {outcome.icon} {outcome.label}
          </span>
          {event.transcript && event.transcript.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-7 h-7 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
            >
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          )}
        </div>
      </div>

      {expanded && event.transcript && (
        <div className="px-4 pb-4 border-t space-y-2" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="pt-3" />
          {event.transcript.map((msg, i) => {
            const isEmma = msg.sender === 'Emma' || msg.sender.startsWith('Emma')
            return (
              <div key={i} className={`flex ${isEmma ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] px-3 py-2 rounded-xl text-sm"
                  style={isEmma ? {
                    background: 'rgba(173,255,71,0.08)',
                    border: '1px solid rgba(173,255,71,0.15)',
                    color: 'white',
                  } : {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'white',
                  }}
                >
                  <div className="text-xs mb-1" style={{ color: isEmma ? 'rgba(173,255,71,0.7)' : 'rgba(255,255,255,0.4)' }}>
                    {msg.sender}
                  </div>
                  {msg.text}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AIActivityPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const filtered = activeFilter === 'all'
    ? AI_EVENTS
    : activeFilter === 'after_hours'
    ? AI_EVENTS.filter(e => e.isAfterHours)
    : AI_EVENTS.filter(e => e.category === activeFilter)

  const afterHoursCount = AI_EVENTS.filter(e => e.isAfterHours).length
  const resolvedCount = AI_EVENTS.filter(e => e.outcome === 'resolved').length
  const escalatedCount = AI_EVENTS.filter(e => e.outcome === 'escalated').length

  const stats = [
    { label: 'Confirmations handled', value: '34', color: '#ADFF47' },
    { label: 'After-hours intercepted', value: afterHoursCount.toString(), color: '#fbbf24' },
    { label: 'Info items collected', value: '67', color: '#60a5fa' },
    { label: 'Vendor nudges', value: '19', color: '#a78bfa' },
    { label: 'Escalated to human', value: escalatedCount.toString(), color: '#f87171' },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Emma AI Activity</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Every interaction Emma handled · {AI_EVENTS.length} events this week
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Main timeline */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => {
              const count = f.id === 'all' ? AI_EVENTS.length : f.id === 'after_hours' ? afterHoursCount : AI_EVENTS.filter(e => e.category === f.id).length
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                  style={activeFilter === f.id ? {
                    background: 'rgba(173,255,71,0.1)',
                    border: '1px solid rgba(173,255,71,0.3)',
                    color: '#ADFF47',
                  } : {
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {f.label}
                  <span className="ml-2 text-xs opacity-70">{count}</span>
                </button>
              )
            })}
          </div>

          {/* Event list */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="glass rounded-2xl p-8 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                No events in this category
              </div>
            )}
            {filtered.map(event => (
              <AIEventRow key={event.id} event={event} />
            ))}
          </div>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-5">
            <div className="text-xs font-semibold tracking-wide uppercase mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
              This Week
            </div>
            <div className="space-y-3">
              {stats.map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
                  <span className="text-sm font-bold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-xs font-semibold tracking-wide uppercase mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              After-Hours Highlight
            </div>
            <div className="text-3xl font-black mb-1" style={{ color: '#fbbf24' }}>12</div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              conversations handled between 8 PM and 7 AM — zero humans involved
            </p>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="text-xs font-medium text-white">3 escalated</div>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>only when AI couldn't resolve</p>
            </div>
          </div>

          <div className="glass rounded-2xl p-5">
            <div className="text-xs font-semibold tracking-wide uppercase mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Resolution Rate
            </div>
            <div className="flex items-end gap-1 mb-2">
              <div className="text-3xl font-black" style={{ color: '#ADFF47' }}>{Math.round((resolvedCount / AI_EVENTS.length) * 100)}%</div>
              <div className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>resolved by AI</div>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.round((resolvedCount / AI_EVENTS.length) * 100)}%`, background: '#ADFF47' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
