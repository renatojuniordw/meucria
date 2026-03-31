// app/[locale]/(auth)/dashboard/page.tsx
'use client'

import React from 'react'
import { StatsCard } from '@/components/ui/StatsCard'
import { useActiveBrand } from '@/hooks/useActiveBrand'

export default function DashboardPage() {
  const { brand } = useActiveBrand()

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem' }}>DASHBOARD</h1>
        <p style={{ color: '#444', fontFamily: 'monospace' }}>MÉTRICAS DA PLATAFORMA</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem' 
      }}>
        <StatsCard 
          label="PROMPTS GERADOS" 
          value="12 / 15" 
          sublabel="PLANO ATUAL: FREE"
          progress={12/15}
        />
        
        <StatsCard 
          label="MARCA ATIVA" 
          value={brand?.name || '...'} 
          sublabel={brand?.niche || 'NÃO DEFINIDO'}
        />

        <StatsCard 
          label="HISTÓRICO" 
          value="6" 
          sublabel="ÚLTIMOS 30 DIAS"
        />
      </div>
    </div>
  )
}
