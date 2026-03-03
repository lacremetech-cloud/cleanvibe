'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Song } from '@/types'

export function useSongs(options?: { genre?: string; search?: string; limit?: number }) {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSongs = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase
      .from('songs')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (options?.genre) query = query.eq('genre', options.genre)
    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,artist.ilike.%${options.search}%`)
    }
    if (options?.limit) query = query.limit(options.limit)

    const { data, error: err } = await query
    if (err) { setError(err.message); setLoading(false); return }

    // Fetch likes for the current user
    if (user && data) {
      const { data: likes } = await supabase
        .from('likes')
        .select('song_id')
        .eq('user_id', user.id)

      const likedIds = new Set((likes ?? []).map((l) => l.song_id))
      setSongs(data.map((s) => ({ ...s, is_liked: likedIds.has(s.id) })))
    } else {
      setSongs(data ?? [])
    }

    setLoading(false)
  }, [options?.genre, options?.search, options?.limit])

  useEffect(() => { fetchSongs() }, [fetchSongs])

  const toggleLike = async (songId: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const song = songs.find((s) => s.id === songId)
    if (!song) return

    if (song.is_liked) {
      await supabase.from('likes').delete().match({ user_id: user.id, song_id: songId })
    } else {
      await supabase.from('likes').insert({ user_id: user.id, song_id: songId })
    }

    setSongs((prev) => prev.map((s) => s.id === songId ? { ...s, is_liked: !s.is_liked } : s))
  }

  return { songs, loading, error, refetch: fetchSongs, toggleLike }
}

export function useLikedSongs() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLiked() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('likes')
        .select('song_id, songs(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      const liked = (data ?? []).map((l) => ({ ...(l.songs as unknown as Song), is_liked: true }))
      setSongs(liked)
      setLoading(false)
    }
    fetchLiked()
  }, [])

  return { songs, loading }
}
