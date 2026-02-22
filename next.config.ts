import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Bilder-Konfiguration (Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', 
      },
    ],
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

  // 3. Performance & Sicherheit (Optional, aber empfohlen)
  reactStrictMode: true,
  poweredByHeader: false, // Erschwert das Identifizieren der Tech-Stack für Bots
};

export default nextConfig;