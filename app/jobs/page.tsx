'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { JOBS, getJobVendor } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { fmtDate } from '@/lib/utils'
import { ChevronRight, Wifi, WifiOff } from 'lucide-react'

// RSG API job shape
interface RSGJob {
  id: number
  orderNumber: string
  transfereeName: string
  phone: string
  moveDate: string | null
  serviceType: string
  origin: string
  destination: string
  emmaStatus: 'pending' | 'awaiting_response' | 'info_complete' | 'confirmed' | 'flagged'
  fields: Record<string, boolean>
  fieldsComplete: number
  fieldsTotal: number
  lastContact: string | null
}

function emmaStatusToDisplay(s: string): string {
  return {
    pending: 'Pending',
    awaiting_response: 'Awaiting Reply',
    info_complete: 'Ready for Dispatch',
    confirmed: 'Confirmed',
    flagged: 'Flagged',
  }[s] ?? s
}

function emmaStatusColor(s: string): string {
  return {
    pending: '#60a5fa',
    awaiting_response: '#fbbf24',
    info_complete: '#ADFF47',
    confirmed: '#ADFF47',
    flagged: '#f87171',
  }[s] ?? 'rgba(255,255,255,0.5)'
}

function cityFromOrigin(origin: string): string {
  // "Manchester, NH 03101" → "Manchester, NH"
  const parts = origin.split(',')
  if (parts.length >= 2) return `${parts[0].trim()}, ${parts[1].trim().split(' ')[0]}`
  return origin
}

type Filter = 'all' | 'attention' | 'missing_info' | 'ready' | 'confirmed'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All Jobs' },
  { id: 'attention', label: 'Needs Attention' },
  { id: 'missing_info', label: 'Missing Info' },
  { id: 'ready', label: 'Ready for Dispatch' },
  { id: 'confirmed', label: 'Confirmed' },
]

function filterRSG(jobs: RSGJob[], filter: Filter): RSGJob[] {
  switch (filter) {
    case 'attention': return jobs.filter(j => ['pending', 'awaiting_response', 'flagged'].includes(j.emmaStatus))
    case 'missing_info': return jobs.filter(j => j.fieldsComplete < j.fieldsTotal)
    case 'ready': return jobs.filter(j => j.emmaStatus === 'info_complete')
    case 'confirmed': return jobs.filter(j => j.emmaStatus === 'confirmed')
    default: return jobs
  }
}

export default function JobsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [liveJobs, setLiveJobs] = useState<RSGJob[] | null>(null)
  const [isLive, setIsLive] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/jobs/warm-handoff?perPage=50')
      .then(r => r.json())
      .then(data => {
        if (data?.data?.length > 0) {
          setLiveJobs(data.data)
          setIsLive(true)
        }
      })
      .catch(() => {})
  }, [])

  if (isLive && liveJobs) {
    const filtered = filterRSG(liveJobs, activeFilter)
    return (
      <div className="space-y-6 max-w-7xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Job Queue</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {liveJobs.length} total jobs · {liveJobs.filter(j => j.emmaStatus !== 'confirmed').length} active
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
            style={{ background: 'rgba(173,255,71,0.08)', border: '1px solid rgba(173,255,71,0.2)', color: '#ADFF47' }}>
            <Wifi size={11} />
            Live data
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
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
              <span className="ml-2 text-xs opacity-70">{filterRSG(liveJobs, f.id).length}</span>
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Job ID', 'Homeowner', 'Service', 'Location', 'Emma Status', 'Info Collected', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>No jobs match this filter</td></tr>
              )}
              {filtered.map(job => {
                const pct = job.fieldsTotal > 0 ? Math.round((job.fieldsComplete / job.fieldsTotal) * 100) : 100
                const isFlagged = job.emmaStatus === 'flagged'
                return (
                  <tr
                    key={job.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: isFlagged ? 'rgba(248,113,113,0.03)' : 'transparent',
                      cursor: 'default',
                    }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold" style={{ color: '#ADFF47' }}>{job.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{job.transfereeName || '—'}</div>
                      {job.moveDate && <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{fmtDate(job.moveDate)}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white">{job.serviceType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: 'rgba(255,255,255,0.6)' }}>{cityFromOrigin(job.origin)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-lg font-medium"
                        style={{ background: `${emmaStatusColor(job.emmaStatus)}18`, color: emmaStatusColor(job.emmaStatus) }}>
                        {emmaStatusToDisplay(job.emmaStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2" title={`${job.fieldsComplete} of ${job.fieldsTotal} info fields collected`}>
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          <div className="h-full rounded-full transition-all" style={{
                            width: `${pct}%`,
                            background: pct === 100 ? '#ADFF47' : pct > 60 ? '#fbbf24' : '#f87171',
                          }} />
                        </div>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{job.fieldsComplete}/{job.fieldsTotal}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ border: '1px solid rgba(255,255,255,0.08)', opacity: 0.3 }}>
                        <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Fallback: mock data
  const mockFiltered = (() => {
    switch (activeFilter) {
      case 'attention': return JOBS.filter(j => ['at_risk', 'pending_info', 'needs_dispatch'].includes(j.status))
      case 'missing_info': return JOBS.filter(j => j.infoItems.some(i => !i.collected))
      case 'ready': return JOBS.filter(j => j.status === 'needs_dispatch')
      case 'confirmed': return JOBS.filter(j => j.status === 'window_confirmed')
      default: return JOBS
    }
  })()

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Job Queue</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{JOBS.length} total jobs · {JOBS.filter(j => j.status !== 'complete').length} active</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
          <WifiOff size={11} />
          Demo data
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
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
            <span className="ml-2 text-xs opacity-70">{mockFiltered.length}</span>
          </button>
        ))}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Job ID', 'Homeowner', 'Service', 'Location', 'Vendor', 'Status', 'Info Collected', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockFiltered.map(job => {
              const vendor = getJobVendor(job)
              const collected = job.infoItems.filter(i => i.collected).length
              const total = job.infoItems.length
              const pct = total > 0 ? Math.round((collected / total) * 100) : 100
              const isAtRisk = job.status === 'at_risk'
              return (
                <tr key={job.id} onClick={() => router.push(`/jobs/${job.id}`)}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: isAtRisk ? 'rgba(251,191,36,0.03)' : 'transparent', cursor: 'pointer' }}>
                  <td className="px-4 py-3"><span className="font-mono text-xs font-bold" style={{ color: '#ADFF47' }}>{job.id}</span></td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{job.homeowner}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{fmtDate(job.scheduledDate)}</div>
                  </td>
                  <td className="px-4 py-3"><span className="text-white">{job.serviceType}</span></td>
                  <td className="px-4 py-3"><span style={{ color: 'rgba(255,255,255,0.6)' }}>{job.city}, {job.state}</span></td>
                  <td className="px-4 py-3">
                    {vendor ? <span className="text-white">{vendor.name}</span>
                      : <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>Unassigned</span>}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={job.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? '#ADFF47' : pct > 60 ? '#fbbf24' : '#f87171' }} />
                      </div>
                      <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{collected}/{total}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/jobs/${job.id}`} className="flex items-center justify-center w-7 h-7 rounded-lg glass-hover" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                      <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
