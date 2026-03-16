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
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-2">
      <h1 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>היסטוריה</h1>

      {/* Weekly chart */}
      <div className="rounded-2xl p-5"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)' }}>
          קלוריות - 7 ימים אחרונים
        </h2>
        <WeeklyChart data={last7} goalCalories={goals.calories} />
      </div>

      {/* History list */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
          30 ימים אחרונים
        </h2>
        {history.length === 0 ? (
          <div className="text-center py-14 rounded-2xl"
            style={{ border: '1px dashed var(--color-border)' }}>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>אין היסטוריה עדיין</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map(day => {
              const pct = Math.round((day.calories / goals.calories) * 100)
              const calOver = day.calories > goals.calories
              const calGood = day.calories > goals.calories * 0.9
              const calColor = calOver ? '#ef4444' : calGood ? '#4ade80' : 'var(--color-text-muted)'
              return (
                <div key={day.date} className="rounded-xl p-4"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>
                      {formatDate(day.date)}
                    </span>
                    <span className="font-bold text-sm stat-value" style={{ color: calColor }}>
                      {Math.round(day.calories)} <span className="font-normal text-xs" style={{ color: 'var(--color-text-dim)' }}>קק&quot;ל</span>
                      <span className="text-xs mr-1" style={{ color: 'var(--color-text-dim)' }}>({pct}%)</span>
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs mb-2.5" style={{ color: 'var(--color-text-muted)' }}>
                    <span style={{ color: '#60a5fa' }}>P {Math.round(day.protein)}g</span>
                    <span style={{ color: '#facc15' }}>C {Math.round(day.carbs)}g</span>
                    <span style={{ color: '#fb923c' }}>F {Math.round(day.fat)}g</span>
                    <span>{day.count} ארוחות</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: calOver ? '#ef4444' : '#7c5cfc',
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
