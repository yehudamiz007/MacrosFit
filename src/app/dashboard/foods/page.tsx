'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['בשר', 'דגים', 'חלב וביצים', 'דגנים', 'קטניות', 'ירקות', 'פירות', 'אגוזים', 'ישראלי', 'ספורט', 'שמנים', 'מתוק', 'רטבים', 'כללי']

export default function AddFoodPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name_he: '', name_en: '', category: 'כללי',
    calories: '', protein: '', carbs: '', fat: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name_he.trim()) { setError('נא להזין שם בעברית'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setLoading(false)
    if (res.ok) {
      setSuccess(true)
      setForm({ name_he: '', name_en: '', category: 'כללי', calories: '', protein: '', carbs: '', fat: '' })
      setTimeout(() => setSuccess(false), 3000)
    } else {
      const data = await res.json()
      setError(data.error || 'שגיאה בהוספת המזון')
    }
  }

  return (
    <div className="space-y-5 pt-2">
      <div>
        <button onClick={() => router.back()} className="text-gray-500 text-sm mb-3 flex items-center gap-1 hover:text-white transition-colors">
          → חזרה
        </button>
        <h1 className="text-xl font-bold">🍽️ הוסף מזון חדש</h1>
        <p className="text-gray-500 text-sm mt-1">הערכים הם לכל 100 גרם</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl animate-slide-in">
          ✅ המזון נוסף בהצלחה למסד הנתונים!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Names */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-300">שם המזון</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">בעברית *</label>
            <input
              name="name_he"
              value={form.name_he}
              onChange={handleChange}
              placeholder="לדוגמה: חזה עוף"
              className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-right outline-none transition-colors text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">באנגלית (אופציונלי)</label>
            <input
              name="name_en"
              value={form.name_en}
              onChange={handleChange}
              placeholder="Chicken Breast"
              dir="ltr"
              className="w-full bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-left outline-none transition-colors text-sm"
            />
          </div>
        </div>

        {/* Category */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <label className="block text-sm font-semibold text-gray-300 mb-2">קטגוריה</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, category: cat }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  form.category === cat
                    ? 'bg-violet-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Macros per 100g */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-gray-300 mb-3">ערכים תזונתיים לכל 100g</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'calories', label: '🔥 קלוריות', unit: 'קק"ל', color: '#a78bfa' },
              { name: 'protein', label: '💪 חלבון', unit: 'g', color: '#60a5fa' },
              { name: 'carbs', label: '🍞 פחמימות', unit: 'g', color: '#facc15' },
              { name: 'fat', label: '🥑 שומן', unit: 'g', color: '#fb923c' },
            ].map(f => (
              <div key={f.name} className="bg-gray-800 rounded-xl p-3">
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
                    style={{ color: f.color }}
                  />
                  <span className="text-gray-600 text-xs">{f.unit}</span>
                </div>
              </div>
            ))}
          </div>
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
          ) : '✅ הוסף למסד הנתונים'}
        </button>
      </form>
    </div>
  )
}
