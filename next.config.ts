import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: res.cloudinary.com judskbgaiwwixhkfgxmn.supabase.co;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    connect-src 'self' vitals.vercel-insights.com judskbgaiwwixhkfgxmn.supabase.co;
    frame-ancestors 'none';
    upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  // 1. Bilder-Konfiguration (Cloudinary)
  images: {
    remotePatterns: [
    {
      protocol: 'https',
      hostname: 'res.cloudinary.com', // Altes Cloudinary
    },
    {
      protocol: 'https',
      hostname: 'judskbgaiwwixhkfgxmn.supabase.co', // Deine Supabase Domain
      port: '',
      pathname: '/storage/v1/object/public/**',
    },
  ],
  },
  


  experimental: {
  optimizePackageImports: ['lucide-react'], // Fasst Icons effizienter zusammen
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
          
        ],
      },
    ];
  },

  // 3. Performance & Sicherheit (Optional, aber empfohlen)
  reactStrictMode: true,
  poweredByHeader: false, // Erschwert das Identifizieren der Tech-Stack für Bots
};

export default nextConfig;