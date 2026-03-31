// lib/openai/promptCache.ts
import { createClient } from '@supabase/supabase-js'
import { redisGet, redisSet } from '@/lib/redis/client'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type PromptId = 'generate' | 'copy' | 'clone' | 'suggest_colors' | 'suggest_content'

export async function getSystemPrompt(id: PromptId): Promise<string> {
  const cacheKey = `system_prompt:${id}`

  // 1. Try Redis cache
  const cached = await redisGet<string>(cacheKey)
  if (cached) return cached

  // 2. Fetch from DB
  const { data, error } = await supabaseAdmin
    .from('system_prompts')
    .select('content')
    .eq('id', id)
    .single()

  if (error || !data) {
    throw new Error(`System prompt '${id}' not found. Check system_prompts table.`)
  }

  // 3. Set cache (TTL 10 min)
  await redisSet(cacheKey, data.content, 600)

  return data.content
}
