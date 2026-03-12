"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateRuntime } from "@/lib/calculations";
import { 
  Clock, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  ArrowDownWideNarrow, 
  ArrowUpWideNarrow 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RuntimeTable({ capacityWh, devices, stationBrandName }: { capacityWh: number, devices: any[], stationBrandName: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDesc, setIsDesc] = useState(true); // true = Längste Laufzeit zuerst
  
  // Hilfsfunktion für die numerische Sortierung (Wh * Effizienz / Watt)
  const getRawHours = (watts: number) => (capacityWh * 0.85) / watts;

  // Dynamische Sortierung der Geräte
  const sortedDevices = useMemo(() => {
    return [...devices].sort((a, b) => {
      const timeA = getRawHours(a.avgWatts);
      const timeB = getRawHours(b.avgWatts);
      return isDesc ? timeB - timeA : timeA - timeB;
    });
  }, [devices, isDesc, capacityWh]);

  const DISPLAY_LIMIT = 8;
  const displayedDevices = isExpanded ? sortedDevices : sortedDevices.slice(0, DISPLAY_LIMIT);

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold italic text-stone-900">Echtwelt-Laufzeiten</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Sortier-Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsDesc(!isDesc)}
            className="h-8 text-[11px] font-bold gap-2 border-stone-200 text-stone-600 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-full"
          >
            {isDesc ? (
              <><ArrowDownWideNarrow className="w-3.5 h-3.5" /> Längste zuerst</>
            ) : (
              <><ArrowUpWideNarrow className="w-3.5 h-3.5" /> Kürzeste zuerst</>
            )}
          </Button>
          
          <Badge variant="secondary" className="bg-stone-100 text-stone-500 border-none font-bold">
            {devices.length} Geräte
          </Badge>
        </div>
      </div>

      <Card className="overflow-hidden relative border-stone-200 shadow-sm rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50/50 border-b border-stone-100">
              <TableHead className="text-[10px] uppercase font-black tracking-widest text-stone-400">Gerät</TableHead>
              <TableHead className="text-right text-[10px] uppercase font-black tracking-widest text-stone-400">
                Geschätzte Laufzeit
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedDevices.map((device) => (
              <TableRow key={device.id} className="hover:bg-blue-50/30 transition-colors border-stone-50">
                <TableCell className="font-semibold text-stone-800 py-1">
                  <div className="flex flex-col">
                    <span>{device.name}</span>
                    <span className="text-[10px] text-stone-400 font-medium">{device.avgWatts} Watt Verbrauch</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-blue-600 font-black">
                  {calculateRuntime(capacityWh, device.avgWatts)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Gradient Overlay & Toggle Button */}
        {!isExpanded && devices.length > DISPLAY_LIMIT && (
          <div className="absolute bottom-12 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}

        {devices.length > DISPLAY_LIMIT && (
          <div className="py-3 bg-white border-t border-stone-100 flex justify-center">
            <Button 
              variant="ghost" 
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>Weniger anzeigen <ChevronUp className="ml-2 w-4 h-4" /></>
              ) : (
                <>Alle {devices.length} Laufzeiten anzeigen <ChevronDown className="ml-2 w-4 h-4" /></>
              )}
            </Button>
          </div>
        )}

        <div className="bg-stone-50 px-4 py-2 text-[10px] text-stone-400 flex items-center gap-2 border-t border-stone-100">
          <Info className="w-3 h-3 shrink-0" />
          <span>Berechnet mit einer Effizienz von 85% ($ \eta = 0.85 $).</span>
        </div>
      </Card>
    </section>
  );
}