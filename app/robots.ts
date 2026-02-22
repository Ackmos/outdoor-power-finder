import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Verhindert, dass interne APIs gescannt werden
    },
    sitemap: 'https://www.powerstation-finder.de//sitemap.xml', // Pfad zu deiner Sitemap
  };
}