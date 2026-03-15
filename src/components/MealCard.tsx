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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between animate-slide-in">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm truncate">{meal.name}</span>
          <span className="text-xs text-gray-600">{time}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-full">
            💪 {meal.protein}g
          </span>
          <span className="bg-yellow-500/10 text-yellow-400 text-xs px-2 py-0.5 rounded-full">
            🍞 {meal.carbs}g
          </span>
          <span className="bg-orange-500/10 text-orange-400 text-xs px-2 py-0.5 rounded-full">
            🥑 {meal.fat}g
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 mr-3">
        <span className="text-violet-400 font-bold text-sm whitespace-nowrap">
          {meal.calories} קק&quot;ל
        </span>
        <button
          onClick={() => onDelete(meal.id)}
          className="text-gray-600 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
