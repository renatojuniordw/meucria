// lib/validations/prompt.schema.ts
import { z } from 'zod'

export const PromptGenerateSchema = z.object({
  brandId: z.string().uuid(),
  format: z.enum(['feed', 'story', 'carousel']),
  objective: z.string().min(5).max(500),
  contentMode: z.enum(['manual', 'ai']),
  contentText: z.string().max(500).optional(),
  colorMode: z.enum(['manual', 'palette', 'ai']),
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }).optional(),
  hasPersona: z.boolean(),
  personaDescription: z.string().max(300).optional(),
  fontModeOverride: z.enum(['manual', 'ai']).optional(),
  fontsOverride: z.object({
    title: z.string().optional(),
    body: z.string().optional(),
    accent: z.string().optional(),
  }).optional(),
})
