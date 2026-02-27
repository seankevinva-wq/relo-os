'use client'

import { useState } from 'react'
import { VENDOR_COMPLIANCE, type VendorCompliance } from '@/lib/mock-data'
import { ComplianceBadge } from '@/components/status-badge'
import { fmtDate } from '@/lib/utils'
import { Shield, X, CheckCircle, AlertTriangle, Clock, ChevronRight } from 'lucide-react'

function NudgeTimeline({ nudges }: { nudges: VendorCompliance['nudges'] }) {
  if (nudges.length === 0) {
    return <p className="text-sm py-2" style={{ color: 'rgba(255,255,255,0.4)' }}>No nudges sent — vendor submitted on time.</p>
  }

  const dayColors: Record<number, string> = {
    0: 'rgba(173,255,71,0.6)',
    1: 'rgba(255,255,255,0.5)',
    2: '#fbbf24',
    3: '#f87171',
  }

  return (
    <div className="space-y-3">
      {nudges.map((nudge, idx) => (
        <div key={idx} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
              style={{
                background: nudge.escalated ? 'rgba(248,113,113,0.15)' : 'rgba(255,255,255,0.06)',
                border: nudge.escalated ? '2px solid rgba(248,113,113,0.4)' : '2px solid rgba(255,255,255,0.1)',
                color: nudge.escalated ? '#f87171' : dayColors[nudge.day] || 'rgba(255,255,255,0.5)',
              }}
            >
              {nudge.escalated ? '!' : `D${nudge.day}`}
            </div>
            {idx < nudges.length - 1 && (
              <div className="w-0.5 flex-1 mt-1 mb-0" style={{ background: 'rgba(255,255,255,0.08)', minHeight: 24 }} />
            )}
          </div>
          <div className="pb-4 flex-1">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span
                className="text-xs font-semibold"
                style={{ color: nudge.escalated ? '#f87171' : dayColors[nudge.day] || 'rgba(255,255,255,0.5)' }}
              >
                {nudge.type}
              </span>
              {nudge.escalated && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>
                  Escalated to Nick
                </span>
              )}
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                {new Date(nudge.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {new Date(nudge.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{nudge.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function Drawer({ vc, onClose }: { vc: VendorCompliance; onClose: () => void }) {
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
            <div className="font-mono text-sm font-bold" style={{ color: '#ADFF47' }}>{vc.jobId}</div>
            <div className="text-lg font-bold text-white mt-0.5">{vc.vendorName}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Service Date', value: fmtDate(vc.serviceDate) },
            { label: 'Invoice Due', value: fmtDate(vc.invoiceDueDate) },
            { label: 'Days Since Job', value: `${vc.daysSinceJob}d` },
            { label: 'Status', value: <ComplianceBadge status={vc.status} /> },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
              <div className="text-sm font-medium text-white">{item.value}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-xs font-semibold tracking-wide uppercase mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Automated Nudge Sequence
          </div>
          <NudgeTimeline nudges={vc.nudges} />
          {vc.nudges.length === 0 && vc.status === 'on_track' && (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(173,255,71,0.05)', border: '1px solid rgba(173,255,71,0.15)' }}>
              <Clock size={14} style={{ color: '#ADFF47' }} />
              <p className="text-xs" style={{ color: '#ADFF47' }}>Auto thank-you will send on service completion</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VendorCompliancePage() {
  const [selectedVc, setSelectedVc] = useState<VendorCompliance | null>(null)

  const awaiting = VENDOR_COMPLIANCE.filter(v => ['overdue_24h', 'overdue_48h', 'warning_issued'].includes(v.status)).length
  const onTrack = VENDOR_COMPLIANCE.filter(v => v.status === 'on_track' || v.status === 'submitted').length
  const overdue = VENDOR_COMPLIANCE.filter(v => v.status === 'overdue_48h' || v.status === 'warning_issued').length

  return (
    <div className="space-y-6 max-w-7xl">
      {selectedVc && <Drawer vc={selectedVc} onClose={() => setSelectedVc(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-white">Vendor Compliance</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          AI-automated paperwork chase · Nick only sees escalations
        </p>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Awaiting Submission', value: awaiting, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
          { label: 'On Track', value: onTrack, color: '#ADFF47', bg: 'rgba(173,255,71,0.05)', border: 'rgba(173,255,71,0.15)' },
          { label: 'Overdue / Warning', value: overdue, color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-5" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
            <div className="text-3xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Vendor', 'Job', 'Service Date', 'Invoice Due', 'Status', 'Days Since Job', 'AI Actions', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VENDOR_COMPLIANCE.map(vc => {
              const isProblematic = ['overdue_24h', 'overdue_48h', 'warning_issued'].includes(vc.status)
              const hasEscalation = vc.nudges.some(n => n.escalated)

              return (
                <tr
                  key={vc.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: isProblematic ? 'rgba(248,113,113,0.02)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedVc(vc)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{vc.vendorName}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold" style={{ color: '#ADFF47' }}>{vc.jobId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{fmtDate(vc.serviceDate)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{fmtDate(vc.invoiceDueDate)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <ComplianceBadge status={vc.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: vc.daysSinceJob > 3 ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
                      {vc.daysSinceJob > 0 ? `${vc.daysSinceJob}d` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {vc.nudges.length > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                          {vc.nudges.length} nudge{vc.nudges.length !== 1 ? 's' : ''} sent
                        </span>
                      )}
                      {hasEscalation && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
                          Escalated
                        </span>
                      )}
                      {vc.nudges.length === 0 && (
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Nick callout */}
      <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(173,255,71,0.05)', border: '1px solid rgba(173,255,71,0.15)' }}>
        <Shield size={16} style={{ color: '#ADFF47', marginTop: 2 }} />
        <div>
          <div className="text-sm font-semibold text-white mb-0.5">How this works</div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Emma sends an automated thank-you the day of service, a friendly reminder on day 1, a second notice on day 2, and a penalty warning on day 3. Only after 3 failed attempts does anything land on Nick's desk — and even then it's a single flagged item, not a phone call.
            <span style={{ color: '#ADFF47' }}> Nick handled 1 vendor issue this week. Emma handled 26.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
