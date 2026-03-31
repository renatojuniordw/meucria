import { getBrand } from '@/lib/repositories/brandRepo'
import { getProfile, incrementPromptsUsed, resetPromptsIfNeeded, logUsageEvent } from '@/lib/repositories/profileRepo'
import { savePrompt } from '@/lib/repositories/promptRepo'
import { buildDescriptive, type PromptInput } from '@/lib/openai/buildDescriptive'
import { generatePrompt } from '@/lib/openai/generatePrompt'
import { checkPromptLimit } from '@/lib/utils/usageLimits'
import type { PlanId } from '@/lib/utils/usageLimits'

export async function generatePromptService(userId: string, input: PromptInput & { brandId: string }) {
  // 1. Get profile and check reset cycle
  let profile = await getProfile(userId)
  profile = await resetPromptsIfNeeded(userId, profile)

  // 2. Check usage limit
  if (!checkPromptLimit(profile.plan as PlanId, profile.prompts_used)) {
    throw new LimitExceededError('Limite de geração atingido para o seu plano.')
  }

  // 3. Get brand data
  const brand = await getBrand(input.brandId, userId)

  // 4. Build descriptive and generate
  const descriptive = buildDescriptive(brand as unknown as import('@/lib/openai/buildDescriptive').Brand, input)
  const generatedPrompt = await generatePrompt(descriptive)

  // 5. Save prompt
  await savePrompt({
    user_id: userId,
    brand_id: input.brandId,
    format: input.format,
    has_persona: input.hasPersona,
    raw_input: input as unknown as Record<string, unknown>,
    generated_prompt: generatedPrompt,
  })

  // 6. Increment usage
  await incrementPromptsUsed(userId, profile.prompts_used)

  // 7. Log event
  await logUsageEvent(userId, 'prompt_generated', { format: input.format })

  // 8. Check 80% warning
  const limit = profile.plan === 'pro' ? Infinity : (profile.plan === 'basic' ? 60 : 15)
  const usagePercent = (profile.prompts_used + 1) / limit
  const shouldWarn = usagePercent >= 0.8 && limit !== Infinity

  return { prompt: generatedPrompt, shouldWarn, usagePercent }
}

export class LimitExceededError extends Error {
  code = 'LIMIT_EXCEEDED' as const
  constructor(message: string) {
    super(message)
    this.name = 'LimitExceededError'
  }
}
