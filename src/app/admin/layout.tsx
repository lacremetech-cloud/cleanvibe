import Link from 'next/link'
import { Music2, BarChart2, Upload, Users, Home, ArrowLeft } from 'lucide-react'

const navItems = [
  { href: '/admin',        icon: BarChart2, label: 'Dashboard' },
  { href: '/admin/songs',  icon: Upload,    label: 'Songs' },
  { href: '/admin/users',  icon: Users,     label: 'Users' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0A0A15] overflow-hidden">
      {/* Admin sidebar */}
      <aside className="w-[220px] flex-shrink-0 bg-[#0A0A15] border-r border-[#2A2A50]/50 flex flex-col">
        <div className="px-5 py-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-[#7C3AED] rounded-lg flex items-center justify-center">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">CleanVibe</span>
          </div>
          <span className="text-xs text-[#A78BFA] font-semibold tracking-widest uppercase ml-9">Admin</span>
        </div>

        <nav className="px-3 space-y-1 flex-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:text-white hover:bg-[#1A1A35] transition-all"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-6 space-y-1">
          <Link
            href="/home"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:text-white hover:bg-[#1A1A35] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
