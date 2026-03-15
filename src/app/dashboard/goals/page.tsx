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
      setToast('✅ יעדים נשמרו!')
      setTimeout(() => setToast(''), 2500)
    }
  }

  const presets = [
    { name: 'ירידה במשקל', calories: 1600, protein: 160, carbs: 130, fat: 55 },
    { name: 'שמירה', calories: 2000, protein: 150, carbs: 200, fat: 65 },
    { name: 'בנית שריר', calories: 2600, protein: 200, carbs: 280, fat: 75 },
  ]

  const fields = [
    { name: 'calories', label: '🔥 קלוריות יומיות', unit: 'קק"ל', color: '#a78bfa' },
    { name: 'protein', label: '💪 חלבון', unit: 'g', color: '#60a5fa' },
    { name: 'carbs', label: '🍞 פחמימות', unit: 'g', color: '#facc15' },
    { name: 'fat', label: '🥑 שומן', unit: 'g', color: '#fb923c' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-2">
      <div>
        <h1 className="text-xl font-bold">🎯 יעדים יומיים</h1>
        <p className="text-gray-500 text-sm mt-1">הגדר את היעדים התזונתיים שלך</p>
      </div>

      {/* Presets */}
      <div>
        <p className="text-sm text-gray-400 mb-2">בחר תבנית מוכנה:</p>
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
              className="bg-gray-900 border border-gray-800 hover:border-violet-500 rounded-xl p-3 text-xs text-gray-400 hover:text-white transition-all text-center"
            >
              <div className="font-semibold mb-1">{p.name}</div>
              <div className="text-gray-600">{p.calories} קק&quot;ל</div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {fields.map(f => (
          <div key={f.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
            <label className="block text-sm text-gray-400 mb-2">{f.label}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                name={f.name}
                value={form[f.name as keyof typeof form]}
                onChange={handleChange}
                min="0"
                dir="ltr"
                className="flex-1 bg-gray-800 border border-gray-700 focus:border-violet-500 rounded-xl px-4 py-2.5 text-left outline-none transition-colors font-semibold"
                style={{ color: f.color }}
              />
              <span className="text-gray-500 text-sm">{f.unit}</span>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-violet-500/20"
        >
          {saving ? 'שומר...' : '💾 שמור יעדים'}
        </button>
      </form>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
