'use client'

import Image from 'next/image'
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react'
import { Song } from '@/types'
import { usePlayerStore } from '@/lib/store/usePlayerStore'
import { formatDuration, formatNumber, cn } from '@/lib/utils'

interface SongRowProps {
  song: Song
  index?: number
  queue?: Song[]
  onLike?: (songId: string) => void
  showPlays?: boolean
}

export default function SongRow({ song, index, queue, onLike, showPlays = false }: SongRowProps) {
  const { playSong, currentSong, isPlaying, pauseResume } = usePlayerStore()
  const isCurrentSong = currentSong?.id === song.id

  function handlePlay(e: React.MouseEvent) {
    e.stopPropagation()
    if (isCurrentSong) {
      pauseResume()
    } else {
      playSong(song, queue ?? [song])
    }
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150',
        isCurrentSong ? 'bg-[#7C3AED]/10' : 'hover:bg-[#1A1A35]'
      )}
      onClick={handlePlay}
    >
      {/* Index / play indicator */}
      <div className="w-6 flex-shrink-0 text-center">
        <span className={cn(
          'text-sm tabular-nums transition-all',
          isCurrentSong ? 'hidden' : 'group-hover:hidden text-[#64748B]'
        )}>
          {index !== undefined ? index + 1 : ''}
        </span>
        <button className={cn('transition-all', isCurrentSong ? 'block' : 'hidden group-hover:block')}>
          {isCurrentSong && isPlaying ? (
            <Pause className="w-4 h-4 text-[#A78BFA] fill-[#A78BFA]" />
          ) : (
            <Play className="w-4 h-4 text-[#F1F5F9] fill-[#F1F5F9]" />
          )}
        </button>
      </div>

      {/* Cover */}
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-[#1A1A35]">
        {song.cover_url ? (
          <Image src={song.cover_url} alt={song.title} width={40} height={40} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{song.title.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Title + artist */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', isCurrentSong ? 'text-[#A78BFA]' : 'text-[#F1F5F9]')}>
          {song.title}
        </p>
        <p className="text-xs text-[#64748B] truncate">{song.artist}</p>
      </div>

      {/* Genre badge */}
      {song.genre && (
        <span className="hidden md:block text-xs px-2.5 py-1 bg-[#2A2A50] text-[#94A3B8] rounded-full flex-shrink-0">
          {song.genre}
        </span>
      )}

      {/* Play count */}
      {showPlays && (
        <span className="hidden sm:block text-xs text-[#64748B] w-16 text-right tabular-nums flex-shrink-0">
          {formatNumber(song.play_count)}
        </span>
      )}

      {/* Duration + actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {onLike && (
          <button
            onClick={(e) => { e.stopPropagation(); onLike(song.id) }}
            className={cn(
              'p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all',
              song.is_liked ? 'opacity-100 text-[#A78BFA]' : 'text-[#64748B] hover:text-white'
            )}
          >
            <Heart className={cn('w-4 h-4', song.is_liked && 'fill-[#A78BFA]')} />
          </button>
        )}
        <span className="text-xs text-[#64748B] tabular-nums w-8 text-right">
          {formatDuration(song.duration)}
        </span>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-1 text-[#64748B] hover:text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-all"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
