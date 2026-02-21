import { ShieldCheck, Battery, Zap, Leaf } from "lucide-react";

export default function LiFePO4Page() {
  return (
    <main className="min-h-screen bg-stone-50 py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 block">Technologie-Guide</span>
        <h1 className="text-4xl md:text-6xl font-black mb-12 leading-tight">Was ist LiFePO4?</h1>

        <div className="bg-white rounded-[2rem] border border-stone-100 p-8 md:p-12 shadow-xl space-y-8">
          <p className="text-xl text-stone-600 leading-relaxed">
            LiFePO4 steht für <strong>Lithium-Eisenphosphat</strong>. Es ist die aktuell sicherste und langlebigste Batterietechnologie für mobile Powerstations.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-100">
              <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-black mb-2">Maximale Sicherheit</h3>
              <p className="text-sm text-stone-500">Im Gegensatz zu herkömmlichen Li-Ion Akkus sind LiFePO4-Zellen thermisch stabil und können praktisch nicht brennen.</p>
            </div>
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-100">
              <Zap className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-black mb-2">3000+ Zyklen</h3>
              <p className="text-sm text-stone-500">Diese Akkus halten oft 10 Jahre oder länger, selbst bei täglicher Nutzung.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}