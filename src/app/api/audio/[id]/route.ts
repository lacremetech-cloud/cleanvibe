import { createClient, createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const service = await createServiceClient()
  const { data: song } = await service
    .from('songs')
    .select('audio_url')
    .eq('id', id)
    .single()

  if (!song) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Extract storage path from URL:
  // https://xxx.supabase.co/storage/v1/object/public/audio/userId/file.mp3
  const match = song.audio_url.match(/\/object\/(?:public|sign)\/audio\/(.+?)(?:\?|$)/)
  if (!match) return NextResponse.json({ error: 'Invalid audio URL' }, { status: 400 })

  const path = match[1]

  const { data, error } = await service.storage.from('audio').createSignedUrl(path, 3600)
  if (error || !data) return NextResponse.json({ error: 'Could not generate signed URL' }, { status: 500 })

  return NextResponse.redirect(data.signedUrl)
}
