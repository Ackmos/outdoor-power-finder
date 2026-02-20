// src/components/home/FilterableProductGrid.tsx
"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation"; // Neue Imports für SEO
import { StationCard } from "./StationCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link"; // Wichtig für Crawler

export function FilterableProductGrid({ initialStations, brands }: any) {
  const pathname = usePathname();
  const searchParams = useSearchParams();


  // Parameter aus der URL lesen
  const activeBrand = searchParams.get("brand") || "Alle";
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 6;

  // Filtern & Pagination Logik
  const filteredStations = activeBrand === "Alle" 
    ? initialStations 
    : initialStations.filter((s: any) => s.brand.name === activeBrand);

  const totalPages = Math.ceil(filteredStations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStations = filteredStations.slice(startIndex, startIndex + itemsPerPage);

  // Hilfsfunktion zum Erzeugen der neuen URL
  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    // Wenn die Marke gewechselt wird, Seite immer auf 1 zurücksetzen
    if (name === "brand") params.set("page", "1");
    return params.toString();
  };



  return (
    <div className="space-y-10">
      <div className="scroll-mt-24" />

      {/* FILTER BAR (Jetzt mit echten Links für SEO) */}
      <div className="flex flex-wrap gap-2 items-center justify-center bg-white p-2 rounded-2xl shadow-sm border border-stone-100">
        <Button 
          variant={activeBrand === "Alle" ? "default" : "ghost"} 
          asChild // Erlaubt die Nutzung von Link im Button
          className="rounded-xl px-6 font-bold"
        >
          <Link href={`${pathname}?${createQueryString("brand", "Alle")}`}>Alle Marken</Link>
        </Button>
        {brands.map((brand: any) => (
          <Button 
            key={brand.id}
            variant={activeBrand === brand.name ? "default" : "ghost"}
            asChild
            className="rounded-xl px-6 font-bold"
          >
            <Link href={`${pathname}?${createQueryString("brand", brand.name)}`}>{brand.name}</Link>
          </Button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedStations.map((station: any) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>

      {/* PAGINATION CONTROLS (Mit echten Links) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            asChild={currentPage > 1}
            className="rounded-xl"
          >
            {currentPage > 1 ? (
              <Link href={`${pathname}?${createQueryString("page", (currentPage - 1).toString())}`}>
                <ChevronLeft className="w-5 h-5" />
              </Link>
            ) : <ChevronLeft className="w-5 h-5" />}
          </Button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                asChild
                className="w-10 h-10 rounded-xl font-bold"
              >
                <Link href={`${pathname}?${createQueryString("page", (i + 1).toString())}`}>
                  {i + 1}
                </Link>
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            asChild={currentPage < totalPages}
            className="rounded-xl"
          >
            {currentPage < totalPages ? (
              <Link href={`${pathname}?${createQueryString("page", (currentPage + 1).toString())}`}>
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : <ChevronRight className="w-5 h-5" />}
          </Button>
        </div>
      )}
    </div>
  );
}