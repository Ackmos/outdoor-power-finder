import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Die Security-Header, die wir erzwingen wollen
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: res.cloudinary.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
  }

  // Wir setzen die Header für ALLE Antworten (auch Bilder & Chunks)
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

// Der Matcher sorgt dafür, dass die Middleware für alles gilt
export const config = {
  matcher: [
    /*
     * Matcht alle Pfade außer:
     * - api (API-Routen haben oft eigene Logik)
     * - favicon.ico, sitemap.xml etc.
     */
    '/((?!api|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}