import { defaultLocale } from '@/locales/config'
import { getLocales } from '@/locales/dictionary'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { NextMiddlewareResult } from 'next/dist/server/web/types'
import { NextRequest, NextResponse, type NextFetchEvent } from 'next/server'

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const headers = { 'accept-language': acceptLanguage === '*' ? 'en' : acceptLanguage }
  const languages = new Negotiator({ headers }).languages()
  const locales = getLocales()

  const locale = match(languages, locales, defaultLocale)
  const response = NextResponse.next()
  if (!request.cookies.get('locale')) {
    response.cookies.set('locale', locale)
  }

  const excludedPaths = [
    '/login',
    '/api/auth/providers',
    '/api/auth/csrf',
    '/api/auth/callback/credentials',
  ]

  if (!excludedPaths.includes(request.nextUrl.pathname)) {
    const res: NextMiddlewareResult = await withAuth(
      // Response with local cookies
      () => response,
      {
        // Matches the pages config in `[...nextauth]`
        pages: {
          signIn: '/login',
        },
      },
    )(request as NextRequestWithAuth, event)
    return res
  }

  return response
}
