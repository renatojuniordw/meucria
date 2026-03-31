'use client'

import { useState } from 'react'
import styles from './PromptPreview.module.scss'

const NICHES = ['Moda', 'Alimentação', 'Fitness', 'Beleza', 'Tecnologia', 'Educação', 'Saúde', 'Imobiliário', 'Outro']

export function PromptPreview() {
  const [niche, setNiche] = useState('')
  const [format, setFormat] = useState<'feed' | 'story' | 'carousel'>('feed')
  const [objective, setObjective] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [used, setUsed] = useState(false)

  const handleGenerate = async () => {
    if (!niche || !objective) return
    setLoading(true)
    try {
      const res = await fetch('/api/prompt/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, format, objective }),
      })
      const data = await res.json()
      if (data.code === 'GUEST_USED') {
        setUsed(true)
      } else if (data.prompt) {
        setResult(data.prompt)
      }
    } catch {
      setResult('Erro ao gerar. Tente novamente.')
    }
    setLoading(false)
  }

  if (used) {
    return (
      <section id="demo" className={styles.section}>
        <div className={styles.card}>
          <h2>Você já usou seu teste gratuito</h2>
          <p>Crie uma conta para ter 15 prompts grátis com sua marca configurada.</p>
          <a href="/login?tab=register" className={styles.cta}>Criar conta grátis</a>
        </div>
      </section>
    )
  }

  return (
    <section id="demo" className={styles.section}>
      <div className={styles.card}>
        <h2>Teste agora — sem precisar criar conta</h2>
        <p className={styles.subtitle}>Preencha os campos abaixo e veja o prompt gerado pela IA</p>

        {!result ? (
          <div className={styles.form}>
            <select value={niche} onChange={(e) => setNiche(e.target.value)}>
              <option value="">Selecione o nicho</option>
              {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>

            <div className={styles.formats}>
              {(['feed', 'story', 'carousel'] as const).map((f) => (
                <button key={f} className={format === f ? styles.active : ''} onClick={() => setFormat(f)}>
                  {f === 'feed' ? 'Feed' : f === 'story' ? 'Story' : 'Carrossel'}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Ex: Promoção de lançamento da coleção de verão com 20% off"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={3}
            />

            <button className={styles.generate} onClick={handleGenerate} disabled={loading || !niche || !objective}>
              {loading ? 'Gerando seu prompt...' : '✨ Gerar meu prompt grátis'}
            </button>
          </div>
        ) : (
          <div className={styles.result}>
            <textarea readOnly value={result} rows={8} />
            <button onClick={() => navigator.clipboard.writeText(result)} className={styles.copy}>
              Copiar prompt
            </button>
            <div className={styles.postGenerate}>
              <p>Gostou? Crie sua conta e tenha 15 prompts grátis com sua marca configurada.</p>
              <a href="/login?tab=register" className={styles.cta}>Criar conta grátis</a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
