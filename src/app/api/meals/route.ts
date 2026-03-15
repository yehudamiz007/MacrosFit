import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/../../auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date') || new Date().toISOString().slice(0, 10)

  const { data, error } = await supabaseAdmin
    .from('meals')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('date', date)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, calories, protein, carbs, fat } = body

  if (!name) {
    return NextResponse.json({ error: 'שם הארוחה חסר' }, { status: 400 })
  }

  const today = new Date().toISOString().slice(0, 10)

  const { data, error } = await supabaseAdmin
    .from('meals')
    .insert({
      user_id: session.user.id,
      name,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      date: today,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
