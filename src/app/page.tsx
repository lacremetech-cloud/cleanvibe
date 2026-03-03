import Link from 'next/link'
import { Music2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A15] text-white flex flex-col">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#7C3AED]/12 blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#7C3AED] rounded-lg flex items-center justify-center">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight">CleanVibe</span>
        </div>
        <Link href="/login" className="text-sm text-[#94A3B8] hover:text-white transition-colors">
          Connexion
        </Link>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            La musique qui
            <br />
            <span className="gradient-text">te fait du bien</span>
          </h1>
          <p className="text-[#64748B] text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Écoute, découvre, ressens. Gratuit, sans pub, sans bruit.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-2xl transition-all duration-200 shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-95 text-base"
          >
            Commencer gratuitement
          </Link>
          <p className="mt-5 text-sm text-[#64748B]">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-[#A78BFA] hover:text-white transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </main>

      <footer className="relative z-10 py-6 text-center">
        <p className="text-xs text-[#2A2A50]">© {new Date().getFullYear()} CleanVibe</p>
      </footer>
    </div>
  )
}
