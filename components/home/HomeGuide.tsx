export function HomeGuide() {
  return (
    <section className="py-16 border-t border-stone-100">
      <div className="max-w-3xl mx-auto px-4 prose prose-stone">
        <h2 className="text-3xl font-black mb-6">Worauf du beim Kauf einer Powerstation achten solltest</h2>
        <p>
          Die Auswahl an mobilen Stromspeichern ist riesig. Um die richtige Entscheidung zu treffen, solltest du vor allem drei Faktoren berücksichtigen: <strong>Kapazität (Wh)</strong>, <strong>Ausgangsleistung (W)</strong> und die <strong>Batterietechnologie</strong>.
        </p>
        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div>
            <h4 className="font-bold mb-2">Kapazität & Leistung</h4>
            <p className="text-sm text-stone-600">
              Die Kapazität in Wattstunden (Wh) gibt an, wie lange deine Geräte betrieben werden können. Für das Laden von Smartphones reichen 200-500 Wh, während für Kaffeemaschinen oder Werkzeuge mindestens 1000-2000 Wh empfohlen werden.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">LiFePO4 vs. Li-Ion</h4>
            <p className="text-sm text-stone-600">
              Moderne Stationen setzen auf LiFePO4-Akkus. Diese sind zwar etwas schwerer, bieten aber bis zu 3000+ Ladezyklen und eine deutlich höhere Sicherheit im Vergleich zu herkömmlichen Lithium-Ionen-Akkus.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}