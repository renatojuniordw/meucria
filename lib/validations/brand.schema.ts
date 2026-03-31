import { z } from 'zod'

export const BrandCreateSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  niche: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  color_mode: z.enum(['manual', 'palette', 'ai']).optional(),
  colors: z.object({
    primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }).optional(),
  content_mode: z.enum(['manual', 'ai']).optional(),
  font_mode: z.enum(['manual', 'ai']).default('ai'),
  fonts: z.object({
    title: z.string().optional(),
    body: z.string().optional(),
    accent: z.string().optional(),
  }).optional(),
})

export const BrandUpdateSchema = BrandCreateSchema.partial()

export type BrandCreate = z.infer<typeof BrandCreateSchema>
export type BrandUpdate = z.infer<typeof BrandUpdateSchema>
