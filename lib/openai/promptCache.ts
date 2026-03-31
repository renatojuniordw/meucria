// lib/openai/promptCache.ts
import { createClient } from '@supabase/supabase-js'
import { Redis } from '@upstash/redis'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export type PromptId = 'generate' | 'copy' | 'clone' | 'suggest_colors' | 'suggest_content'

export async function getSystemPrompt(id: PromptId): Promise<string> {
  const cacheKey = `system_prompt:${id}`
  
  // 1. Try Cache (Upstash)
  try {
    const cached = await redis.get<string>(cacheKey)
    if (cached) return cached
  } catch (err) {
    console.error('Redis cache error:', err)
  }

  // 2. Fetch from DB
  const { data, error } = await supabaseAdmin
    .from('system_prompts')
    .select('content')
    .eq('id', id)
    .single()

  if (error || !data) {
    throw new Error(`System prompt '${id}' not found. Check system_prompts table.`)
  }

  // 3. Set Cache (TTL 10 min)
  try {
    await redis.set(cacheKey, data.content, { ex: 600 })
  } catch (err) {
    console.error('Redis set error:', err)
  }

  return data.content
}
