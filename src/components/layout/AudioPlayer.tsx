'use client'

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, Repeat1, Heart,
} from 'lucide-react'
import { usePlayerStore } from '@/lib/store/usePlayerStore'
import { formatDuration } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

export default function AudioPlayer() {
  const {
    currentSong, isPlaying, volume, isMuted,
    currentTime, duration, isShuffled, repeatMode,
    pauseResume, next, prev, setVolume, toggleMute,
    setCurrentTime, setDuration, toggleShuffle, toggleRepeat,
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Sync isPlaying with audio element
  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Load new song when currentSong changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return
    audioRef.current.src = currentSong.audio_url
    audioRef.current.load()
    if (isPlaying) audioRef.current.play().catch(() => {})

    // Track play in DB
    trackPlay(currentSong.id)
  }, [currentSong?.id])

  // Sync volume
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const trackPlay = useCallback(async (songId: string) => {
    try {
      await fetch(`/api/songs/${songId}/play`, { method: 'POST' })
    } catch {}
  }, [])

  function onTimeUpdate() {
    if (!audioRef.current) return
    setCurrentTime(audioRef.current.currentTime)
  }

  function onLoadedMetadata() {
    if (!audioRef.current) return
    setDuration(audioRef.current.duration)
  }

  function onEnded() {
    next()
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const time = parseFloat(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = time
    setCurrentTime(time)
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVolume(parseFloat(e.target.value))
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  if (!currentSong) return null

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        preload="metadata"
      />

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0A0A15]/95 backdrop-blur-xl border-t border-[#2A2A50]/60 px-4 py-3">
        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px]">
          <div
            className="h-full bg-[#7C3AED] transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto flex items-center gap-4">
          {/* Song info */}
          <div className="flex items-center gap-3 w-[240px] flex-shrink-0 min-w-0">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1A1A35]">
              {currentSong.cover_url ? (
                <Image
                  src={currentSong.cover_url}
                  alt={currentSong.title}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {currentSong.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#F1F5F9] truncate">{currentSong.title}</p>
              <p className="text-xs text-[#64748B] truncate">{currentSong.artist}</p>
            </div>
            <LikeButton songId={currentSong.id} />
          </div>

          {/* Controls (center) */}
          <div className="flex-1 flex flex-col items-center gap-2 max-w-xl mx-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleShuffle}
                className={`p-1.5 rounded-full transition-colors ${isShuffled ? 'text-[#A78BFA]' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={prev}
                className="p-2 text-[#94A3B8] hover:text-white transition-colors"
                title="Previous"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={pauseResume}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg active:scale-95"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-[#0A0A15] fill-current" />
                ) : (
                  <Play className="w-4 h-4 text-[#0A0A15] fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={next}
                className="p-2 text-[#94A3B8] hover:text-white transition-colors"
                title="Next"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-1.5 rounded-full transition-colors ${repeatMode !== 'none' ? 'text-[#A78BFA]' : 'text-[#64748B] hover:text-[#94A3B8]'}`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>
            </div>

            {/* Seek bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-xs text-[#64748B] w-8 text-right tabular-nums">{formatDuration(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1 accent-[#7C3AED]"
                style={{
                  background: `linear-gradient(to right, #7C3AED ${progress}%, #2A2A50 ${progress}%)`,
                }}
              />
              <span className="text-xs text-[#64748B] w-8 tabular-nums">{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Volume (right) */}
          <div className="flex items-center gap-2 w-[180px] flex-shrink-0 justify-end">
            <button
              onClick={toggleMute}
              className="text-[#64748B] hover:text-[#94A3B8] transition-colors p-1"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-1 accent-[#7C3AED]"
              style={{
                background: `linear-gradient(to right, #7C3AED ${(isMuted ? 0 : volume) * 100}%, #2A2A50 ${(isMuted ? 0 : volume) * 100}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

function LikeButton({ songId }: { songId: string }) {
  const handleLike = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('likes').select('song_id').eq('user_id', user.id).eq('song_id', songId).single()
      if (data) {
        await supabase.from('likes').delete().match({ user_id: user.id, song_id: songId })
      } else {
        await supabase.from('likes').insert({ user_id: user.id, song_id: songId })
      }
    } catch {}
  }

  return (
    <button
      onClick={handleLike}
      className="p-1 text-[#64748B] hover:text-[#A78BFA] transition-colors flex-shrink-0"
      title="Like"
    >
      <Heart className="w-4 h-4" />
    </button>
  )
}
