'use client'

import { use, useState } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getJob, getJobVendor, type Job, type InfoItem } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { fmtDate } from '@/lib/utils'
import { ChevronLeft, CheckCircle2, Clock, AlertCircle, MessageSquare, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react'

const STAGES = [
  { key: 'received', label: 'Request Received', description: 'Job created in system' },
  { key: 'collection', label: 'Info Collection', description: 'AI gathering homeowner details' },
  { key: 'dispatched', label: 'Vendor Dispatched', description: 'Crew assigned & confirmed' },
  { key: 'window', label: 'Window Confirmed', description: 'Homeowner confirmed time window' },
  { key: 'complete', label: 'Job Complete', description: 'Service delivered' },
]

function getActiveStage(status: Job['status']): number {
  switch (status) {
    case 'pending_info': return 1
    case 'needs_dispatch': return 2
    case 'dispatched': return 2
    case 'window_confirmed': return 3
    case 'active': return 4
    case 'complete': return 4
    case 'at_risk': return 1
    default: return 0
  }
}

function ProgressStepper({ job }: { job: Job }) {
  const activeStage = getActiveStage(job.status)
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white mb-5">Progress</h3>
      <div className="space-y-1">
        {STAGES.map((stage, idx) => {
          const done = idx < activeStage
          const current = idx === activeStage
          const pending = idx > activeStage
          return (
            <div key={stage.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{
                    background: done ? 'rgba(173,255,71,0.15)' : current ? 'rgba(173,255,71,0.1)' : 'rgba(255,255,255,0.05)',
                    border: done ? '2px solid rgba(173,255,71,0.5)' : current ? '2px solid rgba(173,255,71,0.3)' : '2px solid rgba(255,255,255,0.1)',
                    color: done ? '#ADFF47' : current ? 'rgba(173,255,71,0.7)' : 'rgba(255,255,255,0.3)',
                  }}
                >
                  {done ? <CheckCircle2 size={14} /> : idx + 1}
                </div>
                {idx < STAGES.length - 1 && (
                  <div className="w-0.5 h-8 mt-1" style={{ background: done ? 'rgba(173,255,71,0.3)' : 'rgba(255,255,255,0.08)' }} />
                )}
              </div>
              <div className="pb-4 flex-1">
                <div className="text-sm font-medium" style={{ color: done ? 'white' : current ? 'white' : 'rgba(255,255,255,0.4)' }}>
                  {stage.label}
                </div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{stage.description}</div>
                {done && idx === 0 && (
                  <div className="text-xs mt-0.5" style={{ color: '#ADFF47' }}>✓ {fmtDate(job.createdAt)}</div>
                )}
                {current && job.status === 'pending_info' && (
                  <div className="text-xs mt-0.5" style={{ color: '#fbbf24' }}>AI chasing 2 items</div>
                )}
                {done && idx === 2 && job.techName && (
                  <div className="text-xs mt-0.5" style={{ color: '#ADFF47' }}>✓ {job.techName} assigned</div>
                )}
                {done && idx === 3 && job.windowConfirmed && (
                  <div className="text-xs mt-0.5" style={{ color: '#ADFF47' }}>✓ {job.windowConfirmed}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function InfoChecklist({ items }: { items: InfoItem[] }) {
  const groups = items.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {} as Record<string, InfoItem[]>)

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Info Checklist</h3>
      <div className="space-y-4">
        {Object.entries(groups).map(([group, groupItems]) => (
          <div key={group}>
            <div className="text-xs font-semibold tracking-wider uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {group}
            </div>
            <div className="space-y-2">
              {groupItems.map(item => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl"
                  style={{
                    background: item.collected ? 'rgba(173,255,71,0.05)' : 'rgba(251,191,36,0.05)',
                    border: `1px solid ${item.collected ? 'rgba(173,255,71,0.15)' : 'rgba(251,191,36,0.2)'}`,
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 shrink-0">
                      {item.collected ? (
                        <CheckCircle2 size={14} style={{ color: '#ADFF47' }} />
                      ) : (
                        <AlertCircle size={14} style={{ color: '#fbbf24' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white">{item.label}</div>
                      {item.collected && item.value && (
                        <div className="text-xs mt-0.5 font-medium" style={{ color: '#ADFF47' }}>{item.value}</div>
                      )}
                      {!item.collected && item.reminderCount && (
                        <div className="text-xs mt-0.5" style={{ color: '#fbbf24' }}>
                          AI sent {item.reminderCount} reminder{item.reminderCount !== 1 ? 's' : ''} · last {item.lastReminderHrsAgo}h ago
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConversationLog({ job, homeownerView }: { job: Job; homeownerView: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const messages = expanded ? job.messages : job.messages.slice(-4)

  return (
    <div className="glass rounded-2xl p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
        <h3 className="text-sm font-semibold text-white">AI Conversation Log</h3>
        <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
          Emma · SMS
        </span>
      </div>

      {job.messages.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs mb-3 flex items-center gap-1"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          {expanded ? <><ChevronUp size={12}/> Show less</> : <><ChevronDown size={12}/> Show {job.messages.length - 4} earlier messages</>}
        </button>
      )}

      <div className="space-y-3 flex-1 overflow-y-auto" style={{ maxHeight: '420px' }}>
        {messages.map(msg => {
          const isEmma = msg.sender === 'emma'
          return (
            <div key={msg.id} className={`flex ${isEmma ? 'justify-end' : 'justify-start'}`}>
              <div
                className="max-w-[85%] px-3 py-2 rounded-2xl text-sm"
                style={isEmma ? {
                  background: msg.isAfterHours ? 'rgba(251,191,36,0.12)' : 'rgba(173,255,71,0.1)',
                  border: msg.isAfterHours ? '1px solid rgba(251,191,36,0.25)' : '1px solid rgba(173,255,71,0.2)',
                  color: 'white',
                  borderBottomRightRadius: '4px',
                } : {
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  borderBottomLeftRadius: '4px',
                }}
              >
                <div className="text-xs mb-1 flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {isEmma ? (
                    <span style={{ color: msg.isAfterHours ? '#fbbf24' : '#ADFF47' }}>Emma AI</span>
                  ) : (
                    <span>{job.homeowner}</span>
                  )}
                  {msg.isAfterHours && !homeownerView && (
                    <span className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>
                      After Hours
                    </span>
                  )}
                  <span className="ml-auto">
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                  </span>
                </div>
                {msg.text}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function HomeownerView({ job }: { job: Job }) {
  const activeStage = getActiveStage(job.status)
  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-6" style={{ borderColor: 'rgba(173,255,71,0.2)' }}>
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(173,255,71,0.1)', border: '2px solid rgba(173,255,71,0.3)' }}>
            <CheckCircle2 size={24} style={{ color: '#ADFF47' }} />
          </div>
          <h2 className="text-lg font-bold text-white">Your Job is Confirmed</h2>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Job #{job.id} · {job.serviceType}</p>
        </div>

        {job.windowConfirmed ? (
          <div className="p-4 rounded-xl text-center mb-4" style={{ background: 'rgba(173,255,71,0.08)', border: '1px solid rgba(173,255,71,0.2)' }}>
            <div className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Your tech arrives</div>
            <div className="text-2xl font-bold" style={{ color: '#ADFF47' }}>{job.windowConfirmed}</div>
            <div className="text-sm mt-1 text-white">{fmtDate(job.scheduledDate)}</div>
          </div>
        ) : (
          <div className="p-4 rounded-xl text-center mb-4" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <div className="text-xs font-semibold tracking-wide uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Scheduled date</div>
            <div className="text-xl font-bold" style={{ color: '#fbbf24' }}>{fmtDate(job.scheduledDate)}</div>
            <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Time window being confirmed</div>
          </div>
        )}

        <div className="space-y-2">
          {STAGES.map((stage, idx) => {
            const done = idx <= activeStage
            return (
              <div key={stage.key} className="flex items-center gap-3 p-2">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{
                  background: done ? 'rgba(173,255,71,0.15)' : 'rgba(255,255,255,0.05)',
                }}>
                  {done ? <CheckCircle2 size={12} style={{ color: '#ADFF47' }} /> : <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />}
                </div>
                <span className="text-sm" style={{ color: done ? 'white' : 'rgba(255,255,255,0.35)' }}>{stage.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {job.techName && (
        <div className="glass rounded-2xl p-4">
          <div className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Your technician</div>
          <div className="text-white font-medium">{job.techName}</div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Will text you 30 minutes before arrival</div>
        </div>
      )}

      <div className="glass rounded-2xl p-4">
        <div className="text-xs font-semibold tracking-wide uppercase mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Service address</div>
        <div className="text-white text-sm">{job.address}</div>
        <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{job.city}, {job.state}</div>
      </div>

      <div className="text-center text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
        Questions? Text us at (603) 555-0100 · Powered by Relo Solutions Group
      </div>
    </div>
  )
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const job = getJob(id)
  const [homeownerView, setHomeownerView] = useState(false)

  if (!job) return notFound()

  const vendor = getJobVendor(job)
  const collected = job.infoItems.filter(i => i.collected).length
  const total = job.infoItems.length

  return (
    <div className="space-y-5 max-w-7xl">
      {/* Back link */}
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
        <ChevronLeft size={16} /> Back to Jobs
      </Link>

      {/* Header */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="font-mono text-lg font-bold" style={{ color: '#ADFF47' }}>{job.id}</span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}>
                {job.serviceType}
              </span>
              <StatusBadge status={job.status} />
            </div>
            <h1 className="text-xl font-bold text-white">{job.homeowner}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {job.address} · {job.city}, {job.state} · {fmtDate(job.scheduledDate)}
            </p>
            {vendor && (
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Vendor: <span className="text-white">{vendor.name}</span>
                {job.techName && <> · Tech: <span className="text-white">{job.techName}</span></>}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Info collected</div>
              <div className="text-lg font-bold" style={{ color: collected === total ? '#ADFF47' : '#fbbf24' }}>{collected}/{total}</div>
            </div>
            <button
              onClick={() => setHomeownerView(!homeownerView)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={homeownerView ? {
                background: 'rgba(173,255,71,0.1)',
                border: '1px solid rgba(173,255,71,0.3)',
                color: '#ADFF47',
              } : {
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              {homeownerView ? <EyeOff size={14} /> : <Eye size={14} />}
              {homeownerView ? 'Internal View' : 'Homeowner View'}
            </button>
          </div>
        </div>
      </div>

      {homeownerView ? (
        <div className="max-w-md mx-auto">
          <div className="text-center mb-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(173,255,71,0.1)', border: '1px solid rgba(173,255,71,0.2)', color: '#ADFF47' }}>
              👁 Homeowner Portal View
            </span>
          </div>
          <HomeownerView job={job} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <ProgressStepper job={job} />
          <InfoChecklist items={job.infoItems} />
          <ConversationLog job={job} homeownerView={homeownerView} />
        </div>
      )}
    </div>
  )
}
