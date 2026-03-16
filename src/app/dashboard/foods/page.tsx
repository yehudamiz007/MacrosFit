'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['בשר', 'דגים', 'חלב וביצים', 'דגנים', 'קטניות', 'ירקות', 'פירות', 'אגוזים', 'ישראלי', 'ספורט', 'שמנים', 'מתוק', 'רטבים', 'כללי']

export default function AddFoodPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name_he: '', name_en: '', category: 'כללי',
    calories: '', protein: '', carbs: '', fat: '',
    default_amount: '100',
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
      setForm({ name_he: '', name_en: '', category: 'כללי', calories: '', protein: '', carbs: '', fat: '', default_amount: '100' })
      setTimeout(() => setSuccess(false), 3000)
    } else {
      const data = await res.json()
      setError(data.error || 'שגיאה בהוספת המזון')
    }
  }

  return (
    <div className="space-y-5 pt-2">
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm mb-3 transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          חזרה
        </button>
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>הוסף מזון חדש</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>הערכים הם לכל 100 גרם</p>
      </div>

      {success && (
        <div className="text-sm px-4 py-3 rounded-lg animate-slide-in"
          style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>
          המזון נוסף בהצלחה למסד הנתונים
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm px-4 py-3 rounded-lg"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
            {error}
          </div>
        )}

        {/* Names */}
        <div className="rounded-xl p-4 space-y-3"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
            שם המזון
          </h2>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>עברית *</label>
            <input
              name="name_he"
              value={form.name_he}
              onChange={handleChange}
              placeholder="חזה עוף"
              className="w-full rounded-lg px-4 py-2.5 text-right outline-none text-sm transition-colors"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#7c5cfc')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
          </div>
          <div>
            <label className="block text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>אנגלית (אופציונלי)</label>
            <input
              name="name_en"
              value={form.name_en}
              onChange={handleChange}
              placeholder="Chicken Breast"
              dir="ltr"
              className="w-full rounded-lg px-4 py-2.5 text-left outline-none text-sm transition-colors"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = '#7c5cfc')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            />
          </div>
        </div>

        {/* Category */}
        <div className="rounded-xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
            קטגוריה
          </h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, category: cat }))}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: form.category === cat ? '#7c5cfc' : 'var(--color-surface-2)',
                  color: form.category === cat ? '#fff' : 'var(--color-text-muted)',
                  border: `1px solid ${form.category === cat ? '#7c5cfc' : 'var(--color-border)'}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Default amount */}
        <div className="rounded-xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>
            כמות מנה ברירת מחדל
          </h2>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-dim)' }}>
            הכמות שתמולא אוטומטית בבחירת מזון זה
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
              <input
                type="number"
                name="default_amount"
                value={form.default_amount}
                onChange={handleChange}
                min="1"
                step="any"
                dir="ltr"
                className="w-16 bg-transparent outline-none text-center font-bold stat-value"
                style={{ color: '#7c5cfc' }}
              />
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>g</span>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[30, 50, 100, 150, 200, 250].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, default_amount: String(v) }))}
                  className="px-2.5 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    background: form.default_amount === String(v) ? '#7c5cfc' : 'var(--color-surface-2)',
                    color: form.default_amount === String(v) ? '#fff' : 'var(--color-text-muted)',
                    border: `1px solid ${form.default_amount === String(v) ? '#7c5cfc' : 'var(--color-border)'}`,
                  }}
                >
                  {v}g
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Macros per 100g */}
        <div className="rounded-xl p-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>
            ערכים תזונתיים ל-100g
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'calories', label: 'קלוריות', unit: 'קק"ל', color: '#a78bfa' },
              { name: 'protein', label: 'חלבון', unit: 'g', color: '#60a5fa' },
              { name: 'carbs', label: 'פחמימות', unit: 'g', color: '#facc15' },
              { name: 'fat', label: 'שומן', unit: 'g', color: '#fb923c' },
            ].map(f => (
              <div key={f.name} className="rounded-lg p-3"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
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
          ) : 'הוסף למסד הנתונים'}
        </button>
      </form>
    </div>
  )
}
