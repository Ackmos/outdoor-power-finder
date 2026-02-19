// src/app/page.tsx
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/home/HeroSection";
import { FilterableProductGrid } from "@/components/home/FilterableProductGrid";
import { TopComparisons } from "@/components/home/TopComparisions";
import { Suspense } from "react";

export const metadata = {
  title: "Outdoor Power Finder | Finde die perfekte Powerstation 2026",
  description: "Vergleiche über 50 Powerstations von EcoFlow, Jackery & Bluetti basierend auf echten Kapazitäts-Berechnungen.",
};

export default async function HomePage() {
  const stations = await prisma.powerstation.findMany({
    include: { brand: true },
    orderBy: { capacityWh: 'asc' }
  });

  const brands = await prisma.brand.findMany();

  return (
    <div className="min-h-screen bg-stone-50">
      <HeroSection />
      <section className="container mx-auto px-4 py-12">
      <Suspense fallback={<div className="text-center py-20 text-stone-400">Lade Powerstations...</div>}>
        <FilterableProductGrid initialStations={stations} brands={brands} />
      </Suspense>      </section>
      <TopComparisons />
    </div>
  );
}