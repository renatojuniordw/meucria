'use client'

import React from 'react'
import { AlertCircle, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import styles from './BrandLimitBadge.module.scss'
import { useBrands } from '@/hooks/useBrands'
import { useCurrentPlan } from '@/hooks/useCurrentPlan'

export function BrandLimitBadge() {
  const router = useRouter()
  const { brands, loading: isLoadingBrands } = useBrands()
  const { planData, loading: isLoadingPlan } = useCurrentPlan()

  if (isLoadingBrands || isLoadingPlan) return null

  const used = brands.length
  const limit = planData?.brandLimit || 1
  const isUnlimited = limit === Infinity
  
  // Se for ilimitado (Pro) não mostra badge ou mostra um discreto
  if (isUnlimited) {
    return (
      <div className={`${styles.badge} ${styles.unlimited}`}>
        <Target size={14} />
        <span>Marcas ilimitadas (Pro)</span>
      </div>
    )
  }

  const reachedLimit = used >= limit

  return (
    <div className={`${styles.badge} ${reachedLimit ? styles.danger : styles.normal}`}>
      <span className={styles.countText}>
        Marcas: <strong>{used} / {limit}</strong>
      </span>
      
      {reachedLimit && (
        <button 
          className={styles.upgradeBtn}
          onClick={() => router.push('/pricing')}
          title="Fazer Upgrade de Plano"
        >
          <AlertCircle size={14} /> Fazer Upgrade
        </button>
      )}
    </div>
  )
}
