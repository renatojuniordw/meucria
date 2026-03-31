'use server'

import { cookies } from 'next/headers'

export async function setCookieConsent(value: 'all' | 'essential') {
  const cookieStore = await cookies()
  cookieStore.set('meucrIA_cookie_consent', value, {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })
}

export async function resetCookieConsent() {
  const cookieStore = await cookies()
  cookieStore.delete('meucrIA_cookie_consent')
}
