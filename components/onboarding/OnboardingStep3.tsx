// components/onboarding/OnboardingStep3.tsx
'use client'

import React from 'react'
import { useOnboardingStore } from '@/hooks/useOnboardingStore'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import styles from './OnboardingStep3.module.scss'

export const OnboardingStep3 = () => {
  const { data, updateData } = useOnboardingStore()

  const setMode = (mode: 'manual' | 'palette' | 'ai') => updateData({ colorMode: mode })

  return (
    <div className={styles.container}>
      <h2 style={{ fontSize: '2rem' }}>CORES DA MARCA</h2>
      
      <div className={styles.modes}>
        <Button 
          variant={data.colorMode === 'manual' ? 'primary' : 'outline'}
          onClick={() => setMode('manual')}
        >
          Manual
        </Button>
        <Button 
          variant={data.colorMode === 'ai' ? 'primary' : 'outline'}
          onClick={() => setMode('ai')}
        >
          IA Decide
        </Button>
      </div>

      {data.colorMode === 'manual' && (
        <div className={styles.manualInputs}>
          <Input 
            label="PRIMÁRIA"
            value={data.colors.primary}
            onChange={(e) => updateData({ colors: { ...data.colors, primary: e.target.value } })}
          />
          <Input 
            label="SECUNDÁRIA"
            value={data.colors.secondary}
            onChange={(e) => updateData({ colors: { ...data.colors, secondary: e.target.value } })}
          />
          <Input 
            label="DESTAQUE"
            value={data.colors.accent}
            onChange={(e) => updateData({ colors: { ...data.colors, accent: e.target.value } })}
          />
        </div>
      )}

      {data.colorMode === 'ai' && (
        <p className={styles.aiNote}>
          Nossa IA escolherá as cores perfeitas com base no seu nicho e descrição.
        </p>
      )}

      <div className={styles.preview}>
        <div style={{ backgroundColor: data.colors.primary }} className={styles.swatch} />
        <div style={{ backgroundColor: data.colors.secondary }} className={styles.swatch} />
        <div style={{ backgroundColor: data.colors.accent }} className={styles.swatch} />
      </div>
    </div>
  )
}
