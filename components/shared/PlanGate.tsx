'use client'

import { ReactNode } from 'react'
import { useCurrentPlan } from '@/hooks/useCurrentPlan'

interface PlanGateProps {
  requiredPlan: 'basic' | 'pro'
  children: ReactNode
  fallback?: ReactNode
}

export function PlanGate({ requiredPlan, children, fallback }: PlanGateProps) {
  const { plan, loading } = useCurrentPlan()

  if (loading) return null

  const planOrder = { free: 0, basic: 1, pro: 2 }
  const hasAccess = planOrder[plan] >= planOrder[requiredPlan]

  if (!hasAccess) return fallback ?? null

  return <>{children}</>
}
