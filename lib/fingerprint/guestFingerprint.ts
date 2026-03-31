import { createHash } from 'crypto'
import { headers } from 'next/headers'

export async function getGuestFingerprint(): Promise<string> {
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for') ?? headerList.get('x-real-ip') ?? 'unknown'
  const ua = headerList.get('user-agent') ?? ''
  const lang = headerList.get('accept-language') ?? ''

  const raw = `${ip}|${ua}|${lang}`
  return createHash('sha256').update(raw).digest('hex')
}
