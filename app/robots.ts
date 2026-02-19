import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Verhindert, dass interne APIs gescannt werden
    },
    sitemap: 'https://outdoor-power-finder.vercel.app/sitemap.xml', // Pfad zu deiner Sitemap
  };
}