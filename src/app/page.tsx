import Link from 'next/link'
import { Music2, Headphones, Zap, Shield, Play, ChevronRight, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A15] text-[#F1F5F9] overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[30%] w-[600px] h-[600px] rounded-full bg-[#7C3AED]/8 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] rounded-full bg-violet-800/6 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">CleanVibe</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2 text-sm font-semibold bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full transition-all duration-200 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-95"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C3AED]/15 border border-[#7C3AED]/30 text-[#A78BFA] text-sm font-medium mb-8">
            <Star className="w-3.5 h-3.5 fill-current" />
            Free forever. No ads. No compromise.
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            Music that{' '}
            <span className="gradient-text">elevates</span>
            <br />
            your vibe
          </h1>

          <p className="text-lg sm:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
            CleanVibe is the streaming platform built for good energy.
            Discover feel-good music, build playlists you love, and listen without the noise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 px-8 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base font-semibold rounded-full transition-all duration-200 shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Start listening free
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 border border-[#2A2A50] hover:border-[#7C3AED]/50 text-[#F1F5F9] text-base font-medium rounded-full transition-all duration-200 hover:bg-[#1A1A35]"
            >
              I have an account
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mock player preview */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="glass rounded-2xl p-1 shadow-2xl shadow-black/50">
            <div className="bg-[#12122A] rounded-xl p-6">
              {/* Fake waveform */}
              <div className="flex items-end justify-center gap-1 h-16 mb-6">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 rounded-full bg-[#7C3AED]/40"
                    style={{
                      height: `${20 + Math.sin(i * 0.6) * 30 + Math.random() * 20}%`,
                      opacity: i < 22 ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
              {/* Player controls mockup */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-600 to-violet-900 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">Sunrise Nasheed</p>
                  <p className="text-[#64748B] text-xs truncate">CleanVibe Artist</p>
                  <div className="mt-2 h-1 bg-[#2A2A50] rounded-full">
                    <div className="h-full w-[55%] bg-[#7C3AED] rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A35] flex items-center justify-center">
                    <div className="w-3 h-3 border-l-2 border-t-2 border-b-2 border-[#94A3B8] rounded-sm" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center shadow-lg shadow-violet-500/40">
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1A1A35] flex items-center justify-center">
                    <div className="w-3 h-3 border-r-2 border-t-2 border-b-2 border-[#94A3B8] rounded-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              icon: Headphones,
              title: 'Premium Sound',
              desc: 'High-quality streaming for every track. No buffering, no interruptions.',
            },
            {
              icon: Zap,
              title: 'Instant Playback',
              desc: 'Skip, shuffle, repeat — your music reacts instantly. No lag.',
            },
            {
              icon: Shield,
              title: 'Clean & Private',
              desc: 'No ads, no data selling, no distractions. Just music.',
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-[#12122A] border border-[#2A2A50] rounded-2xl p-6 hover:border-[#7C3AED]/40 transition-colors duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/15 flex items-center justify-center mb-4 group-hover:bg-[#7C3AED]/25 transition-colors">
                <Icon className="w-5 h-5 text-[#A78BFA]" />
              </div>
              <h3 className="font-semibold text-base mb-2">{title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-[#7C3AED]/20 via-[#6D28D9]/15 to-[#7C3AED]/20 border border-[#7C3AED]/30 rounded-3xl p-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to <span className="gradient-text">feel good</span>?
            </h2>
            <p className="text-[#94A3B8] mb-8 text-lg">
              Join CleanVibe. Free, forever.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base font-semibold rounded-full transition-all duration-200 shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 active:scale-95"
            >
              Create free account
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#2A2A50]/50 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#64748B] text-sm">
            <Music2 className="w-4 h-4 text-[#7C3AED]" />
            <span>CleanVibe © {new Date().getFullYear()}</span>
          </div>
          <p className="text-[#64748B] text-sm">Music that elevates.</p>
        </div>
      </footer>
    </div>
  )
}
