-- ============================================================
-- CleanVibe Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  username      text unique not null,
  display_name  text,
  avatar_url    text,
  is_admin      boolean default false not null,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SONGS
-- ============================================================
create table public.songs (
  id              uuid default uuid_generate_v4() primary key,
  title           text not null,
  artist          text not null,
  album           text,
  genre           text,
  duration        integer, -- seconds
  cover_url       text,
  audio_url       text not null,
  play_count      bigint default 0 not null,
  is_published    boolean default true not null,
  uploaded_by     uuid references public.profiles(id) on delete set null,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

-- ============================================================
-- LIKES
-- ============================================================
create table public.likes (
  user_id    uuid references public.profiles(id) on delete cascade not null,
  song_id    uuid references public.songs(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  primary key (user_id, song_id)
);

-- ============================================================
-- PLAY HISTORY
-- ============================================================
create table public.play_history (
  id               uuid default uuid_generate_v4() primary key,
  user_id          uuid references public.profiles(id) on delete cascade not null,
  song_id          uuid references public.songs(id) on delete cascade not null,
  duration_played  integer default 0, -- seconds actually listened
  played_at        timestamptz default now() not null
);

-- Index for fast user history lookups
create index play_history_user_idx on public.play_history(user_id, played_at desc);

-- ============================================================
-- PLAYLISTS
-- ============================================================
create table public.playlists (
  id           uuid default uuid_generate_v4() primary key,
  user_id      uuid references public.profiles(id) on delete cascade not null,
  name         text not null,
  description  text,
  cover_url    text,
  is_public    boolean default false not null,
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);

-- ============================================================
-- PLAYLIST SONGS
-- ============================================================
create table public.playlist_songs (
  playlist_id  uuid references public.playlists(id) on delete cascade not null,
  song_id      uuid references public.songs(id) on delete cascade not null,
  position     integer not null,
  added_at     timestamptz default now() not null,
  primary key (playlist_id, song_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.songs enable row level security;
alter table public.likes enable row level security;
alter table public.play_history enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_songs enable row level security;

-- Profiles: anyone can read, only owner can update
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Songs: published songs visible to all authenticated users
create policy "Published songs are viewable" on public.songs for select using (is_published = true or (select is_admin from public.profiles where id = auth.uid()));
create policy "Admins can insert songs" on public.songs for insert with check ((select is_admin from public.profiles where id = auth.uid()));
create policy "Admins can update songs" on public.songs for update using ((select is_admin from public.profiles where id = auth.uid()));
create policy "Admins can delete songs" on public.songs for delete using ((select is_admin from public.profiles where id = auth.uid()));

-- Likes
create policy "Users can see their own likes" on public.likes for select using (auth.uid() = user_id);
create policy "Users can like songs" on public.likes for insert with check (auth.uid() = user_id);
create policy "Users can unlike songs" on public.likes for delete using (auth.uid() = user_id);

-- Play history
create policy "Users can see own history" on public.play_history for select using (auth.uid() = user_id);
create policy "Users can insert own history" on public.play_history for insert with check (auth.uid() = user_id);

-- Playlists
create policy "Public playlists viewable by all" on public.playlists for select using (is_public = true or auth.uid() = user_id);
create policy "Users can create playlists" on public.playlists for insert with check (auth.uid() = user_id);
create policy "Users can update own playlists" on public.playlists for update using (auth.uid() = user_id);
create policy "Users can delete own playlists" on public.playlists for delete using (auth.uid() = user_id);

-- Playlist songs
create policy "Playlist songs follow playlist visibility" on public.playlist_songs for select using (
  exists (select 1 from public.playlists p where p.id = playlist_id and (p.is_public or p.user_id = auth.uid()))
);
create policy "Playlist owners can manage songs" on public.playlist_songs for insert with check (
  exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
);
create policy "Playlist owners can remove songs" on public.playlist_songs for delete using (
  exists (select 1 from public.playlists p where p.id = playlist_id and p.user_id = auth.uid())
);

-- ============================================================
-- ANALYTICS HELPERS (admin-only functions)
-- ============================================================

-- Increment play count atomically
create or replace function public.increment_play_count(song_id uuid)
returns void language sql security definer as $$
  update public.songs set play_count = play_count + 1 where id = song_id;
$$;

-- ============================================================
-- STORAGE BUCKETS
-- Run after creating buckets in the Supabase dashboard:
--   - "audio"  (private, max 50MB per file)
--   - "covers" (public,  max 5MB per file)
-- ============================================================

-- Storage policies for audio (admins upload, authenticated users read)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('audio',  'audio',  false, 52428800, array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac']),
  ('covers', 'covers', true,  5242880,  array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;

create policy "Admins can upload audio" on storage.objects for insert
  with check (bucket_id = 'audio' and (select is_admin from public.profiles where id = auth.uid()));

create policy "Authenticated users can read audio" on storage.objects for select
  using (bucket_id = 'audio' and auth.role() = 'authenticated');

create policy "Admins can delete audio" on storage.objects for delete
  using (bucket_id = 'audio' and (select is_admin from public.profiles where id = auth.uid()));

create policy "Anyone can read covers" on storage.objects for select
  using (bucket_id = 'covers');

create policy "Admins can upload covers" on storage.objects for insert
  with check (bucket_id = 'covers' and (select is_admin from public.profiles where id = auth.uid()));

create policy "Admins can delete covers" on storage.objects for delete
  using (bucket_id = 'covers' and (select is_admin from public.profiles where id = auth.uid()));

-- ============================================================
-- MAKE FIRST USER ADMIN (run after first signup)
-- Replace the email below with your admin email
-- ============================================================
-- update public.profiles set is_admin = true
-- where id = (select id from auth.users where email = 'your@email.com');
