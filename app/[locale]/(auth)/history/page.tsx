'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { PromptRow } from '@/lib/repositories/promptRepo'

export default function HistoryPage() {
  const [prompts, setPrompts] = useState<PromptRow[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetch() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(50)

      setPrompts((data ?? []) as PromptRow[])
      setLoading(false)
    }
    fetch()
  }, [supabase])

  if (loading) return <p style={{ padding: 64, textAlign: 'center', color: '#888' }}>Carregando histórico...</p>

  return (
    <div style={{ padding: '32px 0' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Histórico de prompts</h1>
      {prompts.length === 0 ? (
        <p style={{ color: '#888' }}>Nenhum prompt gerado ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {prompts.map((p) => (
            <div key={p.id} style={{ border: '1px solid #1a1a1a', padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8rem' }}>{p.format}</span>
                <span style={{ color: '#888', fontSize: '0.75rem' }}>{new Date(p.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.5 }}>
                {p.generated_prompt?.slice(0, 200)}...
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(p.generated_prompt ?? '')}
                style={{ marginTop: 8, padding: '4px 12px', background: 'transparent', border: '1px solid #1a1a1a', color: '#888', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Copiar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
