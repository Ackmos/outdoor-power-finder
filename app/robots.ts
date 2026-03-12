// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',              // Schützt deine internen API-Endpunkte
        '/admin/',            // Schützt den Admin-Bereich (falls vorhanden)
        '/vergleich/*-vs-*',  // 🚀 BLOCKIERT die Thin-Content Vergleichspaare
      ],
    },
    // Fix: Wir entfernen den doppelten Slash und passen die URL an dein sitemap.ts an
    sitemap: 'https://powerstation-finder.de/sitemap.xml', 
  };
}