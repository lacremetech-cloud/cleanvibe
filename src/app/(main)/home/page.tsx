'use client'

import { useSongs } from '@/lib/hooks/useSongs'
import SongCard from '@/components/songs/SongCard'

export default function HomePage() {
  const { songs, loading } = useSongs()

  return (
    <div className="px-4 sm:px-6 py-6">
      <h1 className="text-xl font-bold mb-6 text-cv-text">Toutes les chansons</h1>

      {loading ? (
        <LoadingGrid />
      ) : songs.length === 0 ? (
        <p className="text-cv-muted text-sm py-20 text-center">Aucune chanson disponible.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {songs.map((s) => (
            <SongCard key={s.id} song={s} queue={songs} />
          ))}
        </div>
      )}
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2.5">
          <div className="aspect-square rounded-xl shimmer" />
          <div className="h-3 w-3/4 rounded shimmer mt-1" />
          <div className="h-3 w-1/2 rounded shimmer" />
        </div>
      ))}
    </div>
  )
}
