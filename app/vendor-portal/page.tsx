'use client'

import { useState } from 'react'
import { VENDOR_PORTAL_JOBS, type VendorPortalJob } from '@/lib/mock-data'
import { User, CheckCircle, ChevronRight, Upload, MapPin, Calendar, Clock, DollarSign, Star, X } from 'lucide-react'

type VendorJobStatus = VendorPortalJob['status']

const STATUS_CONFIG: Record<VendorJobStatus, { label: string; color: string; bg: string; border: string; next?: string }> = {
  assigned:          { label: 'Assigned',         color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.3)',  next: 'Accept Job'           },
  accepted:          { label: 'Accepted',          color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.3)',  next: 'Set Service Window'   },
  window_set:        { label: 'Window Set',        color: '#ADFF47', bg: 'rgba(173,255,71,0.12)',  border: 'rgba(173,255,71,0.3)',  next: 'Report On-Site'       },
  on_site:           { label: 'On Site',           color: '#ADFF47', bg: 'rgba(173,255,71,0.15)',  border: 'rgba(173,255,71,0.4)',  next: 'Close Out Job'        },
  complete:          { label: 'Complete',          color: '#ADFF47', bg: 'rgba(173,255,71,0.08)',  border: 'rgba(173,255,71,0.2)',  next: 'Upload Paperwork'     },
  paperwork_uploaded:{ label: 'Paperwork Uploaded',color: '#ADFF47', bg: 'rgba(173,255,71,0.08)',  border: 'rgba(173,255,71,0.2)'                                },
}

const STATUS_ORDER: VendorJobStatus[] = ['assigned', 'accepted', 'window_set', 'on_site', 'complete', 'paperwork_uploaded']

function VendorStatusBadge({ status }: { status: VendorJobStatus }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  )
}

function WindowModal({ onConfirm, onClose }: { onConfirm: (window: string) => void; onClose: () => void }) {
  const [selected, setSelected] = useState('')
  const windows = ['7:00 AM – 10:00 AM', '9:00 AM – 12:00 PM', '10:00 AM – 1:00 PM', '12:00 PM – 3:00 PM', '2:00 PM – 5:00 PM', '3:00 PM – 6:00 PM']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" style={{ backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div className="relative rounded-2xl p-6 w-full max-w-sm" style={{ background: 'rgba(15,15,20,0.98)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Set Service Window</h3>
          <button onClick={onClose} style={{ color: 'rgba(255,255,255,0.4)' }}><X size={16} /></button>
        </div>
        <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Select your 3-hour arrival window for this job. The homeowner will be notified automatically.</p>
        <div className="space-y-2 mb-4">
          {windows.map(w => (
            <button
              key={w}
              onClick={() => setSelected(w)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all"
              style={selected === w ? {
                background: 'rgba(173,255,71,0.12)',
                border: '1px solid rgba(173,255,71,0.3)',
                color: '#ADFF47',
              } : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {w}
            </button>
          ))}
        </div>
        <button
          onClick={() => selected && onConfirm(selected)}
          disabled={!selected}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={selected ? {
            background: '#ADFF47',
            color: '#0a0a0f',
          } : {
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.3)',
            cursor: 'not-allowed',
          }}
        >
          Confirm Window
        </button>
      </div>
    </div>
  )
}

function JobCard({
  job,
  onAction,
  onSelect,
}: {
  job: VendorPortalJob
  onAction: (jobId: string, action: string) => void
  onSelect: (job: VendorPortalJob) => void
}) {
  const cfg = STATUS_CONFIG[job.status]
  const nextAction = cfg.next

  return (
    <div
      className="rounded-2xl p-5 cursor-pointer transition-all"
      style={{
        background: job.status === 'on_site' ? 'rgba(173,255,71,0.05)' : 'rgba(255,255,255,0.03)',
        border: job.status === 'on_site' ? '1px solid rgba(173,255,71,0.2)' : '1px solid rgba(255,255,255,0.08)',
      }}
      onClick={() => onSelect(job)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono text-xs font-bold" style={{ color: '#ADFF47' }}>{job.jobId}</div>
          <div className="text-base font-semibold text-white mt-0.5">{job.homeowner}</div>
          {job.status === 'on_site' && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#ADFF47] animate-pulse" />
              <span className="text-xs font-medium" style={{ color: '#ADFF47' }}>Currently on-site</span>
            </div>
          )}
        </div>
        <VendorStatusBadge status={job.status} />
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <MapPin size={12} className="shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span className="truncate">{job.homeownerAddress}</span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <Calendar size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span>{new Date(job.scheduledDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          {job.serviceWindow && (
            <>
              <Clock size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
              <span>{job.serviceWindow}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <DollarSign size={12} style={{ color: 'rgba(255,255,255,0.3)' }} />
          <span>${job.earnings} earnings</span>
        </div>
      </div>

      {nextAction && (
        <button
          onClick={e => { e.stopPropagation(); onAction(job.id, nextAction) }}
          className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: nextAction === 'Report On-Site' || nextAction === 'Close Out Job'
              ? 'rgba(173,255,71,0.15)'
              : 'rgba(255,255,255,0.07)',
            border: nextAction === 'Report On-Site' || nextAction === 'Close Out Job'
              ? '1px solid rgba(173,255,71,0.3)'
              : '1px solid rgba(255,255,255,0.1)',
            color: nextAction === 'Report On-Site' || nextAction === 'Close Out Job'
              ? '#ADFF47'
              : 'rgba(255,255,255,0.7)',
          }}
        >
          {nextAction === 'Upload Paperwork' && <Upload size={14} className="inline mr-2" />}
          {nextAction === 'Close Out Job' && <CheckCircle size={14} className="inline mr-2" />}
          {nextAction}
        </button>
      )}
    </div>
  )
}

function JobDetailDrawer({ job, onClose, onAction }: { job: VendorPortalJob; onClose: () => void; onAction: (jobId: string, action: string) => void }) {
  const cfg = STATUS_CONFIG[job.status]

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
            <div className="font-mono text-sm font-bold" style={{ color: '#ADFF47' }}>{job.jobId}</div>
            <div className="text-lg font-bold text-white mt-0.5">{job.homeowner}</div>
            <VendorStatusBadge status={job.status} />
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2">
          {[
            { icon: <MapPin size={14} />, label: 'Address', value: job.homeownerAddress },
            { icon: <Calendar size={14} />, label: 'Scheduled', value: new Date(job.scheduledDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) },
            { icon: <Clock size={14} />, label: 'Window', value: job.serviceWindow ?? 'Not yet set' },
            { icon: <DollarSign size={14} />, label: 'Earnings', value: `$${job.earnings}` },
            { icon: <User size={14} />, label: 'Moving Co.', value: job.movingCo },
          ].map(row => (
            <div key={row.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="mt-0.5 shrink-0" style={{ color: 'rgba(255,255,255,0.35)' }}>{row.icon}</span>
              <div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{row.label}</div>
                <div className="text-sm font-medium text-white">{row.value}</div>
              </div>
            </div>
          ))}
        </div>

        {job.specialNotes && (
          <div className="p-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: '#fbbf24' }}>Special Notes</div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{job.specialNotes}</p>
          </div>
        )}

        <div>
          <div className="text-xs font-semibold tracking-wide uppercase mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>Close-Out Checklist</div>
          <div className="space-y-2">
            {job.closeOutItems.map((item, idx) => {
              const done = item.includes('✓') || ['paperwork_uploaded', 'complete'].includes(job.status) && idx < STATUS_ORDER.indexOf(job.status)
              return (
                <div key={idx} className="flex items-center gap-2.5 text-sm">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: done ? 'rgba(173,255,71,0.15)' : 'rgba(255,255,255,0.06)',
                      border: done ? '1px solid rgba(173,255,71,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    {done && <CheckCircle size={12} style={{ color: '#ADFF47' }} />}
                  </div>
                  <span style={{ color: done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)', textDecoration: done ? 'line-through' : 'none' }}>
                    {item}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {cfg.next && (
          <button
            onClick={() => { onAction(job.id, cfg.next!); onClose() }}
            className="mt-auto w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: '#ADFF47', color: '#0a0a0f' }}
          >
            {cfg.next}
          </button>
        )}
      </div>
    </div>
  )
}

export default function VendorPortalPage() {
  const [jobs, setJobs] = useState(VENDOR_PORTAL_JOBS)
  const [windowJobId, setWindowJobId] = useState<string | null>(null)
  const [selectedJob, setSelectedJob] = useState<VendorPortalJob | null>(null)

  const advanceStatus = (jobId: string, action: string) => {
    if (action === 'Set Service Window') {
      setWindowJobId(jobId)
      return
    }
    setJobs(prev => prev.map(j => {
      if (j.id !== jobId) return j
      const idx = STATUS_ORDER.indexOf(j.status)
      const next = STATUS_ORDER[idx + 1] ?? j.status
      return { ...j, status: next }
    }))
  }

  const confirmWindow = (window: string) => {
    if (!windowJobId) return
    setJobs(prev => prev.map(j => j.id === windowJobId ? { ...j, status: 'window_set' as const, serviceWindow: window } : j))
    setWindowJobId(null)
  }

  // Refresh selected job when jobs state changes
  const currentSelected = selectedJob ? jobs.find(j => j.id === selectedJob.id) ?? null : null

  const todayJobs = jobs.filter(j => j.status === 'on_site' || j.status === 'window_set')
  const upcomingJobs = jobs.filter(j => ['assigned', 'accepted'].includes(j.status))
  const completedJobs = jobs.filter(j => ['complete', 'paperwork_uploaded'].includes(j.status))

  const totalEarningsThisMonth = jobs.reduce((s, j) => s + j.earnings, 0)
  const avgQAScore = 4.8

  return (
    <div className="space-y-6 max-w-5xl">
      {windowJobId && (
        <WindowModal
          onConfirm={confirmWindow}
          onClose={() => setWindowJobId(null)}
        />
      )}
      {currentSelected && (
        <JobDetailDrawer
          job={currentSelected}
          onClose={() => setSelectedJob(null)}
          onAction={(jobId, action) => { advanceStatus(jobId, action); setSelectedJob(null) }}
        />
      )}

      {/* Demo banner */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
        style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}
      >
        <User size={14} style={{ color: '#fbbf24' }} />
        <span className="text-xs font-medium" style={{ color: '#fbbf24' }}>
          Demo mode: Viewing as <strong>Gary's Moving Services</strong> (vendor portal simulation)
        </span>
        <span className="ml-auto text-xs" style={{ color: 'rgba(251,191,36,0.5)' }}>Vendor-facing view</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Jobs</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Gary's Moving Services · {jobs.filter(j => !['complete','paperwork_uploaded'].includes(j.status)).length} active jobs
          </p>
        </div>

        {/* Earnings + QA sidebar stats */}
        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-xl font-black" style={{ color: '#ADFF47' }}>${totalEarningsThisMonth.toLocaleString()}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Earnings this month</div>
          </div>
          <div className="w-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-xl font-black" style={{ color: '#fbbf24' }}>{avgQAScore}</span>
              <Star size={16} fill="#fbbf24" style={{ color: '#fbbf24' }} />
            </div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>QA Score</div>
          </div>
        </div>
      </div>

      {/* Today's Jobs */}
      {todayJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ADFF47] animate-pulse" />
            <h2 className="text-sm font-semibold text-white">Today / Active</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(173,255,71,0.1)', color: '#ADFF47' }}>{todayJobs.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {todayJobs.map(job => (
              <JobCard key={job.id} job={job} onAction={advanceStatus} onSelect={setSelectedJob} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Jobs */}
      {upcomingJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <h2 className="text-sm font-semibold text-white">Upcoming</h2>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>{upcomingJobs.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcomingJobs.map(job => (
              <JobCard key={job.id} job={job} onAction={advanceStatus} onSelect={setSelectedJob} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <h2 className="text-sm font-semibold text-white">Completed</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {completedJobs.map(job => (
              <JobCard key={job.id} job={job} onAction={advanceStatus} onSelect={setSelectedJob} />
            ))}
          </div>
        </div>
      )}

      {/* How it works callout */}
      <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(173,255,71,0.05)', border: '1px solid rgba(173,255,71,0.15)' }}>
        <ChevronRight size={16} style={{ color: '#ADFF47', marginTop: 2 }} />
        <div>
          <div className="text-sm font-semibold text-white mb-0.5">Vendor workflow: Accept → Window → On-Site → Close Out → Paperwork</div>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Each button advances the job state. Setting a service window auto-notifies the homeowner via Emma. Reporting on-site triggers a client notification. Close-out unlocks paperwork upload, which starts the billing and compliance flow.{' '}
            <span style={{ color: '#ADFF47' }}>This view shows the vendor's side. RSG sees the admin side in real-time.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
