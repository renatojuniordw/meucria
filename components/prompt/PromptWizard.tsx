// components/prompt/PromptWizard.tsx
'use client'

import { useState } from 'react'
import { useActiveBrand } from '@/hooks/useActiveBrand'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import styles from './PromptWizard.module.scss'

type Slide = { slide: number; label: string; prompt: string }
type PromptResult = { format: string; brand: string; slides: Slide[] }

const copyText = (text: string) => navigator.clipboard.writeText(text)

const buildMarkdown = (result: PromptResult) =>
  result.slides.map((s) => `## Slide ${s.slide} — ${s.label}\n\n${s.prompt}`).join('\n\n---\n\n')

export const PromptWizard = () => {
  const { brand, loading: brandLoading } = useActiveBrand()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PromptResult | null>(null)
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    format: 'feed',
    objective: '',
    contentMode: 'manual',
    contentText: '',
    hasPersona: false,
    personaDescription: '',
    colorMode: 'ai',
  })

  const handleCopy = (text: string, key: string) => {
    copyText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleGenerate = async () => {
    if (!brand) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/prompt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, brandId: brand.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 403) {
          setError('Você atingiu o limite de gerações do seu plano. Faça upgrade para continuar.')
        } else if (res.status === 429) {
          setError('Muitas requisições. Aguarde um momento e tente novamente.')
        } else {
          setError(data.error ?? 'Erro ao gerar prompt. Tente novamente.')
        }
        return
      }
      if (data.prompt) {
        const jsonMatch = data.prompt.match(/```json\n([\s\S]*?)\n```/)
        const parsed = jsonMatch ? JSON.parse(jsonMatch[1]) : JSON.parse(data.prompt)
        if (parsed.slides) {
          setResult(parsed)
          setActiveTab(0)
        } else if (parsed.prompts) {
          setResult({
            format: form.format,
            brand: brand.name,
            slides: parsed.prompts.map(
              (p: { prompt: string }, i: number) => ({
                slide: i + 1,
                label: `Prompt ${i + 1}`,
                prompt: p.prompt,
              })
            ),
          })
          setActiveTab(0)
        }
      }
    } catch (err) {
      console.error(err)
      setError('Erro inesperado. Verifique sua conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (brandLoading) return <div>Carregando...</div>
  if (!brand) return <div>Nenhuma marca ativa encontrada.</div>

  const multiSlide = result && result.slides.length > 1

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
              {['feed', 'story', 'carousel'].map((f) => (
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
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.loadingBar} />
              <div className={styles.loadingBar} style={{ width: '75%' }} />
              <div className={styles.loadingBar} style={{ width: '88%' }} />
              <div className={styles.loadingBar} style={{ width: '60%' }} />
              <div className={styles.loadingBar} style={{ width: '82%' }} />
              <p className={styles.loadingLabel}>GERANDO PROMPT...</p>
            </div>
          ) : error ? (
            <div className={styles.errorMessage}>{error}</div>
          ) : result ? (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                {multiSlide ? (
                  <div className={styles.tabs}>
                    {result.slides.map((s, i) => (
                      <button
                        key={s.slide}
                        className={`${styles.tab} ${activeTab === i ? styles.tabActive : ''}`}
                        onClick={() => setActiveTab(i)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span />
                )}
                <div className={styles.copyActions}>
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(result.slides[activeTab].prompt, 'single')}
                  >
                    {copied === 'single' ? 'COPIADO!' : 'COPIAR PROMPT'}
                  </Button>

                  {multiSlide && (
                    <Button
                      variant="outline"
                      onClick={() => handleCopy(buildMarkdown(result), 'all')}
                    >
                      {copied === 'all' ? 'COPIADO!' : 'COPIAR TUDO'}
                    </Button>
                  )}
                </div>
              </div>

              <pre className={styles.promptText}>{result.slides[activeTab].prompt}</pre>
            </div>
          ) : (
            <div className={styles.placeholder}>SEU PROMPT APARECERÁ AQUI</div>
          )}
        </div>
      </div>
    </div>
  )
}
