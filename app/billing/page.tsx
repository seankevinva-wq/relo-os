'use client'

import { useState } from 'react'
import { BILLING_RECORDS, type BillingRecord } from '@/lib/mock-data'
import { DollarSign, X, Clock, CheckCircle, AlertTriangle, ChevronRight, FileText } from 'lucide-react'

const STATUS_CONFIG: Record<BillingRecord['status'], { label: string; color: string; bg: string; border: string }> = {
  awaiting_paperwork: { label: 'Awaiting Paperwork', color: '#f87171', bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.3)' },
  ready_to_bill:      { label: 'Ready to Bill',      color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)'  },
  invoiced:           { label: 'Invoiced',            color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)'  },
  paid:               { label: 'Paid',                color: '#ADFF47', bg: 'rgba(173,255,71,0.12)',  border: 'rgba(173,255,71,0.3)'  },
}

function BillingStatusBadge({ status }: { status: BillingRecord['status'] }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  )
}

function Drawer({ record, onClose }: { record: BillingRecord; onClose: () => void }) {
  const cfg = STATUS_CONFIG[record.status]

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
            <div className="font-mono text-sm font-bold" style={{ color: '#ADFF47' }}>{record.jobId}</div>
            <div className="text-lg font-bold text-white mt-0.5">{record.clientName}</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Status', value: <BillingStatusBadge status={record.status} /> },
            { label: 'Billed Amount', value: record.billedAmount ? `$${record.billedAmount.toLocaleString()}` : '—' },
            { label: 'Services', value: record.services.join(', ') },
            { label: 'Days Since Complete', value: `${record.daysSinceComplete}d` },
            ...(record.invoiceNumber ? [{ label: 'Invoice #', value: record.invoiceNumber }] : []),
            { label: 'Completed', value: new Date(record.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
              <div className="text-sm font-medium text-white">{item.value}</div>
            </div>
          ))}
        </div>

        {record.notes && (
          <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Notes</div>
            {record.notes}
          </div>
        )}

        {record.status === 'awaiting_paperwork' && (
          <div className="p-4 rounded-xl" style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} style={{ color: '#f87171' }} />
              <span className="text-xs font-semibold" style={{ color: '#f87171' }}>Awaiting Vendor Paperwork</span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Emma has sent {record.daysSinceComplete === 0 ? 'an initial' : `${Math.min(record.daysSinceComplete, 3)} automated`} nudge{record.daysSinceComplete !== 1 ? 's' : ''} to the vendor. Once paperwork is received, this job will move to "Ready to Bill" and auto-invoice can be generated.
            </p>
          </div>
        )}

        {record.status === 'ready_to_bill' && (
          <div className="p-4 rounded-xl" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={14} style={{ color: '#fbbf24' }} />
              <span className="text-xs font-semibold" style={{ color: '#fbbf24' }}>Ready for Auto-Invoice</span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Vendor paperwork received and matched. Emma will generate and send the client invoice automatically — no staff action required.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function BillingPage() {
  const [selected, setSelected] = useState<BillingRecord | null>(null)
  const [filter, setFilter] = useState<BillingRecord['status'] | 'all'>('all')

  const filtered = filter === 'all' ? BILLING_RECORDS : BILLING_RECORDS.filter(r => r.status === filter)

  const awaitingPaperwork = BILLING_RECORDS.filter(r => r.status === 'awaiting_paperwork').length
  const readyToBill       = BILLING_RECORDS.filter(r => r.status === 'ready_to_bill').length
  const billedThisMonth   = BILLING_RECORDS.filter(r => r.status === 'invoiced' || r.status === 'paid').reduce((s, r) => s + (r.billedAmount ?? 0), 0)
  const outstanding       = BILLING_RECORDS.filter(r => r.status === 'invoiced').reduce((s, r) => s + (r.billedAmount ?? 0), 0)

  return (
    <div className="space-y-6 max-w-7xl">
      {selected && <Drawer record={selected} onClose={() => setSelected(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Revenue Tracker</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Auto-match vendor paperwork to jobs · Emma eliminates manual invoice reconciliation
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Awaiting Paperwork', value: awaitingPaperwork, color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', sub: 'vendor docs outstanding' },
          { label: 'Ready to Bill', value: readyToBill, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', sub: 'awaiting invoice send' },
          { label: 'Billed This Month', value: `$${billedThisMonth.toLocaleString()}`, color: '#ADFF47', bg: 'rgba(173,255,71,0.05)', border: 'rgba(173,255,71,0.15)', sub: 'invoiced + paid' },
          { label: 'Outstanding', value: `$${outstanding.toLocaleString()}`, color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', sub: 'awaiting client payment' },
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
        {(['all', 'awaiting_paperwork', 'ready_to_bill', 'invoiced', 'paid'] as const).map(f => {
          const label = f === 'all' ? 'All Jobs' : STATUS_CONFIG[f].label
          const count = f === 'all' ? BILLING_RECORDS.length : BILLING_RECORDS.filter(r => r.status === f).length
          return (
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
              {label} <span className="ml-1" style={{ color: filter === f ? '#ADFF47' : 'rgba(255,255,255,0.3)' }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Job / Client', 'Services', 'Billed Amount', 'Status', 'Days Since Complete', 'Invoice #', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(record => (
              <tr
                key={record.id}
                onClick={() => setSelected(record)}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  cursor: 'pointer',
                  background: record.status === 'awaiting_paperwork' ? 'rgba(248,113,113,0.02)' : 'transparent',
                }}
              >
                <td className="px-4 py-3">
                  <div className="font-mono text-xs font-bold" style={{ color: '#ADFF47' }}>{record.jobId}</div>
                  <div className="text-sm font-medium text-white mt-0.5">{record.clientName}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{record.services.join(', ')}</div>
                </td>
                <td className="px-4 py-3">
                  {record.billedAmount
                    ? <span className="font-semibold text-white">${record.billedAmount.toLocaleString()}</span>
                    : <span style={{ color: 'rgba(255,255,255,0.3)' }}>—</span>}
                </td>
                <td className="px-4 py-3">
                  <BillingStatusBadge status={record.status} />
                </td>
                <td className="px-4 py-3">
                  <span style={{ color: record.daysSinceComplete > 7 ? '#f87171' : record.daysSinceComplete > 3 ? '#fbbf24' : 'rgba(255,255,255,0.5)' }}>
                    {record.daysSinceComplete}d
                  </span>
                </td>
                <td className="px-4 py-3">
                  {record.invoiceNumber
                    ? <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>{record.invoiceNumber}</span>
                    : <span style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>}
                </td>
                <td className="px-4 py-3">
                  <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explainer */}
      <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(173,255,71,0.05)', border: '1px solid rgba(173,255,71,0.15)' }}>
        <DollarSign size={16} style={{ color: '#ADFF47', marginTop: 2 }} />
        <div>
          <div className="text-sm font-semibold text-white mb-0.5">How billing automation will work</div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Today, vendors email PDFs and billing staff manually match them to jobs. With Relo OS, the vendor mobile app close-out triggers auto-matching. Emma reconciles the job record, generates an invoice to the moving company client, and tracks payment status — all without staff touching it.{' '}
            <span style={{ color: '#ADFF47' }}>Target: eliminate 4–6 hrs/week of manual invoice reconciliation.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
