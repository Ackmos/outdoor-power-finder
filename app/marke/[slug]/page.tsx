// src/app/marke/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { StationCard } from "@/components/home/StationCard";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { HomeSchema } from "@/components/seo/HomeSchema";
import { Award, Zap, ShieldCheck } from "lucide-react";

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params; 
  const brand = await prisma.brand.findUnique({ 
    where: { slug: slug } 
  });
  
  if (!brand) return { title: "Marke nicht gefunden" };
  
  return {
    title: `${brand.name} Powerstations im Test & Vergleich | POWERFINDER`,
    alternates: {
      canonical: `/marke/${slug}`,
    },
    description: brand.description || `Alle aktuellen Powerstations von ${brand.name} in der Übersicht. Technische Daten und echte Kapazitäts-Tests.`
  };
}

export default async function BrandPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug: slug },
    include: { 
      powerstations: { 
        include: { brand: true },
        orderBy: { capacityWh: 'asc' } 
      } 
    }
  });

  if (!brand) notFound();

  const breadcrumbItems = [
    { label: "Alle Marken", href: "/" },
    { label: brand.name, href: `/marke/${brand.slug}` }
  ];

  return (
    <main className="min-h-screen bg-stone-50 pb-24">
      <HomeSchema stations={brand.powerstations} />
      
      {/* BRAND HERO */}
      <div className="bg-white border-b border-stone-100 pt-8 pb-16">
        <div className="container mx-auto px-4">
          <Breadcrumbs items={breadcrumbItems} />
          
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black mb-6">{brand.name}</h1>
            <p className="text-xl text-stone-500 leading-relaxed">
              {brand.description || `Entdecke die Welt von ${brand.name}. Von kompakten Begleitern für den nächsten Camping-Trip bis hin zu massiven Energiespeichern für dein Zuhause.`}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12">
        <h2 className="text-2xl font-black mb-8">Aktuelle Modelle von {brand.name}</h2>
        
        {/* PRODUKT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {brand.powerstations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>

        {/* AUSFÜHRLICHE MARKEN-BESCHREIBUNG (SEO & INFO) */}
        {brand.description_section && (
          <div className="">
            <div className="p-8 md:p-16 ">
              <h2 className="text-3xl font-black mb-8">Über den Hersteller {brand.name}</h2>
              <div className="prose prose-stone max-w-none">
                <p className="text-stone-600 leading-loose text-lg whitespace-pre-line">
                  {brand.description_section}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}