export function UseCases() {
  const cases = [
    { title: "Camping & Vanlife", text: "Hier zählen kompakte Maße und geringes Gewicht. Achte auf Modelle mit integriertem MPPT-Solarladeregler für maximale Autarkie fernab der Zivilisation." },
    { title: "Home Office & Backup", text: "Für den Schutz sensibler Elektronik sind Stationen mit USV-Funktion (Unterbrechungsfreie Stromversorgung) essenziell. Sie springen bei Stromausfall in Millisekunden ein." },
    { title: "Garten & Werkstatt", text: "Leistungsstarke Geräte wie Winkelschleifer benötigen einen hohen Anlaufstrom. Prüfe hier besonders die Peak-Leistung (Spitzenlast) des Wechselrichters." }
  ];

  return (
    <section className="py-16 bg-stone-50">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-black text-center mb-12">Welche Powerstation passt zu dir?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((c) => (
            <div key={c.title} className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
              <h3 className="font-bold text-xl mb-4">{c.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}