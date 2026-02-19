// src/app/vergleich/[slug]/ComparisonVerdict.tsx
import { Button } from "@/components/ui/button";
import { ShoppingCart, Award, Zap, Lightbulb } from "lucide-react";

export function ComparisonVerdict({ stationA, stationB }: { stationA: any, stationB: any }) {
  // Logik-Checks
  const isCheaper = stationA.priceApprox < stationB.priceApprox ? stationA : stationB;
  const isLighter = stationA.weightKg < stationB.weightKg ? stationA : stationB;
  const hasMorePower = stationA.capacityWh > stationB.capacityWh ? stationA : stationB;

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
            <div>
              <p className="font-bold text-blue-900 mb-2">Wähle die {stationA.name}, wenn...</p>
              <ul className="text-sm space-y-2">
                {stationA.weightKg < stationB.weightKg && <li>• du maximalen Wert auf Portabilität legst ({stationA.weightKg}kg).</li>}
                {stationA.capacityWh > stationB.capacityWh && <li>• du mehr Reserven für lange Ausflüge brauchst ({stationA.capacityWh}Wh).</li>}
                {stationA.priceApprox < stationB.priceApprox && <li>• du das beste Preis-Leistungs-Verhältnis suchst.</li>}
                <li>• dir das Design von {stationA.brand.name} besser gefällt.</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-blue-900 mb-2">Wähle die {stationB.name}, wenn...</p>
              <ul className="text-sm space-y-2">
                {stationB.weightKg < stationA.weightKg && <li>• Mobilität für dich an erster Stelle steht.</li>}
                {stationB.capacityWh > stationA.capacityWh && <li>• dir die höhere Kapazität von {stationB.capacityWh}Wh wichtig ist.</li>}
                {stationB.priceApprox < stationA.priceApprox && <li>• du beim Kauf {stationA.priceApprox - stationB.priceApprox}€ sparen möchtest.</li>}
                <li>• du auf die bewährte Technik von {stationB.brand.name} setzt.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* KAUF BUTTONS */}
      <div className="grid md:grid-cols-2 gap-4">
        <a href={stationA.affiliateUrl} target="_blank" rel="noopener noreferrer">
          <Button className="w-full h-20 rounded-3xl bg-stone-900 hover:bg-blue-600 text-white flex flex-col items-center justify-center gap-0 group transition-all">
            <span className="text-[10px] font-bold uppercase opacity-60 group-hover:opacity-100">Zum besten Preis</span>
            <span className="text-lg font-black">{stationA.brand.name} {stationA.name} kaufen</span>
          </Button>
        </a>
        <a href={stationB.affiliateUrl} target="_blank" rel="noopener noreferrer">
          <Button className="w-full h-20 rounded-3xl bg-stone-900 hover:bg-blue-600 text-white flex flex-col items-center justify-center gap-0 group transition-all">
            <span className="text-[10px] font-bold uppercase opacity-60 group-hover:opacity-100">Zum besten Preis</span>
            <span className="text-lg font-black">{stationB.brand.name} {stationB.name} kaufen</span>
          </Button>
        </a>
      </div>
    </div>
  );
}