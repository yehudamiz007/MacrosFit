interface MacroBarProps {
  label: string
  current: number
  goal: number
  color: string
  unit?: string
}

export default function MacroBar({ label, current, goal, color, unit = 'g' }: MacroBarProps) {
  const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0
  const over = current > goal

  return (
    <div className="rounded-xl p-4"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </span>
        <span className="text-xs font-semibold" style={{ color: over ? '#ef4444' : 'var(--color-text-muted)' }}>
          {pct}%
        </span>
      </div>
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-2xl font-bold stat-value" style={{ color }}>
          {Math.round(current)}
        </span>
        <span className="text-xs" style={{ color: 'var(--color-text-dim)', marginBottom: '2px' }}>
          /{goal}{unit}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: over ? '#ef4444' : color }}
        />
      </div>
    </div>
  )
}
