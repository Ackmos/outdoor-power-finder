"use client";

import { useState, useMemo } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { StationCard } from "./StationCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  SlidersHorizontal, 
  X, 
  Zap, 
  Battery, 
  Clock, 
  Plug, 
  Weight, 
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export function FilterableProductGrid({ initialStations, brands }: any) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // 1. Dynamische Grenzwerte aus den echten DB-Daten ermitteln
  const stats = useMemo(() => ({
    maxWh: Math.max(...initialStations.map((s: any) => s.capacityWh || 0), 3000),
    maxOutput: Math.max(...initialStations.map((s: any) => s.outputWatts || 0), 3000),
    maxCycles: Math.max(...initialStations.map((s: any) => s.cycleLife || 0), 4000),
    maxWeight: Math.max(...initialStations.map((s: any) => s.weightKg || 0), 50),
  }), [initialStations]);

  // 2. Filter-Werte aus der URL
  const filters = {
    brand: searchParams.get("brand") || "Alle",
    minWh: Number(searchParams.get("minWh")) || 0,
    minOutput: Number(searchParams.get("minOutput")) || 0,
    minCycles: Number(searchParams.get("minCycles")) || 0,
    maxWeight: Number(searchParams.get("maxWeight")) || stats.maxWeight,
    maxChargeTime: Number(searchParams.get("maxCharge")) || 600, 
    minAcPorts: Number(searchParams.get("minAc")) || 0,
  };

  // 3. Filter-Logik
  const filteredStations = useMemo(() => {
    return initialStations.filter((s: any) => {
      const matchBrand = filters.brand === "Alle" || s.brand.name === filters.brand;
      const matchWh = s.capacityWh >= filters.minWh;
      const matchOutput = s.outputWatts >= filters.minOutput;
      const matchCycles = s.cycleLife >= filters.minCycles;
      const matchWeight = s.weightKg <= filters.maxWeight;
      const matchCharge = s.chargeTimeAcMin <= filters.maxChargeTime;
      const matchPorts = s.portsAc >= filters.minAcPorts;
      return matchBrand && matchWh && matchOutput && matchCycles && matchWeight && matchCharge && matchPorts;
    });
  }, [initialStations, filters]);

  // 4. Pagination Logik
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const paginatedStations = filteredStations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // URL Update Funktion
  const updateFilters = (newFilters: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([k, v]) => params.set(k, v.toString()));
    // Wenn nicht explizit die Seite gewechselt wird, immer auf Seite 1 zurücksetzen
    if (!newFilters.page) params.set("page", "1");
    window.history.pushState(null, "", `${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    window.history.pushState(null, "", pathname);
    window.location.reload();
  };

  return (
    <div className="space-y-10">
      {/* FILTER TOP BAR */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 justify-center">
          <Button 
            variant={filters.brand === "Alle" ? "default" : "secondary"}
            onClick={() => updateFilters({ brand: "Alle" })}
            className="rounded-full px-6 font-bold"
          >
            Alle
          </Button>
          {brands.map((b: any) => (
            <Button 
              key={b.id}
              variant={filters.brand === b.name ? "default" : "secondary"}
              onClick={() => updateFilters({ brand: b.name })}
              className="rounded-full px-6 font-bold"
            >
              {b.name}
            </Button>
          ))}
        </div>

        <Button 
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-full gap-2 border-stone-200 shadow-sm"
        >
          {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
          {showFilters ? "Filter schließen" : "Erweiterte Filter"}
        </Button>
      </div>

      {/* EXPANDABLE FILTER PANEL */}
      {showFilters && (
        <div className="bg-white p-6 md:p-10 rounded-[2.5rem] border border-stone-100 shadow-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-2 font-black text-stone-900 uppercase text-xs tracking-widest">
                <Battery className="w-4 h-4 text-amber-500" /> Kapazität & Leistung
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><Label>Min. Kapazität</Label><span className="font-bold">{filters.minWh} Wh</span></div>
                  <Slider defaultValue={[filters.minWh]} max={stats.maxWh} step={100} onValueCommit={(v) => updateFilters({ minWh: v[0] })} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><Label>Dauerleistung (AC)</Label><span className="font-bold">{filters.minOutput} W</span></div>
                  <Slider defaultValue={[filters.minOutput]} max={stats.maxOutput} step={100} onValueCommit={(v) => updateFilters({ minOutput: v[0] })} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 font-black text-stone-900 uppercase text-xs tracking-widest">
                <Clock className="w-4 h-4 text-blue-500" /> Effizienz & Alter
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><Label>Max. Ladezeit (AC)</Label><span className="font-bold">{(filters.maxChargeTime / 60).toFixed(1)} Std.</span></div>
                  <Slider defaultValue={[filters.maxChargeTime]} max={600} min={60} step={30} onValueCommit={(v) => updateFilters({ maxCharge: v[0] })} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><Label>Min. Lebenszyklen</Label><span className="font-bold">{filters.minCycles} Zyklen</span></div>
                  <Slider defaultValue={[filters.minCycles]} max={stats.maxCycles} step={500} onValueCommit={(v) => updateFilters({ minCycles: v[0] })} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-2 font-black text-stone-900 uppercase text-xs tracking-widest">
                <Plug className="w-4 h-4 text-emerald-500" /> Ausstattung
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><Label>Max. Gewicht</Label><span className="font-bold">{filters.maxWeight} kg</span></div>
                  <Slider defaultValue={[filters.maxWeight]} max={stats.maxWeight} step={1} onValueCommit={(v) => updateFilters({ maxWeight: v[0] })} />
                </div>
                <div className="space-y-3 pt-2">
                  <Label className="text-sm">Mindestanzahl Steckdosen</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <Button 
                        key={n}
                        variant={filters.minAcPorts === n ? "default" : "outline"}
                        onClick={() => updateFilters({ minAc: n })}
                        className="flex-1 rounded-xl h-10 font-bold"
                      >
                        {n}+
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-stone-100 flex justify-between items-center">
            <Button variant="ghost" onClick={resetFilters} className="text-stone-500 gap-2 hover:text-red-500 transition">
              <RotateCcw className="w-4 h-4" /> Filter zurücksetzen
            </Button>
          </div>
        </div>
      )}

      {/* RESULT COUNT */}
      <div className="flex items-center gap-4 px-2">
        <div className="h-px flex-1 bg-stone-100" />
        <span className="text-stone-400 text-sm font-medium">
          <strong className="text-stone-900">{filteredStations.length}</strong> Powerstations gefunden
        </span>
        <div className="h-px flex-1 bg-stone-100" />
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedStations.map((station: any) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-12">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => updateFilters({ page: currentPage - 1 })}
            className="rounded-xl border-stone-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => updateFilters({ page: i + 1 })}
                className="w-10 h-10 rounded-xl font-bold border-stone-200"
              >
                {i + 1}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => updateFilters({ page: currentPage + 1 })}
            className="rounded-xl border-stone-200"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* EMPTY STATE */}
      {filteredStations.length === 0 && (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-stone-200">
          <Zap className="w-10 h-10 text-stone-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-900">Keine Ergebnisse</h3>
          <Button variant="link" onClick={resetFilters} className="mt-4 text-amber-600">Filter löschen</Button>
        </div>
      )}
    </div>
  );
}