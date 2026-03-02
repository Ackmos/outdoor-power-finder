// src/components/home/StationCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Battery, Zap, ArrowRight, Banknote } from "lucide-react";
import { getCloudinaryId } from "@/lib/image-utils";
import { title } from "process";
import { cn } from "@/lib/utils";

interface StationCardProps {
  station: any;
  titleTag?: "h2" | "h3" | "h4"; // Wir definieren die erlaubten Tags
}

export function StationCard({ station, titleTag = "h3" }: StationCardProps) {
  // PRIORITÄT: 1. Dediziertes Thumbnail -> 2. Erstes Galeriebild -> 3. Fallback
  const displayImageId = getCloudinaryId(station.thumbnailUrl) || getCloudinaryId(station.images?.[0]) || 'fallback-id';  
  // Optimierung für die Grid-Ansicht (600px Breite ist ideal für Desktop & Mobile)
  const thumbnail = displayImageId ? getCloudinaryId(displayImageId) : null;
  const Tag = titleTag; // Dynamisches Tag für die Überschrift

  // Preis-Segment Helper (Gleich wie im Hero für Konsistenz)
  const getPriceInfo = (price: number) => {
    if (!price) return { label: "N/A", color: "text-stone-400", bg: "bg-stone-100", text: "text-stone-600" };
    if (price < 500) return { label: "Einsteiger", color: "text-green-600", bg: "bg-green-100", text: "text-green-700" };
    if (price <= 1500) return { label: "Mittelklasse", color: "text-blue-600", bg: "bg-blue-100", text: "text-blue-700" };
    return { label: "Premium", color: "text-purple-600", bg: "bg-purple-100", text: "text-purple-700" };
  };

  const priceInfo = getPriceInfo(station.priceApprox);

  return (
    <Card className="group hover:shadow-2xl transition-all duration-500 border-stone-200 overflow-hidden bg-white flex flex-col h-full">
      {/* IMAGE BEREICH - Optimiert für Transparenz */}
      <div className="aspect-[4/3] bg-stone-50/50 flex items-center justify-center relative overflow-hidden">
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={`${station.brand.name} ${station.name} Vorschau`}
            fill
            className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-20">
             <Zap className="w-8 h-8" />
             <span className="text-[10px] font-bold uppercase tracking-widest">{station.brand.name}</span>
          </div>
        )}
        
        {/* Schwebendes Marken-Badge */}
        <div className="absolute top-3 left-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
           <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-[12px] shadow-sm border-stone-100">
             {station.brand.name}
           </Badge>
        </div>
      </div>

      <CardContent className="p-6 flex-grow mb-0 pb-0">
        <Tag className="text-xl font-bold mb-3 leading-tight group-hover:text-blue-600 transition-colors">
          {station.name}
        </Tag>
        
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-center gap-2 text-stone-600">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <Battery className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <span className="text-sm font-semibold">{station.capacityWh} Wh</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <div className="p-1.5 bg-yellow-50 rounded-lg">
              <Zap className="w-3.5 h-3.5 text-yellow-600" />
            </div>
            <span className="text-sm font-semibold">{station.outputWatts} W</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge className={cn("px-2 py-0.5 border-none text-[10px] font-black uppercase tracking-wider shadow-sm", priceInfo.bg, priceInfo.text)}>
             {priceInfo.label}
          </Badge>
          <Badge variant="outline" className="text-[9px] uppercase tracking-tighter border-stone-200 text-stone-500">
            {station.batteryType}
          </Badge>
          {station.upsMode && (
            <Badge variant="outline" className="text-[9px] uppercase tracking-tighter bg-blue-50 border-blue-100 text-blue-600">
              UPS ready
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex justify-between items-center border-t border-stone-50">

        <Link href={`/powerstation-test/${station.slug}`}>
          <Button size="sm" className="gap-2 rounded-full px-5 font-bold shadow-sm">
            Details <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}