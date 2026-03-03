import { NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single()
  if (!profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const serviceClient = await createServiceClient()

  // Parallel fetch all stats
  const [
    { count: totalSongs },
    { count: totalUsers },
    { count: totalLikes },
    { data: songs },
    { data: genreData },
  ] = await Promise.all([
    serviceClient.from('songs').select('*', { count: 'exact', head: true }).eq('is_published', true),
    serviceClient.from('profiles').select('*', { count: 'exact', head: true }),
    serviceClient.from('likes').select('*', { count: 'exact', head: true }),
    serviceClient
      .from('songs')
      .select('id, title, artist, play_count')
      .eq('is_published', true)
      .order('play_count', { ascending: false })
      .limit(10),
    serviceClient
      .from('songs')
      .select('genre')
      .eq('is_published', true)
      .not('genre', 'is', null),
  ])

  // Compute total plays
  const { data: playsSum } = await serviceClient
    .from('songs')
    .select('play_count')
    .eq('is_published', true)

  const totalPlays = (playsSum ?? []).reduce((sum, s) => sum + (s.play_count ?? 0), 0)

  // Likes per song
  const { data: likesPerSong } = await serviceClient
    .from('likes')
    .select('song_id')

  const likesCounts = (likesPerSong ?? []).reduce<Record<string, number>>((acc, l) => {
    acc[l.song_id] = (acc[l.song_id] ?? 0) + 1
    return acc
  }, {})

  const topSongs = (songs ?? []).map((s) => ({
    song_id: s.id,
    title: s.title,
    artist: s.artist,
    play_count: s.play_count ?? 0,
    likes_count: likesCounts[s.id] ?? 0,
    unique_listeners: 0,
    avg_listen_duration: 0,
  }))

  // Genre breakdown
  const genreMap = (genreData ?? []).reduce<Record<string, number>>((acc, s) => {
    if (s.genre) acc[s.genre] = (acc[s.genre] ?? 0) + 1
    return acc
  }, {})

  const genreBreakdown = Object.entries(genreMap)
    .map(([genre, count]) => ({ genre, count, total_plays: 0 }))
    .sort((a, b) => b.count - a.count)

  return NextResponse.json({
    total_songs: totalSongs ?? 0,
    total_users: totalUsers ?? 0,
    total_plays: totalPlays,
    total_likes: totalLikes ?? 0,
    top_songs: topSongs,
    genre_breakdown: genreBreakdown,
  })
}
