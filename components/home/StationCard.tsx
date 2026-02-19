// src/components/home/StationCard.tsx
import Link from "next/link";
import Image from "next/image";
import { getOptimizedImage } from "@/lib/cloudinary-loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Battery, Zap, ArrowRight } from "lucide-react";

export function StationCard({ station }: { station: any }) {
  // PRIORITÄT: 1. Dediziertes Thumbnail -> 2. Erstes Galeriebild -> 3. Fallback
  const displayImage = station.thumbnailUrl || station.images?.[0] || station.imageUrl || null;
  
  // Optimierung für die Grid-Ansicht (600px Breite ist ideal für Desktop & Mobile)
  const thumbnail = displayImage ? getOptimizedImage(displayImage, 600, 450) : null;

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
        <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-blue-600 transition-colors">
          {station.name}
        </h3>
        
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
        <div className="flex flex-col">
          <span className="text-[10px] text-stone-400 font-bold uppercase">Bester Preis</span>
          <span className="text-2xl font-black text-stone-900 leading-none">
            {station.priceApprox}<span className="text-sm ml-0.5">€</span>
          </span>
        </div>
        <Link href={`/powerstation-test/${station.slug}`}>
          <Button size="sm" className="gap-2 rounded-full px-5 font-bold shadow-sm hover:shadow-blue-200 transition-all">
            Details <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}