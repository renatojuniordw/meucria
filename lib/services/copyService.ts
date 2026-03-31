import { getBrand } from '@/lib/repositories/brandRepo'
import { getPrompt, updatePrompt } from '@/lib/repositories/promptRepo'
import { getProfile } from '@/lib/repositories/profileRepo'
import { logUsageEvent } from '@/lib/repositories/profileRepo'
import { generateCopy } from '@/lib/openai/generateCopy'
import type { CopyOutput } from '@/lib/validations/copy.schema'

export type CopyTone = 'urgency' | 'emotional' | 'curiosity' | 'authority'

export async function generateCopyService(
  userId: string,
  input: { promptId: string; brandId: string; tone: CopyTone }
): Promise<CopyOutput> {
  // 1. Verify Pro plan
  const profile = await getProfile(userId)
  if (profile.plan !== 'pro') {
    throw new Error('Copy generation is only available on the Pro plan.')
  }

  // 2. Get brand and prompt data
  const brand = await getBrand(input.brandId, userId)
  const prompt = await getPrompt(input.promptId, userId)

  // 3. Generate copy
  const rawInput = prompt.raw_input as Record<string, unknown>
  const objective = (rawInput.objective as string) ?? ''
  const copy = await generateCopy({
    brandName: brand.name,
    niche: brand.niche ?? '',
    objective,
    generatedPrompt: prompt.generated_prompt ?? '',
    tone: input.tone,
  })

  // 4. Save to prompt record
  await updatePrompt(input.promptId, userId, {
    generated_copy: copy,
    copy_tone: input.tone,
  })

  // 5. Log event
  await logUsageEvent(userId, 'copy_generated', { tone: input.tone })

  return copy
}
