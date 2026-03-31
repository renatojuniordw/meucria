// components/onboarding/OnboardingStep5.tsx
'use client'

import React from 'react'
import { useOnboardingStore } from '@/hooks/useOnboardingStore'

export const OnboardingStep5 = () => {
  const { data, updateData } = useOnboardingStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h2 style={{ fontSize: '2rem' }}>PREFERÊNCIAS</h2>
      <p style={{ color: '#888' }}>Como você prefere criar o conteúdo dos seus prompts?</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div 
          onClick={() => updateData({ contentPreference: 'ai' })}
          style={{ 
            padding: '1.5rem', 
            border: `2px solid ${data.contentPreference === 'ai' ? '#39ff14' : '#1a1a1a'}`,
            cursor: 'pointer'
          }}
        >
          <h3 style={{ marginBottom: '0.5rem' }}>IA Sugere</h3>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>A IA cria o texto e o objetivo com base no seu nicho.</p>
        </div>

        <div 
          onClick={() => updateData({ contentPreference: 'manual' })}
          style={{ 
            padding: '1.5rem', 
            border: `2px solid ${data.contentPreference === 'manual' ? '#39ff14' : '#1a1a1a'}`,
            cursor: 'pointer'
          }}
        >
          <h3 style={{ marginBottom: '0.5rem' }}>Eu Escrevo</h3>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>Você fornece o texto exato que deseja no criativo.</p>
        </div>
      </div>
    </div>
  )
}
