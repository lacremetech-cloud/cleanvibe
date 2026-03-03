'use client'

import { useSongs } from '@/lib/hooks/useSongs'
import { useAuth } from '@/lib/hooks/useAuth'
import SongCard from '@/components/songs/SongCard'
import SongRow from '@/components/songs/SongRow'
import Spinner from '@/components/ui/Spinner'

const GENRES = [
  { label: 'Nasheed',    color: 'from-violet-600 to-violet-900' },
  { label: 'Rap',        color: 'from-purple-600 to-purple-900' },
  { label: 'R&B',        color: 'from-indigo-600 to-indigo-900' },
  { label: 'Lo-fi',      color: 'from-blue-600 to-blue-900' },
  { label: 'Acoustique', color: 'from-cyan-600 to-cyan-900' },
  { label: 'Électro',    color: 'from-teal-600 to-teal-900' },
]

export default function HomePage() {
  const { profile } = useAuth()
  const { songs: newSongs, loading: loadingNew, toggleLike } = useSongs({ limit: 8 })
  const { songs: trending, loading: loadingTrend } = useSongs({ limit: 8 })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  return (
    <div className="px-4 sm:px-6 py-6 space-y-8 max-w-6xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          {greeting}{profile?.display_name ? `, ${profile.display_name}` : ''} 
        </h1>
        <p className="text-[#64748B] text-sm mt-0.5">Qu'est-ce qu'on écoute aujourd'hui ?</p>
      </div>

      {/* Nouveautés */}
      <section>
        <h2 className="text-base font-semibold mb-3 text-[#94A3B8] uppercase tracking-widest text-xs">Nouveautés</h2>
        {loadingNew ? <LoadingGrid /> : newSongs.length === 0 ? <Empty /> : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {newSongs.map((s) => <SongCard key={s.id} song={s} queue={newSongs} onLike={toggleLike} />)}
          </div>
        )}
      </section>

      {/* Tendances */}
      <section>
        <h2 className="text-xs font-semibold mb-3 text-[#94A3B8] uppercase tracking-widest">Tendances</h2>
        {loadingTrend ? <Spinner className="mx-auto" /> : trending.length === 0 ? <Empty /> : (
          <div className="bg-[#0D0D20] border border-[#1A1A35] rounded-2xl overflow-hidden">
            {trending.map((s, i) => (
              <SongRow key={s.id} song={s} index={i} queue={trending} onLike={toggleLike} showPlays />
            ))}
          </div>
        )}
      </section>

      {/* Genres */}
      <section>
        <h2 className="text-xs font-semibold mb-3 text-[#94A3B8] uppercase tracking-widest">Genres</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {GENRES.map(({ label, color }) => (
            <a
              key={label}
              href={`/search?genre=${encodeURIComponent(label)}`}
              className={`rounded-xl p-4 h-16 flex items-end bg-gradient-to-br ${color} hover:scale-[1.02] transition-transform`}
            >
              <span className="text-sm font-bold text-white">{label}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="aspect-square rounded-2xl shimmer" />
      ))}
    </div>
  )
}

function Empty() {
  return <p className="text-[#64748B] text-sm py-8 text-center">Aucune chanson pour le moment.</p>
}
