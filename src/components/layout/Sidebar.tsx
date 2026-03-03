'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Library, Heart, Plus, Music2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/home',    icon: Home,    label: 'Home' },
  { href: '/search',  icon: Search,  label: 'Search' },
  { href: '/library', icon: Library, label: 'Library' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-[240px] flex-shrink-0 bg-[#0A0A15] border-r border-[#2A2A50]/50 h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Music2 className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">CleanVibe</span>
      </div>

      {/* Main nav */}
      <nav className="px-3 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/home' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-[#7C3AED]/15 text-white'
                  : 'text-[#64748B] hover:text-[#94A3B8] hover:bg-[#1A1A35]'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', active ? 'text-[#A78BFA]' : '')} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Library section */}
      <div className="mt-6 px-3 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 mb-3">
          <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">Playlists</span>
          <button
            className="w-6 h-6 rounded-full bg-[#1A1A35] hover:bg-[#2A2A50] flex items-center justify-center transition-colors"
            title="New playlist"
          >
            <Plus className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>
        </div>

        {/* Liked songs shortcut */}
        <Link
          href="/library"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
            pathname === '/library'
              ? 'bg-[#7C3AED]/15 text-white'
              : 'text-[#64748B] hover:text-[#94A3B8] hover:bg-[#1A1A35]'
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center flex-shrink-0">
            <Heart className="w-3.5 h-3.5 text-white fill-white" />
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate text-sm">Liked Songs</p>
            <p className="text-xs text-[#64748B] truncate">Playlist</p>
          </div>
        </Link>

        {/* Empty state or playlist list */}
        <div className="flex-1 overflow-y-auto no-scrollbar mt-2 space-y-1">
          <div className="px-3 py-6 text-center">
            <p className="text-xs text-[#64748B]">Create your first playlist</p>
            <Link
              href="/library"
              className="mt-2 inline-flex items-center gap-1 text-xs text-[#A78BFA] hover:text-[#7C3AED] transition-colors"
            >
              Get started <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
