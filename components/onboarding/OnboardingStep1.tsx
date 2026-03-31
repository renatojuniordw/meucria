// components/onboarding/OnboardingStep1.tsx
'use client'

import React from 'react'
import { useOnboardingStore } from '@/hooks/useOnboardingStore'
import { Input } from '../ui/Input'

export const OnboardingStep1 = () => {
  const { data, updateData } = useOnboardingStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ fontSize: '2rem' }}>VAMOS COMEÇAR</h2>
      <Input 
        label="NOME DA MARCA OU CLIENTE"
        placeholder="Ex: Boutique Alma"
        value={data.name}
        onChange={(e) => updateData({ name: e.target.value })}
      />
      <Input 
        label="SEGMENTO"
        placeholder="Ex: Moda Feminina"
        value={data.segment}
        onChange={(e) => updateData({ segment: e.target.value })}
      />
    </div>
  )
}
