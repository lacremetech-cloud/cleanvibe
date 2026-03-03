'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Bell, ChevronDown, LogOut, Shield, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { getInitials } from '@/lib/utils'

interface HeaderProps {
  showSearch?: boolean
}

export default function Header({ showSearch = false }: HeaderProps) {
  const router = useRouter()
  const { profile, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A50]/40 bg-[#0A0A15]/80 backdrop-blur-sm sticky top-0 z-20">
      {/* Search bar or spacer */}
      {showSearch ? (
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs, artists…"
              className="w-full bg-[#1A1A35] border border-[#2A2A50] rounded-full pl-10 pr-4 py-2.5 text-sm text-[#F1F5F9] placeholder:text-[#64748B] focus:outline-none focus:border-[#7C3AED] transition-colors"
            />
          </div>
        </form>
      ) : (
        <Link href="/search" className="flex items-center gap-2 px-4 py-2 bg-[#1A1A35] rounded-full text-sm text-[#64748B] hover:text-[#94A3B8] transition-colors border border-[#2A2A50]">
          <Search className="w-4 h-4" />
          <span>Search songs, artists…</span>
        </Link>
      )}

      {/* Right side */}
      <div className="flex items-center gap-3 ml-4">
        <button className="w-9 h-9 rounded-full bg-[#1A1A35] border border-[#2A2A50] flex items-center justify-center text-[#64748B] hover:text-[#94A3B8] transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1A35] border border-[#2A2A50] hover:border-[#7C3AED]/50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {profile ? getInitials(profile.display_name ?? profile.username) : '?'}
            </div>
            <span className="text-sm font-medium text-[#F1F5F9] hidden sm:block max-w-[100px] truncate">
              {profile?.display_name ?? profile?.username ?? '…'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#1A1A35] border border-[#2A2A50] rounded-xl shadow-xl shadow-black/50 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-[#2A2A50]">
                  <p className="text-sm font-medium truncate">{profile?.display_name ?? profile?.username}</p>
                  <p className="text-xs text-[#64748B] truncate">@{profile?.username}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:bg-[#2A2A50]/50 transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#94A3B8] hover:text-white hover:bg-[#2A2A50]/50 transition-colors"
                    >
                      <Shield className="w-4 h-4 text-[#A78BFA]" /> Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={signOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
