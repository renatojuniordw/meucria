// components/onboarding/OnboardingStep2.tsx
'use client'

import React from 'react'
import { useOnboardingStore } from '@/hooks/useOnboardingStore'
import { Input } from '../ui/Input'
import styles from '../ui/Input.module.scss'

export const OnboardingStep2 = () => {
  const { data, updateData } = useOnboardingStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ fontSize: '2rem' }}>CONTE MAIS</h2>
      <Input 
        label="NICHO DETALHADO"
        placeholder="Ex: Streetwear unissex com foco em sustentabilidade"
        value={data.niche}
        onChange={(e) => updateData({ niche: e.target.value })}
      />
      <div className={styles.inputWrapper}>
        <label className={styles.label}>DESCRIÇÃO DA MARCA</label>
        <textarea 
          className={styles.input}
          style={{ minHeight: '120px', resize: 'none' }}
          placeholder="Descreva o estilo, tom de voz e o que torna sua marca única..."
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
        />
      </div>
    </div>
  )
}
