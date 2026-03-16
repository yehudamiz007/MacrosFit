'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import MacroBar from '@/components/MacroBar'
import MealCard from '@/components/MealCard'

interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  created_at: string
}

interface Goals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

const DEFAULT_GOALS: Goals = { calories: 2000, protein: 150, carbs: 200, fat: 65 }

export default function DashboardPage() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const today = new Date().toLocaleDateString('he-IL', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  const fetchData = useCallback(async () => {
    const [mealsRes, goalsRes] = await Promise.all([
      fetch('/api/meals'),
      fetch('/api/goals'),
    ])
    if (mealsRes.ok) setMeals(await mealsRes.json())
    if (goalsRes.ok) setGoals(await goalsRes.json())
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleDelete(id: string) {
    const res = await fetch(`/api/meals/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setMeals(prev => prev.filter(m => m.id !== id))
      showToast('הארוחה נמחקה')
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const calPct = Math.min(100, (totals.calories / goals.calories) * 100)
  const calOver = totals.calories > goals.calories
  const remaining = Math.max(0, goals.calories - Math.round(totals.calories))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Date header */}
      <div className="pt-2 pb-1">
        <p className="text-xs mb-0.5" style={{ color: 'var(--color-text-muted)' }}>{today}</p>
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>סיכום היום</h1>
      </div>

      {/* Calories main card */}
      <div className="rounded-2xl p-5"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>קלוריות</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold stat-value" style={{ color: 'var(--color-text)' }}>
                {Math.round(totals.calories)}
              </span>
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                / {goals.calories} קק&quot;ל
              </span>
            </div>
          </div>
          <div className="text-left">
            <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>נותרו</p>
            <p className="text-2xl font-bold stat-value" style={{ color: calOver ? '#ef4444' : '#7c5cfc' }}>
              {remaining}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${calPct}%`,
              backgroundColor: calOver ? '#ef4444' : '#7c5cfc',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>0</span>
          <span className="text-xs font-semibold" style={{ color: calOver ? '#ef4444' : '#7c5cfc' }}>
            {Math.round(calPct)}%
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{goals.calories}</span>
        </div>
      </div>

      {/* Macros grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <MacroBar label="חלבון" current={totals.protein} goal={goals.protein} color="#60a5fa" />
        <MacroBar label="פחמימות" current={totals.carbs} goal={goals.carbs} color="#facc15" />
        <MacroBar label="שומן" current={totals.fat} goal={goals.fat} color="#fb923c" />
      </div>

      {/* Add meal button */}
      <Link
        href="/dashboard/add"
        className="flex items-center justify-center gap-2 w-full font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98]"
        style={{ background: '#7c5cfc', color: '#fff' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        הוסף ארוחה
      </Link>

      {/* Meals list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>ארוחות היום</h2>
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
            {meals.length}
          </span>
        </div>
        {meals.length === 0 ? (
          <div className="text-center py-14 rounded-2xl"
            style={{ border: '1px dashed var(--color-border)' }}>
            <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
              style={{ background: 'var(--color-surface)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3a3a4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              </svg>
            </div>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>לא נרשמו ארוחות היום</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>לחץ על &quot;הוסף ארוחה&quot; כדי להתחיל</p>
          </div>
        ) : (
          <div className="space-y-2">
            {meals.map(meal => (
              <MealCard key={meal.id} meal={meal} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg z-50 animate-slide-in"
          style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
