import Image from "next/image";
import { getOptimizedImage } from "@/lib/cloudinary-loader";
import { Battery, Zap, Timer, Weight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ComparisonTable({ stationA, stationB }: { stationA: any; stationB: any }) {
const specs = [
    { label: "Kapazität", key: "capacityWh", unit: "Wh", better: "higher" },
    { label: "Dauerleistung", key: "outputWatts", unit: "W", better: "higher" },
    { label: "Batterietyp", key: "batteryType", unit: "", better: null },
    { label: "Gewicht", key: "weightKg", unit: "kg", better: "lower" }, // Kleiner ist besser!
    { label: "Ladezeit (AC)", key: "chargeTimeAcMin", unit: "min", better: "lower" }, // Schneller ist besser!
    { label: "AC Steckdosen", key: "portsAc", unit: "x", better: "higher" },
    { label: "USB Anschlüsse", key: "portsUsbA", unit: "x", better: "higher" },
  ];

  const ComparisonRow = ({ spec }: { spec: any }) => {
    const valA = stationA[spec.key];
    const valB = stationB[spec.key];

    // Logik für den Gewinner-Check
    const isBetterA = spec.better === "higher" ? valA > valB : spec.better === "lower" ? valA < valB : false;
    const isBetterB = spec.better === "higher" ? valB > valA : spec.better === "lower" ? valB < valA : false;

    return (
      <div className="group border-b last:border-0 hover:bg-stone-50/50 transition-colors">
        {/* Label in der Mitte oder oben drüber, aber kompakter */}
        <div className="flex flex-col py-4">
          <span className="text-center text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
            {spec.label}
          </span>
          <div className="grid grid-cols-2 divide-x divide-stone-100">
            {/* Wert Station A */}
            <div className={cn("px-4 flex flex-col items-center justify-center", isBetterA && "text-blue-600")}>
              <span className="text-xl font-bold">{valA || '-'} <small className="text-[10px] font-normal text-stone-400 uppercase">{spec.unit}</small></span>
              {isBetterA && <span className="text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3" /> Best</span>}
            </div>
            {/* Wert Station B */}
            <div className={cn("px-4 flex flex-col items-center justify-center", isBetterB && "text-blue-600")}>
              <span className="text-xl font-bold">{valB || '-'} <small className="text-[10px] font-normal text-stone-400 uppercase">{spec.unit}</small></span>
              {isBetterB && <span className="text-[9px] font-black uppercase tracking-tighter flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3" /> Best</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-stone-100 shadow-xl overflow-hidden">
      {/* Kompakter Header */}
      <div className="grid grid-cols-2 divide-x border-b bg-stone-50/30">
        {[stationA, stationB].map((s, i) => (
          <div key={i} className="p-6 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-3">
              <Image src={getOptimizedImage(s.thumbnailUrl || s.images[0], 400, 400)} alt={s.name} fill className="object-contain" />
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase mb-1">{s.brand.name}</span>
            <h3 className="text-lg font-black leading-tight text-center">{s.name}</h3>
            <p className="text-xl font-bold text-blue-600 mt-1">{s.priceApprox}€</p>
          </div>
        ))}
      </div>

      {/* Die Reihen */}
      <div className="flex flex-col">
        {specs.map(spec => <ComparisonRow key={spec.label} spec={spec} />)}
      </div>
    </div>
  );
}