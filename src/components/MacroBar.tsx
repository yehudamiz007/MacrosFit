interface MacroBarProps {
  label: string
  icon: string
  current: number
  goal: number
  color: string
  unit?: string
}

export default function MacroBar({ label, icon, current, goal, color, unit = 'g' }: MacroBarProps) {
  const pct = goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0
  const over = current > goal

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">
          {icon} {label}
        </span>
        <span className={`text-xs font-semibold ${over ? 'text-red-400' : 'text-gray-500'}`}>
          {pct}%
        </span>
      </div>
      <div className="flex items-end gap-1 mb-3">
        <span className="text-2xl font-bold" style={{ color }}>
          {Math.round(current)}
        </span>
        <span className="text-gray-500 text-sm mb-0.5">
          / {goal}{unit}
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: over ? '#ef4444' : color }}
        />
      </div>
    </div>
  )
}
