"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getOptimizedImage } from "@/lib/cloudinary-loader";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ComparisonSelector({ stations }: { stations: any[] }) {
  const [s1, setS1] = useState<any>(null);
  const [s2, setS2] = useState<any>(null);
  const router = useRouter();

  const handleStart = () => {
    if (s1 && s2) router.push(`/vergleich/${s1.slug}-vs-${s2.slug}`);
  };

  const Slot = ({ selected, onSelect, onClear, label }: any) => (
    <div className={cn(
      "relative flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed transition-all duration-500 min-h-[300px] w-full bg-white",
      selected ? "border-blue-500 bg-blue-50/30 border-solid shadow-xl" : "border-stone-200 hover:border-stone-400 bg-stone-50"
    )}>
      {selected ? (
        <>
          <button onClick={onClear} className="absolute top-4 right-4 p-1 rounded-full bg-stone-100 hover:bg-red-100 hover:text-red-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="relative w-40 h-40 mb-4">
            <Image src={getOptimizedImage(selected.thumbnailUrl || selected.images[0], 400, 400)} alt={selected.name} fill className="object-contain" />
          </div>
          <p className="text-xs font-bold text-blue-600 uppercase mb-1">{selected.brand.name}</p>
          <h3 className="text-xl font-bold text-center">{selected.name}</h3>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 text-stone-400">
          <div className="p-4 rounded-full bg-stone-100"><Plus className="w-8 h-8" /></div>
          <p className="font-bold text-sm uppercase tracking-widest">{label}</p>
          <select 
            onChange={(e) => onSelect(stations.find(s => s.slug === e.target.value))}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          >
            <option value="">Wählen...</option>
            {stations.map(s => <option key={s.id} value={s.slug}>{s.brand.name} {s.name}</option>)}
          </select>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-6 relative">
        <Slot selected={s1} onSelect={setS1} onClear={() => setS1(null)} label="Powerstation A" />
        <div className="z-10 bg-white shadow-xl border border-stone-100 rounded-2xl p-4 font-black text-2xl text-blue-600 italic">VS</div>
        <Slot selected={s2} onSelect={setS2} onClear={() => setS2(null)} label="Powerstation B" />
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleStart} 
          disabled={!s1 || !s2}
          className="h-16 px-12 rounded-full text-lg font-bold bg-stone-900 shadow-2xl hover:scale-105 active:scale-95 transition-all gap-3"
        >
          Vergleich starten <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}