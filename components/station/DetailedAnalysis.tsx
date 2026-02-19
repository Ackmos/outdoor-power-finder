// src/components/station/DetailedAnalysis.tsx
import { generateDetailedAnalysis } from "@/lib/text-engine";
import { Clock, BookOpen, Lightbulb, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DetailedAnalysis({ station }: { station: any }) {
  const analysis = generateDetailedAnalysis(station);
  
  // Dynamische Lesezeit berechnen (ca. 200 Wörter pro Minute)
  const wordCount = (analysis.summary + analysis.deepDiveContent).split(" ").length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <section className="my-16 group">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-none px-3">
              Deep Dive
            </Badge>
            <div className="flex items-center gap-1 text-stone-400 text-xs font-medium">
              <Clock className="w-3 h-3" />
              {readingTime} Min. Lesezeit
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900">
            Analyse: Was leistet die {station.name} wirklich?
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Haupttext-Spalte */}
        <div className="lg:col-span-8">
          <div className="prose prose-stone prose-lg max-w-none">
            {/* Einleitungssatz (USP) - Groß und fett für den Einstieg */}
            <p className="text-xl md:text-2xl text-stone-600 leading-snug font-semibold mb-10 border-l-4 border-yellow-500 pl-6 py-2">
              {analysis.summary}
            </p>

            {/* Die dynamische Szenario-Überschrift */}
            <h3 className="text-2xl font-bold mt-12 mb-6 text-stone-800 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-yellow-600" />
              {analysis.deepDiveTitle}
            </h3>

            {/* Der große Deep Dive Content */}
            <div className="text-stone-700 leading-relaxed space-y-6 text-lg">
              {analysis.deepDiveContent.split('\n').map((paragraph, i) => (
                <p key={i} className="first-letter:text-4xl first-letter:font-bold first-letter:text-stone-900 first-letter:mr-1 first-letter:float-left">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Info-Cards */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Pro-Tip Box */}
          <div className="bg-stone-900 text-stone-100 p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <Lightbulb className="w-12 h-12 text-yellow-400 absolute -top-2 -right-2 opacity-20 rotate-12" />
            <div className="relative z-10">
              <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Pro-Tipp
              </h4>
              <p className="text-sm text-stone-400 leading-relaxed">
                Nutze für {station.capacityWh > 1000 ? 'größere Lasten' : 'mobile Einsätze'} immer 
                hochwertige Kabel, um den Spannungsabfall zu minimieren. Die {station.name} arbeitet 
                am effizientesten bei ca. 50% Last.
              </p>
            </div>
          </div>

          {/* Technical Note Box */}
          <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
            <h4 className="font-bold text-stone-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Technik-Check
            </h4>
            <p className="text-sm text-stone-600 italic leading-relaxed">
              "{analysis.technicalNote}"
            </p>
          </div>

          {/* Kleiner Trust-Faktor */}
          <div className="text-center p-4">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
              Unabhängige Datenanalyse
            </p>
            <div className="flex justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}