'use client'

import { useLikedSongs } from '@/lib/hooks/useSongs'
import SongRow from '@/components/songs/SongRow'
import Spinner from '@/components/ui/Spinner'
import { Heart, Music } from 'lucide-react'

export default function LibraryPage() {
  const { songs, loading } = useLikedSongs()

  return (
    <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-end gap-5 mb-8">
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center flex-shrink-0">
          <Heart className="w-12 h-12 text-white fill-white opacity-80" />
        </div>
        <div>
          <p className="text-xs text-[#64748B] uppercase tracking-widest mb-1">Playlist</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Titres aimés</h1>
          <p className="text-[#64748B] text-sm mt-1">
            {loading ? '…' : `${songs.length} titre${songs.length > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : songs.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-[#0D0D20] flex items-center justify-center mb-4">
            <Music className="w-6 h-6 text-[#64748B]" />
          </div>
          <p className="font-semibold mb-1">Aucun titre aimé</p>
          <p className="text-[#64748B] text-sm">Appuie sur le ♥ d'une chanson pour la retrouver ici.</p>
        </div>
      ) : (
        <div className="bg-[#0D0D20] border border-[#1A1A35] rounded-2xl overflow-hidden">
          {songs.map((s, i) => (
            <SongRow key={s.id} song={s} index={i} queue={songs} />
          ))}
        </div>
      )}
    </div>
  )
}
