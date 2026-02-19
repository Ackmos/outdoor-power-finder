// src/components/station/UsageIntent.tsx
export function UsageIntent({ station }: { station: any }) {
  const isLarge = station.capacityWh > 1000;
  
  return (
    <section className="bg-stone-100 p-6 rounded-2xl border border-stone-200 my-8">
      <h2 className="text-xl font-bold mb-4">Eignet sich die {station.name} für deinen Zweck?</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-bold flex items-center gap-2">🏕️ Camping & Vanlife</h3>
          <p className="text-sm text-stone-600 mt-2">
            Mit {station.capacityWh}Wh ist diese Powerstation {isLarge ? 'ein echtes Kraftpaket' : 'ein kompakter Begleiter'}. 
            Für Camper bedeutet das: Eine typische Kühlbox läuft hier ca. {Math.round(station.capacityWh * 0.85 / 45)} Stunden.
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <h3 className="font-bold flex items-center gap-2">🏠 Notstrom & Backup</h3>
          <p className="text-sm text-stone-600 mt-2">
            Im Falle eines Blackouts versorgt die {station.name} wichtige Geräte wie Router oder CPAP-Masken zuverlässig mit Strom. 
            {station.upsMode ? 'Dank USV-Funktion schützt sie deine Hardware.' : ''}
          </p>
        </div>
      </div>
    </section>
  );
}