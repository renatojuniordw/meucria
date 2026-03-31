'use client'

import React from 'react'
import { Sparkles, PenTool } from 'lucide-react'
import styles from './ContentInput.module.scss'

export type ContentMode = 'manual' | 'ai'

interface ContentInputProps {
  mode: ContentMode
  text?: string
  onChangeMode: (mode: ContentMode) => void
  onChangeText: (text: string) => void
  error?: string
}

export function ContentInput({
  mode,
  text,
  onChangeMode,
  onChangeText,
  error,
}: ContentInputProps) {
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={mode === 'ai' ? styles.activeTab : ''}
          onClick={() => {
            onChangeMode('ai')
            onChangeText('') // Reset text when switching to AI
          }}
        >
          <Sparkles size={16} /> Deixar IA Sugerir Texto
        </button>
        <button
          type="button"
          className={mode === 'manual' ? styles.activeTab : ''}
          onClick={() => onChangeMode('manual')}
        >
          <PenTool size={16} /> Digitar Meu Próprio Texto
        </button>
      </div>

      <div className={styles.content}>
        {mode === 'manual' ? (
          <div className={styles.manualMode}>
            <textarea
              className={`${styles.textarea} ${error ? styles.errorBorder : ''}`}
              placeholder="Ex: Liquidação de Inverno - Descontos de até 50% em toda a loja"
              value={text || ''}
              onChange={(e) => onChangeText(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className={styles.footer}>
              {error && <span className={styles.errorText}>{error}</span>}
              <span className={styles.charCount}>{(text || '').length}/500</span>
            </div>
          </div>
        ) : (
          <div className={styles.aiMode}>
            <Sparkles size={24} className={styles.icon} />
            <div className={styles.info}>
              <strong>A IA criará o texto com base no seu objetivo</strong>
              <p>Você definiu um objetivo no passo anterior, e a IA vai gerar um texto persuasivo adaptado à sua marca.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
