// lib/openai/promptCache.ts
import fs from 'fs/promises'
import path from 'path'
import { redisGet, redisSet } from '@/lib/redis/client'

export type PromptId = 'generate' | 'copy' | 'clone' | 'suggest_colors' | 'suggest_content'

const KB_FILES: Record<PromptId, string> = {
  generate: 'meucria-system-prompt-generate.md',
  clone: 'meucria-prompt-clone.md',
  copy: 'meucria-prompt-copy.md',
  suggest_colors: 'meucria-prompt-suggest-colors.md',
  suggest_content: 'meucria-prompt-suggest-content.md',
}

export async function getSystemPrompt(id: PromptId): Promise<string> {
  const cacheKey = `system_prompt:${id}`

  // 1. Try Redis cache
  const cached = await redisGet<string>(cacheKey)
  if (cached) return cached

  // 2. Read from local kb/ file
  const filename = KB_FILES[id]
  const filepath = path.join(process.cwd(), 'kb', filename)
  const content = await fs.readFile(filepath, 'utf-8')

  // 3. Cache it (TTL 10 min)
  await redisSet(cacheKey, content, 600)

  return content
}
