'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function BrandEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [brand, setBrand] = useState<Record<string, unknown> | null>(null)
  const [name, setName] = useState('')
  const [niche, setNiche] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetch() {
      const res = await globalThis.fetch(`/api/brands/${id}`)
      if (res.ok) {
        const data = await res.json()
        setBrand(data)
        setName((data.name as string) ?? '')
        setNiche((data.niche as string) ?? '')
        setDescription((data.description as string) ?? '')
      }
      setLoading(false)
    }
    fetch()
  }, [id, supabase])

  const handleSave = async () => {
    setSaving(true)
    await globalThis.fetch(`/api/brands/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, niche, description }),
    })
    setSaving(false)
    router.push('/brands')
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return
    await globalThis.fetch(`/api/brands/${id}`, { method: 'DELETE' })
    router.push('/brands')
  }

  if (loading) return <p style={{ padding: 64, textAlign: 'center', color: '#888' }}>Carregando...</p>
  if (!brand) return <p style={{ padding: 64, textAlign: 'center', color: '#888' }}>Marca não encontrada.</p>

  return (
    <div style={{ maxWidth: 480, padding: '32px 0' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Editar marca</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da marca"
          style={{ padding: '8px 16px', background: '#000', border: '1px solid #1a1a1a', color: '#fff' }} />
        <input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="Nicho"
          style={{ padding: '8px 16px', background: '#000', border: '1px solid #1a1a1a', color: '#fff' }} />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição" rows={4}
          style={{ padding: '8px 16px', background: '#000', border: '1px solid #1a1a1a', color: '#fff', resize: 'none' }} />

        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '8px 24px', background: '#39ff14', color: '#000', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <button onClick={handleDelete}
            style={{ padding: '8px 24px', background: 'transparent', color: '#ff4444', border: '1px solid #ff4444', cursor: 'pointer' }}>
            Excluir marca
          </button>
        </div>
      </div>
    </div>
  )
}
