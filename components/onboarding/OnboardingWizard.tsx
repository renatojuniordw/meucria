// components/onboarding/OnboardingWizard.tsx (Update)
'use client'

import React, { useState } from 'react'
import { useOnboardingStore } from '@/hooks/useOnboardingStore'
import { useRouter } from '@/i18n/routing'
import { OnboardingStep1 } from '@/components/onboarding/OnboardingStep1'
import { OnboardingStep2 } from '@/components/onboarding/OnboardingStep2'
import { OnboardingStep3 } from '@/components/onboarding/OnboardingStep3'
import { OnboardingStep4 } from '@/components/onboarding/OnboardingStep4'
import { OnboardingStep5 } from '@/components/onboarding/OnboardingStep5'
import styles from './OnboardingWizard.module.scss'
import { Button } from '../ui/Button'

export const OnboardingWizard = () => {
  const { step, data, nextStep, prevStep } = useOnboardingStore()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleFinalize = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      if (res.ok) router.push('/create')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1: return <OnboardingStep1 />
      case 2: return <OnboardingStep2 />
      case 3: return <OnboardingStep3 />
      case 4: return <OnboardingStep4 />
      case 5: return <OnboardingStep5 />
      default: return <OnboardingStep1 />
    }
  }

  return (
    <div className={styles.wizard}>
      <div className={styles.progress}>
        <div 
          className={styles.bar} 
          style={{ width: `${(step / 5) * 100}%` }} 
        />
        <span className={styles.stepInfo}>Passo {step} de 5</span>
      </div>

      <div className={styles.stepContent}>
        {renderStep()}
      </div>

      <div className={styles.nav}>
        {step > 1 && (
          <Button variant="outline" onClick={prevStep} disabled={loading}>Voltar</Button>
        )}
        <div style={{ marginLeft: 'auto' }}>
          {step < 5 ? (
            <Button variant="primary" onClick={nextStep}>Próximo</Button>
          ) : (
            <Button variant="primary" onClick={handleFinalize} disabled={loading}>
              {loading ? 'SALVANDO...' : 'FINALIZAR'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
