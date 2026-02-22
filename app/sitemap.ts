import { prisma } from "@/lib/prisma";
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://powerstation-finder.de/";

// 1. Alle Stationen abrufen
  const stations = await prisma.powerstation.findMany({
    select: { slug: true, updatedAt: true }
  });

  // 2. URLs für Detailseiten generieren
  const stationUrls = stations.map((s) => ({
    url: `${baseUrl}/powerstation-test/${s.slug}`,
    lastModified: s.updatedAt,
  }));

  // 3. URLs für Vergleichsseiten generieren (Kombinatorik)
  const comparisonUrls: MetadataRoute.Sitemap = [];
  
  // Wir iterieren durch die Liste und erstellen Paare (A vs B)
  for (let i = 0; i < stations.length; i++) {
    for (let j = i + 1; j < stations.length; j++) {
      comparisonUrls.push({
        url: `${baseUrl}/vergleich/${stations[i].slug}-vs-${stations[j].slug}`,
        lastModified: new Date(), // Oder das Datum der letzten Änderung der beteiligten Stationen
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  // 4. Alles zusammenführen
  return [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/vergleich`, lastModified: new Date(), priority: 0.8 },
    ...stationUrls,
    ...comparisonUrls,
  ];
}