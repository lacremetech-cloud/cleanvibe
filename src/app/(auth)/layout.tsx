import Link from 'next/link'
import { Music2 } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A15] flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-[#7C3AED]/8 blur-[100px]" />
      </div>
      <nav className="relative z-10 px-6 py-5">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-7 h-7 bg-[#7C3AED] rounded-lg flex items-center justify-center">
            <Music2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight">CleanVibe</span>
        </Link>
      </nav>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  )
}
