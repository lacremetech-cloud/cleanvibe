'use client'

import { useEffect, useState } from 'react'
import { Shield, ShieldOff, Users, Download } from 'lucide-react'
import { Profile } from '@/types'
import { formatDate, getInitials } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(data.users ?? [])
    setLoading(false)
  }

  async function toggleAdmin(user: Profile) {
    setUpdatingId(user.id)
    await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_admin: !user.is_admin }),
    })
    await fetchUsers()
    setUpdatingId(null)
  }

  function exportCSV() {
    const headers = ['Username', 'Display Name', 'Admin', 'Joined']
    const rows = users.map((u) => [u.username, u.display_name ?? '', u.is_admin ? 'Yes' : 'No', formatDate(u.created_at)])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cleanvibe-users.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-[#64748B] text-sm mt-1">{users.length} registered users</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-[#12122A] border border-[#2A2A50] rounded-2xl">
          <Users className="w-10 h-10 text-[#2A2A50] mb-3" />
          <p className="text-[#64748B]">No users yet.</p>
        </div>
      ) : (
        <div className="bg-[#12122A] border border-[#2A2A50] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2.5rem_1fr_1fr_80px_100px] gap-4 px-6 py-3 border-b border-[#2A2A50]/40 text-xs font-semibold text-[#64748B] uppercase tracking-widest">
            <span></span>
            <span>User</span>
            <span>Joined</span>
            <span>Role</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-[#2A2A50]/40">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-[2.5rem_1fr_1fr_80px_100px] gap-4 px-6 py-4 items-center hover:bg-[#1A1A35] transition-colors">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-violet-900 flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
                  {getInitials(user.display_name ?? user.username)}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#F1F5F9] truncate">
                    {user.display_name ?? user.username}
                  </p>
                  <p className="text-xs text-[#64748B] truncate">@{user.username}</p>
                </div>

                <p className="text-sm text-[#64748B]">{formatDate(user.created_at)}</p>

                <div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    user.is_admin
                      ? 'bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30'
                      : 'bg-[#1A1A35] text-[#64748B] border border-[#2A2A50]'
                  }`}>
                    {user.is_admin ? 'Admin' : 'User'}
                  </span>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => toggleAdmin(user)}
                    disabled={updatingId === user.id}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      user.is_admin
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                        : 'bg-[#7C3AED]/10 text-[#A78BFA] hover:bg-[#7C3AED]/20 border border-[#7C3AED]/20'
                    }`}
                    title={user.is_admin ? 'Remove admin' : 'Make admin'}
                  >
                    {updatingId === user.id ? (
                      <Spinner size="sm" />
                    ) : user.is_admin ? (
                      <><ShieldOff className="w-3 h-3" /> Demote</>
                    ) : (
                      <><Shield className="w-3 h-3" /> Promote</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
