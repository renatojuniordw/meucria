'use client'

import React from 'react'
import { Copy, CheckCircle2, Zap } from 'lucide-react'
import styles from './CopyResult.module.scss'
import { Button } from '../ui/Button'
import toast from 'react-hot-toast'

export interface GeneratedCopy {
  hook: string
  body: string
  cta: string
  hashtags: string
}

interface CopyResultProps {
  copyData: GeneratedCopy
}

export function CopyResult({ copyData }: CopyResultProps) {
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null)
  const fullText = `${copyData.hook}\n\n${copyData.body}\n\n${copyData.cta}\n\n${copyData.hashtags}`

  const handleCopy = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(sectionId)
      toast.success('Copiado!')
      setTimeout(() => setCopiedSection(null), 2000)
    } catch {
      toast.error('Erro ao copiar')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <Zap size={20} className={styles.icon} />
          <span>Copy Persuasivo Gerado (Pro)</span>
        </div>
        <Button 
          type="button" 
          onClick={() => handleCopy(fullText, 'all')}
          className={styles.copyAllBtn}
        >
          {copiedSection === 'all' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          Copiar Tudo
        </Button>
      </div>

      <div className={styles.sections}>
        <CopyBlock 
          title="Hook (Atenção)" 
          text={copyData.hook} 
          isCopied={copiedSection === 'hook'}
          onCopy={() => handleCopy(copyData.hook, 'hook')}
        />
        <CopyBlock 
          title="Corpo (Conexão e Oferta)" 
          text={copyData.body} 
          isCopied={copiedSection === 'body'}
          onCopy={() => handleCopy(copyData.body, 'body')}
        />
        <CopyBlock 
          title="CTA (Chamada para Ação)" 
          text={copyData.cta} 
          isCopied={copiedSection === 'cta'}
          onCopy={() => handleCopy(copyData.cta, 'cta')}
        />
        <CopyBlock 
          title="Hashtags" 
          text={copyData.hashtags} 
          isCopied={copiedSection === 'hashtags'}
          onCopy={() => handleCopy(copyData.hashtags, 'hashtags')}
        />
      </div>
    </div>
  )
}

function CopyBlock({ title, text, isCopied, onCopy }: { title: string, text: string, isCopied: boolean, onCopy: () => void }) {
  if (!text) return null
  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <strong>{title}</strong>
        <button type="button" onClick={onCopy} className={styles.iconBtn} title="Copiar bloco">
          {isCopied ? <CheckCircle2 size={14} className={styles.successIcon} /> : <Copy size={14} />}
        </button>
      </div>
      <div className={styles.blockText}>{text}</div>
    </div>
  )
}
