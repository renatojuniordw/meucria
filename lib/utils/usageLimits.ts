// lib/utils/usageLimits.ts
import { PLANS } from '../stripe/plans'

export type PlanId = 'free' | 'basic' | 'pro'

export function checkPromptLimit(planId: PlanId, usedCount: number): boolean {
  const limit = PLANS[planId as keyof typeof PLANS].promptLimit
  if (limit === Infinity) return true
  return usedCount < limit
}

export function checkBrandLimit(planId: PlanId, usedCount: number): boolean {
  const limit = PLANS[planId as keyof typeof PLANS].brandLimit
  if (limit === Infinity) return true
  return usedCount < limit
}
