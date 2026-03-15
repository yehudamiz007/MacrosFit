'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddMealPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const fields = [
    { name: 'calories', label: '🔥 קלוריות', placeholder: '0' },
    { name: 'protein', label: '💪 חלבון (g)', placeholder: '0' },
    { name: 'carbs', label: '🍞 פחמימות (g)', placeholder: '0' },
    { name: 'fat', label: '🥑 שומן (g)', placeholder: '0' },
  ]

  return (
    <div className="space-y-6 pt-2">
      <div>
        <h1 className="text-xl font-bold">➕ הוסף ארוחה</h1>
        <p className="text-gray-500 text-sm mt-1">רשום מה אכלת היום</p>
      </div>

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
            placeholder="לדוגמה: עוף עם אורז, שייק חלבון..."
            className="w-full bg-gray-900 border border-gray-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-right outline-none transition-colors text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-sm text-gray-400 mb-1.5">{f.label}</label>
              <input
                type="number"
                name={f.name}
                value={form[f.name as keyof typeof form]}
                onChange={handleChange}
                placeholder={f.placeholder}
                min="0"
                dir="ltr"
                className="w-full bg-gray-900 border border-gray-800 focus:border-violet-500 rounded-2xl px-4 py-3 text-left outline-none transition-colors text-sm"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-violet-500/20"
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
      </form>
    </div>
  )
}
