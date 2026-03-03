export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Song {
  id: string
  title: string
  artist: string
  album: string | null
  genre: string | null
  duration: number | null // seconds
  cover_url: string | null
  audio_url: string
  play_count: number
  is_published: boolean
  uploaded_by: string | null
  created_at: string
  updated_at: string
  // Joined fields
  is_liked?: boolean
  likes_count?: number
}

export interface Like {
  user_id: string
  song_id: string
  created_at: string
}

export interface PlayHistory {
  id: string
  user_id: string
  song_id: string
  duration_played: number
  played_at: string
  song?: Song
}

export interface Playlist {
  id: string
  user_id: string
  name: string
  description: string | null
  cover_url: string | null
  is_public: boolean
  created_at: string
  updated_at: string
  songs?: Song[]
  songs_count?: number
}

export interface PlaylistSong {
  playlist_id: string
  song_id: string
  position: number
  added_at: string
  song?: Song
}

// Admin analytics types
export interface SongAnalytics {
  song_id: string
  title: string
  artist: string
  play_count: number
  likes_count: number
  unique_listeners: number
  avg_listen_duration: number
}

export interface GenreStats {
  genre: string
  count: number
  total_plays: number
}

export interface AdminStats {
  total_songs: number
  total_users: number
  total_plays: number
  total_likes: number
  top_songs: SongAnalytics[]
  genre_breakdown: GenreStats[]
}

// API response types
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
}
