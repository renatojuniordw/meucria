'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PLANS } from '@/lib/stripe/plans'

type PlanId = keyof typeof PLANS

export function useCurrentPlan() {
  const [plan, setPlan] = useState<PlanId>('free')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetch() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      if (profile) setPlan(profile.plan as PlanId)
      setLoading(false)
    }

    fetch()
  }, [supabase])

  const planData = PLANS[plan]
  const isPro = plan === 'pro'
  const isBasic = plan === 'basic'
  const isFree = plan === 'free'

  return { plan, planData, isPro, isBasic, isFree, loading }
}
