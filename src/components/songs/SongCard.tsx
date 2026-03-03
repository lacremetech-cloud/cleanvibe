'use client'

import Image from 'next/image'
import { Play, Heart, Pause } from 'lucide-react'
import { Song } from '@/types'
import { usePlayerStore } from '@/lib/store/usePlayerStore'
import { cn } from '@/lib/utils'

interface SongCardProps {
  song: Song
  queue?: Song[]
  onLike?: (songId: string) => void
}

export default function SongCard({ song, queue, onLike }: SongCardProps) {
  const { playSong, currentSong, isPlaying, pauseResume } = usePlayerStore()
  const isCurrent = currentSong?.id === song.id

  function handlePlay(e: React.MouseEvent) {
    e.stopPropagation()
    if (isCurrent) { pauseResume(); return }
    playSong(song, queue ?? [song])
  }

  return (
    <div className="group flex flex-col gap-2.5 cursor-pointer" onClick={handlePlay}>
      {/* Cover */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#0D0D20]">
        {song.cover_url ? (
          <Image src={song.cover_url} alt={song.title} fill className="object-cover" sizes="200px" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center">
            <span className="text-white text-3xl font-black opacity-40">{song.title.charAt(0)}</span>
          </div>
        )}

        {/* Play overlay */}
        <div className={cn(
          'absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-200',
          isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
            {isCurrent && isPlaying
              ? <Pause className="w-4 h-4 text-black fill-black" />
              : <Play className="w-4 h-4 text-black fill-black ml-0.5" />}
          </div>
        </div>

        {/* Like */}
        {onLike && (
          <button
            onClick={(e) => { e.stopPropagation(); onLike(song.id) }}
            className={cn(
              'absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all',
              'opacity-0 group-hover:opacity-100',
              song.is_liked && 'opacity-100 bg-[#7C3AED]'
            )}
          >
            <Heart className={cn('w-3.5 h-3.5', song.is_liked ? 'text-white fill-white' : 'text-white')} />
          </button>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <p className={cn('text-sm font-semibold truncate', isCurrent ? 'text-[#A78BFA]' : 'text-white')}>
          {song.title}
        </p>
        <p className="text-xs text-[#64748B] truncate">{song.artist}</p>
      </div>
    </div>
  )
}
