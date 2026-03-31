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
    console.warn(`System prompt '${id}' not found in DB. Using fallback.`)
    // Hardcoded fallbacks to prevent crash if table is empty
    const fallbacks: Record<PromptId, string> = {
      suggest_colors: 'Você é um especialista em design de marcas. Retorne APENAS um objeto JSON com chaves: "primary", "secondary", e "accent", contendo as cores em formato hexadecimal (ex: #FFFFFF) mais adequadas para o nicho informado.',
      suggest_content: 'Você é um copywriter. Retorne um JSON com "objective" (objetivo da marca) e "contentText" (texto curto).',
      generate: 'Você é um AI gerador de prompts de imagem.',
      copy: 'Você é um copywriter especialista.',
      clone: 'Você é um especialista em extração de estilo de imagem.'
    }
    return fallbacks[id] || 'You are a helpful assistant.'
  }

  // 3. Set cache (TTL 10 min)
  await redisSet(cacheKey, data.content, 600)

  return data.content
}
