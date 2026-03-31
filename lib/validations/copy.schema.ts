import { z } from 'zod'

export const CopyGenerateSchema = z.object({
  promptId: z.string().uuid(),
  brandId: z.string().uuid(),
  tone: z.enum(['urgency', 'emotional', 'curiosity', 'authority']).default('urgency'),
})

export const CopyOutputSchema = z.object({
  hook: z.string().min(1).max(120),
  body: z.string().min(1).max(400),
  cta: z.string().min(1).max(80),
  hashtags: z.array(z.string().startsWith('#')).min(5).max(12),
})

export type CopyGenerate = z.infer<typeof CopyGenerateSchema>
export type CopyOutput = z.infer<typeof CopyOutputSchema>
