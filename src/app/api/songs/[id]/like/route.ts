import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: existing } = await supabase
    .from('likes')
    .select('song_id')
    .eq('user_id', user.id)
    .eq('song_id', id)
    .single()

  if (existing) {
    await supabase.from('likes').delete().match({ user_id: user.id, song_id: id })
    return NextResponse.json({ liked: false })
  } else {
    await supabase.from('likes').insert({ user_id: user.id, song_id: id })
    return NextResponse.json({ liked: true })
  }
}
