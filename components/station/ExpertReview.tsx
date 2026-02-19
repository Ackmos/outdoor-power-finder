// src/components/station/ExpertReview.tsx
import { getStationUSP } from "@/lib/usp-logic";
import { uspTemplates } from "@/lib/text-template";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Wallet, Zap, LayoutGrid } from "lucide-react";

export function ExpertReview({ station }: { station: any }) {
  const usp = getStationUSP(station);
  const totalPorts = station.portsAc + station.portsUsbC + station.portsUsbA;
  
  const seed = station.slug.length;
  const uspTextArray = uspTemplates[usp.type as keyof typeof uspTemplates] || uspTemplates.GENERAL;
  
  const selectedText = uspTextArray[seed % uspTextArray.length]
    .replace("{name}", station.name)
    .replace("{weight}", station.weightKg)
    .replace("{output}", station.outputWatts)
    .replace("{cycles}", station.cycleLife)
    .replace("{portCount}", totalPorts);

  // Icon basierend auf USP auswählen
  const Icon = usp.type === "ALL_STAR" ? Trophy : 
               usp.type === "VALUE" ? Wallet : 
               usp.type === "CONNECTIVITY" ? LayoutGrid : Zap;

  return (
    <section className={`my-12 p-8 rounded-3xl border-2 transition-all ${
      usp.type === "ALL_STAR" ? "border-yellow-400 bg-yellow-50/30" : "border-stone-100 bg-stone-50/50"
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${usp.type === "ALL_STAR" ? "bg-yellow-400" : "bg-stone-200"}`}>
            <Icon className="w-6 h-6 text-stone-900" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Redaktions-Fazit</h2>
        </div>
        
        <Badge className={`${
          usp.type === "ALL_STAR" ? "bg-yellow-400 text-black" : "bg-stone-900 text-white"
        } px-6 py-2 rounded-full text-sm font-bold shadow-sm`}>
          {usp.label}
        </Badge>
      </div>

      <p className="text-xl md:text-2xl leading-snug text-stone-800 font-semibold mb-6">
        "{selectedText}"
      </p>

      {/* Highlights-Zusammenfassung (für pSEO Keywords) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-stone-200/50">
        <div className="text-center">
          <p className="text-[10px] uppercase text-stone-500 font-bold">Gewicht</p>
          <p className="text-sm font-bold">{station.weightKg} kg</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase text-stone-500 font-bold">Laden (AC)</p>
          <p className="text-sm font-bold">{station.chargeTimeAcMin} Min</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase text-stone-500 font-bold">Anschlüsse</p>
          <p className="text-sm font-bold">{totalPorts} Ports</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase text-stone-500 font-bold">Zyklen</p>
          <p className="text-sm font-bold">{station.cycleLife}+</p>
        </div>
      </div>
    </section>
  );
}