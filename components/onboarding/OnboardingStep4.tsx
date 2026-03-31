// components/onboarding/OnboardingStep4.tsx
'use client'

import React from 'react'
import { useOnboardingStore } from '@/hooks/useOnboardingStore'
import { Button } from '../ui/Button'
import { FONTS } from '@/lib/constants/fonts'
import styles from './OnboardingStep4.module.scss'

export const OnboardingStep4 = () => {
  const { data, updateData } = useOnboardingStore()

  const setMode = (mode: 'manual' | 'ai') => updateData({ fontMode: mode })

  return (
    <div className={styles.container}>
      <h2 style={{ fontSize: '2rem' }}>TIPOGRAFIA</h2>
      
      <div className={styles.modes}>
        <Button 
          variant={data.fontMode === 'ai' ? 'primary' : 'outline'}
          onClick={() => setMode('ai')}
        >
          IA Decide
        </Button>
        <Button 
          variant={data.fontMode === 'manual' ? 'primary' : 'outline'}
          onClick={() => setMode('manual')}
        >
          Eu Escolho
        </Button>
      </div>

      {data.fontMode === 'ai' ? (
        <p className={styles.aiNote}>
          A IA escolherá as fontes ideais para o seu nicho. O resultado captura a personalidade tipográfica, não a fonte exata pixel a pixel.
        </p>
      ) : (
        <div className={styles.manualSelection}>
          <div className={styles.slot}>
            <label>Título (Display/Bold)</label>
            <select 
              value={data.fonts?.title || ''} 
              onChange={(e) => updateData({ fonts: { ...data.fonts!, title: e.target.value } })}
            >
              {FONTS.display.map(f => <option key={f} value={f}>{f}</option>)}
              {FONTS.sans.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          {/* Repeat for Body and Accent... */}
        </div>
      )}

      <p className={styles.disclaimer}>
        As fontes são interpretadas pela IA para capturar o estilo visual — o resultado pode variar da fonte original.
      </p>
    </div>
  )
}
