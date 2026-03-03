'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Library, Music2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/home',        icon: Home,    label: 'Accueil' },
  { href: '/search',  icon: Search,  label: 'Recherche' },
  { href: '/library', icon: Library, label: 'Bibliothèque' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-[200px] flex-shrink-0 bg-[#0A0A15] border-r border-[#1A1A35] h-full py-6">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 mb-8">
        <div className="w-7 h-7 bg-[#7C3AED] rounded-lg flex items-center justify-center">
          <Music2 className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold tracking-tight">CleanVibe</span>
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/home' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'text-white bg-[#1A1A35]'
                  : 'text-[#64748B] hover:text-[#94A3B8] hover:bg-[#12122A]'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0', active && 'text-[#A78BFA]')} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

/* Bottom navigation — mobile only */
export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A15]/95 backdrop-blur-xl border-t border-[#1A1A35] flex items-center justify-around px-2 pb-safe">
      {navItems.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href !== '/home' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 px-4 py-3 transition-colors',
              active ? 'text-white' : 'text-[#64748B]'
            )}
          >
            <Icon className={cn('w-5 h-5', active && 'text-[#A78BFA]')} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
