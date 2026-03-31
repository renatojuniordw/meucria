'use client'

import React from 'react'
import { LayoutGrid, Smartphone, Layers } from 'lucide-react'
import styles from './FormatSelector.module.scss'

export type CreativeFormat = 'feed' | 'story' | 'carousel'

interface FormatSelectorProps {
  value: CreativeFormat
  onChange: (format: CreativeFormat) => void
}

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  const formats = [
    { id: 'feed', label: 'Feed (1:1 / 4:5)', icon: LayoutGrid, desc: 'Post único no feed' },
    { id: 'story', label: 'Story/Reels (9:16)', icon: Smartphone, desc: 'Criativo vertical' },
    { id: 'carousel', label: 'Carrossel', icon: Layers, desc: 'Sequência de imagens' },
  ] as const

  return (
    <div className={styles.container}>
      {formats.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`${styles.card} ${value === f.id ? styles.active : ''}`}
          onClick={() => onChange(f.id)}
        >
          <f.icon size={24} className={styles.icon} />
          <div className={styles.info}>
            <span className={styles.label}>{f.label}</span>
            <span className={styles.desc}>{f.desc}</span>
          </div>
        </button>
      ))}
    </div>
  )
}
