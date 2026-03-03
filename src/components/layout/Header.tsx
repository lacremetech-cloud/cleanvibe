'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, LogOut, Shield, User, Music2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { getInitials } from '@/lib/utils'

export default function Header() {
  const router = useRouter()
  const { profile, isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[#1A1A35] bg-[#0A0A15]/90 backdrop-blur-sm sticky top-0 z-20">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-6 h-6 bg-[#7C3AED] rounded-md flex items-center justify-center">
          <Music2 className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-sm tracking-tight">CleanVibe</span>
      </div>

      {/* Desktop search shortcut */}
      <Link
        href="/search"
        className="hidden md:flex items-center gap-2 px-3 py-2 bg-[#12122A] rounded-xl text-sm text-[#64748B] hover:text-[#94A3B8] transition-colors border border-[#1A1A35] hover:border-[#2A2A50]"
      >
        <Search className="w-3.5 h-3.5" />
        <span>Rechercher…</span>
      </Link>

      {/* Profile */}
      <div className="relative ml-auto">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#12122A] border border-[#1A1A35] hover:border-[#2A2A50] transition-colors"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
            {profile ? getInitials(profile.display_name ?? profile.username) : '?'}
          </div>
          <ChevronDown className="w-3 h-3 text-[#64748B]" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-[#12122A] border border-[#2A2A50] rounded-2xl shadow-xl shadow-black/50 z-20 overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1A1A35]">
                <p className="text-xs font-semibold truncate">{profile?.display_name ?? profile?.username}</p>
                <p className="text-[10px] text-[#64748B] truncate">@{profile?.username}</p>
              </div>
              <div className="py-1">
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-[#94A3B8] hover:text-white hover:bg-[#1A1A35] transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#A78BFA]" /> Admin
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Déconnexion
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
