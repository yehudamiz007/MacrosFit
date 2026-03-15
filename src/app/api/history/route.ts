import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const fromDate = thirtyDaysAgo.toISOString().slice(0, 10)

  const { data, error } = await supabaseAdmin
    .from('meals')
    .select('date, calories, protein, carbs, fat')
    .eq('user_id', session.user.id)
    .gte('date', fromDate)
    .order('date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const byDate: Record<string, { calories: number; protein: number; carbs: number; fat: number; count: number }> = {}
  for (const row of data || []) {
    if (!byDate[row.date]) byDate[row.date] = { calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 }
    byDate[row.date].calories += row.calories
    byDate[row.date].protein += row.protein
    byDate[row.date].carbs += row.carbs
    byDate[row.date].fat += row.fat
    byDate[row.date].count++
  }

  const result = Object.entries(byDate)
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => b.date.localeCompare(a.date))

  return NextResponse.json(result)
}
