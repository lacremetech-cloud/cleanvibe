'use client'

import { useSongs } from '@/lib/hooks/useSongs'
import { useAuth } from '@/lib/hooks/useAuth'
import SongCard from '@/components/songs/SongCard'
import SongRow from '@/components/songs/SongRow'
import Spinner from '@/components/ui/Spinner'
import { TrendingUp, Clock, Sparkles } from 'lucide-react'

const GENRES = ['Nasheed', 'Rap', 'R&B', 'Lo-fi', 'Pop', 'Acoustic']

export default function HomePage() {
  const { profile } = useAuth()
  const { songs: allSongs, loading, toggleLike } = useSongs({ limit: 50 })
  const { songs: newReleases } = useSongs({ limit: 8 })
  const { songs: trending } = useSongs({ limit: 10 })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="px-6 py-8 space-y-10">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold mb-1">
          {greeting}{profile?.display_name ? `, ${profile.display_name}` : ''} 👋
        </h1>
        <p className="text-[#64748B] text-sm">What do you want to listen to today?</p>
      </div>

      {/* Quick picks — horizontal scroll */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-[#A78BFA]" />
          <h2 className="text-lg font-semibold">New Releases</h2>
        </div>
        {newReleases.length === 0 ? (
          <EmptySection message="No songs yet. Check back soon!" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {newReleases.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                queue={newReleases}
                onLike={toggleLike}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trending */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-[#A78BFA]" />
          <h2 className="text-lg font-semibold">Trending Now</h2>
        </div>
        {trending.length === 0 ? (
          <EmptySection message="Nothing trending yet." />
        ) : (
          <div className="bg-[#12122A] border border-[#2A2A50] rounded-2xl overflow-hidden">
            <div className="divide-y divide-[#2A2A50]/40">
              {trending.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={i}
                  queue={trending}
                  onLike={toggleLike}
                  showPlays
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Browse by genre */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[#A78BFA]" />
          <h2 className="text-lg font-semibold">Browse by Genre</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {GENRES.map((genre, i) => (
            <GenreCard key={genre} genre={genre} colorIndex={i} />
          ))}
        </div>
      </section>

      {/* All songs */}
      {allSongs.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">All Songs</h2>
          <div className="bg-[#12122A] border border-[#2A2A50] rounded-2xl overflow-hidden">
            <div className="divide-y divide-[#2A2A50]/40">
              {allSongs.map((song, i) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={i}
                  queue={allSongs}
                  onLike={toggleLike}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function EmptySection({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-10 text-[#64748B] text-sm bg-[#12122A] rounded-2xl border border-[#2A2A50]">
      {message}
    </div>
  )
}

const genreColors = [
  'from-violet-600 to-violet-900',
  'from-purple-600 to-purple-900',
  'from-indigo-600 to-indigo-900',
  'from-blue-600 to-blue-900',
  'from-cyan-600 to-cyan-900',
  'from-teal-600 to-teal-900',
]

function GenreCard({ genre, colorIndex }: { genre: string; colorIndex: number }) {
  return (
    <a
      href={`/search?genre=${encodeURIComponent(genre)}`}
      className={`relative overflow-hidden rounded-xl p-4 h-20 flex items-end bg-gradient-to-br ${genreColors[colorIndex % genreColors.length]} hover:scale-[1.02] transition-transform cursor-pointer`}
    >
      <span className="text-sm font-bold text-white relative z-10">{genre}</span>
    </a>
  )
}
