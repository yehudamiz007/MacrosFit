'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const WeeklyChart = dynamic(() => import('@/components/WeeklyChart'), { ssr: false })

interface DayStat {
  date: string
  calories: number
  protein: number
  carbs: number
  fat: number
  count: number
}

interface Goals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export default function HistoryPage() {
  const [history, setHistory] = useState<DayStat[]>([])
  const [goals, setGoals] = useState<Goals>({ calories: 2000, protein: 150, carbs: 200, fat: 65 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/history').then(r => r.json()),
      fetch('/api/goals').then(r => r.json()),
    ]).then(([h, g]) => {
      setHistory(h)
      setGoals(g)
      setLoading(false)
    })
  }, [])

  // Last 7 days for chart
  const last7: DayStat[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const found = history.find(h => h.date === dateStr)
    last7.push(found || { date: dateStr, calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 })
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T12:00:00')
    const today = new Date().toISOString().slice(0, 10)
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
    const yStr = yesterday.toISOString().slice(0, 10)
    if (dateStr === today) return 'היום'
    if (dateStr === yStr) return 'אתמול'
    return d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-xl font-bold">📈 היסטוריה</h1>

      {/* Weekly chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-5">
        <h2 className="font-semibold text-gray-300 mb-4">קלוריות - 7 ימים אחרונים</h2>
        <WeeklyChart data={last7} goalCalories={goals.calories} />
      </div>

      {/* History list */}
      <div>
        <h2 className="font-semibold text-gray-300 mb-3">30 ימים אחרונים</h2>
        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <div className="text-5xl mb-3">📋</div>
            <p>אין היסטוריה עדיין</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map(day => {
              const pct = Math.round((day.calories / goals.calories) * 100)
              const calColor = day.calories > goals.calories ? 'text-red-400' : day.calories > goals.calories * 0.9 ? 'text-green-400' : 'text-gray-400'
              return (
                <div key={day.date} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{formatDate(day.date)}</span>
                    <span className={`font-bold text-sm ${calColor}`}>
                      {Math.round(day.calories)} קק&quot;ל ({pct}%)
                    </span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span>💪 {Math.round(day.protein)}g</span>
                    <span>🍞 {Math.round(day.carbs)}g</span>
                    <span>🥑 {Math.round(day.fat)}g</span>
                    <span>🍽️ {day.count} ארוחות</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: day.calories > goals.calories ? '#ef4444' : '#7c3aed',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
