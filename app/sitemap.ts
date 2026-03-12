// src/app/sitemap.ts
import { prisma } from "@/lib/prisma";
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://powerstation-finder.de";

  // 1. Alle Stationen für die Detailseiten abrufen
const [stations, brands] = await Promise.all([
    prisma.powerstation.findMany({
      select: { slug: true, updatedAt: true }
    }),
    prisma.brand.findMany({
      select: { slug: true}
    })
  ]);

  // 2. URLs für die Testberichte generieren
  const stationUrls = stations.map((s) => ({
    url: `${baseUrl}/powerstation-test/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

// 3. URLs für die Markenseiten generieren
  const brandUrls = brands.map((b) => ({
    url: `${baseUrl}/marke/${b.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7, // Etwas niedriger als Einzeltests, aber wichtig für die Struktur
  }));

  // 3. Zusammenführung der statischen Seiten, des Tools und der Tests
  return [
    { 
      url: baseUrl, 
      lastModified: new Date(), 
      priority: 1.0, 
      changeFrequency: 'daily' 
    },
    { 
      url: `${baseUrl}/laufzeit-rechner`, // Unser neues Core-Feature
      lastModified: new Date(), 
      priority: 0.9, 
      changeFrequency: 'monthly' 
    },
    { 
      url: `${baseUrl}/vergleich`, // Nur die Haupt-Übersichtsseite, keine Paare
      lastModified: new Date(), 
      priority: 0.7, 
      changeFrequency: 'weekly' 
    },
    { 
      url: `${baseUrl}/ratgeber/lifepo4`, // Nur die Haupt-Übersichtsseite, keine Paare
      lastModified: new Date(), 
      priority: 0.7, 
      changeFrequency: 'weekly' 
    },
    { 
      url: `${baseUrl}/ratgeber/wattstunden-rechner`, // Nur die Haupt-Übersichtsseite, keine Paare
      lastModified: new Date(), 
      priority: 0.7, 
      changeFrequency: 'weekly' 
    },
    { 
      url: `${baseUrl}/notstrom`, // Nur die Haupt-Übersichtsseite, keine Paare
      lastModified: new Date(), 
      priority: 0.7, 
      changeFrequency: 'weekly' 
    },
        { 
      url: `${baseUrl}/camping`, // Nur die Haupt-Übersichtsseite, keine Paare
      lastModified: new Date(), 
      priority: 0.7, 
      changeFrequency: 'weekly' 
    },
        { 
      url: `${baseUrl}/notstrom`, // Nur die Haupt-Übersichtsseite, keine Paare
      lastModified: new Date(), 
      priority: 0.7, 
      changeFrequency: 'weekly' 
    },
    ...stationUrls,
    ...brandUrls,
  ];
}