import { cn } from '@/lib/utils'
import type { JobStatus } from '@/lib/mock-data'

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bg: string; border: string }> = {
  pending_info: { label: 'Pending Info', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
  needs_dispatch: { label: 'Needs Dispatch', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)' },
  dispatched: { label: 'Dispatched', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)' },
  window_confirmed: { label: 'Window Confirmed', color: '#ADFF47', bg: 'rgba(173,255,71,0.1)', border: 'rgba(173,255,71,0.3)' },
  active: { label: 'Active Today', color: '#ADFF47', bg: 'rgba(173,255,71,0.15)', border: 'rgba(173,255,71,0.4)' },
  complete: { label: 'Complete', color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
  at_risk: { label: 'At Risk', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
}

export function StatusBadge({ status, className }: { status: JobStatus; className?: string }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', className)}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  )
}

export function ComplianceBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; color: string; bg: string; border: string }> = {
    submitted: { label: 'Submitted', color: '#ADFF47', bg: 'rgba(173,255,71,0.1)', border: 'rgba(173,255,71,0.3)' },
    on_track: { label: 'On Track', color: 'rgba(255,255,255,0.5)', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' },
    overdue_24h: { label: 'Overdue 24h', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
    overdue_48h: { label: 'Overdue 48h', color: '#fb923c', bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)' },
    warning_issued: { label: 'Warning Issued', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
  }
  const cfg = configs[status] || configs.on_track
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  )
}
