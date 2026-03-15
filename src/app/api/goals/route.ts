import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/../../../../auth'
import { supabaseAdmin } from '@/lib/supabase'

const DEFAULT_GOALS = { calories: 2000, protein: 150, carbs: 200, fat: 65 }

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data } = await supabaseAdmin
    .from('user_goals')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  return NextResponse.json(data || { ...DEFAULT_GOALS, user_id: session.user.id })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { calories, protein, carbs, fat } = body

  const { data, error } = await supabaseAdmin
    .from('user_goals')
    .upsert(
      {
        user_id: session.user.id,
        calories: Number(calories) || DEFAULT_GOALS.calories,
        protein: Number(protein) || DEFAULT_GOALS.protein,
        carbs: Number(carbs) || DEFAULT_GOALS.carbs,
        fat: Number(fat) || DEFAULT_GOALS.fat,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
