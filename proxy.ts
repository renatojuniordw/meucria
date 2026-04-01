import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { updateSession } from '@/lib/supabase/middleware'

const intlMiddleware = createIntlMiddleware(routing)

const AUTH_ROUTES = ['/dashboard', '/create', '/history', '/brands', '/onboarding', '/settings', '/presets', '/clone']
const PRO_ROUTES = ['/history', '/presets', '/clone']
const ADMIN_ROUTES = ['/admin']

export default async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request)
  const intlResponse = intlMiddleware(request)

  response.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value)
  })

  const pathname = request.nextUrl.pathname
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.includes(r))
  const isProRoute = PRO_ROUTES.some((r) => pathname.includes(r))
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.includes(r))

  if (isAuthRoute || isAdminRoute) {
    if (!user) {
      const locale = pathname.split('/')[1] || routing.defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed, plan, role')
      .eq('id', user.id)
      .single()

    // Admin gate
    if (isAdminRoute && profile?.role !== 'admin') {
      const locale = pathname.split('/')[1] || routing.defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
    }

    // Pro gate
    if (isProRoute && profile?.plan !== 'pro') {
      const locale = pathname.split('/')[1] || routing.defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/pricing?highlight=pro`, request.url))
    }

    // Onboarding gate
    if (profile && !profile.onboarding_completed && !pathname.includes('/onboarding')) {
      const locale = pathname.split('/')[1] || routing.defaultLocale
      return NextResponse.redirect(new URL(`/${locale}/onboarding`, request.url))
    }
  }

  return intlResponse
}

export const config = {
  matcher: ['/', '/(pt-BR|en-US)/:path*'],
}
