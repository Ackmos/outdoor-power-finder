import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: res.cloudinary.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  // 1. Bilder-Konfiguration (Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', 
      },
    ],
    minimumCacheTTL: 31536000,
  },

  // 2. SEO-Fix: www auf non-www umleiten
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.powerstation-finder.de',
          },
        ],
        destination: 'https://powerstation-finder.de/:path*',
        permanent: true, // Erzeugt einen 301-Redirect für Google
      },
    ];
  },

  async headers() {
    return [
      {
        // Diese Header gelten für alle Pfade deiner Seite
        source: '/:path*',
        headers: [
          { 
            key: 'Content-Security-Policy', 
            value: cspHeader 
          }, // Die neue CSP
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Verhindert MIME-Sniffing (Löst deinen Fehler)
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Verhindert Clickjacking (Löst deinen Fehler)
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block', // Zusätzlicher Schutz vor Cross-Site Scripting
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin', // Schützt Nutzerdaten beim Verlassen der Seite
          },
        ],
      },
      {
        // ✅ SPEZIELL FÜR BILDER: Erzwingt die Header für den Image-Optimizer
        source: '/_next/image',
          headers: [
            { key: 'Content-Security-Policy', value: cspHeader },
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          ],
      }
    ];
  },

  // 3. Performance & Sicherheit (Optional, aber empfohlen)
  reactStrictMode: true,
  poweredByHeader: false, // Erschwert das Identifizieren der Tech-Stack für Bots
  trailingSlash: false,
};

export default nextConfig;