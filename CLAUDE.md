# CLAUDE.md — AI Assistant Guide for CleanVibe

This file provides essential context for AI coding assistants (Claude Code and others) working in this repository. Keep it updated as the project evolves.

---

## What Is CleanVibe

CleanVibe is a **private halal music streaming platform** — a Spotify-style experience for Islamic/feel-good music. It is NOT a public marketplace. The owner uploads songs via an admin panel; users sign up, listen, like, and build playlists.

**Core goals:**
- Premium Spotify-like UX that teenagers prefer over mainstream alternatives
- Private/invite-friendly — not indexed or mainstream
- Free, no ads
- Visually modern — no overt religious iconography; clean, tech-forward aesthetic

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | TypeScript, `src/` dir, `@/` alias |
| Styling | Tailwind CSS v4 | Custom CV palette, see `tailwind.config.ts` |
| Backend/DB | Supabase | PostgreSQL + Auth + Storage |
| Auth | Supabase Auth | Email/password, email confirmation |
| State | Zustand | Player state (`usePlayerStore`) |
| Animations | Framer Motion | Available but not yet used heavily |
| Charts | Recharts | Admin analytics |
| Forms | React Hook Form + Zod | All forms validated |
| Icons | Lucide React | Consistent icon set |
| Utilities | clsx + tailwind-merge (`cn()`) | Class merging |

---

## Project Structure

```
cleanvibe/
├── CLAUDE.md                    # This file
├── .env.example                 # Required env vars template
├── supabase/
│   └── schema.sql               # Full DB schema — run in Supabase SQL Editor
├── src/
│   ├── middleware.ts             # Auth protection for routes
│   ├── types/
│   │   └── index.ts             # All TypeScript interfaces
│   ├── lib/
│   │   ├── utils.ts             # cn(), formatDuration, formatNumber, etc.
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser Supabase client
│   │   │   └── server.ts        # Server + service-role clients
│   │   ├── store/
│   │   │   └── usePlayerStore.ts # Zustand global audio player state
│   │   └── hooks/
│   │       ├── useAuth.ts       # Current user + profile + isAdmin
│   │       └── useSongs.ts      # Song fetching + like toggle
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx       # Primary | Ghost | Outline | Danger variants
│   │   │   ├── Input.tsx        # Label + error + icon support
│   │   │   └── Spinner.tsx      # Loading indicator
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx      # Left nav (Home, Search, Library, Playlists)
│   │   │   ├── Header.tsx       # Search bar + profile menu + sign out
│   │   │   └── AudioPlayer.tsx  # Persistent bottom player (HTML5 Audio)
│   │   └── songs/
│   │       ├── SongCard.tsx     # Grid card with cover art + hover play
│   │       └── SongRow.tsx      # List row (like Spotify track list)
│   └── app/
│       ├── layout.tsx           # Root layout (Inter font, dark bg)
│       ├── globals.css          # CSS vars, scrollbar, range input, utilities
│       ├── page.tsx             # Landing page (public)
│       ├── (auth)/
│       │   ├── layout.tsx       # Minimal auth shell
│       │   ├── login/page.tsx   # Email/password login
│       │   └── signup/page.tsx  # Registration (username, email, password)
│       ├── (main)/
│       │   ├── layout.tsx       # App shell: Sidebar + Header + AudioPlayer
│       │   ├── page.tsx         # Home: New Releases grid + Trending list + Genres
│       │   ├── search/page.tsx  # Search with genre chips + debounced query
│       │   ├── library/page.tsx # Liked songs playlist
│       │   └── playlist/[id]/   # Dynamic playlist view
│       ├── admin/
│       │   ├── layout.tsx       # Admin sidebar
│       │   ├── page.tsx         # Dashboard: KPI cards + charts
│       │   ├── songs/page.tsx   # Upload/edit/delete songs + CSV export
│       │   └── users/page.tsx   # User list + promote/demote admin
│       └── api/
│           ├── songs/[id]/play/route.ts   # POST: increment play count + history
│           ├── songs/[id]/like/route.ts   # POST: toggle like
│           ├── playlists/route.ts         # GET/POST playlists
│           ├── playlists/[id]/songs/route.ts  # POST/DELETE playlist songs
│           ├── admin/analytics/route.ts   # GET: admin stats
│           ├── admin/songs/route.ts       # GET: all songs (admin)
│           ├── admin/songs/[id]/route.ts  # PATCH/DELETE song
│           └── admin/users/[id]/route.ts  # PATCH: toggle admin
```

---

## Database Schema

See `supabase/schema.sql` for the full schema. Key tables:

| Table | Purpose |
|---|---|
| `profiles` | Extends `auth.users`; has `is_admin` flag |
| `songs` | Audio tracks with metadata, `audio_url`, `cover_url`, `play_count` |
| `likes` | User ↔ song likes (composite PK) |
| `play_history` | Every listen event per user |
| `playlists` | User-created playlists |
| `playlist_songs` | Playlist ↔ song join with `position` |

RLS is enabled on all tables. Admins bypass most restrictions via policy checks.

### Storage Buckets
- `audio` — private, MP3/WAV/OGG, max 50MB
- `covers` — public, images, max 5MB

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=         # From Supabase project Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Anon/public key
SUPABASE_SERVICE_ROLE_KEY=        # Service role key (server-only, never expose)
NEXT_PUBLIC_SITE_URL=             # http://localhost:3000 in dev
```

---

## Common Commands

```bash
# Development
npm run dev

# Type check (always run before committing)
npx tsc --noEmit

# Build
npm run build

# Lint
npm run lint
```

---

## Color Palette

All colors use the `cv-*` naming convention in Tailwind config:

| Token | Hex | Usage |
|---|---|---|
| `cv-bg` | `#0A0A15` | Page backgrounds |
| `cv-surface` | `#12122A` | Cards, panels |
| `cv-card` | `#1A1A35` | Nested surfaces, inputs |
| `cv-border` | `#2A2A50` | Borders, dividers |
| `cv-primary` | `#7C3AED` | CTAs, active states |
| `cv-hover` | `#6D28D9` | Hover on primary |
| `cv-light` | `#A78BFA` | Accent text, icons |
| `cv-muted` | `#64748B` | Secondary text |
| `cv-subtle` | `#94A3B8` | Tertiary text |
| `cv-text` | `#F1F5F9` | Primary text |

Also available: `.gradient-text`, `.glass`, `.shimmer` utility classes in `globals.css`.

---

## Route Protection

The middleware (`src/middleware.ts`) handles:
- `/login`, `/signup` → redirect to `/` if already authenticated
- `/search`, `/library`, `/playlist/*`, `/profile` → redirect to `/login` if not authenticated
- `/admin/*` → redirect to `/login` if not auth'd; redirect to `/` if auth'd but not admin

The **landing page** (`/`) and **auth pages** (`/login`, `/signup`) are fully public.

---

## Audio Player Architecture

The player is a **persistent HTML5 Audio element** controlled by Zustand:

1. `usePlayerStore` (Zustand) holds all state: `currentSong`, `isPlaying`, `volume`, `queue`, etc.
2. `AudioPlayer.tsx` renders the fixed bottom bar and syncs the `<audio>` ref with store state
3. Any component calls `playSong(song, queue)` from the store to start playback
4. Play events are tracked via `POST /api/songs/[id]/play` on song change

---

## Admin Panel

Accessible at `/admin` — requires `is_admin = true` in `profiles`.

**To make the first admin:** run this SQL in Supabase after your first signup:
```sql
UPDATE public.profiles SET is_admin = true
WHERE id = (SELECT id FROM auth.users WHERE email = 'your@email.com');
```

Admin features:
- **Dashboard** — KPI cards (songs, users, plays, likes) + bar/pie charts
- **Songs** — Upload (audio + cover), edit metadata, delete, CSV export
- **Users** — View all users, promote/demote admin role, CSV export

---

## Code Conventions

### Component patterns
- Client components: `'use client'` directive at top
- Server components: no directive (default in App Router)
- Co-locate hooks with their primary consumer when possible

### Naming
- Files/folders: kebab-case or camelCase as appropriate to Next.js routing
- Components: PascalCase
- Hooks: `use` prefix, camelCase
- Stores: `use*Store` suffix

### Error handling
- API routes return `{ error: string }` on failure with appropriate HTTP status
- Client hooks surface errors via `error` state
- No try/catch swallowing — always propagate or surface

### Security
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code
- All admin API routes check `is_admin` before executing
- RLS enforces data isolation at the database level
- Validate all user input with Zod schemas

---

## AI Assistant Instructions

When working in this repository:

1. **Read before editing.** Always read a file before modifying it.
2. **Stay scoped.** Don't refactor, add comments, or change unrelated code.
3. **Branch correctly.** All Claude work goes on `claude/<session-id>` branches.
4. **TypeScript first.** Run `npx tsc --noEmit` after changes and fix all errors.
5. **Never commit secrets.** `.env.local` is gitignored — never include real credentials.
6. **Use the design system.** Stick to `cv-*` Tailwind colors; don't introduce new hex values.
7. **Player state via store.** Use `usePlayerStore` — never create a local audio element.
8. **Admin checks.** Every admin API route must verify `is_admin` before acting.
9. **No speculative features.** Build only what was requested.
10. **Keep CLAUDE.md updated** when you add new routes, components, or patterns.

---

Last updated: 2026-03-03 (full application scaffold committed)
