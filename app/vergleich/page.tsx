import { Metadata } from 'next'
import { prisma } from "@/lib/prisma";
import { ComparisonSelector } from "@/components/comparison/ComparisonSelector";
import { AlertCircle } from "lucide-react";

// SEO Metadaten für den Vergleichs-Hub
export const metadata: Metadata = {
  title: 'Powerstation Vergleich: Modelle direkt gegenüberstellen',
  description: 'Nutze unseren Powerstation Vergleich, um technische Daten, Kapazität und Preise von EcoFlow, Jackery, Bluetti und anderen Marken direkt zu vergleichen.',
  keywords: ['Powerstation Vergleich', 'Stromspeicher Vergleich', 'EcoFlow vs Jackery', 'Bluetti Vergleich', 'Solar Generator Daten'],
  alternates: {
      canonical: `/vergleich`,
    },
  openGraph: {
    title: 'Der große Powerstation Vergleich | Alle Modelle gegenübergestellt',
    description: 'Finde die passende Powerstation durch direkten Vergleich der technischen Spezifikationen.',
    type: 'website',
  },
}

export default async function ComparisonHubPage() {
  // Wir laden alle Stationen
  const stations = await prisma.powerstation.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      images: true, 
      brand: {
        select: { name: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  // Sicherheits-Check: Falls die DB leer ist
  if (!stations || stations.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="bg-stone-50 border border-stone-200 rounded-[2rem] p-12">
          <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h1 className="text-2xl font-black mb-2">Keine Daten verfügbar</h1>
          <p className="text-stone-500">
            Es wurden noch keine Powerstations im System gefunden.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        {/* H1 Headline */}
        <h1 className="text-4xl font-black tracking-tight mb-4 uppercase">
          Powerstation <span className="text-stone-400">Vergleich</span>
        </h1>
        
        {/* Optimierter Intro-Text für Seobility */}
        <p className="text-stone-500 max-w-2xl mx-auto leading-relaxed">
          Mit unserem interaktiven <strong>Powerstation Vergleich</strong> kannst du zwei Modelle auswählen, 
          um technische Daten, Ladezeiten und Preise direkt gegenüberzustellen und die beste Wahl für dein Setup zu treffen.
        </p>
      </div>

      {/* Die interaktive Client-Komponente */}
      <ComparisonSelector stations={stations} />
    </main>
  );
}