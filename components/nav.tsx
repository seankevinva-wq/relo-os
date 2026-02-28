'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Briefcase, Zap, Activity, Shield, Menu, X, HelpCircle, FileText, Star, DollarSign, Users } from 'lucide-react'

type NavItem = { href: string; label: string; icon: React.ReactNode; section?: string }

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Command Center', icon: <LayoutDashboard size={16} /> },
  { href: '/jobs', label: 'Job Queue', icon: <Briefcase size={16} /> },
  { href: '/dispatch', label: 'Auto-Dispatch', icon: <Zap size={16} /> },
  { href: '/ai-activity', label: 'Emma AI', icon: <Activity size={16} /> },
  { href: '/vendor-compliance', label: 'Vendor Compliance', icon: <Shield size={16} /> },
  { href: '/estimates', label: 'Estimates', icon: <FileText size={16} />, section: 'growth' },
  { href: '/qa-reviews', label: 'QA & Reviews', icon: <Star size={16} />, section: 'growth' },
  { href: '/billing', label: 'Billing', icon: <DollarSign size={16} />, section: 'growth' },
  { href: '/vendor-portal', label: 'Vendor Portal', icon: <Users size={16} />, section: 'growth' },
  { href: '/proposal', label: 'Our Proposal', icon: <FileText size={16} />, section: 'help' },
  { href: '/help', label: 'Help & Guide', icon: <HelpCircle size={16} />, section: 'help' },
]

export function Nav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-3 left-3 z-50 flex md:hidden items-center justify-center w-11 h-11 rounded-xl cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu size={18} className="text-white" />
      </button>

      {/* Desktop sidebar */}
      <div className="hidden md:block shrink-0">
        <NavContent pathname={pathname} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            style={{ backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-56 h-full overflow-y-auto">
            <NavContent pathname={pathname} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

function NavContent({ pathname, onClose }: { pathname: string; onClose?: () => void }) {
  return (
    <nav
      className="w-56 min-h-screen p-4 flex flex-col border-r"
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'rgba(255,255,255,0.07)',
      }}
    >
      {/* Logo / Brand */}
      <div className="px-3 py-4 mb-3 flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#ADFF47' }}>
            Relo OS
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
            RSG Command Center
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)' }}
            aria-label="Close navigation menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Emma status dot */}
      <div
        className="mx-3 mb-4 px-3 py-2 rounded-xl flex items-center gap-2"
        style={{ background: 'rgba(173,255,71,0.08)', border: '1px solid rgba(173,255,71,0.2)' }}
      >
        <span className="w-2 h-2 rounded-full bg-[#ADFF47] animate-pulse" />
        <span className="text-xs font-medium" style={{ color: '#ADFF47' }}>Emma is active</span>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1">
        {NAV_ITEMS.map((item, idx) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const prevItem = NAV_ITEMS[idx - 1]
          const showDivider = (item.section === 'growth' && (!prevItem || prevItem.section !== 'growth'))
            || (item.section === 'help' && (!prevItem || prevItem.section !== 'help'))
          return (
            <div key={item.href}>
              {showDivider && (
                <div className="px-3 pt-3 pb-1">
                  <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                    {item.section === 'help' ? 'Help' : 'Pipeline'}
                  </div>
                </div>
              )}
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                )}
                style={active ? {
                  background: 'rgba(173,255,71,0.1)',
                  border: '1px solid rgba(173,255,71,0.25)',
                  boxShadow: '0 0 20px rgba(173,255,71,0.12)',
                  color: 'white',
                } : {
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid transparent',
                }}
              >
                <span style={{ color: active ? '#ADFF47' : 'rgba(255,255,255,0.4)' }}>{item.icon}</span>
                {item.label}
              </Link>
            </div>
          )
        })}
      </div>

      {/* Bottom branding */}
      <div className="mt-auto px-3 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Powered by Emma AI
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Relo Solutions Group
        </div>
      </div>
    </nav>
  )
}
