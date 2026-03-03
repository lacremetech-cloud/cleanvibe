'use client'

import Image from 'next/image'
import { Play, Heart, MoreHorizontal, Plus } from 'lucide-react'
import { Song } from '@/types'
import { usePlayerStore } from '@/lib/store/usePlayerStore'
import { formatDuration } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SongCardProps {
  song: Song
  queue?: Song[]
  onLike?: (songId: string) => void
}

export default function SongCard({ song, queue, onLike }: SongCardProps) {
  const { playSong, currentSong, isPlaying } = usePlayerStore()
  const isCurrentSong = currentSong?.id === song.id

  return (
    <div
      className={cn(
        'group relative bg-[#12122A] border rounded-2xl p-4 cursor-pointer transition-all duration-300 hover:border-[#7C3AED]/40 hover:bg-[#1A1A35]',
        isCurrentSong ? 'border-[#7C3AED]/60 bg-[#1A1A35]' : 'border-[#2A2A50]'
      )}
      onClick={() => playSong(song, queue ?? [song])}
    >
      {/* Cover art */}
      <div className="relative mb-3 aspect-square rounded-xl overflow-hidden">
        {song.cover_url ? (
          <Image
            src={song.cover_url}
            alt={song.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 200px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center">
            <span className="text-white text-4xl font-bold opacity-60">
              {song.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Play overlay */}
        <div className={cn(
          'absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200',
          isCurrentSong && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}>
          <div className="w-12 h-12 bg-[#7C3AED] rounded-full flex items-center justify-center shadow-xl shadow-violet-500/40 scale-90 group-hover:scale-100 transition-transform">
            {isCurrentSong && isPlaying ? (
              <div className="flex items-end gap-[3px] h-5 pb-0.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1 bg-white rounded-full animate-pulse-slow" style={{ height: `${40 + i * 20}%`, animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            ) : (
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            )}
          </div>
        </div>

        {/* Liked indicator */}
        {song.is_liked && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-[#7C3AED] rounded-full flex items-center justify-center">
            <Heart className="w-3 h-3 text-white fill-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0">
        <p className={cn('font-semibold text-sm truncate mb-0.5', isCurrentSong ? 'text-[#A78BFA]' : 'text-[#F1F5F9]')}>
          {song.title}
        </p>
        <p className="text-xs text-[#64748B] truncate">{song.artist}</p>
        {song.duration && (
          <p className="text-xs text-[#64748B]/60 mt-1">{formatDuration(song.duration)}</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onLike && (
          <button
            onClick={(e) => { e.stopPropagation(); onLike(song.id) }}
            className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm',
              song.is_liked
                ? 'bg-[#7C3AED] text-white'
                : 'bg-black/40 text-[#94A3B8] hover:text-white'
            )}
            title={song.is_liked ? 'Unlike' : 'Like'}
          >
            <Heart className={cn('w-3.5 h-3.5', song.is_liked && 'fill-white')} />
          </button>
        )}
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
          title="More options"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
