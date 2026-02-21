import { prisma } from "@/lib/prisma";
import { StationCard } from "@/components/home/StationCard";
import { ShieldCheck, Home, Zap } from "lucide-react";

export const metadata = {
  title: "Notstromversorgung für Zuhause | POWERFINDER",
  description: "Sichere dein Zuhause gegen Blackouts ab. Powerstations mit hoher Kapazität und USV-Funktion.",
};

export default async function NotstromPage() {
  // Fokus auf Power: Geräte über 1500Wh
  const stations = await prisma.powerstation.findMany({
    where: {
      capacityWh: { gt: 1500 }
    },
    include: { brand: true },
    orderBy: { capacityWh: 'desc' }
  });

  return (
    <main className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Bereich */}
      <div className="bg-white border-b border-stone-100 pt-16 pb-20 text-center md:text-left">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center md:justify-start gap-3 text-red-600 font-bold tracking-widest uppercase text-sm mb-4">
            <ShieldCheck className="w-5 h-5" />
            <span>Blackout-Vorsorge</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-stone-900 mb-6 tracking-tighter">
            Sicherheit für <br className="hidden md:block" />dein Zuhause.
          </h1>
          <p className="text-xl text-stone-500 max-w-2xl leading-relaxed">
            Wenn das Netz ausfällt, übernehmen diese Giganten. Mit Kapazitäten ab 2kWh betreibst du Kühlschränke, Kaffeemaschinen oder sogar medizinische Geräte problemlos weiter.
          </p>
        </div>
      </div>

      {/* Produkt Grid */}
      <div className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      </div>

      {/* Info-Card */}
      <div className="container mx-auto px-4 mt-20">
        <div className="bg-white border border-stone-200 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="bg-stone-100 p-6 rounded-full text-stone-900">
            <Home className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2 text-stone-900">USV-Funktion beachten</h3>
            <p className="text-stone-600">
              Viele der hier gelisteten Modelle verfügen über eine <strong>USV (Unterbrechungsfreie Stromversorgung)</strong>. 
              Das bedeutet, sie schalten bei einem Stromausfall in weniger als 20ms um, sodass dein PC oder Router einfach weiterläuft.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}