// src/components/station/RuntimeTable.tsx
"use client"; // Wichtig für den State

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculateRuntime } from "@/lib/calculations";
import { Clock, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RuntimeTable({ capacityWh, devices, stationBrandName }: { capacityWh: number, devices: any[], stationBrandName: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Wir zeigen initial nur die ersten 8 Geräte
  const DISPLAY_LIMIT = 8;
  const displayedDevices = isExpanded ? devices : devices.slice(0, DISPLAY_LIMIT);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold italic">Echtwelt-Laufzeiten für {stationBrandName}</h3>
        </div>
        <Badge variant="outline" className="text-stone-400">
          {devices.length} Geräte gelistet
        </Badge>
      </div>

      <Card className="overflow-hidden relative">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50">
              <TableHead>Gerät</TableHead>
              <TableHead className="text-right">Laufzeit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedDevices.map((device) => (
              <TableRow key={device.id} className="hover:bg-blue-50/30 transition-colors">
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell className="text-right font-mono text-blue-600 font-bold">
                  {calculateRuntime(capacityWh, device.avgWatts)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Gradient Overlay & Toggle Button */}
        {!isExpanded && devices.length > DISPLAY_LIMIT && (
          <div className="absolute bottom-10 left-0 w-full h-24 bg-gradient-to-t pointer-events-none" />
        )}

        {devices.length > DISPLAY_LIMIT && (
          <div className="pt-4 bg-white border-t flex justify-center">
            <Button 
              variant="ghost" 
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold"
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

        <div className="bg-stone-50 border-t text-[10px] text-stone-500 flex gap-2">
          <Info className="w-3 h-3 shrink-0" />
          <span>Berechnet mit $ \eta = 0.85 $. Realwerte können abweichen.</span>
        </div>
      </Card>
    </section>
  );
}