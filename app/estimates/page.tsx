'use client'

import { useState } from 'react'
import { ESTIMATES, type EstimateRecord } from '@/lib/mock-data'
import { FileText, X, ChevronRight, Mail, MessageSquare, Phone, TrendingUp } from 'lucide-react'

type FilterStatus = 'all' | 'fresh' | 'aging' | 'stale' | 'converted'

const STATUS_CONFIG = {
  fresh:     { label: 'Fresh',     color: '#ADFF47', bg: 'rgba(173,255,71,0.12)',   border: 'rgba(173,255,71,0.3)'   },
  aging:     { label: 'Aging',     color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',   border: 'rgba(251,191,36,0.3)'   },
  stale:     { label: 'Stale',     color: '#f87171', bg: 'rgba(248,113,113,0.12)',  border: 'rgba(248,113,113,0.3)'  },
  converted: { label: 'Converted', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',   border: 'rgba(96,165,250,0.3)'   },
}

const METHOD_ICON: Record<string, React.ReactNode> = {
  email: <Mail size={12} />,
  sms:   <MessageSquare size={12} />,
  phone: <Phone size={12} />,
}

function EstimateStatusBadge({ status }: { status: EstimateRecord['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  )
}

function FollowUpTimeline({ estimate }: { estimate: EstimateRecord }) {
  if (estimate.followUps.length === 0) {
    return (
      <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.4)' }}>
        No follow-ups sent yet — Emma will send first outreach within 24 hrs of estimate creation.
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {estimate.followUps.map((fu, idx) => (
        <div key={idx} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}
            >
              {METHOD_ICON[fu.method]}
            </div>
            {idx < estimate.followUps.length - 1 && (
              <div className="w-0.5 flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.08)', minHeight: 20 }} />
            )}
          </div>
          <div className="pb-3 flex-1">
            <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {new Date(fu.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {fu.method.toUpperCase()}
            </div>
            <div className="text-xs p-2.5 rounded-lg" style={{ background: 'rgba(173,255,71,0.06)', border: '1px solid rgba(173,255,71,0.12)', color: 'rgba(255,255,255,0.7)' }}>
              Emma: {fu.message}
            </div>
            {fu.response && (
              <div className="text-xs p-2 rounded-lg mt-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}>
                Reply: "{fu.response}"
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function Drawer({ estimate, onClose }: { estimate: EstimateRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" style={{ backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div
        className="relative w-full max-w-md h-full overflow-y-auto p-6 flex flex-col gap-5"
        style={{
          background: 'rgba(15,15,20,0.98)',
          borderLeft: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(32px)',
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-sm font-bold" style={{ color: '#ADFF47' }}>{estimate.estimateNumber}</div>
            <div className="text-lg font-bold text-white mt-0.5">{estimate.homeowner}</div>
            <div className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{estimate.clientName}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Quoted Value', value: `$${estimate.quotedValue.toLocaleString()}` },
            { label: 'Days Open', value: estimate.status === 'converted' ? 'Converted' : `${estimate.daysOpen}d` },
            { label: 'Status', value: <EstimateStatusBadge status={estimate.status} /> },
            { label: 'Services', value: estimate.services.join(', ') },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
              <div className="text-sm font-medium text-white">{item.value}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-xs font-semibold tracking-wide uppercase mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Emma's Follow-Up Log
          </div>
          <FollowUpTimeline estimate={estimate} />
        </div>
      </div>
    </div>
  )
}

// Monday report preview
function MondayReport() {
  const totalOpen = ESTIMATES.filter(e => e.status !== 'converted').length
  const followedUpThisWeek = ESTIMATES.filter(e => e.lastFollowUp !== null).length
  const converted = ESTIMATES.filter(e => e.status === 'converted').length
  const conversionRate = Math.round((converted / ESTIMATES.length) * 100)

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        fontFamily: 'monospace',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <FileText size={14} style={{ color: '#ADFF47' }} />
        <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#ADFF47' }}>Monday Morning Report Preview</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(173,255,71,0.08)', color: 'rgba(173,255,71,0.7)' }}>Auto-generated by Emma</span>
      </div>
      <div className="text-xs space-y-1" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.8 }}>
        <div style={{ color: 'rgba(255,255,255,0.25)' }}>──────────────────────────────────────</div>
        <div><span style={{ color: 'rgba(255,255,255,0.9)' }}>WEEKLY ESTIMATES REPORT</span> · Mon Feb 27, 2026</div>
        <div style={{ color: 'rgba(255,255,255,0.25)' }}>──────────────────────────────────────</div>
        <div>Open Estimates: <span style={{ color: '#fbbf24' }}>{totalOpen}</span></div>
        <div>Followed Up This Week: <span style={{ color: '#ADFF47' }}>{followedUpThisWeek}</span> (automated)</div>
        <div>Converted to Orders: <span style={{ color: '#60a5fa' }}>{converted}</span></div>
        <div>Conversion Rate: <span style={{ color: '#ADFF47' }}>{conversionRate}%</span></div>
        <div style={{ color: 'rgba(255,255,255,0.25)' }}>──────────────────────────────────────</div>
        <div className="pt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Previously: this report was assembled manually every Monday morning by pulling PDFs from 3 systems. Emma now generates it automatically — zero staff time required.
        </div>
      </div>
    </div>
  )
}

export default function EstimatesPage() {
  const [selected, setSelected] = useState<EstimateRecord | null>(null)
  const [filter, setFilter] = useState<FilterStatus>('all')

  const filtered = filter === 'all' ? ESTIMATES : ESTIMATES.filter(e => e.status === filter)

  const totalOpen = ESTIMATES.filter(e => e.status !== 'converted').length
  const followedUp = ESTIMATES.filter(e => e.lastFollowUp !== null).length
  const converted = ESTIMATES.filter(e => e.status === 'converted').length
  const conversionRate = Math.round((converted / ESTIMATES.length) * 100)

  return (
    <div className="space-y-6 max-w-7xl">
      {selected && <Drawer estimate={selected} onClose={() => setSelected(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-white">Open Estimates Pipeline</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Emma chases open quotes automatically — no more Monday morning PDF reports
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Open', value: totalOpen.toLocaleString(), color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', sub: 'estimates outstanding' },
          { label: 'Followed Up This Week', value: followedUp, color: '#ADFF47', bg: 'rgba(173,255,71,0.05)', border: 'rgba(173,255,71,0.15)', sub: 'automated by Emma' },
          { label: 'Converted to Orders', value: converted, color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', sub: 'this period' },
          { label: 'Conversion Rate', value: `${conversionRate}%`, color: '#ADFF47', bg: 'rgba(173,255,71,0.05)', border: 'rgba(173,255,71,0.15)', sub: 'follow-up conversion' },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-5" style={{ background: k.bg, border: `1px solid ${k.border}` }}>
            <div className="text-3xl font-black mb-1" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs font-medium text-white mb-0.5">{k.label}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'fresh', 'aging', 'stale', 'converted'] as FilterStatus[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={filter === f ? {
              background: 'rgba(173,255,71,0.12)',
              border: '1px solid rgba(173,255,71,0.3)',
              color: '#ADFF47',
            } : {
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {f === 'all' ? 'All Estimates' : STATUS_CONFIG[f].label}
            {f !== 'all' && (
              <span className="ml-1.5" style={{ color: f === filter ? '#ADFF47' : 'rgba(255,255,255,0.3)' }}>
                {ESTIMATES.filter(e => e.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Client / Homeowner', 'Services', 'Value', 'Days Open', 'Last Follow-Up', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(est => (
                <tr
                  key={est.id}
                  onClick={() => setSelected(est)}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    background: est.status === 'stale' ? 'rgba(248,113,113,0.02)' : 'transparent',
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-white text-sm">{est.homeowner}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{est.clientName}</div>
                    <div className="font-mono text-xs mt-0.5" style={{ color: '#ADFF47' }}>{est.estimateNumber}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{est.services.join(', ')}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">${est.quotedValue.toLocaleString()}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: est.daysOpen > 30 ? '#f87171' : est.daysOpen > 7 ? '#fbbf24' : 'rgba(255,255,255,0.6)' }}>
                      {est.status === 'converted' ? '—' : `${est.daysOpen}d`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {est.lastFollowUp
                        ? new Date(est.lastFollowUp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : <span style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <EstimateStatusBadge status={est.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monday report */}
        <div className="flex flex-col gap-4">
          <MondayReport />

          <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(173,255,71,0.05)', border: '1px solid rgba(173,255,71,0.15)' }}>
            <TrendingUp size={16} style={{ color: '#ADFF47', marginTop: 2 }} />
            <div>
              <div className="text-sm font-semibold text-white mb-0.5">How Emma chases estimates</div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Emma sends a personalized follow-up email at day 3, a second touch at day 7 (email + SMS), and a final notice at day 21 before marking as stale. Converted quotes are flagged and closed automatically.{' '}
                <span style={{ color: '#ADFF47' }}>1,437 open estimates. Zero Monday morning reports.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
