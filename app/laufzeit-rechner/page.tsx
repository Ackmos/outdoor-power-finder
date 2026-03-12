import { prisma } from "@/lib/prisma";
import { RuntimeCalculator } from "@/components/calculator/RuntimeCalculator";
import { Clock, Info } from "lucide-react";

export const metadata = {
  title: "Powerstation Laufzeit-Rechner | Wie lange hält dein Akku?",
  description: "Berechne exakt, wie lange eine Powerstation deine Geräte (Kühlbox, Laptop, CPAP) versorgen kann. Einfach Wh eingeben und Ergebnis sehen.",
};

export default async function CalculatorPage() {
  const devices = await prisma.device.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 bg-blue-50 rounded-2xl">
          <Clock className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">
          Der ultimative <span className="text-blue-600">Laufzeit-Rechner</span>
        </h1>
        <p className="text-stone-500 max-w-xl mx-auto">
          Wähle eine Kapazität oder ein spezifisches Modell und erfahre sofort, 
          wie lange deine wichtigsten Geräte im Ernstfall oder beim Camping durchhalten.
        </p>
      </div>

      <RuntimeCalculator devices={devices} />

      <section className="bg-stone-50 p-6 rounded-3xl border border-stone-100 flex gap-4">
        <Info className="w-6 h-6 text-stone-400 shrink-0" />
        <div className="text-sm text-stone-500 space-y-2">
          <p className="font-bold text-stone-700">Wie wir rechnen:</p>
          <p>
            Wir nutzen die Formel: <code className="bg-stone-200 px-1 rounded">Laufzeit = (Kapazität Wh * 0.85) / Watt</code>. 
            Die 15% Abzug (0.85) kalkulieren wir für den Eigenverbrauch des Wechselrichters und Wandlungsverluste ein, 
            damit deine Ergebnisse so realistisch wie möglich sind.
          </p>
        </div>
      </section>
    </main>
  );
}