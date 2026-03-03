'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search as SearchIcon } from 'lucide-react'
import { useSongs } from '@/lib/hooks/useSongs'
import SongRow from '@/components/songs/SongRow'
import SongCard from '@/components/songs/SongCard'
import Spinner from '@/components/ui/Spinner'
import Header from '@/components/layout/Header'

const GENRES = ['Nasheed', 'Rap', 'R&B', 'Lo-fi', 'Pop', 'Acoustic', 'Classical', 'Electronic']

const genreColors = [
  'from-violet-600 to-violet-900',
  'from-purple-600 to-purple-900',
  'from-indigo-600 to-indigo-900',
  'from-blue-600 to-blue-900',
  'from-cyan-600 to-cyan-900',
  'from-teal-600 to-teal-900',
  'from-emerald-600 to-emerald-900',
  'from-pink-600 to-pink-900',
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''
  const initialGenre = searchParams.get('genre') ?? undefined

  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(initialGenre)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const { songs, loading, toggleLike } = useSongs({
    search: debouncedQuery || undefined,
    genre: selectedGenre,
  })

  const showBrowse = !debouncedQuery && !selectedGenre

  return (
    <div className="flex flex-col h-full">
      {/* Custom header with search */}
      <div className="px-6 py-4 border-b border-[#2A2A50]/40 bg-[#0A0A15]/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="relative max-w-lg">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, artists, genres…"
            className="w-full bg-[#1A1A35] border border-[#2A2A50] rounded-full pl-10 pr-4 py-3 text-sm text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#7C3AED] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Genre filter chips */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGenre(undefined)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              !selectedGenre
                ? 'bg-[#7C3AED] text-white'
                : 'bg-[#1A1A35] border border-[#2A2A50] text-[#94A3B8] hover:border-[#7C3AED]/50'
            }`}
          >
            All
          </button>
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(selectedGenre === genre ? undefined : genre)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedGenre === genre
                  ? 'bg-[#7C3AED] text-white'
                  : 'bg-[#1A1A35] border border-[#2A2A50] text-[#94A3B8] hover:border-[#7C3AED]/50'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Browse grid (when no search query) */}
        {showBrowse && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Browse All</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {GENRES.map((genre, i) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`relative overflow-hidden rounded-xl p-5 h-24 flex items-end bg-gradient-to-br ${genreColors[i]} hover:scale-[1.02] transition-transform text-left`}
                >
                  <span className="text-base font-bold text-white">{genre}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Results */}
        {(debouncedQuery || selectedGenre) && (
          <section>
            <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-widest mb-4">
              {loading ? 'Searching…' : `${songs.length} result${songs.length !== 1 ? 's' : ''}`}
            </h2>

            {loading ? (
              <div className="flex justify-center py-16">
                <Spinner size="lg" />
              </div>
            ) : songs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <SearchIcon className="w-10 h-10 text-[#2A2A50] mb-3" />
                <p className="text-[#64748B]">No results for &ldquo;{debouncedQuery || selectedGenre}&rdquo;</p>
                <p className="text-sm text-[#64748B]/70 mt-1">Try a different search or genre</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {songs.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    queue={songs}
                    onLike={toggleLike}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
