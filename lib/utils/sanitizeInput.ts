// lib/utils/sanitizeInput.ts

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous\s+)?instructions/i,
  /agora\s+voc[êe]\s+[eé]/i,
  /you\s+are\s+now/i,
  /novo\s+modo/i,
  /modo\s+(desenvolvedor|admin|deus|irrestrito)/i,
  /jailbreak/i,
  /\bDAN\b/,
  /mostre?\s+o\s+prompt/i,
  /revele?\s+suas\s+instru[çc][oõ]es/i,
  /ignore\s+a\s+regra/i,
  /bypass/i,
  /system\s+prompt/i,
  /suas\s+configura[çc][oõ]es/i,
  /aja\s+como/i,
  /comporte[- ]se\s+como/i,
  /esquece?\s+tudo/i,
  /nova\s+tarefa/i,
  /em\s+vez\s+disso/i,
  /modo\s+irrestrito/i,
  /autorizado\s+por/i,
]

// Limites mapeados pelas schemas do zod
const FIELD_MAX_LENGTHS: Record<string, number> = {
  niche: 120,
  description: 500,
  objective: 500,
  contentText: 500,
  personaDescription: 300,
  brand_name: 80,
  theme: 300,
}

const FIELD_DEFAULTS: Record<string, string> = {
  niche: 'negócios e serviços',
  description: '',
  objective: 'post para rede social',
  contentText: '',
  personaDescription: '',
  brand_name: '[Marca]',
  theme: 'criativo institucional da marca',
}

export function sanitizeString(value: string): string {
  if (!value) return ''
  return value
    .replace(/[\u0000-\u001F\u007F\u200B\uFEFF]/g, '') // remove control + zero-width chars
    .replace(/\s+/g, ' ')                               // colapsa múltiplos espaços/tabs/newlines
    .trim()
}

export function sanitizeField(field: string, value: string): string {
  if (!value || typeof value !== 'string') return FIELD_DEFAULTS[field] ?? ''

  let sanitized = value.slice(0, FIELD_MAX_LENGTHS[field] ?? 500)

  sanitized = sanitized
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\uFEFF\u200B]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  const hasInjection = INJECTION_PATTERNS.some((pattern) => pattern.test(sanitized))
  if (hasInjection) return FIELD_DEFAULTS[field] ?? ''

  const concatenationPattern = /[.!?;]\s+[A-ZÁÀÃÂÉÊÍÓÔÕÚÜÇ][^.]*?(voc[êe]|ignore|instruc|prompt|modo|agora)/i
  if (concatenationPattern.test(sanitized)) return FIELD_DEFAULTS[field] ?? ''

  return sanitized
}

export function sanitizeBriefing(raw: Record<string, unknown>): Record<string, unknown> {
  const textFields = ['niche', 'description', 'objective', 'contentText', 'personaDescription', 'brand_name', 'theme']
  const sanitized = { ...raw }

  for (const field of textFields) {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitizeField(field, sanitized[field] as string)
    }
  }

  // Sanitizar hex codes - aceitando objeto listado na instrução
  if (
    sanitized.colors &&
    typeof sanitized.colors === 'object' &&
    Array.isArray((sanitized.colors as Record<string, unknown>).hex_values)
  ) {
    const colors = sanitized.colors as Record<string, unknown>
    colors.hex_values = (colors.hex_values as unknown[]).filter(
      (hex) => typeof hex === 'string' && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)
    )
  }

  return sanitized
}

export function sanitizeInput<T extends Record<string, unknown>>(input: T): T {
  // First apply the basic sanitizeString/Briefing rules for nested fields generically if needed
  // Alternatively, just proxy it to sanitizeBriefing 
  return sanitizeBriefing(input) as T
}
