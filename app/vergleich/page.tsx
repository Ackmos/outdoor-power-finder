// src/app/vergleich/page.tsx
import { prisma } from "@/lib/prisma";
import { ComparisonSelector } from "@/components/comparison/ComparisonSelector";
import { AlertCircle } from "lucide-react"; // Optional für schöneres UI

export default async function ComparisonHubPage() {
  // Wir laden alle Stationen
  const stations = await prisma.powerstation.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      // Geändert von thumbnailUrl zu images, da dies in deinem Schema steht
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
            Bitte führe zuerst das Seed-Skript aus.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-4 uppercase">
          Powerstation <span className="text-stone-400">Vergleich</span>
        </h1>
        <p className="text-stone-500">
          Wähle zwei Modelle aus, um technische Daten und Preise direkt gegenüberzustellen.
        </p>
      </div>

      {/* Die interaktive Client-Komponente */}
      <ComparisonSelector stations={stations} />
    </main>
  );
}