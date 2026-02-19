"use client"; // Wichtig für den State-Wechsel

import { useState } from "react";
import Image from "next/image";
import { getOptimizedImage } from "@/lib/cloudinary-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Battery, ChevronLeft, ChevronRight } from "lucide-react";
import { AffiliateCTA } from "./AffiliateCTA";
import { SocialTrust } from "./SocialTrust";
import { cn } from "@/lib/utils"; // Shadcn Utility

export function StationHero({ station }: { station: any }) {
  // Falls 'images' leer ist, nutzen wir das alte 'imageUrl' als Fallback-Array
  const gallery = station.images?.length > 0 ? station.images : [station.imageUrl];
  const [activeIndex, setActiveIndex] = useState(0);

  // Hauptbild-Optimierung (Cloudinary)
  const currentHeroImage = getOptimizedImage(gallery[activeIndex], 1000, 1000);

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % gallery.length);
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <div className="grid gap-8 md:grid-cols-2 items-start">
      <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0">
          <div className="space-y-2">
            <Badge variant="outline" className="text-stone-400 border-stone-200">
              {station.brand.name} Powerstation
            </Badge>
            <CardTitle className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {station.name}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="px-0 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Battery className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-stone-400 uppercase">Kapazität</span>
              </div>
              <p className="text-xl font-bold">{station.capacityWh} Wh</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-xs font-bold text-stone-400 uppercase">Leistung</span>
              </div>
              <p className="text-xl font-bold">{station.outputWatts} W</p>
            </div>
          </div>

          <AffiliateCTA price={station.priceApprox} />
          <SocialTrust brandName={station.brand.name} />
        </CardContent>
      </Card>
      
      {/* --- GALERIE BEREICH --- */}
      <div className="space-y-4">
        <div className="relative aspect-square bg-white rounded-3xl flex items-center justify-center border border-stone-100 shadow-sm overflow-hidden group">
          {gallery[activeIndex] ? (
            <Image 
              key={activeIndex} // Key sorgt für Re-Animation beim Wechsel
              src={currentHeroImage} 
              alt={`${station.brand.name} ${station.name} Ansicht ${activeIndex + 1}`}
              fill
              className="object-contain p-8 animate-in fade-in zoom-in-95 duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="text-stone-300 italic">Bild nicht verfügbar</div>
          )}

          {/* Navigation Arrows (nur sichtbar wenn mehr als 1 Bild) */}
          {gallery.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-4 p-2 rounded-full bg-white/80 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5 text-stone-600" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-4 p-2 rounded-full bg-white/80 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="w-5 h-5 text-stone-600" />
              </button>
            </>
          )}

          <Badge className="absolute top-4 right-4 bg-green-500">
             {station.batteryType}
          </Badge>
        </div>

        {/* THUMBNAILS LISTE */}
        {gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {gallery.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative w-20 h-20 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all",
                  activeIndex === idx ? "border-blue-500 ring-2 ring-blue-100" : "border-stone-100 hover:border-stone-300"
                )}
              >
                <Image 
                  src={getOptimizedImage(img, 200, 200)} 
                  alt="Thumbnail" 
                  fill 
                  className="object-contain p-2"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}