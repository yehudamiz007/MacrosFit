'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const navLinks = [
  {
    href: '/dashboard',
    label: 'היום',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#7c5cfc' : '#6b6b80'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/dashboard/history',
    label: 'היסטוריה',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#7c5cfc' : '#6b6b80'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    href: '/dashboard/goals',
    label: 'יעדים',
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#7c5cfc' : '#6b6b80'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
]

export default function NavBar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: 'rgba(10,10,15,0.85)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{ background: 'var(--color-violet-muted)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c5cfc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-wide" style={{ color: 'var(--color-text)' }}>
              MacrosFit
            </span>
          </Link>
          {session?.user && (
            <div className="flex items-center gap-3">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ''}
                  width={28}
                  height={28}
                  className="rounded-full opacity-80"
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs transition-colors px-2 py-1 rounded-lg"
                style={{ color: 'var(--color-text-muted)' }}
              >
                יציאה
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 backdrop-blur-xl pb-safe"
        style={{ background: 'rgba(10,10,15,0.92)', borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-2xl mx-auto flex">
          {navLinks.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex-1 flex flex-col items-center py-3 gap-1 transition-colors"
                style={{ color: active ? '#7c5cfc' : '#6b6b80' }}
              >
                {link.icon(active)}
                <span className="text-xs" style={{ fontSize: '0.65rem', fontWeight: active ? 600 : 400 }}>
                  {link.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
