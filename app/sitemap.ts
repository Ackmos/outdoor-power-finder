import { prisma } from "@/lib/prisma";
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://outdoor-power-finder.vercel.app";

  // Alle Powerstations für die Detailseiten abrufen
  const stations = await prisma.powerstation.findMany({
    select: { slug: true, updatedAt: true }
  });

  const stationUrls = stations.map((s) => ({
    url: `${baseUrl}/powerstation-test/${s.slug}`,
    lastModified: s.updatedAt,
  }));

  // Standard-Seiten hinzufügen
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/vergleich`, lastModified: new Date() },
    ...stationUrls,
  ];
}