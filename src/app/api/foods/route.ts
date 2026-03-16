import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json([])
  }

  const { data, error } = await supabaseAdmin
    .from('foods')
    .select('*')
    .or(`name_he.ilike.%${q}%,name_en.ilike.%${q}%`)
    .limit(10)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name_he, name_en, category, calories, protein, carbs, fat, default_amount } = body

  if (!name_he?.trim()) {
    return NextResponse.json({ error: 'שם בעברית חסר' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('foods')
    .insert({
      name_he: name_he.trim(),
      name_en: name_en?.trim() || null,
      category: category?.trim() || 'כללי',
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
      default_amount: Number(default_amount) || 100,
      added_by: session.user.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
