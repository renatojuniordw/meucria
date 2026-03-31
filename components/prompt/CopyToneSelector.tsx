'use client'

import React from 'react'
import { Flame, Heart, AlertCircle, ShieldCheck } from 'lucide-react'
import styles from './CopyToneSelector.module.scss'

export type CopyTone = 'urgency' | 'emotional' | 'curiosity' | 'authority'

interface CopyToneSelectorProps {
  value: CopyTone
  onChange: (tone: CopyTone) => void
}

export function CopyToneSelector({ value, onChange }: CopyToneSelectorProps) {
  const tones = [
    { id: 'urgency', label: 'Urgência', icon: Flame, desc: 'Ofertas com prazo curto, escassez' },
    { id: 'emotional', label: 'Emocional', icon: Heart, desc: 'Conexão, desejo, empatia' },
    { id: 'curiosity', label: 'Curiosidade', icon: AlertCircle, desc: 'Gatilho "o que é aquilo?", mistério' },
    { id: 'authority', label: 'Autoridade', icon: ShieldCheck, desc: 'Dados, confiança, prova social' },
  ] as const

  return (
    <div className={styles.container}>
      {tones.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`${styles.card} ${value === t.id ? styles.active : ''}`}
          onClick={() => onChange(t.id)}
        >
          <div className={styles.iconBox}>
            <t.icon size={20} />
          </div>
          <div className={styles.info}>
            <span className={styles.label}>{t.label}</span>
            <span className={styles.desc}>{t.desc}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
