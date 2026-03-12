"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Battery, 
  Zap, 
  Clock, 
  List, 
  ArrowDownWideNarrow, 
  ArrowUpWideNarrow 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function RuntimeCalculator({ devices }: { devices: any[] }) {
  const [wh, setWh] = useState(1000);
  const [customWatts, setCustomWatts] = useState(60);
  const [isDesc, setIsDesc] = useState(true); // true = Lange Laufzeit zuerst

  // Hilfsfunktion für die reine Zahl (wichtig zum Sortieren)
  const getRawHours = (capacity: number, watts: number) => {
    return (capacity * 0.85) / watts;
  };

  // Die formatierte Zeitausgabe
  const formatRuntime = (totalHours: number) => {
    if (totalHours < 1) return `${Math.round(totalHours * 60)} Min.`;
    const h = Math.floor(totalHours);
    const m = Math.round((totalHours - h) * 60);
    
    if (h >= 24) {
      return `${(totalHours / 24).toFixed(1)} Tage`;
    }
    return m > 0 ? `${h}h ${m}m` : `${h} Std.`;
  };

  // Dynamische Sortierung der Geräte-Liste
  const sortedDevices = useMemo(() => {
    return [...devices].sort((a, b) => {
      const timeA = getRawHours(wh, a.avgWatts);
      const timeB = getRawHours(wh, b.avgWatts);
      return isDesc ? timeB - timeA : timeA - timeB;
    });
  }, [devices, wh, isDesc]);

  return (
    <div className="space-y-10">
      {/* 1. INPUT BEREICH (Slider wie gehabt) */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-none shadow-xl bg-white rounded-[2.5rem] space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2 text-stone-400">
                <Battery className="w-4 h-4 text-blue-500" />
                <label className="text-xs font-black uppercase tracking-widest">Kapazität (Wh)</label>
              </div>
              <span className="text-3xl font-black text-blue-600">{wh}</span>
            </div>
            <Slider value={[wh]} max={4000} min={100} step={50} onValueChange={(v) => setWh(v[0])} />
            <Input type="number" value={wh} onChange={(e) => setWh(Number(e.target.value))} className="h-10 rounded-xl text-center font-bold" />
          </div>
        </Card>

        <Card className="p-6 border-none shadow-xl bg-stone-900 text-white rounded-[2.5rem] space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2 text-stone-400">
                <Zap className="w-4 h-4 text-yellow-400" />
                <label className="text-xs font-black uppercase tracking-widest">Dein Gerät (W)</label>
              </div>
              <span className="text-3xl font-black text-yellow-400">{customWatts}W</span>
            </div>
            <Slider value={[customWatts]} max={2000} min={1} step={5} onValueChange={(v) => setCustomWatts(v[0])} />
            <div className="flex items-center justify-between gap-4">
              <Input type="number" value={customWatts} onChange={(e) => setCustomWatts(Number(e.target.value))} className="h-10 bg-white/5 border-white/10 text-white rounded-xl text-center font-bold w-20" />
              <div className="text-right">
                <p className="text-[10px] text-stone-500 font-black uppercase">Laufzeit</p>
                <p className="text-2xl font-black text-white">{formatRuntime(getRawHours(wh, customWatts))}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 2. SORTIERBARE GERÄTE-LISTE */}
      <Card className="border-none shadow-sm bg-white rounded-[2.5rem] overflow-hidden">
        <div className="bg-stone-50 px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-stone-400" />
                <h2 className="text-sm font-black uppercase tracking-widest text-stone-500">
                  Vergleichsliste
                </h2>
            </div>
            
            {/* Sortier-Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsDesc(!isDesc)}
              className="text-blue-600 hover:bg-blue-50 font-bold gap-2 text-xs"
            >
              {isDesc ? (
                <><ArrowDownWideNarrow className="w-4 h-4" /> Längste zuerst</>
              ) : (
                <><ArrowUpWideNarrow className="w-4 h-4" /> Kürzeste zuerst</>
              )}
            </Button>
        </div>

        <div className="divide-y divide-stone-50">
          {sortedDevices.map((device) => (
            <div key={device.id} className="px-6 py-4 flex items-center justify-between hover:bg-blue-50/30 transition-colors group">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-stone-800 group-hover:text-blue-600">
                  {device.name}
                </span>
                <span className="text-[10px] text-stone-400 font-medium">
                  Verbrauch: {device.avgWatts} Watt
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-stone-900">
                  {formatRuntime(getRawHours(wh, device.avgWatts))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}