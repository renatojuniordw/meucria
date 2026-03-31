'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  full_name: string | null
  plan: string
  role: string
  prompts_used: number
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const url = filter ? `/api/admin/users?plan=${filter}` : '/api/admin/users'
    fetch(url).then(r => r.json()).then(d => setUsers(d.users ?? [])).catch(console.error)
  }, [filter])

  return (
    <div style={{ padding: '32px 0' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Usuários</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['', 'free', 'basic', 'pro'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '4px 16px', background: filter === f ? '#39ff14' : 'transparent', color: filter === f ? '#000' : '#888', border: '1px solid #1a1a1a', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase' }}>
            {f || 'Todos'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {users.map((u) => (
          <div key={u.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, border: '1px solid #1a1a1a' }}>
            <div>
              <span style={{ fontWeight: 600 }}>{u.full_name ?? 'Sem nome'}</span>
              <span style={{ color: '#888', marginLeft: 8, fontSize: '0.8rem' }}>{u.plan}</span>
            </div>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>{u.prompts_used} prompts</span>
          </div>
        ))}
      </div>
    </div>
  )
}
