'use client'

import { create } from 'zustand'
import { Song } from '@/types'

interface PlayerState {
  currentSong: Song | null
  queue: Song[]
  queueIndex: number
  isPlaying: boolean
  volume: number
  isMuted: boolean
  currentTime: number
  duration: number
  isShuffled: boolean
  repeatMode: 'none' | 'one' | 'all'

  // Actions
  playSong: (song: Song, queue?: Song[]) => void
  pauseResume: () => void
  next: () => void
  prev: () => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  addToQueue: (song: Song) => void
  clearQueue: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  volume: 0.8,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  isShuffled: false,
  repeatMode: 'none',

  playSong: (song, queue) => {
    const newQueue = queue ?? [song]
    const idx = newQueue.findIndex((s) => s.id === song.id)
    set({
      currentSong: song,
      queue: newQueue,
      queueIndex: idx >= 0 ? idx : 0,
      isPlaying: true,
      currentTime: 0,
    })
  },

  pauseResume: () => set((s) => ({ isPlaying: !s.isPlaying })),

  next: () => {
    const { queue, queueIndex, isShuffled, repeatMode } = get()
    if (queue.length === 0) return

    let nextIdx: number
    if (repeatMode === 'one') {
      nextIdx = queueIndex
    } else if (isShuffled) {
      nextIdx = Math.floor(Math.random() * queue.length)
    } else {
      nextIdx = queueIndex + 1
      if (nextIdx >= queue.length) {
        nextIdx = repeatMode === 'all' ? 0 : queueIndex
      }
    }

    set({ currentSong: queue[nextIdx], queueIndex: nextIdx, currentTime: 0, isPlaying: true })
  },

  prev: () => {
    const { queue, queueIndex, currentTime } = get()
    if (currentTime > 3) {
      // Restart current song if past 3s
      set({ currentTime: 0 })
      return
    }
    const prevIdx = Math.max(0, queueIndex - 1)
    set({ currentSong: queue[prevIdx], queueIndex: prevIdx, currentTime: 0, isPlaying: true })
  },

  setVolume: (volume) => set({ volume, isMuted: volume === 0 }),
  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  toggleShuffle: () => set((s) => ({ isShuffled: !s.isShuffled })),
  toggleRepeat: () =>
    set((s) => ({
      repeatMode: s.repeatMode === 'none' ? 'all' : s.repeatMode === 'all' ? 'one' : 'none',
    })),
  addToQueue: (song) => set((s) => ({ queue: [...s.queue, song] })),
  clearQueue: () => set({ queue: [], queueIndex: 0 }),
}))
