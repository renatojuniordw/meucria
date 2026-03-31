// lib/openai/buildDescriptive.ts
import { sanitizeString } from '@/lib/utils/sanitizeInput'

export interface Brand {
  id: string
  name: string
  niche: string
  description?: string
  color_mode: string
  colors?: { primary: string; secondary: string; accent: string }
  font_mode: string
  fonts?: { title: string; body: string; accent: string }
}

export interface PromptInput {
  format: 'feed' | 'story' | 'carousel'
  hasPersona: boolean
  personaDescription?: string
  objective: string
  contentMode: 'manual' | 'ai'
  contentText?: string
  colorMode: 'manual' | 'palette' | 'ai'
  colors?: { primary: string; secondary: string; accent: string }
  fontModeOverride?: 'manual' | 'ai'
  fontsOverride?: { title?: string; body?: string; accent?: string }
}

export function buildDescriptive(brand: Brand, input: PromptInput): string {
  const lines: string[] = []

  // MARCA
  lines.push(`Brand: ${brand.name}`)
  lines.push(`Niche: ${brand.niche}`)
  if (brand.description) lines.push(`Brand description: ${brand.description}`)

  // FORMATO DO CRIATIVO
  lines.push(`Creative format: ${input.format}`)
  if (input.hasPersona && input.personaDescription) {
    lines.push(`Persona: ${sanitizeString(input.personaDescription)}`)
  }

  // OBJETIVO / MENSAGEM
  lines.push(`Objective: ${sanitizeString(input.objective)}`)
  if (input.contentMode === 'manual' && input.contentText) {
    lines.push(`Content text: ${sanitizeString(input.contentText)}`)
  }

  // CORES
  if (input.colorMode === 'manual' && input.colors) {
    lines.push(`Brand colors: primary ${input.colors.primary}, secondary ${input.colors.secondary}, accent ${input.colors.accent}`)
  } else if (input.colorMode === 'ai' || brand.color_mode === 'ai') {
    lines.push(`Colors: choose colors appropriate to the niche and brand personality`)
  }

  // TIPOGRAFIA
  const fontMode = input.fontModeOverride ?? brand.font_mode
  const fonts = input.fontsOverride ?? brand.fonts

  if (fontMode === 'ai' || !fonts) {
    lines.push(`Typography: choose fonts appropriate to the niche and brand style`)
  } else {
    const parts: string[] = []
    if (fonts.title) parts.push(`${fonts.title} for headlines`)
    if (fonts.body) parts.push(`${fonts.body} for body text`)
    if (fonts.accent) parts.push(`${fonts.accent} for accent`)
    if (parts.length) lines.push(`Typography: ${parts.join(', ')}`)
  }

  return lines.join('\n')
}
