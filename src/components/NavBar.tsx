'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const navLinks = [
  { href: '/dashboard', label: 'היום', icon: '📊' },
  { href: '/dashboard/history', label: 'היסטוריה', icon: '📅' },
  { href: '/dashboard/goals', label: 'יעדים', icon: '🎯' },
]

export default function NavBar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl">💪</span>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-l from-violet-400 to-pink-400">
              MacrosFit
            </span>
          </Link>
          {session?.user && (
            <div className="flex items-center gap-2">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ''}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                יציאה
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-gray-950/90 backdrop-blur-xl border-t border-gray-800 pb-safe">
        <div className="max-w-2xl mx-auto flex">
          {navLinks.map(link => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors ${
                  active ? 'text-violet-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span>{link.label}</span>
                {active && <span className="w-1 h-1 bg-violet-400 rounded-full" />}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
