'use client'

import { useLikedSongs } from '@/lib/hooks/useSongs'
import SongRow from '@/components/songs/SongRow'
import Spinner from '@/components/ui/Spinner'
import { Heart, Music } from 'lucide-react'

export default function LibraryPage() {
  const { songs, loading } = useLikedSongs()

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="flex items-end gap-6 mb-8">
        <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center flex-shrink-0 shadow-xl shadow-violet-500/30">
          <Heart className="w-16 h-16 text-white fill-white opacity-80" />
        </div>
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-1">Playlist</p>
          <h1 className="text-4xl font-extrabold mb-2">Liked Songs</h1>
          <p className="text-[#64748B] text-sm">
            {loading ? '…' : `${songs.length} song${songs.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Song list */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#1A1A35] flex items-center justify-center mb-4">
            <Music className="w-8 h-8 text-[#64748B]" />
          </div>
          <h2 className="text-lg font-semibold mb-2">No liked songs yet</h2>
          <p className="text-[#64748B] text-sm max-w-sm">
            Tap the heart on any song to save it here. Your music taste, your collection.
          </p>
        </div>
      ) : (
        <div className="bg-[#12122A] border border-[#2A2A50] rounded-2xl overflow-hidden">
          <div className="px-4 py-2 border-b border-[#2A2A50]/40 grid grid-cols-[2rem_1fr_auto] gap-4 text-xs font-semibold text-[#64748B] uppercase tracking-widest">
            <span>#</span>
            <span>Title</span>
            <span className="pr-8">Duration</span>
          </div>
          <div className="divide-y divide-[#2A2A50]/40">
            {songs.map((song, i) => (
              <SongRow
                key={song.id}
                song={song}
                index={i}
                queue={songs}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
