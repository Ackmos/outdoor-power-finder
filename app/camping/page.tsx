import { prisma } from "@/lib/prisma";
import { StationCard } from "@/components/home/StationCard"; // Pfad ggf. anpassen
import { Tent, Sun, Zap } from "lucide-react";

export const metadata = {
  title: "Powerstations für Camping & Outdoor 2026 | POWERFINDER",
  description: "Die besten tragbaren Powerstations für dein nächstes Abenteuer. Leicht, robust und solarfähig.",
};

export default async function CampingPage() {
  // Fokus auf Portabilität: Geräte unter 1200Wh
  const stations = await prisma.powerstation.findMany({
    where: {
      capacityWh: { lt: 1200 }
    },
    include: { brand: true },
    orderBy: { capacityWh: 'asc' }
  });

  return (
    <main className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Bereich */}
      <div className="bg-white border-b border-stone-100 pt-16 pb-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 text-amber-600 font-bold tracking-widest uppercase text-sm mb-4">
            <Tent className="w-5 h-5" />
            <span>Outdoor & Vanlife</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 mb-6 tracking-tighter">
            Energie für <br />unterwegs.
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl leading-relaxed">
            Egal ob im Zelt, im Camper oder beim Wandern – diese Powerstations sind leicht genug für den Transport und stark genug für deine Kühlbox und Kamera.
          </p>
        </div>
      </div>

      {/* Produkt Grid */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
        
        {stations.length === 0 && (
          <div className="py-20 text-center text-stone-400">
            Aktuell keine Camping-Modelle verfügbar.
          </div>
        )}
      </div>

      {/* Camping Guide Mini-Section */}
      <section className="container mx-auto px-4 mt-24">
        <div className="bg-stone-900 rounded-[2.5rem] p-8 md:p-16 text-white grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Worauf es beim Camping ankommt</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="bg-white/10 p-2 rounded-lg h-fit"><Zap className="text-yellow-400 w-5 h-5" /></div>
                <div><span className="font-bold block">Gewicht:</span> Idealerweise unter 15kg für maximale Mobilität.</div>
              </li>
              <li className="flex gap-3">
                <div className="bg-white/10 p-2 rounded-lg h-fit"><Sun className="text-yellow-400 w-5 h-5" /></div>
                <div><span className="font-bold block">Solar-Input:</span> Wichtig für autarkes Stehen ohne Landstrom.</div>
              </li>
            </ul>
          </div>
          <div className="bg-stone-800 rounded-2xl p-8 border border-stone-700">
            <p className="italic text-stone-300">"Für ein Wochenende reicht meist eine Kapazität von 500Wh bis 1000Wh völlig aus, um Handy, Laptop und eine kleine Kühlbox zu betreiben."</p>
          </div>
        </div>
      </section>
    </main>
  );
}