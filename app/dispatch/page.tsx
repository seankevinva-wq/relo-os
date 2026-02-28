'use client'

import { useState, useEffect } from 'react'
import { JOBS, VENDORS, DISPATCH_MATCHES, DISPATCH_RULES, getJob, getVendor, type Job } from '@/lib/mock-data'
import { StatusBadge } from '@/components/status-badge'
import { fmtDate } from '@/lib/utils'
import { Zap, CheckCircle, ChevronDown, ChevronUp, Star, MapPin, Shield, Clock } from 'lucide-react'
import { toast } from 'sonner'

const DISPATCH_JOB_IDS = ['RSG-2851', 'RSG-2856', 'RSG-2863']

function ScoreCounter({ target, active }: { target: number; active: boolean }) {
  const [score, setScore] = useState(0)
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!active) { setScore(0); return }
    if (prefersReducedMotion) { setScore(target); return }
    const duration = 1200
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setScore(Math.round(eased * target))
      if (progress >= 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [target, active, prefersReducedMotion])

  return (
    <span
      className="text-5xl font-black"
      style={{
        color: score > 85 ? '#ADFF47' : score > 65 ? '#fbbf24' : '#f87171',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {score}
    </span>
  )
}

function VendorCard({ vendorId, matchScore, distanceMi, reasoning, isRecommended, isDispatched }: {
  vendorId: string
  matchScore: number
  distanceMi: number
  reasoning: string[]
  isRecommended: boolean
  isDispatched: boolean
}) {
  const vendor = getVendor(vendorId)
  if (!vendor) return null

  return (
    <div
      className="rounded-2xl p-4 transition-all flex flex-col gap-3"
      style={{
        background: isRecommended ? 'rgba(173,255,71,0.06)' : 'rgba(255,255,255,0.04)',
        border: isRecommended ? '2px solid rgba(173,255,71,0.4)' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: isRecommended ? '0 0 30px rgba(173,255,71,0.1)' : 'none',
      }}
    >
      {isRecommended && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wide uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(173,255,71,0.15)', color: '#ADFF47' }}>
            AI Recommendation
          </span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Match Score</span>
        </div>
      )}
      {isRecommended && (
        <div className="flex items-end gap-2">
          <ScoreCounter target={matchScore} active={true} />
          <span className="text-xl font-bold mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>/100</span>
        </div>
      )}

      <div>
        <div className="font-semibold text-white text-sm">{vendor.name}</div>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <MapPin size={10} /> {distanceMi} mi
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Star size={10} style={{ fill: '#fbbf24', color: '#fbbf24' }} /> {vendor.qaScore}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <Clock size={10} /> {vendor.totalJobs} jobs
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{
              background: vendor.availabilityStatus === 'available' ? 'rgba(173,255,71,0.1)' : 'rgba(251,191,36,0.1)',
              color: vendor.availabilityStatus === 'available' ? '#ADFF47' : '#fbbf24',
            }}
          >
            {vendor.availabilityStatus === 'available' ? '● Available' : '● Busy'}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
            Tier {vendor.tier}
          </span>
        </div>
      </div>

      {!isRecommended && (
        <div className="flex items-center gap-2">
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full" style={{ width: `${matchScore}%`, background: matchScore > 75 ? '#ADFF47' : '#fbbf24' }} />
          </div>
          <span className="text-xs font-bold shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }}>{matchScore}</span>
        </div>
      )}

      {isRecommended && (
        <div>
          <div className="text-xs font-semibold mb-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Why this vendor:</div>
          <div className="space-y-1">
            {reasoning.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-white">
                <CheckCircle size={10} style={{ color: '#ADFF47', flexShrink: 0 }} />
                {r}
              </div>
            ))}
          </div>
        </div>
      )}

      {vendor.certifications.length > 0 && isRecommended && (
        <div className="flex flex-wrap gap-1.5">
          {vendor.certifications.map(cert => (
            <span key={cert} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
              <Shield size={9} /> {cert}
            </span>
          ))}
        </div>
      )}

      {isDispatched && isRecommended && (
        <div className="text-center py-2 rounded-xl text-sm font-semibold" style={{ background: 'rgba(173,255,71,0.1)', color: '#ADFF47', border: '1px solid rgba(173,255,71,0.3)' }}>
          ✓ Dispatched
        </div>
      )}
    </div>
  )
}

export default function DispatchPage() {
  const [selectedJobId, setSelectedJobId] = useState(DISPATCH_JOB_IDS[0])
  const [rulesOpen, setRulesOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [dispatched, setDispatched] = useState<Set<string>>(new Set())

  const job = getJob(selectedJobId)
  const matches = DISPATCH_MATCHES[selectedJobId] || []
  const recommendedMatch = matches[0]
  const recommendedVendor = recommendedMatch ? getVendor(recommendedMatch.vendorId) : null

  const handleDispatch = () => {
    if (!job || !recommendedVendor) return
    setDispatched(prev => new Set(prev).add(selectedJobId))
    toast.success(`Dispatching ${recommendedVendor.name} to ${job.homeowner}...`, {
      description: `${job.serviceType} · ${job.city}, ${job.state} · ${fmtDate(job.scheduledDate)}`,
      duration: 5000,
    })
  }

  const isDispatched = dispatched.has(selectedJobId)

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Auto-Dispatch</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          AI-powered vendor matching · {DISPATCH_JOB_IDS.length} jobs awaiting dispatch
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left panel — job selector */}
        <div className="space-y-3">
          <div className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Pending Dispatch
          </div>
          {DISPATCH_JOB_IDS.map(jobId => {
            const j = getJob(jobId)
            if (!j) return null
            const isSelected = selectedJobId === jobId
            const isDone = dispatched.has(jobId)
            return (
              <button
                key={jobId}
                onClick={() => setSelectedJobId(jobId)}
                className="w-full text-left p-4 rounded-2xl transition-all"
                style={isSelected ? {
                  background: 'rgba(173,255,71,0.08)',
                  border: '2px solid rgba(173,255,71,0.3)',
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold" style={{ color: isSelected ? '#ADFF47' : 'rgba(255,255,255,0.5)' }}>{j.id}</span>
                  {isDone ? (
                    <span className="text-xs" style={{ color: '#ADFF47' }}>✓ Done</span>
                  ) : (
                    <StatusBadge status={j.status} />
                  )}
                </div>
                <div className="text-sm font-medium text-white">{j.homeowner}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{j.serviceType}</div>
                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{j.city}, {j.state} · {fmtDate(j.scheduledDate)}</div>
              </button>
            )
          })}
        </div>

        {/* Main panel */}
        <div className="lg:col-span-3 space-y-5">
          {job && (
            <>
              {/* Job header */}
              <div className="glass rounded-2xl p-4 flex items-center gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-sm font-bold" style={{ color: '#ADFF47' }}>{job.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}>{job.serviceType}</span>
                    <StatusBadge status={job.status} />
                  </div>
                  <div className="text-base font-semibold text-white">{job.homeowner}</div>
                  <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{job.city}, {job.state} · {fmtDate(job.scheduledDate)}</div>
                </div>
                <button
                  onClick={handleDispatch}
                  disabled={isDispatched}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60"
                  style={isDispatched ? {
                    background: 'rgba(173,255,71,0.1)',
                    border: '1px solid rgba(173,255,71,0.3)',
                    color: '#ADFF47',
                    cursor: 'default',
                  } : {
                    background: '#ADFF47',
                    color: '#0A0A0A',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(173,255,71,0.3)',
                  }}
                >
                  {isDispatched ? (
                    <><CheckCircle size={14} /> Dispatched</>
                  ) : (
                    <><Zap size={14} /> Dispatch to {recommendedVendor?.name.split(' ').slice(0, 2).join(' ')}</>
                  )}
                </button>
              </div>

              {/* Vendor cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {matches.map((match, idx) => (
                  <VendorCard
                    key={match.vendorId + idx}
                    vendorId={idx === 0 ? match.vendorId : VENDORS[idx + 1]?.id || match.vendorId}
                    matchScore={match.matchScore}
                    distanceMi={match.distanceMi}
                    reasoning={match.reasoning}
                    isRecommended={idx === 0}
                    isDispatched={isDispatched && idx === 0}
                  />
                ))}
              </div>

              {/* Rules explainer */}
              <div className="glass rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4"
                  onClick={() => setRulesOpen(!rulesOpen)}
                >
                  <div className="flex items-center gap-2">
                    <Shield size={14} style={{ color: '#ADFF47' }} />
                    <span className="text-sm font-semibold text-white">Dispatch Rules</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(173,255,71,0.1)', color: '#ADFF47' }}>{DISPATCH_RULES.length} rules active</span>
                  </div>
                  {rulesOpen ? <ChevronUp size={14} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />}
                </button>
                {rulesOpen && (
                  <div className="px-5 pb-5 space-y-3">
                    {DISPATCH_RULES.map((rule, idx) => (
                      <div key={idx} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(173,255,71,0.1)', color: '#ADFF47' }}>
                            {idx + 1}
                          </span>
                          <span className="text-sm font-semibold text-white">{rule.label}</span>
                        </div>
                        <p className="text-xs ml-7" style={{ color: 'rgba(255,255,255,0.5)' }}>{rule.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dispatch history */}
              <div className="glass rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-5 py-4"
                  onClick={() => setHistoryOpen(!historyOpen)}
                >
                  <div className="flex items-center gap-2">
                    <Clock size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
                    <span className="text-sm font-semibold text-white">Recent Dispatches in this Market</span>
                  </div>
                  {historyOpen ? <ChevronUp size={14} style={{ color: 'rgba(255,255,255,0.4)' }} /> : <ChevronDown size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />}
                </button>
                {historyOpen && (
                  <div className="px-5 pb-5">
                    <div className="space-y-2">
                      {[
                        { id: 'RSG-2848', vendor: 'Rocky Mountain Services', score: 91, date: 'Feb 23' },
                        { id: 'RSG-2840', vendor: 'Rocky Mountain Services', score: 88, date: 'Feb 18' },
                        { id: 'RSG-2831', vendor: 'Northeast Specialty Movers', score: 76, date: 'Feb 12' },
                        { id: 'RSG-2822', vendor: 'Rocky Mountain Services', score: 93, date: 'Feb 5' },
                        { id: 'RSG-2814', vendor: 'AllState Specialty Co.', score: 58, date: 'Jan 29' },
                      ].map(h => (
                        <div key={h.id} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                          <span className="font-mono text-xs" style={{ color: '#ADFF47', minWidth: 90 }}>{h.id}</span>
                          <span className="text-sm text-white flex-1">{h.vendor}</span>
                          <span className="text-xs" style={{ color: h.score > 80 ? '#ADFF47' : '#fbbf24' }}>Score: {h.score}</span>
                          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{h.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
