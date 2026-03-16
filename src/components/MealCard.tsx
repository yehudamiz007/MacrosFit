'use client'

interface Meal {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  created_at: string
}

interface MealCardProps {
  meal: Meal
  onDelete: (id: string) => void
}

export default function MealCard({ meal, onDelete }: MealCardProps) {
  const time = new Date(meal.created_at).toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="rounded-xl p-4 flex items-center justify-between animate-slide-in"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
            {meal.name}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{time}</span>
        </div>
        <div className="flex gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <span style={{ color: '#60a5fa' }}>P {meal.protein}g</span>
          <span style={{ color: '#facc15' }}>C {meal.carbs}g</span>
          <span style={{ color: '#fb923c' }}>F {meal.fat}g</span>
        </div>
      </div>
      <div className="flex items-center gap-3 mr-3">
        <span className="font-bold text-sm stat-value" style={{ color: '#7c5cfc' }}>
          {meal.calories} <span className="font-normal text-xs" style={{ color: 'var(--color-text-muted)' }}>קק&quot;ל</span>
        </span>
        <button
          onClick={() => onDelete(meal.id)}
          className="transition-colors p-1.5 rounded-lg"
          style={{ color: 'var(--color-text-dim)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-dim)')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}
