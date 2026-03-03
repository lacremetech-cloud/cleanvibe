'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Play, Pause, SkipBack, SkipForward, Heart,
  Shuffle, Repeat, Repeat1, ChevronDown, Volume2, VolumeX,
} from 'lucide-react'
import { usePlayerStore } from '@/lib/store/usePlayerStore'
import { createClient } from '@/lib/supabase/client'
import { formatDuration } from '@/lib/utils'

export default function AudioPlayer() {
  const {
    currentSong, isPlaying, volume, isMuted,
    currentTime, duration, isShuffled, repeatMode, isExpanded,
    pauseResume, next, prev, setVolume, toggleMute,
    setCurrentTime, setDuration, toggleShuffle, toggleRepeat, toggleExpanded,
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Chargement audio via route sécurisée (signed URL)
  useEffect(() => {
    if (!audioRef.current || !currentSong) return
    audioRef.current.src = `/api/audio/${currentSong.id}`
    audioRef.current.load()
    if (isPlaying) audioRef.current.play().catch(() => {})
    fetch(`/api/songs/${currentSong.id}/play`, { method: 'POST' }).catch(() => {})
    checkLiked(currentSong.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id])

  useEffect(() => {
    if (!audioRef.current) return
    if (isPlaying) audioRef.current.play().catch(() => {})
    else audioRef.current.pause()
  }, [isPlaying])

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = isMuted ? 0 : volume
  }, [volume, isMuted])

  async function checkLiked(songId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('likes')
      .select('song_id')
      .eq('user_id', user.id)
      .eq('song_id', songId)
      .maybeSingle()
    setIsLiked(!!data)
  }

  async function handleLike() {
    if (!currentSong) return
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (isLiked) {
      await supabase.from('likes').delete().match({ user_id: user.id, song_id: currentSong.id })
    } else {
      await supabase.from('likes').insert({ user_id: user.id, song_id: currentSong.id })
    }
    setIsLiked(!isLiked)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const t = parseFloat(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = t
    setCurrentTime(t)
  }

  if (!currentSong) return null

  const coverUrl = currentSong.cover_url

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => { if (!isDragging && audioRef.current) setCurrentTime(audioRef.current.currentTime) }}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={next}
        preload="auto"
      />

      {/* ── EXPANDED PLAYER ── */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
          {/* Fond flouté */}
          <div className="absolute inset-0">
            {coverUrl
              ? <Image src={coverUrl} alt="" fill className="object-cover scale-125 blur-3xl opacity-40" unoptimized />
              : <div className="absolute inset-0 bg-gradient-to-b from-[#1a0533] to-cv-bg" />}
            <div className="absolute inset-0 bg-cv-bg/75" />
          </div>

          <div className="relative z-10 flex flex-col h-full max-w-sm mx-auto w-full px-6">
            {/* Header */}
            <div className="flex items-center justify-between pt-12 pb-4">
              <button
                onClick={toggleExpanded}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
              <span className="text-sm font-semibold text-cv-subtle tracking-wide uppercase">En lecture</span>
              <div className="w-10" />
            </div>

            {/* Cover Art */}
            <div className="flex justify-center my-6">
              <div className={`w-72 h-72 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 transition-all duration-500 ${isPlaying ? 'scale-100' : 'scale-90 opacity-80'}`}>
                {coverUrl
                  ? <Image src={coverUrl} alt={currentSong.title} width={288} height={288} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-cv-primary to-violet-900 flex items-center justify-center">
                      <span className="text-white text-7xl font-bold">{currentSong.title.charAt(0)}</span>
                    </div>}
              </div>
            </div>

            {/* Titre + Like */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-2xl font-bold text-cv-text truncate">{currentSong.title}</p>
                <p className="text-cv-muted mt-0.5 truncate">{currentSong.artist}</p>
              </div>
              <button
                onClick={handleLike}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 ${isLiked ? 'text-cv-primary' : 'text-cv-muted hover:text-cv-text'}`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="mb-2">
              <input
                type="range" min={0} max={duration || 100} value={currentTime}
                onChange={handleSeek}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="w-full appearance-none h-1 rounded-full cursor-pointer"
                style={{ background: `linear-gradient(to right, #7C3AED ${progress}%, #2A2A50 ${progress}%)` }}
              />
              <div className="flex justify-between mt-1.5 text-xs text-cv-muted tabular-nums">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            {/* Contrôles principaux */}
            <div className="flex items-center justify-between mt-4 mb-6">
              <button
                onClick={toggleShuffle}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isShuffled ? 'text-cv-primary' : 'text-cv-muted hover:text-cv-text'}`}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button onClick={prev} className="w-12 h-12 flex items-center justify-center text-cv-text hover:text-white transition-colors">
                <SkipBack className="w-8 h-8 fill-current" />
              </button>

              <button
                onClick={pauseResume}
                className="w-18 h-18 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
                style={{ width: '72px', height: '72px' }}
              >
                {isPlaying
                  ? <Pause className="w-8 h-8 text-black fill-black" />
                  : <Play className="w-8 h-8 text-black fill-black ml-1" />}
              </button>

              <button onClick={next} className="w-12 h-12 flex items-center justify-center text-cv-text hover:text-white transition-colors">
                <SkipForward className="w-8 h-8 fill-current" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${repeatMode !== 'none' ? 'text-cv-primary' : 'text-cv-muted hover:text-cv-text'}`}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </button>
            </div>

            {/* Volume (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <button onClick={toggleMute} className="text-cv-muted hover:text-cv-text transition-colors">
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range" min={0} max={1} step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-1 appearance-none h-1 rounded-full cursor-pointer"
                style={{ background: `linear-gradient(to right, #7C3AED ${(isMuted ? 0 : volume) * 100}%, #2A2A50 ${(isMuted ? 0 : volume) * 100}%)` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── MINI PLAYER BAR ── */}
      {!isExpanded && (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40">
          {/* Barre de progression fine */}
          <div className="h-[3px] bg-cv-border">
            <div className="h-full bg-cv-primary transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <div className="bg-cv-surface/95 backdrop-blur-xl border-t border-cv-border px-3 py-2.5 flex items-center gap-2">
            {/* Cover + infos — cliquable pour expand */}
            <button onClick={toggleExpanded} className="flex items-center gap-3 flex-1 min-w-0 text-left">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-cv-card flex-shrink-0 shadow-lg">
                {coverUrl
                  ? <Image src={coverUrl} alt={currentSong.title} width={48} height={48} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-cv-primary to-violet-900" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-cv-text truncate">{currentSong.title}</p>
                <p className="text-xs text-cv-muted truncate">{currentSong.artist}</p>
              </div>
            </button>

            {/* Contrôles droite */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button
                onClick={handleLike}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90 ${isLiked ? 'text-cv-primary' : 'text-cv-muted hover:text-cv-text'}`}
              >
                <Heart className={`w-4.5 h-4.5 ${isLiked ? 'fill-current' : ''}`} style={{ width: '18px', height: '18px' }} />
              </button>

              <button onClick={prev} className="w-9 h-9 flex items-center justify-center text-cv-muted hover:text-cv-text transition-colors">
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={pauseResume}
                className="w-11 h-11 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md mx-0.5"
              >
                {isPlaying
                  ? <Pause className="w-4 h-4 text-black fill-black" />
                  : <Play className="w-4 h-4 text-black fill-black ml-0.5" />}
              </button>

              <button onClick={next} className="w-9 h-9 flex items-center justify-center text-cv-muted hover:text-cv-text transition-colors">
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
        input[type='range']::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.4);
        }
      `}</style>
    </>
  )
}
