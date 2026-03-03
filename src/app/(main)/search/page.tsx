'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search as SearchIcon } from 'lucide-react'
import { useSongs } from '@/lib/hooks/useSongs'
import SongCard from '@/components/songs/SongCard'
import Spinner from '@/components/ui/Spinner'

const GENRES = ['Nasheed', 'Rap', 'R&B', 'Lo-fi', 'Acoustique', 'Électro', 'Classique', 'Pop']
const GENRE_COLORS = [
  'from-violet-600 to-violet-900', 'from-purple-600 to-purple-900',
  'from-indigo-600 to-indigo-900', 'from-blue-600 to-blue-900',
  'from-cyan-600 to-cyan-900',    'from-teal-600 to-teal-900',
  'from-emerald-600 to-emerald-900', 'from-pink-600 to-pink-900',
]

function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [debounced, setDebounced] = useState(query)
  const [genre, setGenre] = useState<string | undefined>(searchParams.get('genre') ?? undefined)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 280)
    return () => clearTimeout(t)
  }, [query])

  const { songs, loading, toggleLike } = useSongs({ search: debounced || undefined, genre })

  return (
    <div className="px-4 sm:px-6 py-6 space-y-6 max-w-6xl mx-auto">
      {/* Search input */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Titres, artistes, genres…"
          className="w-full bg-[#0D0D20] border border-[#1A1A35] focus:border-[#7C3AED] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder:text-[#64748B] outline-none transition-colors"
        />
      </div>

      {/* Genre chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setGenre(undefined)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${!genre ? 'bg-[#7C3AED] text-white' : 'bg-[#0D0D20] border border-[#1A1A35] text-[#64748B] hover:text-white'}`}
        >
          Tout
        </button>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(genre === g ? undefined : g)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${genre === g ? 'bg-[#7C3AED] text-white' : 'bg-[#0D0D20] border border-[#1A1A35] text-[#64748B] hover:text-white'}`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Browse genres (no query) */}
      {!debounced && !genre && (
        <section>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-3">Parcourir par genre</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {GENRES.map((g, i) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`rounded-xl p-5 h-20 flex items-end text-left bg-gradient-to-br ${GENRE_COLORS[i]} hover:scale-[1.02] transition-transform`}
              >
                <span className="text-sm font-bold text-white">{g}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Results */}
      {(debounced || genre) && (
        <section>
          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : songs.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <SearchIcon className="w-8 h-8 text-[#2A2A50] mb-3" />
              <p className="text-[#64748B] text-sm">Aucun résultat pour « {debounced || genre} »</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-[#64748B] mb-3">{songs.length} résultat{songs.length > 1 ? 's' : ''}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {songs.map((s) => <SongCard key={s.id} song={s} queue={songs} onLike={toggleLike} />)}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-32"><Spinner size="lg" /></div>}>
      <SearchContent />
    </Suspense>
  )
}
