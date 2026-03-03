import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify ownership
  const { data: playlist } = await supabase
    .from('playlists')
    .select('user_id')
    .eq('id', id)
    .single()

  if (!playlist || playlist.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { song_id } = await req.json()

  // Get current max position
  const { data: maxPos } = await supabase
    .from('playlist_songs')
    .select('position')
    .eq('playlist_id', id)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  const position = (maxPos?.position ?? 0) + 1

  const { error } = await supabase
    .from('playlist_songs')
    .insert({ playlist_id: id, song_id, position })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true }, { status: 201 })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { song_id } = await req.json()

  await supabase
    .from('playlist_songs')
    .delete()
    .match({ playlist_id: id, song_id })

  return NextResponse.json({ ok: true })
}
