'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart2, Music, Users, Heart, Play, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { formatNumber } from '@/lib/utils'
import Spinner from '@/components/ui/Spinner'
import { AdminStats } from '@/types'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch('/api/admin/analytics')
      const data = await res.json()
      setStats(data)
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) {
    return <div className="flex justify-center pt-32"><Spinner size="lg" /></div>
  }

  if (!stats) return null

  const PIE_COLORS = ['#7C3AED', '#6D28D9', '#A78BFA', '#8B5CF6', '#4C1D95', '#5B21B6']

  return (
    <div className="px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-[#64748B] text-sm mt-1">CleanVibe platform analytics</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Songs', value: formatNumber(stats.total_songs), icon: Music, color: 'text-violet-400' },
          { label: 'Total Users', value: formatNumber(stats.total_users), icon: Users, color: 'text-blue-400' },
          { label: 'Total Plays', value: formatNumber(stats.total_plays), icon: Play, color: 'text-green-400' },
          { label: 'Total Likes', value: formatNumber(stats.total_likes), icon: Heart, color: 'text-pink-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#12122A] border border-[#2A2A50] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-widest">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Songs Bar Chart */}
        <div className="bg-[#12122A] border border-[#2A2A50] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-[#A78BFA]" />
            <h2 className="text-sm font-semibold">Top Songs by Plays</h2>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.top_songs.slice(0, 8)} layout="vertical">
              <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="title"
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                width={90}
                tickFormatter={(v: string) => v.length > 12 ? `${v.slice(0, 12)}…` : v}
              />
              <Tooltip
                contentStyle={{ background: '#1A1A35', border: '1px solid #2A2A50', borderRadius: 8 }}
                labelStyle={{ color: '#F1F5F9' }}
                itemStyle={{ color: '#A78BFA' }}
              />
              <Bar dataKey="play_count" fill="#7C3AED" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Genre Pie Chart */}
        <div className="bg-[#12122A] border border-[#2A2A50] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-4 h-4 text-[#A78BFA]" />
            <h2 className="text-sm font-semibold">Genre Breakdown</h2>
          </div>
          {stats.genre_breakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.genre_breakdown}
                  dataKey="count"
                  nameKey="genre"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }: { name?: string; percent?: number }) =>
                    `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {stats.genre_breakdown.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1A1A35', border: '1px solid #2A2A50', borderRadius: 8 }}
                  itemStyle={{ color: '#A78BFA' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-[#64748B] text-sm">
              No genre data yet
            </div>
          )}
        </div>
      </div>

      {/* Top songs table */}
      <div className="bg-[#12122A] border border-[#2A2A50] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2A2A50]/40 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#A78BFA]" />
          <h2 className="text-sm font-semibold">Top Performing Songs</h2>
        </div>
        <div className="divide-y divide-[#2A2A50]/40">
          <div className="grid grid-cols-[2rem_1fr_1fr_80px_80px] gap-4 px-6 py-2.5 text-xs font-semibold text-[#64748B] uppercase tracking-widest">
            <span>#</span>
            <span>Song</span>
            <span>Artist</span>
            <span className="text-right">Plays</span>
            <span className="text-right">Likes</span>
          </div>
          {stats.top_songs.map((song, i) => (
            <div key={song.song_id} className="grid grid-cols-[2rem_1fr_1fr_80px_80px] gap-4 px-6 py-3 items-center hover:bg-[#1A1A35] transition-colors">
              <span className="text-sm text-[#64748B] tabular-nums">{i + 1}</span>
              <span className="text-sm font-medium text-[#F1F5F9] truncate">{song.title}</span>
              <span className="text-sm text-[#64748B] truncate">{song.artist}</span>
              <span className="text-sm text-[#94A3B8] text-right tabular-nums">{formatNumber(song.play_count)}</span>
              <span className="text-sm text-[#94A3B8] text-right tabular-nums">{formatNumber(song.likes_count)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
