'use client'

import { useState } from 'react'
import { QA_REVIEWS, VENDOR_QA_LEADERBOARD, type QAReview } from '@/lib/mock-data'
import { Star, X, CheckCircle, AlertTriangle, MessageSquare } from 'lucide-react'

function StarRating({ score, size = 14 }: { score: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          fill={i <= score ? '#fbbf24' : 'none'}
          style={{ color: i <= score ? '#fbbf24' : 'rgba(255,255,255,0.2)' }}
        />
      ))}
    </div>
  )
}

function ScoreDistribution() {
  const counts = [1, 2, 3, 4, 5].map(s => ({
    star: s,
    count: QA_REVIEWS.filter(r => r.score === s).length,
  }))
  const max = Math.max(...counts.map(c => c.count))

  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-sm font-semibold text-white mb-4">Score Distribution (30-day)</div>
      <div className="space-y-2">
        {counts.reverse().map(({ star, count }) => (
          <div key={star} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-12 shrink-0">
              <Star size={11} fill="#fbbf24" style={{ color: '#fbbf24' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{star}</span>
            </div>
            <div className="flex-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', height: 8 }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: max > 0 ? `${(count / max) * 100}%` : '0%',
                  background: star >= 4 ? '#ADFF47' : star === 3 ? '#fbbf24' : '#f87171',
                }}
              />
            </div>
            <span className="text-xs w-4 text-right" style={{ color: 'rgba(255,255,255,0.4)' }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewSequencePanel({ review }: { review: QAReview }) {
  return (
    <div className="space-y-3">
      {review.emmaSequence.map((step, idx) => (
        <div key={idx} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: step.step === 'Internal Alert'
                  ? 'rgba(251,191,36,0.15)'
                  : step.response
                    ? 'rgba(173,255,71,0.12)'
                    : 'rgba(255,255,255,0.06)',
                color: step.step === 'Internal Alert' ? '#fbbf24' : step.response ? '#ADFF47' : 'rgba(255,255,255,0.4)',
              }}
            >
              {step.step === 'Internal Alert' ? <AlertTriangle size={12} /> : <MessageSquare size={12} />}
            </div>
            {idx < review.emmaSequence.length - 1 && (
              <div className="w-0.5 flex-1 mt-1" style={{ background: 'rgba(255,255,255,0.08)', minHeight: 20 }} />
            )}
          </div>
          <div className="pb-3 flex-1">
            <div className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {step.step} · {new Date(step.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </div>
            <div className="text-xs p-2.5 rounded-lg" style={{
              background: step.step === 'Internal Alert' ? 'rgba(251,191,36,0.06)' : 'rgba(173,255,71,0.06)',
              border: `1px solid ${step.step === 'Internal Alert' ? 'rgba(251,191,36,0.15)' : 'rgba(173,255,71,0.12)'}`,
              color: 'rgba(255,255,255,0.7)',
            }}>
              {step.message}
            </div>
            {step.response && (
              <div className="text-xs p-2 rounded-lg mt-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}>
                Reply: "{step.response}"
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function Drawer({ review, onClose }: { review: QAReview; onClose: () => void }) {
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
            <div className="font-mono text-sm font-bold" style={{ color: '#ADFF47' }}>{review.jobId}</div>
            <div className="text-lg font-bold text-white mt-0.5">{review.homeowner}</div>
            <StarRating score={review.score} size={16} />
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-3 rounded-xl text-sm italic" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)' }}>
          "{review.comment}"
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Vendor', value: review.vendorName },
            { label: 'Service', value: review.serviceType },
            { label: 'Completed', value: new Date(review.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { label: 'Google Review', value: review.googleReviewTriggered
              ? (review.googleReviewLeft ? '✓ Left' : 'Requested')
              : 'Suppressed (score < 4)' },
          ].map(item => (
            <div key={item.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
              <div className="text-sm font-medium" style={{ color: review.googleReviewLeft && item.label === 'Google Review' ? '#ADFF47' : !review.googleReviewTriggered && item.label === 'Google Review' ? '#fbbf24' : 'white' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div>
          <div className="text-xs font-semibold tracking-wide uppercase mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Emma's Review Sequence
          </div>
          <ReviewSequencePanel review={review} />
        </div>
      </div>
    </div>
  )
}

export default function QAReviewsPage() {
  const [selected, setSelected] = useState<QAReview | null>(null)

  const avgScore = (QA_REVIEWS.reduce((s, r) => s + r.score, 0) / QA_REVIEWS.length).toFixed(2)
  const responseRate = Math.round((QA_REVIEWS.length / (QA_REVIEWS.length * 20)) * 100) // ~5% simulated
  const googleTriggered = QA_REVIEWS.filter(r => r.googleReviewTriggered).length
  const googleLeft = QA_REVIEWS.filter(r => r.googleReviewLeft).length

  return (
    <div className="space-y-6 max-w-7xl">
      {selected && <Drawer review={selected} onClose={() => setSelected(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-white">QA & Reviews Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Automated QA collection + Google review requests · Emma targets 30%+ response rate
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Avg QA Score',
            value: avgScore,
            sub: 'out of 5.0',
            color: '#ADFF47',
            bg: 'rgba(173,255,71,0.05)',
            border: 'rgba(173,255,71,0.15)',
          },
          {
            label: 'Response Rate',
            value: `${responseRate}%`,
            sub: '→ Emma targets 30%+',
            color: '#fbbf24',
            bg: 'rgba(251,191,36,0.08)',
            border: 'rgba(251,191,36,0.2)',
          },
          {
            label: 'Google Reviews Triggered',
            value: googleTriggered,
            sub: 'this month',
            color: '#60a5fa',
            bg: 'rgba(96,165,250,0.08)',
            border: 'rgba(96,165,250,0.2)',
          },
          {
            label: 'Reviews Left',
            value: googleLeft,
            sub: `${Math.round((googleLeft / googleTriggered) * 100)}% of requests converted`,
            color: '#ADFF47',
            bg: 'rgba(173,255,71,0.05)',
            border: 'rgba(173,255,71,0.15)',
          },
        ].map(k => (
          <div key={k.label} className="rounded-2xl p-5" style={{ background: k.bg, border: `1px solid ${k.border}` }}>
            <div className="text-3xl font-black mb-1" style={{ color: k.color }}>{k.value}</div>
            <div className="text-xs font-medium text-white mb-0.5">{k.label}</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Reviews */}
        <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <h2 className="text-sm font-semibold text-white">Recent Reviews</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Homeowner / Job', 'Vendor', 'Score', 'Comment', 'Google', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QA_REVIEWS.map(r => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  style={{
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    background: r.score < 4 ? 'rgba(251,191,36,0.02)' : 'transparent',
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-white text-sm">{r.homeowner}</div>
                    <div className="font-mono text-xs mt-0.5" style={{ color: '#ADFF47' }}>{r.jobId}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{r.vendorName}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{r.serviceType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StarRating score={r.score} />
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>"{r.comment}"</p>
                  </td>
                  <td className="px-4 py-3">
                    {r.googleReviewTriggered ? (
                      r.googleReviewLeft ? (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(173,255,71,0.1)', color: '#ADFF47' }}>
                          <CheckCircle size={10} className="inline mr-1" />Left
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)' }}>
                          Requested
                        </span>
                      )
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24' }}>
                        Suppressed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 18 }}>›</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <ScoreDistribution />

          {/* Vendor leaderboard */}
          <div className="glass rounded-2xl p-5">
            <div className="text-sm font-semibold text-white mb-4">Vendor QA Leaderboard</div>
            <div className="space-y-3">
              {VENDOR_QA_LEADERBOARD.map((v, idx) => (
                <div key={v.vendorId} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: idx === 0 ? 'rgba(173,255,71,0.12)' : 'rgba(255,255,255,0.05)',
                      color: idx === 0 ? '#ADFF47' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate">{v.vendorName}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{v.jobsDone} jobs · {v.totalScores} scores</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold" style={{ color: v.avgScore >= 4.7 ? '#ADFF47' : v.avgScore >= 4.0 ? '#fbbf24' : '#f87171' }}>
                      {v.avgScore.toFixed(1)}
                    </div>
                    <StarRating score={Math.round(v.avgScore)} size={10} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: 'rgba(173,255,71,0.05)', border: '1px solid rgba(173,255,71,0.15)' }}>
            <Star size={16} style={{ color: '#ADFF47', marginTop: 2 }} />
            <div>
              <div className="text-sm font-semibold text-white mb-0.5">Emma's review logic</div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                At job close, Emma texts the homeowner for a 1–5 score. If score ≥ 4, she sends a Google review link 60 seconds later. If score ≤ 3, the Google ask is suppressed and Nick is alerted.{' '}
                <span style={{ color: '#ADFF47' }}>Current response rate: ~5% manual → target 30%+ with Emma.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
