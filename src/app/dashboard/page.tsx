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
      showToast('🗑️ הארוחה נמחקה')
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Date */}
      <div className="text-center pt-2">
        <p className="text-gray-500 text-sm">{today}</p>
        <h1 className="text-xl font-bold mt-1">סיכום היום</h1>
      </div>

      {/* Calories big card */}
      <div className="bg-gradient-to-br from-violet-900/40 to-pink-900/20 border border-violet-800/30 rounded-3xl p-5 text-center">
        <p className="text-gray-400 text-sm mb-1">🔥 קלוריות</p>
        <div className="flex items-end justify-center gap-2 mb-3">
          <span className="text-5xl font-extrabold text-white">{Math.round(totals.calories)}</span>
          <span className="text-gray-400 mb-1.5">/ {goals.calories} קק&quot;ל</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(100, (totals.calories / goals.calories) * 100)}%`,
              background: totals.calories > goals.calories
                ? '#ef4444'
                : 'linear-gradient(90deg, #7c3aed, #ec4899)',
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          נותרו {Math.max(0, goals.calories - Math.round(totals.calories))} קק&quot;ל
        </p>
      </div>

      {/* Macros grid */}
      <div className="grid grid-cols-3 gap-3">
        <MacroBar label="חלבון" icon="💪" current={totals.protein} goal={goals.protein} color="#60a5fa" />
        <MacroBar label="פחמימות" icon="🍞" current={totals.carbs} goal={goals.carbs} color="#facc15" />
        <MacroBar label="שומן" icon="🥑" current={totals.fat} goal={goals.fat} color="#fb923c" />
      </div>

      {/* Add meal button */}
      <Link
        href="/dashboard/add"
        className="flex items-center justify-center gap-2 w-full bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-semibold py-3.5 rounded-2xl transition-all shadow-lg shadow-violet-500/20"
      >
        <span className="text-xl">➕</span>
        הוסף ארוחה
      </Link>

      {/* Meals list */}
      <div>
        <h2 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
          🍽️ ארוחות היום
          <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">{meals.length}</span>
        </h2>
        {meals.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <div className="text-5xl mb-3">🍽️</div>
            <p>עדיין לא נרשמו ארוחות היום</p>
            <p className="text-sm mt-1">לחץ על &quot;הוסף ארוחה&quot; כדי להתחיל</p>
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
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg z-50 animate-slide-in">
          {toast}
        </div>
      )}
    </div>
  )
}
