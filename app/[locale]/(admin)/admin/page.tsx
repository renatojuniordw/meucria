'use client'

import { useState, useEffect } from 'react'

interface Stats {
  totalUsers: number
  activeUsersLast7Days: number
  promptsGeneratedToday: number
  promptsGeneratedThisMonth: number
  paidUsers: number
  totalBrandsCreated: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  if (!stats) return <p style={{ padding: 64, color: '#888' }}>Carregando...</p>

  const cards = [
    { label: 'Total de usuários', value: stats.totalUsers },
    { label: 'Ativos (7 dias)', value: stats.activeUsersLast7Days },
    { label: 'Prompts hoje', value: stats.promptsGeneratedToday },
    { label: 'Prompts este mês', value: stats.promptsGeneratedThisMonth },
    { label: 'Usuários pagantes', value: stats.paidUsers },
    { label: 'Marcas criadas', value: stats.totalBrandsCreated },
  ]

  return (
    <div style={{ padding: '32px 0' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 32 }}>Painel Admin</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {cards.map((c) => (
          <div key={c.label} style={{ border: '1px solid #1a1a1a', padding: 24 }}>
            <p style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{c.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#39ff14', marginTop: 4 }}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
