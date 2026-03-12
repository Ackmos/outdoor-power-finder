// src/components/home/HeroSection.tsx
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative bg-stone-900 py-20 px-4 overflow-hidden">
      {/* Subtile Hintergrund-Deko für modernes Design */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-500 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-stone-800 border border-stone-700 px-4 py-1.5 rounded-full text-stone-300 text-sm mb-6">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span>Der größte Powerstation-Vergleich 2026</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
          Finde die perfekte <span className="text-yellow-500">Powerstation</span> <br className="hidden md:block" />
          für dein nächstes Abenteuer.
        </h1>
        
        <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Wir berechnen für dich die echte Laufzeit für über 100 Geräte. 
          Egal ob Camping, Home-Office oder Notstrom-Backup.
        </p>
        

      </div>
    </section>
  );
}