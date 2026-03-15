'use client'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface DayStat {
  date: string
  calories: number
}

interface WeeklyChartProps {
  data: DayStat[]
  goalCalories: number
}

export default function WeeklyChart({ data, goalCalories }: WeeklyChartProps) {
  const labels = data.map(d => {
    const date = new Date(d.date + 'T12:00:00')
    return date.toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric' })
  })

  const values = data.map(d => d.calories)
  const colors = values.map(v => v > goalCalories ? 'rgba(239,68,68,0.7)' : 'rgba(124,106,247,0.7)')
  const borders = values.map(v => v > goalCalories ? '#ef4444' : '#7c6af7')

  return (
    <div className="h-52">
      <Bar
        data={{
          labels,
          datasets: [{
            label: 'קלוריות',
            data: values,
            backgroundColor: colors,
            borderColor: borders,
            borderWidth: 2,
            borderRadius: 8,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => `${ctx.raw} קק"ל`,
              },
            },
          },
          scales: {
            x: {
              ticks: { color: '#94a3b8', font: { size: 11 } },
              grid: { color: '#1f2937' },
            },
            y: {
              ticks: { color: '#94a3b8' },
              grid: { color: '#1f2937' },
            },
          },
        }}
      />
    </div>
  )
}
