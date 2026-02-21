export default function WhCalculatorPage() {
  return (
    <main className="min-h-screen bg-stone-50 py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 block">Berechnung</span>
        <h1 className="text-4xl md:text-6xl font-black mb-12">Wh richtig berechnen</h1>
        
        <div className="bg-white rounded-[2rem] border border-stone-100 shadow-xl overflow-hidden">
          <div className="p-8 md:p-16 border-b text-center">
            <h2 className="text-2xl font-black mb-12">Die Realitäts-Formel</h2>
            
            {/* Visuelle Formel mit Tailwind statt LaTeX */}
            <div className="flex items-center justify-center gap-6 text-3xl md:text-5xl font-black text-stone-900">
              <span>t =</span>
              <div className="flex flex-col items-center">
                <span className="border-b-4 border-stone-900 px-4 pb-1">E × 0,85</span>
                <span className="pt-1">P</span>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 text-[10px] font-black uppercase tracking-widest text-stone-400">
              <div>t = Stunden</div>
              <div>E = Kapazität (Wh)</div>
              <div>P = Last (W)</div>
            </div>
          </div>

          <div className="p-8 md:p-12 bg-stone-50/50">
            <p className="text-stone-600 leading-relaxed">
              Warum die <strong>0,85</strong>? Powerstations verlieren Energie beim Umwandeln von Gleichstrom in Wechselstrom (Inverter-Effizienz).
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}