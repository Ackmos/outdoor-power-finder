// src/components/station/ComparisonTable.tsx
import Image from "next/image";
import { CheckCircle2, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCloudinaryId } from "@/lib/image-utils";

export function ComparisonTable({ stationA, stationB }: { stationA: any; stationB: any }) {
  // Hilfsfunktion für die Preis-Skala
  const getPriceInfo = (price: number) => {
    if (!price) return { label: "N/A", icons: "-", color: "text-stone-400" };
    if (price < 500) return { label: "Einsteiger", icons: "€", color: "text-green-600" };
    if (price <= 1500) return { label: "Mittelklasse", icons: "€€", color: "text-blue-600" };
    return { label: "Premium", icons: "€€€", color: "text-purple-600" };
  };

  // Hilfsfunktion für Bilder (Fix für Supabase vs Cloudinary)
  const getSafeImage = (path: string) => {
    if (!path) return "";
    return path.startsWith('http') ? path : getCloudinaryId(path);
  };

  const specs = [
    { label: "Preis-Klasse", key: "priceApprox", unit: "segment", better: "lower" }, // Neu hinzugefügt
    { label: "Kapazität", key: "capacityWh", unit: "Wh", better: "higher" },
    { label: "Dauerleistung", key: "outputWatts", unit: "W", better: "higher" },
    { label: "Batterietyp", key: "batteryType", unit: "", better: null },
    { label: "Gewicht", key: "weightKg", unit: "kg", better: "lower" },
    { label: "Ladezeit (AC)", key: "chargeTimeAcMin", unit: "min", better: "lower" },
    { label: "AC Steckdosen", key: "portsAc", unit: "x", better: "higher" },
  ];

  const ComparisonRow = ({ spec }: { spec: any }) => {
    const valA = stationA[spec.key];
    const valB = stationB[spec.key];
    
    // Logik für Preis-Segment Anzeige
    const renderValue = (val: any, unit: string) => {
      if (unit === "segment") {
        const info = getPriceInfo(val);
        return <span className={cn("font-black", info.color)}>{info.icons}</span>;
      }
      return <>{val || '-'} <small className="text-[10px] font-normal text-stone-400 uppercase">{unit}</small></>;
    };

    const isBetterA = spec.better === "higher" ? valA > valB : spec.better === "lower" ? valA < valB : false;
    const isBetterB = spec.better === "higher" ? valB > valA : spec.better === "lower" ? valB < valA : false;

    return (
      <div className="group border-b last:border-0 hover:bg-stone-50/50 transition-colors">
        <div className="flex flex-col py-4">
          <span className="text-center text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
            {spec.label}
          </span>
          <div className="grid grid-cols-2 divide-x divide-stone-100">
            <div className={cn("px-4 flex flex-col items-center justify-center", isBetterA && "text-blue-600")}>
              <span className="text-xl font-bold">{renderValue(valA, spec.unit)}</span>
              {isBetterA && <span className="text-[12px] font-black uppercase tracking-tighter flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-4 h-4" /> Best</span>}
            </div>
            <div className={cn("px-4 flex flex-col items-center justify-center", isBetterB && "text-blue-600")}>
              <span className="text-xl font-bold">{renderValue(valB, spec.unit)}</span>
              {isBetterB && <span className="text-[12px] font-black uppercase tracking-tighter flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-4 h-4" /> Best</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-100 shadow-xl overflow-hidden my-12">
      <div className="grid grid-cols-2 divide-x border-b bg-stone-50/30">
        {[stationA, stationB].map((s, i) => {
          const priceInfo = getPriceInfo(s.priceApprox);
          return (
            <div key={i} className="p-6 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-3">
                <Image 
                  src={getSafeImage(s.thumbnailUrl || s.images?.[0])} 
                  alt={s.name} 
                  fill 
                  className="object-contain" 
                />
              </div>
              <span className="text-[10px] font-bold text-stone-400 uppercase mb-1">{s.brand.name}</span>
              <h2 className="text-lg font-black leading-tight text-center mb-2">{s.name}</h2>
              {/* Preis-Skala im Header statt Betrag */}
              <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white border shadow-sm", priceInfo.color)}>
                {priceInfo.icons} {priceInfo.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col">
        {specs.map(spec => <ComparisonRow key={spec.label} spec={spec} />)}
      </div>
    </div>
  );
}