// src/app/vergleich/page.tsx
import { prisma } from "@/lib/prisma";
import { ComparisonSelector } from "@/components/comparison/ComparisonSelector";

export default async function ComparisonHubPage() {
  // Wir laden alle Stationen (nur die nötigsten Daten für die Auswahl)
  const stations = await prisma.powerstation.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      thumbnailUrl: true,
      brand: {
        select: { name: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black tracking-tight mb-4">Powerstation Vergleich</h1>
        <p className="text-stone-500">Wähle zwei Modelle aus, um technische Daten und Preise direkt gegenüberzustellen.</p>
      </div>

      {/* Die interaktive Client-Komponente für die Auswahl */}
      <ComparisonSelector stations={stations} />
    </main>
  );
}