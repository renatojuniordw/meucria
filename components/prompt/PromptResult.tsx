'use client'

import React from 'react'
import { Copy, CheckCircle2, Download, Share2, ImageIcon, ThumbsUp, ThumbsDown } from 'lucide-react'
import styles from './PromptResult.module.scss'
import { Button } from '../ui/Button'
import toast from 'react-hot-toast'

interface PromptResultProps {
  promptText: string
  promptId?: string
  onFeedback?: (isPositive: boolean) => void
  onUploadImage?: () => void
}

export function PromptResult({ promptText, promptId, onFeedback, onUploadImage }: PromptResultProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopied(true)
      toast.success('Prompt copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Erro ao copiar')
    }
  }

  const handleExportTxt = () => {
    const blob = new Blob([promptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meucria-prompt-${new Date().getTime()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    if (!promptId) return toast.error('Salve o prompt antes de compartilhar')
    const url = `${window.location.origin}/p/${promptId}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link de compartilhamento copiado!')
    } catch (err) {
      toast.error('Erro ao copiar link')
    }
  }

  if (!promptText) return null

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <SparklesIcon />
          <span>Seu Prompt Otimizado</span>
        </div>
        <div className={styles.actions}>
          <button type="button" onClick={handleShare} title="Compartilhar Link Público">
            <Share2 size={16} />
          </button>
          <button type="button" onClick={handleExportTxt} title="Baixar .txt">
            <Download size={16} />
          </button>
          <Button type="button" onClick={handleCopy} className={styles.copyBtn}>
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copied ? 'Copiado!' : 'Copiar Prompt'}
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <textarea
          readOnly
          value={promptText}
          className={styles.textarea}
          rows={10}
        />
      </div>

      <div className={styles.footer}>
        <div className={styles.feedback}>
          <span>O resultado foi bom?</span>
          <button type="button" onClick={() => onFeedback?.(true)}><ThumbsUp size={16} /></button>
          <button type="button" onClick={() => onFeedback?.(false)}><ThumbsDown size={16} /></button>
        </div>

        <button type="button" className={styles.uploadBtn} onClick={onUploadImage}>
          <ImageIcon size={16} />
          Anexar Imagem Gerada
        </button>
      </div>
    </div>
  )
}

function SparklesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-primary, #0070f3)' }}>
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>
    </svg>
  )
}
