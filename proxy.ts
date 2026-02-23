// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // 1. Logging: Welche URL wird gerade verarbeitet?
  // Das erscheint in deinem Terminal (VS Code / Deployment Log)
  //console.log(`[Proxy-Check] Anfrage für: ${pathname}`)

  // Spezielles Logging für Bilder
  //if (pathname.startsWith('/_next/image')) {
  //  console.log(`[Proxy-Image] 🔥 BILD-OPTIMIZER GETRIGGERT: ${request.url}`)
  //}

  const response = NextResponse.next()

  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: res.cloudinary.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;"
  }

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

// 2. Aggressiver Matcher: Wir fangen alles ab, um den Fehler einzugrenzen
export const config = {
  matcher: '/:path*', 
}