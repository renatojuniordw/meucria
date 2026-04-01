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
  // Constrói o schema exato pedido pelo system prompt V2
  const briefing: Record<string, any> = {
    brand_name: brand.name,
    niche: brand.niche,
    description: brand.description || '',
    format: input.format,
    theme: sanitizeString(input.objective)
  }

  if (input.format === 'carousel') {
    briefing.carousel_slides = 3 // default for carousels
  }

  // Agrega text content extra (Persona / Manual Text) ao tema, já que o prompt base não tem campos pra isso
  const extraTheme: string[] = []
  if (input.contentMode === 'manual' && input.contentText) {
    extraTheme.push(`Texto sugerido: ${sanitizeString(input.contentText)}`)
  }
  if (input.hasPersona && input.personaDescription) {
    extraTheme.push(`Persona alvo: ${sanitizeString(input.personaDescription)}`)
  }
  if (extraTheme.length > 0) {
    briefing.theme += ' | ' + extraTheme.join(' | ')
  }

  // Lógica de cores
  const isAiColor = input.colorMode === 'ai' || (input.colorMode !== 'palette' && input.colorMode !== 'manual' && brand.color_mode === 'ai')
  
  if (isAiColor) {
    briefing.colors = { mode: 'ai_decide' }
  } else {
    const colorsObj = input.colors || brand.colors
    if (colorsObj && typeof colorsObj === 'object') {
      briefing.colors = {
        mode: 'manual',
        hex_values: [colorsObj.primary, colorsObj.secondary, colorsObj.accent].filter(Boolean)
      }
    } else {
      briefing.colors = { mode: 'ai_decide' }
    }
  }

  // Lógica de tipografia
  const fontMode = input.fontModeOverride ?? brand.font_mode
  
  if (fontMode === 'ai') {
    briefing.typography = { mode: 'ai_decide' }
  } else {
    const fontsObj = input.fontsOverride || brand.fonts
    if (fontsObj && typeof fontsObj === 'object') {
      briefing.typography = {
        mode: 'manual',
        title_font: fontsObj.title || '',
        body_font: fontsObj.body || '',
        highlight_font: fontsObj.accent || ''
      }
    } else {
      briefing.typography = { mode: 'ai_decide' }
    }
  }

  return JSON.stringify(briefing, null, 2)
}
