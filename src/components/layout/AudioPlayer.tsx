'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2, VolumeX } from 'lucide-react'
import { usePlayerStore } from '@/lib/store/usePlayerStore'
import { formatDuration } from '@/lib/utils'

export default function AudioPlayer() {
  const {
    currentSong, isPlaying, volume, isMuted,
    currentTime, duration,
    pauseResume, next, prev, setVolume, toggleMute,
    setCurrentTime, setDuration,
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.play().catch(() => {})
    else audioRef.current.pause()
  }, [isPlaying])

  useEffect(() => {
    if (!audioRef.current || !currentSong) return
    audioRef.current.src = currentSong.audio_url
    audioRef.current.load()
    if (isPlaying) audioRef.current.play().catch(() => {})
    fetch(`/api/songs/${currentSong.id}/play`, { method: 'POST' }).catch(() => {})
  }, [currentSong?.id])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const t = parseFloat(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = t
    setCurrentTime(t)
  }

  if (!currentSong) return null

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={next}
        preload="metadata"
      />

      {/* Player bar — au-dessus de la bottom nav sur mobile */}
      <div className="fixed bottom-0 md:bottom-0 left-0 right-0 z-30 bg-[#0A0A15]/95 backdrop-blur-xl border-t border-[#1A1A35]" style={{ bottom: 'calc(var(--bottom-nav-height, 0px))' }}>
        {/* Seek bar fine tout en haut */}
        <div className="h-[2px] bg-[#1A1A35]">
          <div className="h-full bg-[#7C3AED] transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>

        <div className="px-4 py-3 flex items-center gap-3">
          {/* Cover + info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1A1A35] flex-shrink-0">
              {currentSong.cover_url ? (
                <Image src={currentSong.cover_url} alt={currentSong.title} width={40} height={40} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-violet-900" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-white">{currentSong.title}</p>
              <p className="text-xs text-[#64748B] truncate">{currentSong.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={prev} className="p-2 text-[#64748B] hover:text-white transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={pauseResume}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform flex-shrink-0"
            >
              {isPlaying
                ? <Pause className="w-4 h-4 text-black fill-black" />
                : <Play className="w-4 h-4 text-black fill-black ml-0.5" />}
            </button>
            <button onClick={next} className="p-2 text-[#64748B] hover:text-white transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Volume — desktop only */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 w-28">
            <button onClick={toggleMute} className="text-[#64748B] hover:text-white transition-colors">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range" min={0} max={1} step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-1 accent-[#7C3AED]"
              style={{ background: `linear-gradient(to right,#7C3AED ${(isMuted ? 0 : volume) * 100}%,#2A2A50 ${(isMuted ? 0 : volume) * 100}%)` }}
            />
          </div>

          {/* Time — desktop only */}
          <div className="hidden md:flex items-center gap-1 text-xs text-[#64748B] tabular-nums flex-shrink-0">
            <span>{formatDuration(currentTime)}</span>
            <span>/</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Seek bar interactive — desktop */}
        <div className="hidden md:block px-4 pb-2">
          <input
            type="range" min={0} max={duration || 100} value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 accent-[#7C3AED]"
            style={{ background: `linear-gradient(to right,#7C3AED ${progress}%,#2A2A50 ${progress}%)` }}
          />
        </div>
      </div>

      {/* Spacer pour le player sur mobile — au-dessus de la bottom nav */}
      <style>{`
        @media (max-width: 767px) {
          :root { --bottom-nav-height: 64px; }
        }
      `}</style>
    </>
  )
}
