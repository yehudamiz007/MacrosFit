'use client'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) router.push('/dashboard')
  }, [session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Logo */}
        <div className="text-7xl mb-6 animate-bounce">💪</div>
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-l from-violet-400 to-pink-400 bg-clip-text text-transparent">
          MacrosFit
        </h1>
        <p className="text-gray-400 text-lg mb-2">מקרוספיט</p>
        <p className="text-gray-500 text-sm mb-10">
          עקוב אחר הקלוריות והמאקרו שלך בקלות
        </p>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: '🔥', label: 'קלוריות' },
            { icon: '💪', label: 'חלבון' },
            { icon: '📊', label: 'גרפים' },
          ].map(f => (
            <div key={f.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-xs text-gray-400">{f.label}</div>
            </div>
          ))}
        </div>

        {/* Sign in button */}
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-semibold px-6 py-3.5 rounded-2xl hover:bg-gray-100 transition-all shadow-lg shadow-white/5 active:scale-95"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          כניסה עם Google
        </button>

        <p className="text-gray-600 text-xs mt-6">
          בכניסה אתה מסכים לתנאי השימוש שלנו
        </p>
      </div>
    </main>
  )
}
