import Sidebar, { BottomNav } from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import AudioPlayer from '@/components/layout/AudioPlayer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0A0A15] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          {children}
        </main>
      </div>

      <AudioPlayer />
      <BottomNav />
    </div>
  )
}
