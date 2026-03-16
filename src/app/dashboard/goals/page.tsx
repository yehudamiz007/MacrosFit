'use client'
import { useState, useEffect } from 'react'

interface Goals {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export default function GoalsPage() {
  const [form, setForm] = useState({ calories: '2000', protein: '150', carbs: '200', fat: '65' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    fetch('/api/goals')
      .then(r => r.json())
      .then((g: Goals) => {
        setForm({
          calories: String(g.calories),
          protein: String(g.protein),
          carbs: String(g.carbs),
          fat: String(g.fat),
        })
        setLoading(false)
      })
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calories: Number(form.calories),
        protein: Number(form.protein),
        carbs: Number(form.carbs),
        fat: Number(form.fat),
      }),
    })
    setSaving(false)
    if (res.ok) {
      setToast('יעדים נשמרו')
      setTimeout(() => setToast(''), 2500)
    }
  }

  const presets = [
    { name: 'ירידה במשקל', calories: 1600, protein: 160, carbs: 130, fat: 55 },
    { name: 'שמירה', calories: 2000, protein: 150, carbs: 200, fat: 65 },
    { name: 'בנית שריר', calories: 2600, protein: 200, carbs: 280, fat: 75 },
  ]

  const fields = [
    { name: 'calories', label: 'קלוריות יומיות', unit: 'קק"ל', color: '#a78bfa' },
    { name: 'protein', label: 'חלבון', unit: 'g', color: '#60a5fa' },
    { name: 'carbs', label: 'פחמימות', unit: 'g', color: '#facc15' },
    { name: 'fat', label: 'שומן', unit: 'g', color: '#fb923c' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5 pt-2">
      <div>
        <h1 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>יעדים יומיים</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>הגדר את היעדים התזונתיים שלך</p>
      </div>

      {/* Presets */}
      <div>
        <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>תבניות מוכנות</p>
        <div className="grid grid-cols-3 gap-2">
          {presets.map(p => (
            <button
              key={p.name}
              onClick={() => setForm({
                calories: String(p.calories),
                protein: String(p.protein),
                carbs: String(p.carbs),
                fat: String(p.fat),
              })}
              className="rounded-xl p-3 text-center transition-all"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#7c5cfc')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
            >
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{p.name}</div>
              <div className="text-xs" style={{ color: 'var(--color-text-dim)' }}>{p.calories} קק&quot;ל</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {fields.map(f => (
          <div key={f.name} className="rounded-xl p-4"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            <label className="block text-xs font-medium mb-2.5" style={{ color: 'var(--color-text-muted)' }}>
              {f.label}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name={f.name}
                value={form[f.name as keyof typeof form]}
                onChange={handleChange}
                min="0"
                dir="ltr"
                className="flex-1 rounded-lg px-4 py-2.5 text-left outline-none transition-colors font-bold text-lg stat-value"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: f.color,
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#7c5cfc')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
              />
              <span className="text-sm w-10" style={{ color: 'var(--color-text-muted)' }}>{f.unit}</span>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="w-full font-semibold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ background: '#7c5cfc', color: '#fff' }}
        >
          {saving ? 'שומר...' : 'שמור יעדים'}
        </button>
      </form>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full text-sm font-medium shadow-lg z-50"
          style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
