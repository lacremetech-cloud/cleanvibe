'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Play, Shuffle, MoreHorizontal, Music } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Playlist, Song } from '@/types'
import { usePlayerStore } from '@/lib/store/usePlayerStore'
import SongRow from '@/components/songs/SongRow'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'

export default function PlaylistPage() {
  const { id } = useParams<{ id: string }>()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const { playSong, toggleShuffle } = usePlayerStore()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: pl } = await supabase.from('playlists').select('*').eq('id', id).single()
      setPlaylist(pl)

      const { data: ps } = await supabase
        .from('playlist_songs')
        .select('position, songs(*)')
        .eq('playlist_id', id)
        .order('position')

      const songList = (ps ?? []).map((r) => r.songs as unknown as Song)
      setSongs(songList)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return <div className="flex justify-center pt-32"><Spinner size="lg" /></div>
  }

  if (!playlist) {
    return (
      <div className="flex flex-col items-center justify-center pt-32 text-center">
        <p className="text-[#64748B]">Playlist not found.</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="flex items-end gap-6 mb-8">
        <div className="w-36 h-36 rounded-2xl overflow-hidden flex-shrink-0 bg-[#1A1A35] shadow-xl shadow-black/40">
          {playlist.cover_url ? (
            <Image src={playlist.cover_url} alt={playlist.name} width={144} height={144} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center">
              <Music className="w-14 h-14 text-white opacity-60" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-1">Playlist</p>
          <h1 className="text-4xl font-extrabold mb-2 truncate">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-[#64748B] text-sm mb-2">{playlist.description}</p>
          )}
          <p className="text-[#64748B] text-sm">{songs.length} song{songs.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Play controls */}
      {songs.length > 0 && (
        <div className="flex items-center gap-3 mb-6">
          <Button
            onClick={() => playSong(songs[0], songs)}
            size="lg"
            className="rounded-full"
          >
            <Play className="w-4 h-4 fill-white" /> Play
          </Button>
          <button
            onClick={() => { toggleShuffle(); if (songs[0]) playSong(songs[0], songs) }}
            className="w-12 h-12 rounded-full bg-[#1A1A35] border border-[#2A2A50] flex items-center justify-center text-[#64748B] hover:text-white hover:border-[#7C3AED]/50 transition-all"
          >
            <Shuffle className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#64748B] hover:text-white transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Songs */}
      {songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Music className="w-10 h-10 text-[#2A2A50] mb-3" />
          <p className="text-[#64748B]">This playlist is empty.</p>
        </div>
      ) : (
        <div className="bg-[#12122A] border border-[#2A2A50] rounded-2xl overflow-hidden">
          <div className="divide-y divide-[#2A2A50]/40">
            {songs.map((song, i) => (
              <SongRow key={song.id} song={song} index={i} queue={songs} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
