'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  Play, Pause, SkipBack, SkipForward, Heart, ChevronDown,
  Shuffle, Repeat, Repeat1, Plus, Music,
} from 'lucide-react'
import { usePlayerStore } from '@/lib/store/usePlayerStore'
import { createClient } from '@/lib/supabase/client'
import { formatDuration, cn } from '@/lib/utils'
import { Song } from '@/types'

type Tab = 'suivre' | 'paroles' | 'similaires'

export default function AudioPlayer() {
  const {
    currentSong, isPlaying, volume, isMuted,
    currentTime, duration, isShuffled, repeatMode, isExpanded,
    pauseResume, next, prev,
    setCurrentTime, setDuration, toggleShuffle, toggleRepeat, toggleExpanded,
    queue, queueIndex,
  } = usePlayerStore()

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('suivre')
  const [similarSongs, setSimilarSongs] = useState<Song[]>([])

  // Audio source via signed URL
  useEffect(() => {
    if (!audioRef.current || !currentSong) return
    audioRef.current.src = `/api/audio/${currentSong.id}`
    audioRef.current.load()
    if (isPlaying) audioRef.current.play().catch(() => {})
    fetch(`/api/songs/${currentSong.id}/play`, { method: 'POST' }).catch(() => {})
    checkLiked(currentSong.id)
    if (currentSong.genre) fetchSimilar(currentSong.genre, currentSong.id)
    else setSimilarSongs([])
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
      .from('likes').select('song_id')
      .eq('user_id', user.id).eq('song_id', songId).maybeSingle()
    setIsLiked(!!data)
  }

  async function fetchSimilar(genre: string, excludeId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('songs').select('*')
      .eq('genre', genre).eq('is_published', true).neq('id', excludeId).limit(10)
    setSimilarSongs(data ?? [])
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

  // Audio element always mounted when there's a song
  if (!currentSong) return null

  const coverUrl = currentSong.cover_url
  const upcomingSongs = queue.slice(queueIndex + 1)

  return (
    <>
      {/* Hidden audio element — always active */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => { if (!isDragging && audioRef.current) setCurrentTime(audioRef.current.currentTime) }}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={next}
        preload="auto"
        className="hidden"
      />

      {/* Full-screen player */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
          {/* Background blur from cover */}
          <div className="absolute inset-0">
            {coverUrl ? (
              <>
                <Image src={coverUrl} alt="" fill className="object-cover scale-110 blur-3xl opacity-50" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-b from-cv-bg/50 via-cv-bg/80 to-cv-bg" />
              </>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-[#180a30] to-cv-bg" />
            )}
          </div>

          <div className="relative z-10 flex flex-col h-full max-w-md mx-auto w-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-12 pb-2 flex-shrink-0">
              <button
                onClick={toggleExpanded}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
              <p className="text-xs font-semibold text-cv-subtle tracking-widest uppercase">En lecture</p>
              <div className="w-10" />
            </div>

            {/* Cover Art — dominant */}
            <div className="flex justify-center px-8 py-3 flex-shrink-0">
              <div className={cn(
                'w-full max-w-[280px] aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/70 transition-all duration-500',
                isPlaying ? 'scale-100' : 'scale-[0.88] opacity-75'
              )}>
                {coverUrl ? (
                  <Image
                    src={coverUrl}
                    alt={currentSong.title}
                    width={280}
                    height={280}
                    className="w-full h-full object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-cv-primary to-violet-900 flex items-center justify-center">
                    <span className="text-white text-7xl font-bold">{currentSong.title.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Title + Actions */}
            <div className="px-6 flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex-1 min-w-0 mr-4">
                <h2 className="text-xl font-bold text-cv-text truncate">{currentSong.title}</h2>
                <p className="text-cv-muted text-sm truncate mt-0.5">{currentSong.artist}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleLike}
                  className={cn(
                    'w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90',
                    isLiked ? 'text-cv-primary' : 'text-cv-muted hover:text-cv-text'
                  )}
                >
                  <Heart className={cn('w-5 h-5', isLiked && 'fill-current')} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-full text-cv-muted hover:text-cv-text transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-6 mb-4 flex-shrink-0">
              <input
                type="range" min={0} max={duration || 100} value={currentTime}
                onChange={handleSeek}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onTouchStart={() => setIsDragging(true)}
                onTouchEnd={() => setIsDragging(false)}
                className="w-full h-1 appearance-none rounded-full cursor-pointer"
                style={{ background: `linear-gradient(to right, #A78BFA ${progress}%, #2A2A50 ${progress}%)` }}
              />
              <div className="flex justify-between mt-1.5 text-xs text-cv-muted tabular-nums">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="px-6 flex items-center justify-between mb-5 flex-shrink-0">
              <button
                onClick={toggleShuffle}
                className={cn('w-10 h-10 flex items-center justify-center rounded-full transition-colors', isShuffled ? 'text-cv-light' : 'text-cv-muted hover:text-cv-text')}
              >
                <Shuffle className="w-5 h-5" />
              </button>

              <button onClick={prev} className="w-12 h-12 flex items-center justify-center text-cv-text hover:text-white transition-colors">
                <SkipBack className="w-8 h-8 fill-current" />
              </button>

              <button
                onClick={pauseResume}
                className="w-[70px] h-[70px] bg-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform"
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
                className={cn('w-10 h-10 flex items-center justify-center rounded-full transition-colors', repeatMode !== 'none' ? 'text-cv-light' : 'text-cv-muted hover:text-cv-text')}
              >
                {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 flex-1 flex flex-col min-h-0">
              <div className="flex border-b border-cv-border flex-shrink-0">
                {(['suivre', 'paroles', 'similaires'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'flex-1 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors',
                      activeTab === tab
                        ? 'text-white border-b-2 border-cv-primary -mb-px'
                        : 'text-cv-muted hover:text-cv-subtle'
                    )}
                  >
                    {tab === 'suivre' ? 'À Suivre' : tab === 'paroles' ? 'Paroles' : 'Similaires'}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto py-3 pb-12">
                {activeTab === 'suivre' && (
                  upcomingSongs.length === 0
                    ? <p className="text-cv-muted text-sm text-center py-10">Aucune chanson suivante.</p>
                    : <div className="space-y-0.5">
                        {upcomingSongs.map((s) => (
                          <QueueRow key={s.id} song={s} queue={queue} />
                        ))}
                      </div>
                )}

                {activeTab === 'paroles' && (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Music className="w-10 h-10 text-cv-border mb-3" />
                    <p className="text-cv-muted text-sm">Paroles non disponibles</p>
                  </div>
                )}

                {activeTab === 'similaires' && (
                  similarSongs.length === 0
                    ? <p className="text-cv-muted text-sm text-center py-10">Aucune chanson similaire.</p>
                    : <div className="space-y-0.5">
                        {similarSongs.map((s) => (
                          <QueueRow key={s.id} song={s} queue={[...queue, ...similarSongs]} />
                        ))}
                      </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 14px; height: 14px; border-radius: 50%;
          background: white; cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }
        input[type='range']::-moz-range-thumb {
          width: 14px; height: 14px; border-radius: 50%;
          background: white; cursor: pointer; border: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </>
  )
}

function QueueRow({ song, queue }: { song: Song; queue: Song[] }) {
  const { playSong, currentSong, isPlaying } = usePlayerStore()
  const isCurrent = currentSong?.id === song.id

  return (
    <button
      onClick={() => playSong(song, queue)}
      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-cv-card/60 transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-cv-card flex-shrink-0">
        {song.cover_url
          ? <Image src={song.cover_url} alt={song.title} width={40} height={40} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-gradient-to-br from-cv-primary to-violet-900" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-medium truncate', isCurrent ? 'text-cv-light' : 'text-cv-text')}>
          {song.title}
        </p>
        <p className="text-xs text-cv-muted truncate">{song.artist}</p>
      </div>
      {isCurrent && isPlaying && (
        <div className="w-2 h-2 rounded-full bg-cv-primary animate-pulse flex-shrink-0" />
      )}
    </button>
  )
}
