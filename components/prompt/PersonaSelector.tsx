'use client'

import React from 'react'
import { UserCircle } from 'lucide-react'
import styles from './PersonaSelector.module.scss'

interface PersonaSelectorProps {
  hasPersona: boolean
  description?: string
  onChangeHasPersona: (has: boolean) => void
  onChangeDescription: (desc: string) => void
  error?: string
}

export function PersonaSelector({
  hasPersona,
  description,
  onChangeHasPersona,
  onChangeDescription,
  error,
}: PersonaSelectorProps) {
  return (
    <div className={styles.container}>
      {/* Toggle visual */}
      <div 
        className={`${styles.toggleArea} ${hasPersona ? styles.activeToggle : ''}`}
        onClick={() => {
          onChangeHasPersona(!hasPersona)
          if (hasPersona) onChangeDescription('') // Clear when toggled off
        }}
        role="button"
        tabIndex={0}
      >
        <div className={styles.iconBox}>
          <UserCircle size={20} />
        </div>
        <div className={styles.info}>
          <strong>Deseja focar numa persona na imagem?</strong>
          <span>Ex: Mostrar uma mulher jovem bebendo café. (Opcional)</span>
        </div>
        
        {/* Toggle Switch */}
        <div className={`${styles.switch} ${hasPersona ? styles.switchOn : ''}`}>
          <div className={styles.knob} />
        </div>
      </div>

      {hasPersona && (
        <div className={styles.personaInput}>
          <textarea
            className={`${styles.textarea} ${error ? styles.errorBorder : ''}`}
            placeholder="Descreva a persona. Ex: Mulher entre 25-35 anos, ruiva, sorrindo e segurando uma xícara nas duas mãos, estilo casual moderno..."
            value={description || ''}
            onChange={(e) => onChangeDescription(e.target.value)}
            rows={3}
            maxLength={300}
            autoFocus
          />
          <div className={styles.footer}>
            {error && <span className={styles.errorText}>{error}</span>}
            <span className={styles.charCount}>{(description || '').length}/300</span>
          </div>
        </div>
      )}
    </div>
  )
}
