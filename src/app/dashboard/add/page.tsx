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
    { name: 'calories', label: 'קלוריות', unit: 'קק"ל', color: '#a78bfa' },
    { name: 'protein', label: 'חלבון', unit: 'g', color: '#60a5fa' },
    { name: 'carbs', label: 'פחמימות', unit: 'g', color: '#facc15' },
    { name: 'fat', label: 'שומן', unit: 'g', color: '#fb923c' },
  ]

  return (
    <div className="space-y-5 pt-2">
      <div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>הוסף ארוחה</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>חפש מזון או הזן ידנית</p>
      </div>

      {/* Food search */}
      <div className="rounded-xl p-4"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <label className="block text-xs font-medium mb-2.5" style={{ color: 'var(--color-text-muted)' }}>
          חיפוש מזון
        </label>

        <div className="flex gap-2 mb-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="עוף, אורז, סלמון..."
            className="flex-1 rounded-lg px-3 py-2.5 text-right outline-none text-sm transition-colors"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#7c5cfc')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
          />
          <div className="flex items-center gap-1 rounded-lg px-3"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', minWidth: '80px' }}>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-12 bg-transparent outline-none text-center text-sm"
              style={{ color: 'var(--color-text)' }}
              min="1"
            />
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>g</span>
          </div>
        </div>

        {searching && (
          <div className="text-center py-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>מחפש...</div>
        )}
        {query.length >= 2 && results.length === 0 && !searching && (
          <div className="text-center py-3">
            <p className="text-sm mb-2" style={{ color: 'var(--color-text-muted)' }}>לא נמצא &quot;{query}&quot;</p>
            <Link href="/dashboard/foods" className="text-sm transition-colors" style={{ color: '#7c5cfc' }}>
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
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-right transition-colors"
                style={{ background: 'var(--color-surface-2)' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#7c5cfc')}
              >
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{food.name_he}</span>
                  <span className="text-xs mr-2" style={{ color: 'var(--color-text-muted)' }}>{food.category}</span>
                </div>
                <div className="text-xs text-left">
                  <span className="font-semibold" style={{ color: '#7c5cfc' }}>
                    {Math.round(food.calories * Number(amount) / 100)}
                  </span>
                  <span style={{ color: 'var(--color-text-dim)' }}> קק"ל</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Manual form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm px-4 py-3 rounded-lg"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
            שם הארוחה *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="לדוגמה: עוף עם אורז"
            className="w-full rounded-xl px-4 py-3 text-right outline-none text-sm transition-colors"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#7c5cfc')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {macroFields.map(f => (
            <div key={f.name} className="rounded-xl p-3"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <label className="block text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>{f.label}</label>
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
                  className="flex-1 bg-transparent outline-none text-xl font-bold text-left stat-value"
                  style={{ color: f.color }}
                />
                <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{f.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ background: '#7c5cfc', color: '#fff' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              שומר...
            </span>
          ) : 'שמור ארוחה'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="w-full font-medium py-3 rounded-xl transition-all text-sm"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          ביטול
        </button>

        <Link
          href="/dashboard/foods"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl transition-all text-sm"
          style={{ border: '1px dashed var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          + הוסף מזון חדש למסד הנתונים
        </Link>
      </form>
    </div>
  )
}
