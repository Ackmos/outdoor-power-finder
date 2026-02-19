// src/components/home/TopComparisons.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function TopComparisons() {
  const featured = [
    { s1: "EcoFlow River 2", s2: "Bluetti EB3A", slug: "ecoflow-river-2-vs-bluetti-eb3a" },
    { s1: "Jackery Explorer 300 Plus", s2: "EcoFlow River 2 Max", slug: "jackery-300-plus-vs-ecoflow-river-2-max" },
    { s1: "Bluetti AC2A", s2: "Jackery 240", slug: "bluetti-ac2a-vs-jackery-240" },
  ];

  return (
    <section className="py-12 border-t border-stone-100 bg-stone-50/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-black mb-8">Beliebte Duelle</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((comp) => (
            <Link key={comp.slug} href={`/vergleich/${comp.slug}`}>
              <div className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center justify-between hover:shadow-md transition-all group">
                <div className="flex items-center gap-3 text-sm font-bold">
                  <span className="truncate max-w-[100px]">{comp.s1}</span>
                  <span className="text-blue-600 italic text-[10px]">VS</span>
                  <span className="truncate max-w-[100px]">{comp.s2}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}