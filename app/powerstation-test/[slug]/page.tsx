// src/app/station/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StationHero } from "@/components/station/StationHero";
import { RuntimeTable } from "@/components/station/RuntimeTable";
import { ProsCons } from "@/components/station/ProCons";
import { TechSpecGrid } from "@/components/station/TechSpecGrid";
import { Metadata } from "next";
import { UsageIntent } from "@/components/station/UsageIntent";
import { ExpertReview } from "@/components/station/ExpertReview";
import { DynamicFAQ } from "@/components/station/DynamicFAQ";
import { DetailedAnalysis } from "@/components/station/DetailedAnalysis";
import { ProductSchema } from "./ProductSchema";

export async function generateStaticParams() {
  const stations = await prisma.powerstation.findMany({
    select: { slug: true },
  });

return stations.map((station) => ({
    slug: station.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const station = await prisma.powerstation.findUnique({ 
    where: { slug },
    include: { brand: true } 
  });

  if (!station) return { title: "Powerstation nicht gefunden" };

  // Wir bauen einen Title, der auf echte Suchanfragen optimiert ist
  return {
    title: `${station.brand.name} ${station.name} Test & Vergleich | POWERFINDER`,
    description: `Detaillierter Test der ${station.name} von ${station.brand.name}. Alle technischen Daten, Bilder und Laufzeiten im Überblick. Jetzt informieren!`,    openGraph: {
      images: [station.thumbnailUrl || ""], // Zeigt das Bild beim Teilen auf Social Media
    },
    alternates: {
      canonical: `https://powerstation-finder.de/powerstation-test/${slug}`,
    }
  };
}

export default async function StationPage({ params }: Props) {
  const { slug } = await params; 
  
  const station = await prisma.powerstation.findUnique({
    where: { slug: slug },
    include: { brand: true },
  });

  if (!station) notFound();

  const devices = await prisma.device.findMany();

  return (
    <>
    <ProductSchema station={station} />
    <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">{station.brand.name} {station.name}: Der ultimative Laufzeit-Check für Outdoor & Backup</h1>

      <StationHero station={station} />
      <UsageIntent station={station} />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          <RuntimeTable capacityWh={station.capacityWh} devices={devices} stationBrandName={`${station.brand.name} ${station.name}`} />
          <ExpertReview station={station} />
          <ProsCons pros={station.pros} cons={station.cons} />
        </div>
        
        <aside>
          <TechSpecGrid station={station} />
        </aside>
        
      </div>
      <DetailedAnalysis station={station} />
      <DynamicFAQ station={station} />
    </main>
    </>
  );
}