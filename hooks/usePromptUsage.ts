'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function usePromptUsage() {
  const [used, setUsed] = useState(0)
  const [limit, setLimit] = useState(15)
  const [plan, setPlan] = useState<string>('free')
  const [resetAt, setResetAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetch() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan, prompts_used, prompts_reset_at')
        .eq('id', user.id)
        .single()

      if (profile) {
        setUsed(profile.prompts_used)
        setPlan(profile.plan)
        setResetAt(profile.prompts_reset_at)
        const limits: Record<string, number> = { free: 15, basic: 60, pro: Infinity }
        setLimit(limits[profile.plan] ?? 15)
      }
      setLoading(false)
    }

    fetch()
  }, [supabase])

  const remaining = Math.max(0, limit - used)
  const percentage = limit === Infinity ? 0 : (used / limit) * 100

  return { used, limit, remaining, percentage, plan, resetAt, loading }
}
