// src/app/vergleich/[slug]/page.tsx
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ComparisonTable } from "./ComparisonTable";
import { ComparisonVerdict } from "./ComparisonVerdict";

// 1. DYNAMISCHE METADATA GENERIERUNG
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const parts = slug.split("-vs-");
  
  if (parts.length !== 2) return { title: "Vergleich" };

  const [slug1, slug2] = await Promise.all([
    prisma.powerstation.findUnique({ where: { slug: parts[0] }, include: { brand: true } }),
    prisma.powerstation.findUnique({ where: { slug: parts[1] }, include: { brand: true } })
  ]);

  if (!slug1 || !slug2) return { title: "Vergleich nicht gefunden" };

  const title = `${slug1.brand.name} ${slug1.name} vs ${slug2.brand.name} ${slug2.name} Vergleich`;
  const description = `Welche Powerstation ist besser? Vergleiche ${slug1.name} und ${slug2.name} im direkten Duell. Technische Daten, Ladezeiten und unser Experten-Fazit.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

// 2. HAUPTKOMPONENTE
export default async function ComparisonPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const parts = slug.split("-vs-");
  
  if (parts.length !== 2) {
    notFound();
  }

  const [slug1, slug2] = parts;

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
      {/* H1 Headline */}
      <h1 className="text-4xl md:text-6xl font-black text-center mb-6">
        {stationA.name} <span className="text-blue-600">vs</span> {stationB.name}
      </h1>

      {/* SEO-Textblock: Wiederholt die H1-Begriffe (Fix für Seobility) */}
      <p className="text-stone-500 text-center max-w-2xl mx-auto mb-12 leading-relaxed">
        Welches Modell gewinnt im Duell <strong>{stationA.name} vs {stationB.name}</strong>? 
        Wir haben beide Powerstations gegenübergestellt, um dir bei der Entscheidung zwischen 
        {stationA.brand.name} und {stationB.brand.name} zu helfen.
      </p>

      <ComparisonTable stationA={stationA} stationB={stationB} />
      <ComparisonVerdict stationA={stationA} stationB={stationB} />
    </main>
  );
}