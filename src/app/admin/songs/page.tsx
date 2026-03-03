'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Upload, Pencil, Trash2, X, Music, ImageIcon,
  CheckCircle, AlertCircle, Plus, Download,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Song } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import { formatNumber, formatDuration, formatDate } from '@/lib/utils'

const GENRES = ['Nasheed', 'Rap', 'R&B', 'Lo-fi', 'Pop', 'Acoustic', 'Classical', 'Electronic', 'Other']

const uploadSchema = z.object({
  title:  z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  album:  z.string().optional(),
  genre:  z.string().optional(),
})
type UploadForm = z.infer<typeof uploadSchema>

export default function AdminSongsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const audioFileRef = useRef<HTMLInputElement>(null)
  const coverFileRef = useRef<HTMLInputElement>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
  })

  useEffect(() => { fetchSongs() }, [])

  async function fetchSongs() {
    const supabase = createClient()
    const { data } = await supabase.from('songs').select('*').order('created_at', { ascending: false })
    setSongs(data ?? [])
    setLoading(false)
  }

  function notify(type: 'success' | 'error', message: string) {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  function openEditForm(song: Song) {
    setEditingSong(song)
    setValue('title', song.title)
    setValue('artist', song.artist)
    setValue('album', song.album ?? '')
    setValue('genre', song.genre ?? '')
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditingSong(null)
    setAudioFile(null)
    setCoverFile(null)
    setCoverPreview(null)
    reset()
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setCoverPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function onSubmit(data: UploadForm) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      let audioUrl = editingSong?.audio_url ?? ''
      let coverUrl = editingSong?.cover_url ?? null

      if (!editingSong && !audioFile) {
        notify('error', 'Please select an audio file')
        return
      }

      // Upload audio
      if (audioFile) {
        setUploadProgress('Uploading audio…')
        const audioPath = `${user.id}/${Date.now()}_${audioFile.name.replace(/\s+/g, '_')}`
        const { error: audioError } = await supabase.storage.from('audio').upload(audioPath, audioFile)
        if (audioError) throw audioError
        const { data: urlData } = supabase.storage.from('audio').getPublicUrl(audioPath)
        audioUrl = urlData.publicUrl
      }

      // Upload cover
      if (coverFile) {
        setUploadProgress('Uploading cover…')
        const coverPath = `${user.id}/${Date.now()}_${coverFile.name.replace(/\s+/g, '_')}`
        const { error: coverError } = await supabase.storage.from('covers').upload(coverPath, coverFile)
        if (coverError) throw coverError
        const { data: urlData } = supabase.storage.from('covers').getPublicUrl(coverPath)
        coverUrl = urlData.publicUrl
      }

      setUploadProgress('Saving…')

      // Get audio duration
      let duration: number | undefined
      if (audioFile) {
        duration = await getAudioDuration(audioFile)
      }

      if (editingSong) {
        const { error } = await supabase
          .from('songs')
          .update({ title: data.title, artist: data.artist, album: data.album, genre: data.genre, cover_url: coverUrl, ...(duration ? { duration } : {}) })
          .eq('id', editingSong.id)
        if (error) throw error
        notify('success', 'Song updated successfully')
      } else {
        const { error } = await supabase.from('songs').insert({
          title: data.title,
          artist: data.artist,
          album: data.album,
          genre: data.genre,
          audio_url: audioUrl,
          cover_url: coverUrl,
          duration,
          uploaded_by: user.id,
        })
        if (error) throw error
        notify('success', 'Song uploaded successfully')
      }

      await fetchSongs()
      closeForm()
    } catch (err) {
      notify('error', err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadProgress(null)
    }
  }

  async function deleteSong(song: Song) {
    if (!confirm(`Delete "${song.title}"? This cannot be undone.`)) return
    const supabase = createClient()
    await supabase.from('songs').delete().eq('id', song.id)
    notify('success', 'Song deleted')
    await fetchSongs()
  }

  async function exportCSV() {
    const headers = ['Title', 'Artist', 'Genre', 'Plays', 'Created']
    const rows = songs.map((s) => [s.title, s.artist, s.genre ?? '', s.play_count, formatDate(s.created_at)])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cleanvibe-songs.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="px-8 py-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium ${
          notification.type === 'success'
            ? 'bg-green-500/20 border border-green-500/40 text-green-400'
            : 'bg-red-500/20 border border-red-500/40 text-red-400'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Songs</h1>
          <p className="text-[#64748B] text-sm mt-1">{songs.length} songs in the library</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4" /> Upload Song
          </Button>
        </div>
      </div>

      {/* Upload/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeForm} />
          <div className="relative z-10 w-full max-w-lg bg-[#12122A] border border-[#2A2A50] rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A50]">
              <h2 className="font-semibold">{editingSong ? 'Edit Song' : 'Upload New Song'}</h2>
              <button onClick={closeForm} className="text-[#64748B] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Cover upload */}
              <div className="flex items-start gap-4">
                <div
                  className="w-24 h-24 rounded-xl overflow-hidden bg-[#1A1A35] border border-[#2A2A50] flex items-center justify-center cursor-pointer hover:border-[#7C3AED]/50 transition-colors flex-shrink-0"
                  onClick={() => coverFileRef.current?.click()}
                >
                  {coverPreview ? (
                    <Image src={coverPreview} alt="Cover" width={96} height={96} className="w-full h-full object-cover" />
                  ) : editingSong?.cover_url ? (
                    <Image src={editingSong.cover_url} alt="Cover" width={96} height={96} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[#64748B]">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-xs">Cover</span>
                    </div>
                  )}
                </div>
                <input ref={coverFileRef} type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />

                <div className="flex-1 space-y-3">
                  <Input {...register('title')} label="Title" placeholder="Song title" error={errors.title?.message} />
                  <Input {...register('artist')} label="Artist" placeholder="Artist name" error={errors.artist?.message} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input {...register('album')} label="Album" placeholder="Album (optional)" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#94A3B8]">Genre</label>
                  <select
                    {...register('genre')}
                    className="bg-[#1A1A35] border border-[#2A2A50] rounded-xl px-4 py-3 text-sm text-[#F1F5F9] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  >
                    <option value="">Select genre</option>
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              {/* Audio file */}
              {!editingSong && (
                <div>
                  <label className="text-sm font-medium text-[#94A3B8] block mb-1.5">Audio File (MP3, WAV, OGG)</label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-4 cursor-pointer text-center transition-colors ${
                      audioFile ? 'border-[#7C3AED]/60 bg-[#7C3AED]/5' : 'border-[#2A2A50] hover:border-[#7C3AED]/40'
                    }`}
                    onClick={() => audioFileRef.current?.click()}
                  >
                    <Music className={`w-6 h-6 mx-auto mb-1 ${audioFile ? 'text-[#A78BFA]' : 'text-[#64748B]'}`} />
                    <p className="text-sm text-[#64748B]">
                      {audioFile ? audioFile.name : 'Click to select audio file'}
                    </p>
                    {audioFile && <p className="text-xs text-[#64748B]/60 mt-0.5">{(audioFile.size / 1024 / 1024).toFixed(1)} MB</p>}
                  </div>
                  <input ref={audioFileRef} type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)} className="hidden" />
                </div>
              )}

              {uploadProgress && (
                <div className="flex items-center gap-2 text-sm text-[#A78BFA]">
                  <Spinner size="sm" />
                  {uploadProgress}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={closeForm} className="flex-1">Cancel</Button>
                <Button type="submit" loading={isSubmitting || !!uploadProgress} className="flex-1">
                  <Upload className="w-4 h-4" />
                  {editingSong ? 'Save Changes' : 'Upload'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Songs table */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : songs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#12122A] border border-[#2A2A50] rounded-2xl">
          <Music className="w-10 h-10 text-[#2A2A50] mb-3" />
          <p className="text-[#64748B]">No songs yet. Upload your first one!</p>
        </div>
      ) : (
        <div className="bg-[#12122A] border border-[#2A2A50] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_1fr_80px_70px_70px_100px] gap-4 px-6 py-3 border-b border-[#2A2A50]/40 text-xs font-semibold text-[#64748B] uppercase tracking-widest">
            <span></span>
            <span>Song</span>
            <span>Artist / Genre</span>
            <span className="text-right">Plays</span>
            <span className="text-right">Duration</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-[#2A2A50]/40">
            {songs.map((song) => (
              <div key={song.id} className="grid grid-cols-[40px_1fr_1fr_80px_70px_70px_100px] gap-4 px-6 py-3.5 items-center hover:bg-[#1A1A35] transition-colors">
                {/* Cover */}
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#1A1A35] flex-shrink-0">
                  {song.cover_url ? (
                    <Image src={song.cover_url} alt={song.title} width={36} height={36} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{song.title.charAt(0)}</span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#F1F5F9] truncate">{song.title}</p>
                  <p className="text-xs text-[#64748B] truncate">{formatDate(song.created_at)}</p>
                </div>

                <div className="min-w-0">
                  <p className="text-sm text-[#94A3B8] truncate">{song.artist}</p>
                  {song.genre && (
                    <span className="inline-block text-xs px-2 py-0.5 bg-[#2A2A50] text-[#94A3B8] rounded-full mt-0.5">{song.genre}</span>
                  )}
                </div>

                <p className="text-sm text-[#94A3B8] text-right tabular-nums">{formatNumber(song.play_count)}</p>
                <p className="text-sm text-[#94A3B8] text-right tabular-nums">{formatDuration(song.duration)}</p>

                <div>
                  <span className={`text-xs px-2 py-1 rounded-full ${song.is_published ? 'bg-green-500/15 text-green-400' : 'bg-yellow-500/15 text-yellow-400'}`}>
                    {song.is_published ? 'Live' : 'Draft'}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => openEditForm(song)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-[#2A2A50] transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteSong(song)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio()
    audio.src = URL.createObjectURL(file)
    audio.onloadedmetadata = () => {
      resolve(Math.round(audio.duration))
      URL.revokeObjectURL(audio.src)
    }
    audio.onerror = () => resolve(0)
  })
}
