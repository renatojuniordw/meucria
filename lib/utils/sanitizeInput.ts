// lib/utils/sanitizeInput.ts

export function sanitizeString(value: string): string {
  if (!value) return ''
  return value
    .replace(/[\u0000-\u001F\u007F\u200B\uFEFF]/g, '') // remove control + zero-width chars
    .replace(/\s+/g, ' ')                               // colapsa múltiplos espaços/tabs/newlines
    .trim()
}

export function sanitizeInput<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [
      key,
      typeof value === 'string' ? sanitizeString(value) : value,
    ])
  ) as T
}
