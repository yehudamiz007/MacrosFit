'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Food {
  id: string
  name_he: string
  name_en: string
  category: string
  calories: number
  protein: number
  carbs: number
  fat: number
  default_amount: number
}

export default function AddMealPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Food[]>([])
  const [searching, setSearching] = useState(false)
  const [amount, setAmount] = useState('100')
  const searchRef = useRef<HTMLDivElement>(null)

  // Debounced food search
  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const t = setTimeout(async () => {
      setSearching(true)
      const res = await fetch(`/api/foods?q=${encodeURIComponent(query)}`)
      if (res.ok) setResults(await res.json())
      setSearching(false)
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  function selectFood(food: Food) {
    const portion = food.default_amount || 100
    setAmount(String(portion))
    const multiplier = portion / 100
    setForm({
      name: food.name_he,
      calories: String(Math.round(food.calories * multiplier)),
      protein: String(Math.round(food.protein * multiplier * 10) / 10),
      carbs: String(Math.round(food.carbs * multiplier * 10) / 10),
      fat: String(Math.round(food.fat * multiplier * 10) / 10),
    })
    setQuery('')
    setResults([])
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('נא להזין שם ארוחה'); return }
    setLoading(true)
    const res = await fetch('/api/meals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        calories: Number(form.calories) || 0,
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
      }),
    })
    setLoading(false)
    if (res.ok) {
      router.push('/dashboard')
    } else {
      const data = await res.json()
      setError(data.error || 'שגיאה בהוספת הארוחה')
    }
  }

  const macroFields = [
    { name: 'calories', label: '🔥 קלוריות', unit: 'קק"ל' },
    { name: 'protein', label: '💪 חלבון', unit: 'g' },
    { name: 'carbs', label: '🍞 פחמימות', unit: 'g' },
    { name: 'fat', label: '🥑 שומן', unit: 'g' },
  ]

  return (
    <div className="space-y-5 pt-2">
      <div>
        <h1 className="text-xl font-bold">➕ הוסף ארוחה</h1>
        <p className="text-gray-500 text-sm mt-1">חפש מזון או הזן ידנית</p>
      </div>

      {/* Food search */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <label className="block text-sm text-gray-400 mb-2">🔍 חפש מזון</label>

        <div className="flex gap-2 mb-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="עוף, אורז, סלמון..."
            className="flex-1 bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-right outline-none transition-colors text-sm"
          />
          <div className="flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-xl px-3">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-14 bg-transparent outline-none text-center text-sm"
              min="1"
            />
            <span className="text-gray-500 text-xs">g</span>
          </div>
        </div>

        {/* Results */}
        {searching && (
          <div className="text-center py-3 text-gray-500 text-sm">מחפש...</div>
        )}
        {/* Add new food link */}
        {query.length >= 2 && results.length === 0 && !searching && (
          <div className="text-center py-3">
            <p className="text-gray-500 text-sm mb-2">לא נמצא &quot;{query}&quot;</p>
            <Link
              href="/dashboard/foods"
              className="text-violet-400 text-sm hover:text-violet-300 underline"
            >
              + הוסף מזון חדש למסד הנתונים
            </Link>
          </div>
        )}

        {results.length > 0 && (
          <div ref={searchRef} className="space-y-1 max-h-60 overflow-y-auto">
            {results.map(food => (
              <button
                key={food.id}
                onClick={() => selectFood(food)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-right transition-colors"
              >
                <div>
                  <span className="text-sm font-medium">{food.name_he}</span>
                  <span className="text-xs text-gray-500 mr-2">{food.category}</span>
                </div>
                <div className="text-xs text-gray-400 text-left">
                  <span className="text-violet-400 font-semibold">{Math.round(food.calories * Number(amount) / 100)}</span>
                  <span className="text-gray-600"> קק"ל</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Manual form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">שם הארוחה *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="לדוגמה: עוף עם אורז..."
            className="w-full bg-gray-900 border border-gray-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-right outline-none transition-colors text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {macroFields.map(f => (
            <div key={f.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-3">
              <label className="block text-xs text-gray-500 mb-1.5">{f.label}</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  name={f.name}
                  value={form[f.name as keyof typeof form]}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="any"
                  dir="ltr"
                  className="flex-1 bg-transparent outline-none text-lg font-bold text-left"
                />
                <span className="text-gray-600 text-xs">{f.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-violet-500/20"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              שומר...
            </span>
          ) : '✅ שמור ארוחה'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="w-full bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-400 font-medium py-3 rounded-2xl transition-all text-sm"
        >
          ביטול
        </button>

        <Link
          href="/dashboard/foods"
          className="flex items-center justify-center gap-2 w-full border border-dashed border-gray-700 hover:border-violet-500 text-gray-500 hover:text-violet-400 font-medium py-3 rounded-2xl transition-all text-sm"
        >
          🍽️ הוסף מזון חדש למסד הנתונים
        </Link>
      </form>
    </div>
  )
}
