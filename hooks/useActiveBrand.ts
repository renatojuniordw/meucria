import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Brand } from '@/lib/openai/buildDescriptive'

export function useActiveBrand() {
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchActiveBrand() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('active_brand_id')
        .eq('id', user.id)
        .single()

      if (profile?.active_brand_id) {
        const { data: brandData } = await supabase
          .from('brands')
          .select('*')
          .eq('id', profile.active_brand_id)
          .single()
        
        setBrand(brandData)
      }
      setLoading(false)
    }

    fetchActiveBrand()
  }, [supabase])

  return { brand, loading }
}
