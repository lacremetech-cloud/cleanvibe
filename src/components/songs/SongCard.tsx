'use client'

import Image from 'next/image'
import { Song } from '@/types'
import { usePlayerStore } from '@/lib/store/usePlayerStore'
import { cn } from '@/lib/utils'

interface SongCardProps {
  song: Song
  queue?: Song[]
}

export default function SongCard({ song, queue }: SongCardProps) {
  const { playSong, currentSong, isPlaying, toggleExpanded } = usePlayerStore()
  const isCurrent = currentSong?.id === song.id

  function handleClick() {
    if (isCurrent) {
      toggleExpanded()
    } else {
      playSong(song, queue ?? [song])
      toggleExpanded()
    }
  }

  return (
    <div
      className={cn(
        'group flex flex-col gap-2 cursor-pointer rounded-xl p-1.5 transition-all duration-200',
        isCurrent ? 'bg-cv-card/80' : 'hover:bg-cv-card/40'
      )}
      onClick={handleClick}
    >
      {/* Cover */}
      <div className={cn(
        'relative aspect-square rounded-xl overflow-hidden bg-cv-card ring-2 transition-all duration-300',
        isCurrent ? 'ring-cv-primary shadow-lg shadow-cv-primary/30' : 'ring-transparent'
      )}>
        {song.cover_url ? (
          <Image src={song.cover_url} alt={song.title} fill className="object-cover" sizes="200px" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cv-primary to-violet-900 flex items-center justify-center">
            <span className="text-white text-3xl font-black opacity-40">{song.title.charAt(0)}</span>
          </div>
        )}

        {/* Overlay */}
        <div className={cn(
          'absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200',
          isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          {isCurrent && isPlaying ? (
            <EqualizerBars />
          ) : (
            <div className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="black">
                <path d="M3 2.5l10 5.5-10 5.5V2.5z" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 px-0.5 pb-0.5">
        <p className={cn(
          'text-sm font-semibold truncate leading-tight',
          isCurrent ? 'text-cv-light' : 'text-cv-text'
        )}>
          {song.title}
        </p>
        <p className="text-xs text-cv-muted truncate mt-0.5">{song.artist}</p>
      </div>
    </div>
  )
}

function EqualizerBars() {
  return (
    <>
      <div className="flex items-end gap-[3px] h-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-[4px] bg-white rounded-full"
            style={{
              height: '100%',
              animationName: 'eq-bar',
              animationDuration: `${0.5 + i * 0.15}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes eq-bar {
          from { transform: scaleY(0.25); transform-origin: bottom; }
          to   { transform: scaleY(1);    transform-origin: bottom; }
        }
      `}</style>
    </>
  )
}
