'use client'

import { useState } from 'react'
import Link from 'next/link'
import { JOBS, getJobVendor, STATUS_LABELS, type JobStatus } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { fmtDate } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

type Filter = 'all' | 'attention' | 'missing_info' | 'dispatch' | 'today'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All Jobs' },
  { id: 'attention', label: 'Needs Attention' },
  { id: 'missing_info', label: 'Missing Info' },
  { id: 'dispatch', label: 'Pending Dispatch' },
  { id: 'today', label: 'Active Today' },
]

function filterJobs(filter: Filter) {
  switch (filter) {
    case 'attention': return JOBS.filter(j => ['at_risk', 'pending_info', 'needs_dispatch'].includes(j.status))
    case 'missing_info': return JOBS.filter(j => j.infoItems.some(i => !i.collected))
    case 'dispatch': return JOBS.filter(j => j.status === 'needs_dispatch')
    case 'today': return JOBS.filter(j => j.status === 'active' || j.status === 'window_confirmed')
    default: return JOBS
  }
}

export default function JobsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const jobs = filterJobs(activeFilter)

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Job Queue</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{JOBS.length} total jobs · {JOBS.filter(j=>j.status!=='complete').length} active</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
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
            <span className="ml-2 text-xs opacity-70">{filterJobs(f.id).length}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Job ID', 'Homeowner', 'Service', 'Location', 'Vendor', 'Status', 'Info Collected', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => {
              const vendor = getJobVendor(job)
              const collected = job.infoItems.filter(i => i.collected).length
              const total = job.infoItems.length
              const pct = total > 0 ? Math.round((collected / total) * 100) : 100
              const isAtRisk = job.status === 'at_risk'

              return (
                <tr
                  key={job.id}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    background: isAtRisk ? 'rgba(251,191,36,0.03)' : 'transparent',
                  }}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold" style={{ color: '#ADFF47' }}>{job.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{job.homeowner}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{fmtDate(job.scheduledDate)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-white">{job.serviceType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>{job.city}, {job.state}</span>
                  </td>
                  <td className="px-4 py-3">
                    {vendor ? (
                      <span className="text-white">{vendor.name}</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(96,165,250,0.1)', color: '#60a5fa' }}>Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: pct === 100 ? '#ADFF47' : pct > 60 ? '#fbbf24' : '#f87171',
                          }}
                        />
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
