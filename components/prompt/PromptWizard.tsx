// components/prompt/PromptWizard.tsx
'use client'

import React, { useState } from 'react'
import { useActiveBrand } from '@/hooks/useActiveBrand'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import styles from './PromptWizard.module.scss'

export const PromptWizard = () => {
  const { brand, loading: brandLoading } = useActiveBrand()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  
  const [form, setForm] = useState({
    format: 'feed',
    objective: '',
    contentMode: 'manual',
    contentText: '',
    hasPersona: false,
    personaDescription: '',
    colorMode: 'ai'
  })

  const handleGenerate = async () => {
    if (!brand) return
    setLoading(true)
    try {
      const res = await fetch('/api/prompt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, brandId: brand.id }),
      })
      const data = await res.json()
      if (data.prompt) setResult(data.prompt)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (brandLoading) return <div>Carregando...</div>
  if (!brand) return <div>Nenhuma marca ativa encontrada.</div>

  return (
    <div className={styles.wizard}>
      <header className={styles.header}>
        <h2 className={styles.title}>GERAR PROMPT</h2>
        <p className={styles.subtitle}>MARCA: {brand.name}</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.controls}>
          <div className={styles.group}>
            <label>FORMATO</label>
            <div className={styles.toggleGroup}>
              {['feed', 'story', 'carousel'].map(f => (
                <Button 
                  key={f}
                  variant={form.format === f ? 'primary' : 'outline'}
                  onClick={() => setForm({ ...form, format: f })}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          <Input 
            label="OBJETIVO DO CRIATIVO"
            placeholder="Ex: Lançamento da coleção de outono"
            value={form.objective}
            onChange={(e) => setForm({ ...form, objective: e.target.value })}
          />

          <div style={{ marginTop: '1rem' }}>
            <Button 
              variant="primary" 
              style={{ width: '100%' }}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? 'PROCESSANDO...' : 'GERAR AGORA'}
            </Button>
          </div>
        </div>

        <div className={styles.resultZone}>
          {result ? (
            <div className={styles.resultCard}>
              <pre className={styles.promptText}>{result}</pre>
              <Button 
                onClick={() => navigator.clipboard.writeText(result)}
                variant="outline"
                style={{ marginTop: '1rem' }}
              >
                COPIAR PROMPT
              </Button>
            </div>
          ) : (
            <div className={styles.placeholder}>
              SEU PROMPT APARECERÁ AQUI
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
