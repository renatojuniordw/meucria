'use client'

import React from 'react'
import { Copy, CheckCircle2 } from 'lucide-react'
import { Button } from '../ui/Button'
import styles from './CloneResult.module.scss'
import toast from 'react-hot-toast'

interface CloneResultProps {
  promptText: string
  onReset: () => void
}

export function CloneResult({ promptText, onReset }: CloneResultProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText)
      setCopied(true)
      toast.success('Prompt reverso copiado!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Erro ao copiar')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.successBanner}>
        <CheckCircle2 size={24} className={styles.icon} />
        <div>
          <h3>Imagem analisada com sucesso!</h3>
          <p>A IA extraiu a estética, iluminação e direção de arte. Agora você tem o prompt reverso pronto.</p>
        </div>
      </div>

      <div className={styles.resultBox}>
        <div className={styles.boxHeader}>
          <span>Prompt Engenheirado</span>
          <button type="button" onClick={handleCopy} className={styles.copyIconBtn}>
            {copied ? <CheckCircle2 size={16} className={styles.successIcon} /> : <Copy size={16} />}
          </button>
        </div>
        <textarea
          readOnly
          value={promptText}
          className={styles.textarea}
          rows={8}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" onClick={onReset} className={styles.resetBtn}>
          Clonar Outra Imagem
        </Button>
        <Button type="button" onClick={handleCopy} className={styles.copyBtn}>
          {copied ? 'Copiado!' : 'Copiar Prompt e Usar'}
        </Button>
      </div>
    </div>
  )
}
