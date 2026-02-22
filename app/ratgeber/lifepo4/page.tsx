import { Metadata } from 'next'
import { ShieldCheck, Battery, Zap, Leaf } from "lucide-react";

// SEO Metadaten
export const metadata: Metadata = {
  title: 'Was ist LiFePO4? Lithium-Eisenphosphat einfach erklärt',
  description: 'Erfahre alles über LiFePO4 Batterien: Warum Lithium-Eisenphosphat die sicherste und langlebigste Technologie für moderne Powerstations ist.',
  keywords: ['LiFePO4', 'Lithium-Eisenphosphat', 'Akku Technologie', 'Powerstation Akku', 'Batteriesicherheit'],
  alternates: {
    canonical: '/ratgeber/lifepo4', // Erzeugt https://powerstation-finder.de/ratgeber/lifepo4
  },
  openGraph: {
    title: 'Was ist LiFePO4? Der ultimative Guide zur Akku-Technik',
    description: 'Sicherheit, Langlebigkeit und Effizienz: Warum LiFePO4 der Standard für Powerstations geworden ist.',
    type: 'article',
  },
}

export default function LiFePO4Page() {
  return (
    <main className="min-h-screen bg-stone-50 py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-4">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 block">Technologie-Guide</span>
        
        {/* H1 Headline */}
        <h1 className="text-4xl md:text-6xl font-black mb-12 leading-tight">Was ist LiFePO4?</h1>

        <div className="bg-white rounded-[2rem] border border-stone-100 p-8 md:p-12 shadow-xl space-y-8">
          {/* Intro-Text (Fix für Seobility: H1 Text wird hier wiederholt) */}
          <p className="text-xl text-stone-600 leading-relaxed">
            Viele Nutzer stellen sich beim Kauf einer Powerstation die Frage: <strong>Was ist LiFePO4?</strong> Kurz gesagt steht die Abkürzung für <strong>Lithium-Eisenphosphat</strong>. Dabei handelt es sich um die aktuell sicherste und langlebigste Batterietechnologie für mobile Stromspeicher auf dem Markt.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-100">
              <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-black mb-2">Maximale Sicherheit</h3>
              <p className="text-sm text-stone-500">Im Gegensatz zu herkömmlichen Li-Ion Akkus sind LiFePO4-Zellen thermisch stabil. Das bedeutet, dass sie selbst bei Beschädigung praktisch nicht brennen oder explodieren können.</p>
            </div>
            <div className="p-6 rounded-3xl bg-stone-50 border border-stone-100">
              <Zap className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-black mb-2">3000+ Ladezyklen</h3>
              <p className="text-sm text-stone-500">Ein großer Vorteil von <strong>LiFePO4</strong> ist die Lebensdauer. Diese Akkus halten oft 10 Jahre oder länger, was sie deutlich nachhaltiger macht als ältere Technologien.</p>
            </div>
          </div>
          
          <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100">
            <h2 className="text-2xl font-black mb-4 text-blue-900">Warum LiFePO4 wählen?</h2>
            <p className="text-stone-700 leading-relaxed">
              Wenn du dich fragst, ob sich der Aufpreis lohnt: Ja. Durch die hohe Zyklenfestigkeit sind die Kosten pro Ladung bei einer <strong>LiFePO4</strong> Powerstation am Ende deutlich geringer als bei herkömmlichen Lithium-Ionen-Akkus.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}