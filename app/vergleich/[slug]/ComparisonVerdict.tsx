import { Button } from "@/components/ui/button";
import { Award, Lightbulb, ArrowRight, Star } from "lucide-react";
import Link from "next/link"; // Wichtig für interne Verlinkung

export function ComparisonVerdict({ stationA, stationB }: { stationA: any, stationB: any }) {
  // Einfache Sieger-Logik (Wer hat in mehr Kategorien die Nase vorn?)
  const scoreA = 
    (stationA.capacityWh > stationB.capacityWh ? 1 : 0) + 
    (stationA.priceApprox < stationB.priceApprox ? 1 : 0) + 
    (stationA.weightKg < stationB.weightKg ? 1 : 0);
  
  const scoreB = 
    (stationB.capacityWh > stationA.capacityWh ? 1 : 0) + 
    (stationB.priceApprox < stationA.priceApprox ? 1 : 0) + 
    (stationB.weightKg < stationA.weightKg ? 1 : 0);

  const winner = scoreA >= scoreB ? stationA : stationB;

  const DetailButton = ({ station, isWinner }: { station: any, isWinner: boolean }) => (
    <Button 
      asChild 
      className={cn(
        "w-full h-20 rounded-3xl flex flex-col items-center justify-center gap-0 group transition-all relative overflow-hidden",
        isWinner 
          ? "bg-stone-900 hover:bg-stone-800 text-white shadow-lg scale-105 z-10" 
          : "bg-white border-2 border-stone-100 text-stone-900 hover:bg-stone-50"
      )}
    >
      <Link href={`/powerstation-test/${station.slug}`}>
        {isWinner && (
          <span className="absolute top-2 right-4 text-[9px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400" /> Empfehlung
          </span>
        )}
        <span className="text-[10px] font-bold uppercase opacity-60">Alle Details & Test</span>
        <span className="text-lg font-black">{station.brand.name} {station.name}</span>
      </Link>
    </Button>
  );

  return (
    <div className="max-w-4xl mx-auto mt-12 space-y-8">
      {/* FAZIT BOX */}
      <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
        <Lightbulb className="absolute -right-4 -top-4 w-32 h-32 text-blue-100 rotate-12" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            <Award className="text-blue-600" /> Unser Experten-Fazit
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-stone-700 leading-relaxed">
            <div className={cn(winner === stationA && "bg-white/50 p-4 rounded-2xl border border-blue-100")}>
              <p className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                Wähle die {stationA.name} {winner === stationA && <Star className="w-4 h-4 fill-amber-400 text-amber-400"/>}
              </p>
              <ul className="text-sm space-y-2">
                {stationA.weightKg < stationB.weightKg && <li>• Maximale Portabilität ({stationA.weightKg}kg).</li>}
                {stationA.capacityWh > stationB.capacityWh && <li>• Höhere Reserven ({stationA.capacityWh}Wh).</li>}
                {stationA.priceApprox < stationB.priceApprox && <li>• Bestes Preis-Leistungs-Verhältnis.</li>}
                <li>• Bewährte Technik von {stationA.brand.name}.</li>
              </ul>
            </div>
            <div className={cn(winner === stationB && "bg-white/50 p-4 rounded-2xl border border-blue-100")}>
              <p className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                Wähle die {stationB.name} {winner === stationB && <Star className="w-4 h-4 fill-amber-400 text-amber-400"/>}
              </p>
              <ul className="text-sm space-y-2">
                {stationB.weightKg < stationA.weightKg && <li>• Mobilität steht an erster Stelle.</li>}
                {stationB.capacityWh > stationA.capacityWh && <li>• Maximale Kapazität von {stationB.capacityWh}Wh.</li>}
                {stationB.priceApprox < stationA.priceApprox && <li>• Kostenersparnis von {stationA.priceApprox - stationB.priceApprox}€.</li>}
                <li>• Qualität von {stationB.brand.name}.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL BUTTONS (Statt Kauf-Links) */}
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <DetailButton station={stationA} isWinner={winner === stationA} />
        <DetailButton station={stationB} isWinner={winner === stationB} />
      </div>
    </div>
  );
}

// Hilfsfunktion für CSS-Klassen
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}