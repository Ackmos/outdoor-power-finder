// src/app/vergleich/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ComparisonTable } from "./ComparisonTable"; // Pfad ggf. anpassen
import { ComparisonVerdict } from "./ComparisonVerdict";

export default async function ComparisonPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  // Wir splitten den Pfad beim "-vs-"
  const parts = slug.split("-vs-");
  
  if (parts.length !== 2) {
    notFound();
  }

  const [slug1, slug2] = parts;

  // Abfrage bleibt gleich
  const [stationA, stationB] = await Promise.all([
    prisma.powerstation.findUnique({
      where: { slug: slug1 },
      include: { brand: true }
    }),
    prisma.powerstation.findUnique({
      where: { slug: slug2 },
      include: { brand: true }
    })
  ]);

  if (!stationA || !stationB) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black text-center mb-12">
        {stationA.name} <span className="text-blue-600">vs</span> {stationB.name}
      </h1>
      <ComparisonTable stationA={stationA} stationB={stationB} />
      <ComparisonVerdict stationA={stationA} stationB={stationB} />
    </main>
  );
}