import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Increment play count atomically
  await supabase.rpc('increment_play_count', { song_id: id })

  // Record history if authenticated
  if (user) {
    await supabase.from('play_history').insert({
      user_id: user.id,
      song_id: id,
    })
  }

  return NextResponse.json({ ok: true })
}
